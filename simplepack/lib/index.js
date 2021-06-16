const Compiler = require('./compiler');
const options = require('../simplepack.config');

const compile = new Compiler(options);
compile.run();