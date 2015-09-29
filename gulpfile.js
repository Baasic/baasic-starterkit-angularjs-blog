/* jshint node: true */
'use strict';

var gulp = require('gulp'),
    postcss = require('gulp-postcss'),
    g = require('gulp-load-plugins')({ lazy: false }),
    replace = require('gulp-replace'),
    noop = g.util.noop,
    es = require('event-stream'),
    bowerFiles = require('main-bower-files'),
    rimraf = require('rimraf'),
    queue = require('streamqueue'),
    lazypipe = require('lazypipe'),
    stylish = require('jshint-stylish'),
    bower = require('./bower'),
    minifyCss = require('gulp-minify-css'),
    isWatching = false;

var htmlminOpts = {
    removeComments: true,
    collapseWhitespace: true,
    removeEmptyAttributes: false,
    collapseBooleanAttributes: true,
    removeRedundantAttributes: true
};

var baseUrl = g.util.env.baseUrl || '/';
var theme = g.util.env.theme || 'space-thumbnail';

//Plugins
var atImport = require('postcss-import');
var customProperties = require('postcss-custom-properties');
var customMedia = require('postcss-custom-media');
var calc = require('postcss-calc');
var colorFunction = require('postcss-color-function');
var autoprefixer = require('autoprefixer');

//Processor
gulp.task('styles', ['clean-tmp'], function () {
    var processors = [
        atImport({
            from: './src/themes/' + theme + '/src/app.css'
        }),
        customMedia,
        customProperties,
        calc,        
        colorFunction,
        autoprefixer({
            browsers: ['last 2 versions']
        })
    ];

    return gulp.src(
        './src/themes/' + theme + '/src/app.css')
        .pipe(postcss(processors))        
        .pipe(gulp.dest('./.tmp/'))
        .pipe(g.cached('built-css'))
        .pipe(livereload());
});

gulp.task('styles-dist', function () {
    var processors = [
        atImport({
            from: './src/themes/' + theme + '/src/app.css'
        }),
        customMedia,
        customProperties,
        calc,        
        colorFunction,
        autoprefixer({
            browsers: ['last 2 versions']
        }),
    ];
    return gulp.src([
        './src/themes/' + theme + '/src/app.css'
    ])
        .pipe(postcss(processors))
        .pipe(minifyCss({processImport: false}))
        .pipe(gulp.dest('./dist/'));
});



/**
 * Scripts
 */
gulp.task('scripts-dist', ['templates-dist'], function () {
    return es.merge(appConfigSource(), appFiles())
        .pipe(g.angularFilesort())
        .pipe(dist('js', bower.name, { ngAnnotate: true }));
});

gulp.task('scripts', [], function () {
    return appConfigSource()
        .pipe(g.angularFilesort())
        .pipe(gulp.dest('./.tmp'));
});

/**
 * Templates
 */
gulp.task('templates', function () {
    return templateFiles().pipe(buildTemplates());
});

gulp.task('templates-dist', function () {
    return templateFiles({ min: true }).pipe(buildTemplates());
});

/**
 * Vendors
 */
gulp.task('vendors', function () {
    var files = bowerFiles();
    var vendorJs = fileTypeFilter(files, 'js');
    var vendorCss = fileTypeFilter(files, 'css');
    var q = new queue({ objectMode: true });
    if (vendorJs.length) {
        q.queue(gulp.src(vendorJs).pipe(dist('js', 'vendors')));
    }
    if (vendorCss.length) {
        q.queue(gulp.src(vendorCss).pipe(dist('css', 'vendors')));
    }
    return q.done();
});

/**
 * Index
 */
gulp.task('index', index);
gulp.task('build-all', ['styles', 'templates', 'scripts'], index);

