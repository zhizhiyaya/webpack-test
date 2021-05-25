const MyPlugin = require('./my-plugin');
const Compiler = require('./Compiler');
const myPlugin = new MyPlugin(); // 实例化plugin
const options = {
    plugins: [myPlugin]
}
const compiler = new Compiler();
for (const plugin of options.plugins) {
    if (typeof plugin === "function") {
        plugin.call(compiler, compiler);
    } else { // object本身无 apply 方法，所以 自定义 插件时需要添加 apply方法
        plugin.apply(compiler);
    }
}
compiler.run();