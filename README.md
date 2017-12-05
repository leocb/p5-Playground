# About
This repo is a collection of demos, tests and for-fun coding with p5.js

p5.js is a open-source javaScript libray port of processing. It's main goal is to make coding accessible for artists, designers, educators and beginners; but IMO, it's just plain fun to code on it. You can learn more about p5 [here](https://p5js.org/).

This repo in particular uses [p5-Manager](https://github.com/chiunhau/p5-manager) to... well... manage the source code

As a learning source, I highly recommend Daniel Shiffman's [Coding train](https://www.youtube.com/channel/UCvjgXvBlbQiydffZU7m1_aw) series on YouTube.

# How to
## Installing
- First install [Node.js](https://nodejs.org/en/) (you don't have to redownload if you already have it)
- Then install [p5-manager](https://www.npmjs.com/package/p5-manager) globally with npm, using the following command on the Terminal/Command prompt:
```shell
npm install -g p5-manager
```

## Running
This project already have a p5 collection setup, so you just have to start the server and enjoy, do so by using the following command at the project root folder
```shell
p5 server
```
This will start a [localhost](http://localhost:5555) server at port 5555. If you wish to open it on a different port, you can do so by using this command:
```shell
p5 server --port PORT_NUMBER
```

## Add'ing more things
P5-manager is awesome to manage your p5 sketches, you can add more projects to it by using the following command:
```shell
p5 generate PROJECT_NAME
```
this will create a sketch with some boilerplate code and libraries already setup

# Happy coding!