angular.module('baasic.blog').directive('baasicHeroImg', [function() {
	'use strict';
	return {
		restrict: 'E',
        scope: true,		
		template: '<div class="hero-image hero-hide-mobile" style="background-image: url(\'./assets/img/title-photo.jpg\');"></div>'
	};
}]);