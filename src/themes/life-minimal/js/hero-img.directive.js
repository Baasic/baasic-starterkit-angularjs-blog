angular.module('baasic.blog').directive('baasicHeroImg', [function() {
	'use strict';
	return {
		restrict: 'E',
        scope: true,		
		template: '<div class="hero-image" style="background-image: url(\'./assets/img/title-photo.jpg\');"></div>'
	};
}]);