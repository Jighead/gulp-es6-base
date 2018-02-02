const gulp = require('gulp'),
    //print = require('gulp-print'), // print what gulp is doing when it runs the task
    babel = require('gulp-babel'),  // conver to es216 to es5
    runSq = require('run-sequence'), // alows us to run task in specificsequence
    sass = require('gulp-sass'), // sass preprocessor
    autoprefixer = require('gulp-autoprefixer'), // autoprefix our css for across browsers
    sourcemaps = require('gulp-sourcemaps'), // uses css sourcemaps
    uglify = require('gulp-uglify'), // minify javascript
    concat = require('gulp-concat'), //concatenate files
    del = require('del'), // dele files
    cleanCss = require('gulp-clean-css'), // clean and minify css
    browserSync = require('browser-sync') // browsersync dev server

// delete everyting in the dist folder
gulp.task('clean', () => {
  return del([  'dist/**/*',  ]) 
});

// copy all html files to dist folder
gulp.task('copy-html', () => {
  return gulp.src('./src/*.html')
  //.pipe(print())
  .pipe(gulp.dest('dist')) 
});

// copy all image files to dist/images folder
gulp.task('copy-images', () => {
   return gulp.src('./src/assets/images/**/*.*')
   //.pipe(print())
   .pipe(gulp.dest('./dist/assets/images')) 
})
// copy lib or vendor css
gulp.task('vendor-css', () => {
    return gulp.src('./src/assets/css/libs/*.css')
    //.pipe(print())
    .pipe(autoprefixer()) // prefix the css
    .pipe(concat('vendor.css')) // concatenate into 1 file called vendor.css
    .pipe(cleanCss()) //minify it
    .pipe(gulp.dest('./dist/css'))
 })
// convert sass to css 
gulp.task('sass', () => {
   return gulp.src('./src/assets/scss/*.scss')
   //.pipe(print())
   .pipe(sourcemaps.init())
   .pipe(sass().on('error', sass.logError))
   .pipe(autoprefixer(['last 3 versions', '> 1%'], { cascade: true })) // prefix the css
   .pipe(sourcemaps.write())
  .pipe(gulp.dest('dist/assets/css'))
});


// copy/bundle custom js 
gulp.task('copy-js', () => {
  return gulp.src(['./src/js/*.js']) // glob the folder structure
    //.pipe(uglify()) // minify them
	//.pipe(concat('app.js')) 
	.pipe(gulp.dest('./dist/js/')) 
})
// copy/bundle custom js 
gulp.task('lib-js', () => {
	return gulp.src([
    './src/js/lib/jquery.js',
    './src/js/lib/bootstrap.js',
    './src/js/lib/waypoints.js',
    './src/js/lib/sticky.js',
    './src/js/lib/flexable1.0.6.js'
  ]) // glob the folder structure
		.pipe(uglify()) // minify them
		.pipe(concat('vendor.js')) 
		.pipe(gulp.dest('./dist/js/')) 
})


gulp.task('scripts', () => {
	return gulp.src('./src/js/components/*.js')
    //.pipe(sourcemaps.init())
	.pipe(babel({ presets: ['babel-preset-es2015'] }))    // #3. transpile ES2015 to ES5 using ES2015 preset
    //.pipe(sourcemaps.write())
	//.pipe(uglify()) // minify them
	.pipe(concat('components.js')) 
	.pipe(gulp.dest('dist/js/')) 
});

gulp.task('font-awesome', () => {
  return gulp.src('./src/font-awesome/**/*')
  //.pipe(print())
  .pipe(gulp.dest('./dist/font-awesome'))
})

// launching server with watch tasks
gulp.task('server', function() {
  browserSync.init({
      server: "./dist"
  });
  gulp.watch('src/css/*.css', ['vendor-css']).on('change', browserSync.reload );
  gulp.watch("src/scss/*.scss", ['sass']).on('change', browserSync.reload );
  gulp.watch("src/js/**/*.js", ['copy-js']).on('change', browserSync.reload);
  gulp.watch("src/js/lib/*.js", ['lib-js']).on('change', browserSync.reload);
  gulp.watch("src/images/**/*.*", ['copy-images']).on('change', browserSync.reload);
  gulp.watch("src/*.html", ['copy-html'] ).on('change', browserSync.reload);
});

// run these tasks in sequence for production build
gulp.task('dev', function() {
  runSq('clean', 'sass', 'vendor-css','lib-js','copy-js', ['scripts','copy-html', 'copy-images', 'font-awesome'],'server');
});

// run these tasks in sequence for production build
gulp.task('prod', function() {
  runSq('clean', 'sass', 'vendor-css','lib-js','copy-js', ['scripts','copy-html', 'copy-images', 'font-awesome']);
});