function index() {
    var opt = { read: false };
    return gulp.src('./src/app/index.html')
        .pipe(g.inject(gulp.src('./src/themes/' + theme + '/assets/js/*.js'), { addRootSlash: false, ignorePath: 'src/themes/' + theme, starttag: '<!-- inject:vendorTheme -->' }))
        .pipe(g.inject(gulp.src(bowerFiles(), opt), { addRootSlash: false, ignorePath: 'bower_components', starttag: '<!-- inject:vendor:{{ext}} -->' }))
        .pipe(g.inject(es.merge(appFiles(), cssFiles('./.tmp/**/*.css', opt)), { addRootSlash: false, ignorePath: ['.tmp', 'src/app', 'src/themes/' + theme] }))
        .pipe(replace('<base href="/" />', '<base href="' + baseUrl + '" />'))
        .pipe(g.embedlr())
        .pipe(gulp.dest('./.tmp/'))
        .pipe(livereload());
}

/**
 * Assets
 */
gulp.task('assets', ['favicon'], function () {
    return gulp.src(['./src/assets/**', './src/themes/' + theme + '/assets/**'])
        .pipe(gulp.dest('./dist/assets'));
});
gulp.task('favicon', function () {
    return gulp.src(['./src/themes/' + theme + '/favicon.ico'])
        .pipe(gulp.dest('./dist'));
});

/**
 * Clenaup
 */
gulp.task('clean-dist', function (done) {
    rimraf.sync('./dist', {});
    done();
});

gulp.task('clean-tmp', function (done) {
    rimraf.sync('./.tmp/', {});
    done();
});


/**
 * Dist
 */
gulp.task('dist', ['clean-dist', 'vendors', 'assets', 'styles-dist', 'scripts-dist'], function () {
    return gulp.src('./src/app/index.html')
        .pipe(g.inject(gulp.src('./dist/vendors.min.{js,css}'), { addRootSlash: false, ignorePath: 'dist', starttag: '<!-- inject:vendor:{{ext}} -->' }))
        .pipe(replace('<base href="/" />', '<base href="' + baseUrl + '" />'))
        .pipe(g.inject(gulp.src('./dist/' + bower.name + '.min.{js,css}'), { addRootSlash: false, ignorePath: 'dist' }))
        .pipe(g.inject(cssFiles('./dist/**/*.css', {}), { addRootSlash: false, ignorePath: ['dist', 'src/app', 'src/themes/' + theme] }))
        .pipe(g.htmlmin(htmlminOpts))
        .pipe(gulp.dest('./dist/'));
});

/**
 * Watch
 */
gulp.task('serve', ['watch'], g.serve({
    port: 3000,
    root: ['./.tmp', './.tmp/src/app', './src/app', './bower_components', './src', './src/themes/' + theme],
    middleware: function (req, res, next) {
        if (req.url.indexOf('.') === -1) {
            req.url = '/index.html';
        }
        return next();
    }
}));
gulp.task('watch', ['default'], function () {
    isWatching = true;
    // Initiate livereload server:
    g.livereload.listen();
    gulp.watch('./src/app/**/*.js', ['jshint', 'scripts']).on('change', function (evt) {
        if (evt.type !== 'changed') {
            gulp.start('index');
        } else {
            g.livereload.changed(evt);
        }
    });
    gulp.watch('./src/themes/' + theme + '/templates/**/*.js', ['jshint', 'scripts']).on('change', function (evt) {
        if (evt.type !== 'changed') {
            gulp.start('index');
        } else {
            g.livereload.changed(evt);
        }
    });
    gulp.watch('./src/app/index.html', ['index']);
    gulp.watch(['./src/themes/' + theme + '/templates/**/*.html'], ['templates']);
    gulp.watch(['./src/themes/' + theme + '/src/**/*.css'], ['csslint']).on('change', function (evt) {
        if (evt.type !== 'changed') {
            gulp.start('index');
        } else {
            g.livereload.changed(evt);
        }
    });
});

/**
 * Default task
 */
gulp.task('default', ['lint', 'build-all']);

/**
 * Lint everything
 */
gulp.task('lint', ['jshint', 'csslint']);



/**
 * Linter
 */
gulp.task('jshint', function () {
    return gulp.src([
        './gulpfile.js',
        './src/app/**/*.js'
    ])
        .pipe(g.cached('jshint'))
        .pipe(jshint('./.jshintrc'))
        .pipe(livereload());
});

