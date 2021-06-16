
            (function(modules) {
                function require(fileName) {
                    console.log(fileName, modules)
                    const fn = modules[fileName];
        
                    const module = { exports : {} };
        
                    fn(require, module, module.exports);
        
                    return module.exports;
                }

                require('/Users/wangjie/Documents/myFE/webpack-test/simplepack/src/index.js');
            })({'/Users/wangjie/Documents/myFE/webpack-test/simplepack/src/index.js': function (require, module, exports) { "use strict";

var _greeting = require("/greeting.js");

document.write((0, _greeting.greeting)('Jane')); },'/greeting.js': function (require, module, exports) { "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.greeting = greeting;
function greeting(name) {
  return 'hello' + name;
} },})
        