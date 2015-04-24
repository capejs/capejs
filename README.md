# Cape.JS DOCUMENTATION

![Cape.JS logo](https://cdn.rawgit.com/oiax/capejs/logo1/doc/logo/capejs.svg)

## Setting up

1. Install [Hugo](http://gohugo.io/).
1. Run the following commands on your terminal:
```
$ git clone -b gh-pages git@github.com:oiax/capejs.git gh-pages
$ git clone -b documentation git@github.com:oiax/capejs.git documentation
$ cd documentation
$ ln -s ../gh-pages public
```

## How to edit and preview the contents

1. Run `hugo server -w` command on your terminal to start the Hugo server.
1. Open `http://localhost:1313/capejs/` with your browser.
1. Edit the files in the directories `content`, `data`, `layouts` and `static`.
   Do not touch the files in the directory `public`.
1. Wait your browser to reload the page automatically.

## How to commit your changes to the repository

Run the following commands on your terminal:

```
$ git add .
$ git commit
$ git push
```

Note that the `public` directory is ignored.

## How to publish the updated documents

1. Stop the Hugo server by hitting `Ctrl-C` on your terminal.
1. Run `hugo` command on your terminal.
1. Run the following commands on your terminal:
```
$ cd ../gh-pages
$ git add .
$ git commit
$ git push
```

The URL of public documentation is http://oiax.github.io/capejs/.
