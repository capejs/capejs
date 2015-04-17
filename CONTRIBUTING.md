# Contributing to CapeJS

If you’d like to contribute a feature or bug fix,
you can [fork](https://help.github.com/articles/fork-a-repo/) CapeJS,
commit your changes,
and [send a pull request](https://help.github.com/articles/using-pull-requests/).

Please make sure to [search the issue tracker](https://github.com/oiax/capejs/issues) first.

## Setting up your development environment

You need [Node.js](https://nodejs.org/) to build CapeJS and run the tests.

You also need [gulp](http://gulpjs.com/),
which can be installed via `npm` (a package manager for Node.js):

```shell
$ sudo npm install gulp
```

Then run the following command (without `sudo`) to install dependencies:

```shell
$ npm install
```

## How to build virtual-dom

You should build virtual-dom when you bump its version.

```shell
$ npm run build-vdom
```

The target file is created in the `vendor/virtual-dom` directory.

## How to build CapeJS

```shell
$ gulp
```

You can automate building task by running `gulp watch`.

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

You need [io.js](https://iojs.org) to run the test this way.
