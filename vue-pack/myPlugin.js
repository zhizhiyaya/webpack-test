// // const babel = require('babel-core');
// // const types = require('babel-types');

// // 将import {flattenDeep, chunk} from 'lodash' 转化为下面这种写法:
// // import flattenDeep from 'lodash/flattenDepp'
// // import chunk from 'lodash/chunk'

// // Babel将源码转换AST之后，通过遍历AST树（其实就是一个js对象），对树做一些修改，然后再将AST转成code，即成源码。
// let visitor = {
//     BinaryExpression(path) {
//         if (path.node.operator !== "===") {
//           return;
//         }
//         console.log(111111111111)
//         path.node.left = t.identifier("sebmck");
//         path.node.right = t.identifier("dork");
//     },
//     // import 语句解析时触发该函数
//     // ImportDeclaration(path, ref = {opts: {}}) {  //path 语句抽象语法树 opts 插件参数
//     //     let node = path.node;
//     //     let {specifiers} = node; // 导入的包的说明符 是个数组集合
//     //     // 确认导入库 是否是 .babelrc library属性指定库 以及 如果不是默认导入 才进行按需导入加载
//     //     if (ref.opts.library === node.source.value && !types.isImportDefaultSpecifier(specifiers[0])) {
//     //         let newImports = specifiers.map(specifier => ( // 遍历 出导入的每个包的说明描述符
//     //             types.importDeclaration([types.importDefaultSpecifier(specifier.local)],
//     //             // 生成import语句如 import chunk from 'lodash/chunk'
//     //             types.stringLiteral(`${node.source.value}/${specifier.local.name}`))
//     //         ));

//     //         // 将原有语句写法替换掉 新写法
//     //        path.replaceWithMultiple(newImports);
//     //     }
//     // }
// }
// // export default function({ types: t }) {
// //     return {
// //       visitor: {
// //         // Identifier(path, state) {},
// //         // ASTNodeTypeHere(path, state) {},
// //         BinaryExpression(path) {
// //             if (path.node.operator !== "===") {
// //               return;
// //             }
// //             console.log(111111111111, sebmck, dork)
// //             path.node.left = t.identifier("sebmck");
// //             path.node.right = t.identifier("dork");
// //         },
// //       }
// //     };
// // };
// module.exports = function(babel) { // 将插件导出
//     return {visitor} // 属性名固定为visitor
// };

// export default function({ types: t }) {
//     return {
//       visitor: {
//         // visitor contents
//       }
//     };
//   };


"use strict"

exports.__esModule = true

const getJSXAttributeName = (path) => {
    const nameNode = path.node.name;
    if (t.isJSXIdentifier(nameNode)) {
        return nameNode.name;
    }
    return `${nameNode.namespace.name}:${nameNode.name.name}`;
};

const getJSXAttributeValue = (path, state) => {
    const valuePath = path.get('value');
    if (valuePath.isJSXElement()) {
        return transformJSXElement(valuePath, state);
    }
    if (valuePath.isStringLiteral()) {
        return valuePath.node;
    }
    if (valuePath.isJSXExpressionContainer()) {
        return utils_1.transformJSXExpressionContainer(valuePath);
    }
    return null;
};

const isConstant = (node) => {
    if (t.isIdentifier(node)) {
        return node.name === 'undefined';
    }
    if (t.isArrayExpression(node)) {
        const { elements } = node;
        return elements.every((element) => element && exports.isConstant(element));
    }
    if (t.isObjectExpression(node)) {
        return node.properties.every((property) => exports.isConstant(property.value));
    }
    if (t.isLiteral(node)) {
        return true;
    }
    return false;
};

const checkIsComponent = (path) => {
    const namePath = path.get('name');
    if (namePath.isJSXMemberExpression()) {
        return exports.shouldTransformedToSlots(namePath.node.property.name); // For withCtx
    }
    const tag = namePath.node.name;
    return exports.shouldTransformedToSlots(tag) && !html_tags_1.default.includes(tag) && !svg_tags_1.default.includes(tag);
};

exports.default = function (babel) {
  const { types: t } = babel;
  return {
    visitor: {
        JSXElement: {
            exit (path, file) {
                // const tag = utils_1.getTag(path, state);
                // const isComponent = utils_1.checkIsComponent(path.get('openingElement'));
                const props = path.get('openingElement').get('attributes');

                // const directives = [];
                // const dynamicPropNames = new Set();
                // // let slots = null;
                // // let patchFlag = 0;
                // if (props.length === 0) {
                //     return {
                //         tag,
                //         isComponent,
                //         slots,
                //         props: t.nullLiteral(),
                //         directives,
                //         patchFlag,
                //         dynamicPropNames,
                //     };
                // }
                const isComponent = checkIsComponent(path.get('openingElement'));
                props.forEach(prop => {
                    if (prop.isJSXAttribute()) {
                        let name = getJSXAttributeName(prop);
                        const attributeValue = getJSXAttributeValue(prop, state);
                        if (!isConstant(attributeValue)) {
                            if (name === 'class' && !isComponent) {
                                dynamicPropNames.add('testName');
                            }
                        }
                    }
                });

              // turn tag into createElement call
              var callExpr = buildElementCall(path.get('openingElement'), file)
              if (path.node.children.length) {
                // add children array as 3rd arg
                callExpr.arguments.push(t.arrayExpression(path.node.children))
                if (callExpr.arguments.length >= 3) {
                  callExpr._prettyCall = true
                }
              }
              path.replaceWith(t.inherits(callExpr, path.node))
            }
        },
        FunctionDeclaration(path) { 
            path.replaceWithSourceString(function addtest(a, b) { return 'sebmck'; });
        },
    }
  };
}

module.exports = exports["default"]
