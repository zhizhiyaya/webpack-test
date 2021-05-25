// normal option
module.exports = {
    watch: true,
    watchOptions: {
        ignored: /node_modules/,
        aggregateTimeout: 300,  //文件变动后多久发起构建
        poll: 1000,  //每秒询问次数
    }
};


// webpack_dll.config.js
const path = require('path');
const DllPlugin = require('webpack/lib/DllPlugin');
module.exports = {
    entry: {
        // 将React相关模块放入一个动态链接库
        react: ['react','react-dom','react-router-dom','react-loadable'],
        librarys: ['editor'],
        utils: ['axios','js-cookie']
    },
    output: {
        filename: '[name]-dll.js',
        path: path.resolve(__dirname, 'dll'),
        // 存放动态链接库的全局变量名，加上_dll_防止全局变量冲突
        library: '_dll_[name]'
    },
    // 动态链接库的全局变量名称，需要可output.library中保持一致，也是输出的manifest.json文件中name的字段值
    // 如react.manifest.json字段中存在"name":"_dll_react"
    plugins: [
        new DllPlugin({
            // DllPlugin 的参数中 name 值必须和 output.library 值保持一致
            name: '_dll_[name]', // dll的全局变量名
            path: path.join(__dirname, 'dll', '[name].manifest.json') // 描述生成的manifest文件
        }),
    ]
};
// output : 
// |-- utils.dll.js
// |-- utils.manifest.json
// |-- librarys.dll.js
// |-- librarys.manifest.json
// |-- react.dll.js
// └── react.manifest.json

// webpack.config.json,  接上面的 webpack_dll.config.js
const path = require('path');
const DllReferencePlugin = require('webpack/lib/DllReferencePlugin');
module.exports = {
    entry:{ main:'./main.js' },
    //... 省略output、loader等的配置
    plugins:[
        new DllReferencePlugin({
            manifest:require('./dist/react.manifest.json')
        }),
        new DllReferenctPlugin({
            manifest:require('./dist/polyfill.manifest.json')
        })
    ]
};