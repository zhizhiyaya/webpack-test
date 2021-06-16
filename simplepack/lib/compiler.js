const fs = require('fs');
const path = require('path');
const { getAst, getDependencies, transform } = require("./parser");

module.exports = class Compiler{
    constructor(options) {
        const { entry, output } = options;
        this.entry = entry;
        this.output = output;
        this.modules = [];
    }
    run() {
        const entryModule = this.buildModule(this.entry, true); 
        this.modules.push(entryModule);
        // [ { fileName: '/Users/wangjie/Documents/myFE/webpack-test/simplepack/src/index.js',
        // deps: [ '/greeting.js' ],
        // source: '"use strict";\n\nvar _greeting = require("/greeting.js");\n\ndocument.write((0, _greeting.greeting)(\'Jane\'));' } ]
        this.modules.map( _module => {
            _module.deps.map(dep => {
                this.modules.push(this.buildModule(dep, false));
            })
        });
        // [ { 
        //     fileName: '/Users/wangjie/Documents/myFE/webpack-test/simplepack/src/index.js',
        //     deps: [ '/greeting.js' ],
        //     source: '"use strict";\n\nvar _greeting = require("/greeting.js");\n\ndocument.write((0, _greeting.greeting)(\'Jane\'));'
        // },
        //     { 
        //     fileName: '/greeting.js',
        //     deps: [],
        //     source: '"use strict";\n\nObject.defineProperty(exports, "__esModule", {\n  value: true\n});\nexports.greeting = greeting;\nfunction greeting(name) {\n  return \'hello\' + name;\n}' 
        // } ]
        // console.log(this.modules);
        this.emitFiles();
    }
    buildModule(fileName, isEntry) {
        let ast;
        if (isEntry) {
            ast = getAst(fileName);
        } else {
            const absoluteModule = path.join(process.cwd(), '/src', fileName);
            ast = getAst(absoluteModule);
        }
        return {
            fileName,
            deps: getDependencies(ast),
            source: transform(ast)
        }
    }
    emitFiles() {
        const outputPath = path.join(this.output.path, this.output.fileName);
        let modules = '';
        this.modules.map((_module) => {
            modules += `'${ _module.fileName }': function (require, module, exports) { ${ _module.source } },`
        });
        
        const bundle = `
            (function(modules) {
                function require(fileName) {
                    console.log(fileName, modules)
                    const fn = modules[fileName];
        
                    const module = { exports : {} };
        
                    fn(require, module, module.exports);
        
                    return module.exports;
                }

                require('${this.entry}');
            })({${modules}})
        `;
        fs.writeFileSync(outputPath, bundle, 'utf-8');
    }
}