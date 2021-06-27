// vue.config.js
module.exports = {
    runtimeCompiler: true,
    outputDir: './dist',
    filenameHashing: true,
    pages: {
        index: './src/entry/main.js',
        adminApp: './src/entry/adminApp.js',
        // index: {
        //     // page 的入口
        //     entry: './src/main.js',
        //     // 模板来源
        //     template: 'public/index.html',
        //     // 在 dist/index.html 的输出
        //     filename: 'index.html',
        //     // 当使用 title 选项时，
        //     // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
        //     title: 'Index Page',
        //     // 在这个页面中包含的块，默认情况下会包含
        //     // 提取出来的通用 chunk 和 vendor chunk。
        //     chunks: ['chunk-vendors', 'chunk-common', 'index']
        // },
        // adminApp: {
        //     // page 的入口
        //     entry: './src/adminApp.js',
        //     // 模板来源
        //     template: 'public/adminApp.html',
        //     // 在 dist/index.html 的输出
        //     filename: 'adminApp.html',
        //     // 当使用 title 选项时，
        //     // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
        //     title: 'adminApp Page',
        //     // 在这个页面中包含的块，默认情况下会包含
        //     // 提取出来的通用 chunk 和 vendor chunk。
        //     chunks: ['chunk-vendors', 'chunk-common', 'adminApp']
        // },
        // 当使用只有入口的字符串格式时，
        // 模板会被推导为 `public/subpage.html`
        // 并且如果找不到的话，就回退到 `public/index.html`。
        // 输出文件名会被推导为 `subpage.html`。
        // subpage: 'src/subpage/main.js'
    },
    configureWebpack: {
        resolve: { alias: { vue: 'vue/dist/vue.esm.js' } },
        optimization: {
            splitChunks: {
                chunks: 'all',
                // chunks: 'async',
                minSize: 20000,
                // minRemainingSize: 0,
                minChunks: 1,
                maxAsyncRequests: 1,
                maxInitialRequests: 30,
                enforceSizeThreshold: 50000,
                cacheGroups: {
                    defaultVendors: {
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10,
                        reuseExistingChunk: true,
                    },
                    default: {
                        minChunks: 2,
                        priority: -20,
                        reuseExistingChunk: true,
                    },
                },

            },
        },
    //   plugins: [
    //     new MyAwesomeWebpackPlugin()
    //   ]
    }
};