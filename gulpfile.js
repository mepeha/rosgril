const gulp = require("gulp");
const concat = require("gulp-concat");
const sass = require("gulp-sass")(require("sass"));
const terser = require("gulp-terser");
const browserSync = require("browser-sync").create();
const sourcemaps = require("gulp-sourcemaps");
const newer = require("gulp-newer");
const cached = require("gulp-cached");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const dependents = require("gulp-dependents");

const nodeModules = "node_modules/";

// Запуск Live Server
gulp.task("serve", function () {
    browserSync.init({
        server: { baseDir: "./" },
        notify: false,
        open: true,
    });

    gulp.watch("libs/css/*.css", gulp.series("vendorStyles"));
    gulp.watch("src/scss/**/*.scss", gulp.series("styles"));
    gulp.watch("libs/js/*.min.js", gulp.series("vendorScripts"));
    gulp.watch("src/js/**/*.js", gulp.series("scripts"));
    gulp.watch("./*.html").on("change", browserSync.reload);
});

// Объединяем и минифицируем CSS-библиотеки (только если изменились)
gulp.task("vendorStyles", function () {
    return gulp
        .src("libs/css/*.css")
        .pipe(newer("dist/css/vendor.css"))
        .pipe(concat("vendor.css"))
        .pipe(gulp.dest("dist/css"))
        .pipe(browserSync.stream());
});

// Собираем SCSS в style.css + автопрефиксы
gulp.task("styles", function () {
    return gulp
        .src("src/scss/style.scss")
        .pipe(dependents())
        .pipe(sourcemaps.init())
        .pipe(sass().on("error", sass.logError))
        .pipe(postcss([autoprefixer()])) // Добавляем автопрефиксы
        .pipe(concat("style.css"))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("dist/css"))
        .pipe(browserSync.stream());
});

// Объединяем и минифицируем JS-библиотеки
gulp.task("vendorScripts", function () {
    return gulp
        .src([
            nodeModules + "jquery/dist/jquery.min.js",
            "libs/js/*.min.js"
        ])
        .pipe(newer("dist/js/vendor.js"))
        .pipe(concat("vendor.js"))
        .pipe(terser())
        .pipe(gulp.dest("dist/js"))
        .pipe(browserSync.stream());
});

// Собираем твои JS-файлы
gulp.task("scripts", function () {
    return gulp
        .src("src/js/**/*.js")
        .pipe(cached("js")) // Кэшируем изменения
        .pipe(concat("main.js"))
        .pipe(gulp.dest("dist/js"))
        .pipe(browserSync.stream());
});

// Запуск всех задач + Live Server
gulp.task("default", gulp.parallel("vendorStyles", "styles", "vendorScripts", "scripts", "serve"));