gulp.task('csslint', ['styles'], function () {
});


/**
 * All CSS files as a stream
 */
function cssFiles(src, opt) {
    return gulp.src(src, opt);
}

/**
 * All AngularJS application files as a stream
 */
function appFiles() {
    var files = [
        './.tmp/' + bower.name + '-templates.js',
        './.tmp/**/*.js',
        '!./.tmp/src/app/**/*_test.js',
        './src/app/**/*.js',
        '!./src/app/**/*_test.js',
        './src/themes/' + theme + '/**/*.js',
        '!./src/app/app.config.js'
    ];
    return gulp.src(files)
        .pipe(g.angularFilesort());
}


/**
 * All AngularJS templates/partials as a stream
 */
function templateFiles(opt) {
    return gulp.src('./src/themes/' + theme + '/templates/**/*.html', opt)
        .pipe(opt && opt.min ? g.htmlmin(htmlminOpts) : noop());
}

/**
 * Build AngularJS templates/partials
 */
function buildTemplates() {
    return lazypipe()
        .pipe(g.ngHtml2js, {
            declareModule: false,
            moduleName: 'myBlog',
            prefix: 'templates/'
        })
        .pipe(g.concat, bower.name + '-templates.js')
        .pipe(gulp.dest, './.tmp')
        .pipe(livereload)();
}

/**
 * Filter an array of files according to file type
 *
 * @param {Array} files
 * @param {String} extension
 * @return {Array}
 */
function fileTypeFilter(files, extension) {
    var regExp = new RegExp('\\.' + extension + '$');
    return files.filter(regExp.test.bind(regExp));
}

/**
 * Concat, rename, minify
 *
 * @param {String} ext
 * @param {String} name
 * @param {Object} opt
 */
function dist(ext, name, opt) {
    opt = opt || {};
    return lazypipe()
        .pipe(g.concat, name + '.' + ext)
        .pipe(gulp.dest, './dist')
        .pipe(opt.ngAnnotate ? g.ngAnnotate : noop)
        .pipe(opt.ngAnnotate ? g.rename : noop, name + '.annotated.' + ext)
        .pipe(opt.ngAnnotate ? gulp.dest : noop, './dist')
        .pipe(ext === 'js' ? g.uglify : minifyCss)
        .pipe(g.rename, name + '.min.' + ext)
        .pipe(gulp.dest, './dist')();
}

/**
 * Livereload (or noop if not run by watch)
 */
function livereload() {
    return lazypipe()
        .pipe(isWatching ? g.livereload : noop)();
}

/**
 * Jshint with stylish reporter
 */
function jshint(jshintfile) {
    return lazypipe()
        .pipe(g.jshint, jshintfile)
        .pipe(g.jshint.reporter, stylish)();
}

/**
 * Utility methods
 */
function extend() {
    for (var i = 1; i < arguments.length; i++) {
        for (var key in arguments[i]) {
            if (arguments[i].hasOwnProperty(key)) {
                arguments[0][key] = arguments[i][key];
            }
        }
    }
    return arguments[0];
}

function moduleExists(name) {
    try {
        return require.resolve(name);
    }
    catch (e) {
        return false;
    }
}

function baasicAppConfiguratinProvider() {
    var themeConfigPath = './src/themes/' + theme + '/app.conf.json';
    var rootAppConfig = require('./app.conf.json');
    var themeAppConfig = {};
    if (moduleExists(themeConfigPath)) {
        themeAppConfig = require(themeConfigPath);
    }
    return extend({
        apiKey: ''
    }, themeAppConfig, rootAppConfig);
}

function appConfigSource() {
    var appConfig = baasicAppConfiguratinProvider();
    return gulp.src(['./src/app/app.config.js'])
        .pipe(replace('<apiKey>', appConfig.apiKey))
        .pipe(replace('<apiRootUrl>', appConfig.apiRootUrl))
        .pipe(replace('<apiVersion>', appConfig.apiVersion));
}