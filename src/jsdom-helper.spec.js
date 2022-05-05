const { JSDOM } = require("jsdom");

JSDOM.fromFile("./dist/index.html").then((dom) => {
  global.window   = dom.window;
  global.document = dom.window.document;
  global.requestAnimationFrame = (callback) => {
    setTimeout(callback, 0);
  }
});
