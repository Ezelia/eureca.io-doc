// Include gulp
const gulp = require('gulp');
const jsdoc = require('gulp-jsdoc3');


gulp.task('generate-docs', (done) => {    
    var config = require('./jsdoc.json');
    gulp.src(['./doc-source/Readme.md'], {read: false})
        .pipe(jsdoc(config, done));
});
