var gulp = require('gulp');

var bower = require('main-bower-files'),
	filter = require('gulp-filter');


gulp.task('bower', function(){
	var jsFilter = filter('**/*.js'),
		cssFilter = filter('**/*.css');

	gulp.src(bower())
		.pipe(jsFilter)
		.pipe(gulp.dest('./js/'))
		.pipe(jsFilter.restore())
		.pipe(cssFilter)
		.pipe(gulp.dest('./css/'));
});
