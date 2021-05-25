// 1、构建优化
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({size: 5}); // 构建共享进程池，包含5个进程

// normal option
module.exports = {
    mode: 'production',
    plugins: [
        // happypack并行处理
        new HappyPack({
            // 用唯一ID来代表当前HappyPack是用来处理一类特定文件的，与rules中的use对应
            id: 'babel',
            loaders: ['babel-loader?cacheDirectory'],//默认设置loader处理
            threadPool: happyThreadPool,//使用共享池处理
        }),
        new HappyPack({
            // 用唯一ID来代表当前HappyPack是用来处理一类特定文件的，与rules中的use对应
            id: 'css',
            loaders: [
                'css-loader',
                'postcss-loader',
                'sass-loader'],
                threadPool: happyThreadPool
        }),
        // webpack-parallel-uglify-plugin
        // 可以开启多个子进程，每个子进程使用UglifyJS压缩代码，可以并行执行，能显著缩短压缩时间。
        new ParallelUglifyPlugin({
            uglifyJS:{
                //...这里放uglifyJS的参数
            },
            uglifyES: {}
            //...其他ParallelUglifyPlugin的参数，设置cacheDir可以开启缓存，加快构建速度
        }),
    ],
    resolve: {
        extensions: ['jsx', 'js'], // 数量多的文件后缀靠前放
        modules: [path.resolve(__dirname, 'node_modules')], // 指定第三方模块目录，避免层层查找
        alias: {
            react: path.resolve(__dirname, './node_modules/react/dist/react.min.js'),
            design: path.resolve(__dirname, 'design'),
        }
    },
    module: {
        noParse:[/jquery|chartjs/, /react\.min\.js$/], // 这些规则下的文件 不必解析
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: [
                    'happypack/loader?id=babel',
                    'babel-loader?cacheDirectory', // 开启转换结果缓存
                ],
                include: path.resolve(__dirname, 'src'), // 只对src目录中文件采用babel-loader
                exclude: path.resolve(__dirname,' ./node_modules'), // 排除node_modules目录下的文件
            },
            
            {
                test: /\.(scss|css)$/,
                //使用的mini-css-extract-plugin提取css此处，如果放在上面会出错
                use: [MiniCssExtractPlugin.loader,'happypack/loader?id=css'],
                include:[
                    path.resolve(__dirname,'src'),
                    path.join(__dirname, './node_modules/antd')
                ]
            },
        ]
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