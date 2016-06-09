# Contributing to Cape.JS

If you’d like to contribute a feature or bug fix,
you can [fork](https://help.github.com/articles/fork-a-repo/) Cape.JS,
commit your changes,
and [send a pull request](https://help.github.com/articles/using-pull-requests/).

Please make sure to [search the issue tracker](https://github.com/oiax/Cape.JS/issues) first.

## Setting up your development environment

You need [Node.js](https://nodejs.org/) 5.5 to build Cape.JS and run the tests.

You also need [gulp](http://gulpjs.com/) and [browserify](http://browserify.org/),
which can be installed via `npm` (a package manager for Node.js):

```shell
$ sudo npm install -g gulp browserify
```

Then run the following command (without `sudo`) to install dependencies:

```shell
$ npm install
```

## How to build Cape.JS

```shell
$ gulp
```

You can automate building task by running `gulp watch`.

Please do not include `dist` directory to your ordinary commits.
You should include it only when you bump the version number of Cape.JS.

## How to minify (uglify) cape.js

```shell
$ gulp minify
```

## How to run the tests

Run the following command on the terminal:

```shell
$ gulp test
```

Coverage reports are created in the directory `coverage`.

You can also run the test by opening `test/runner.html` with your web browser.

## How to run the tests with jsdom (experimental)

Run the following command on the terminal:

```shell
$ npm run test2
```
