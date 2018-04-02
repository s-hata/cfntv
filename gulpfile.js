const gulp = require('gulp');

const cfnvt = require('./src');

gulp.task('validate', () => {
  gulp.src(['templates/*.yml'])
    .pipe(cfnvt({region: 'ap-northeast-1'}))
    .on('error', error => console.log(error));
});

gulp.task('default', ['validate'], () => {
  gulp.watch('templates/**.yml', ['validate']);
});
