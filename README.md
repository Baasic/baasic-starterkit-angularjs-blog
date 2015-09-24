Baasic AngularJS Blog Starter Kit
============

## Starter Kit Functionality

This Starter Kit provides a bare-bones blog engine. Initially, it shows a list of blog posts, with search, tags, and login modules contained within a panel on the right side. To keep things simple, it allows you to add/edit/delete blog posts using the markdown syntax and add tags to posts. We deliberately removed more advanced features so the basic functionality is not obscured by them: however, future samples will include a complete content management functionality.

This Kit is based on the Baasic article data type. Articles provide a standard way to gather written work for the purpose of publishing various documents, news, posts and other similar items. Each article has a set of properties that can be edited interactively to change their appearance and behavior. We can distinguish following article types:
- Published article - a publicly available article,
- Article pending publication - an article that is waiting on publication until the predetermined Publication date,
- Draft article - an unfinished article saved to the Baasic data storage and
- Archived article - an older article separated in the archived data storage for potential future use.

More information about the Starter Kit can be found in the series of blog posts [here](http://www.baasic.com/posts/AngularJS-Blog-Starter-Kit-part-1/).

## Starter Kit themes live demo

### Space themes
[Space Minimal](http://demo.baasic.com/angularjs/starterkit-blog-themes/space-minimal/)  

[Space Tiles](http://demo.baasic.com/angularjs/starterkit-blog-themes/space-tiles/)  

[Space Thumbnail](http://demo.baasic.com/angularjs/starterkit-blog-themes/space-thumbnail/)  

### Gastro themes
[Gastro Thumbnail](http://demo.baasic.com/angularjs/starterkit-blog-themes/gastro-thumbnail/)  

[Gastro NSFY](http://demo.baasic.com/angularjs/starterkit-blog-themes/gastro-nsfy/)  

### Life theme
[Life Minimal](http://demo.baasic.com/angularjs/starterkit-blog-themes/life-minimal/)  

### Events theme
[Events Minimal](http://demo.baasic.com/angularjs/starterkit-blog-themes/events-minimal/) 

### Music theme
[Music Blocks](http://demo.baasic.com/angularjs/starterkit-blog-themes/music-blocks/)
 

## Working with the Starter kit
 
As a client-side prerequisite, you should install the basic tools for your operating system: Node.js (4.x and above), Bower and Gulp. Start by cloning the [AngularJS blog Starter Kit repository](https://github.com/Baasic/baasic-starterkit-angularjs-blog/). After that, go into the root folder of the started Kit you just cloned and type

    npm install
    
npm (Node Package Manager) will go through its configuration file (package.json) and install all dependencies. It may take a couple of minutes to download and install everything; when it is finished, just type

    gulp serve
    
this will serve you the default theme, to serve a different theme please use the _--theme_ switch

    gulp serve --theme gastro-thumbnail

and you are *almost* ready to go. 

In its default state, this Kit points to the [main demo site](http://demo.baasic.com/angularjs/starterkit-blog/) and pulls its content from it. As it would not be a nice thing to have thousands of users editing it, you will need to point your Kit to your own application. It is easy - just go to the *\src\app\app.js* and enter your Baasic application unique identifier (API Key) here:

    baasicAppProvider.create('your-unique-identifier', {
            apiRootUrl: 'api.baasic.com',
            apiVersion: 'beta'
        }); 

As your application may be empty and there is no articles in it, and the demo page will be blank after this switch. However, you can now log in and start entering your own content. 

## Production ready build

To make the app ready for deploy to production run:

```bash
gulp dist
```
or
```bash
gulp dist --theme gastro-thumbnail
```

## Base url option

You can also add a `--baseUrl` command if your blog destination is not in root of your website 

For example:
`--baseUrl "/angularjs/starterkit-blog-themes/events-minimal/"`

Now there's a `./dist` folder with all scripts and stylesheets concatenated and minified, also third party libraries installed with bower will be concatenated and minified into `vendors.min.js` and `vendors.min.css` respectively.

## Get in touch

Get in touch using one of the community channels 

* GitHub: [Baasic](https://github.com/Baasic)
* Google Groups: [Baasic Support](https://groups.google.com/forum/#!forum/baasic-baas)
* Twitter: [@baasical](https://twitter.com/baasical)