var SRC   = 'src' ,
    fs    = require( 'fs' ) ,
    del   = require( 'del' ) ,
    sass  = require( 'gulp-sass' ) ,
    babel = require( 'gulp-babel' ) ,
    watch = require( 'gulp-watch' ) ,// gulp.watch 不能监视 新建的 和 删除的 文件，所以换成了这个模块
    gulp  = require( 'gulp' );

/**
 * 监视所有以 .es6 .scss 为后缀的文件，并在文件改动时自动转换成正常的 .js .css 文件
 */
gulp.task( 'watch-es6-scss' , function ( done ) { // 带上这个 done 参数，控制台里就不会显示 Finished — 不带上其实任务也仍然在 watch 中
    watch( SRC + '/**/*.{es6,scss}' , function ( e ) {
        var fileFullPath = e.path ,
            isScss       = '.scss' === e.extname;

        switch ( e.event ) {
            case 'change':
                var dest = fileFullPath.slice( 0 , fileFullPath.lastIndexOf( '\\' ) );

                // scss 比较特殊，如果改动的是以下划线（_）开头的文件，就全部编译一次
                if ( isScss ) {
                    if ( '_' === e.basename[ 0 ] ) {
                        console.warn( '检测到更改了以下划线开头的 scss 文件（' + e.basename + '），正在重新编译整个项目……' );
                        complieScss()
                            .on( 'finish' , function () {
                                console.log( '编译完成。' );
                            } ); // 这个操作可能会触发此 watch
                    } else {
                        complieScss( fileFullPath , dest );
                    }
                } else {
                    complieEs6( fileFullPath , dest );
                }
                break;
            case 'unlink':
                var path = fileFullPath.slice( 0 , fileFullPath.lastIndexOf( '.' ) ) + (isScss ? '.css' : '.js');
                fs.unlink( path/* , function () {
                 console.log( 'Deleted file:' + path );
                 }*/ );
                break;
            case 'add':
                //console.log( 'Added:' + fileFullPath );
                break;
        }

    } );
} );

/**
 * 将所有 es6 文件转换成 .js 文件
 */
gulp.task( 'compile-es6' , function () {
    return complieEs6();
} );

/**
 * 将所有 scss 文件转换成 .css 文件
 */
gulp.task( 'compile-scss' , function () {
    return complieScss();
} );

/**
 * 输出文件，过滤掉开发时的中间文件如 *.es6、*.psd、*.scss
 */
gulp.task( 'output' , [ 'compile-es6' , 'compile-scss' ] , function ( done ) {
    del( 'dist' , function () {
        gulp.src( [
            'src/**' ,
            '!src/**/_*{,/**}' , // 避免把空目录也复制过去，@see https://github.com/gulpjs/gulp/issues/165
            '!src/**/*.{psd,es6,scss,md}'
        ] ).pipe( gulp.dest( 'dist' ) ).on( 'finish' , function () {
            done();
        } );
    } );
} );

/**
 * 将所有 .es6 文件转换成 .js 文件
 * @params {String} [path]
 * @params {String} [dest]
 */
function complieEs6( path , dest ) {
    return gulp.src( path || SRC + '/**/*.es6' )
        .pipe( babel().on( 'error' , function ( err ) {
            console.error( 'Error occur in ' + err.plugin );
            console.error( err.stack );
        } ) )
        .pipe( gulp.dest( dest || SRC ) );
}

/**
 * 将所有 .scss 文件转换成 .css 文件
 * @params {String} [path]
 * @params {String} [dest]
 */
function complieScss( path , dest ) {
    return gulp.src( path || SRC + '/**/*.scss' )
        .pipe( sass().on( 'error' , sass.logError ) )
        .pipe( gulp.dest( dest || SRC ) );
}
