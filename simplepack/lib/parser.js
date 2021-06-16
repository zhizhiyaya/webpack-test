// 转换 ，E6 -> ES5 
const fs = require('fs');
const babylon = require('babylon');
const traverse = require('babel-traverse').default;
const {transformFromAst} = require('babel-core');

module.exports = {
    getAst: (path) => {
        const content = fs.readFileSync(path, 'utf-8')
    
        return babylon.parse(content, {
            sourceType: 'module',
        });
    },
    getDependencies: (ast) => {
        const deps = [];
        traverse(ast, {
            ImportDeclaration: ({node}) => {
                deps.push(node.source.value);
            }
        });
        // console.log(deps)
        return deps;
    },
    transform: (ast) => {
        return transformFromAst(ast, null, {
            presets: 'env'
        }).code;
    }
}