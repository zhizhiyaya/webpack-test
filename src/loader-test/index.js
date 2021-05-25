var path = require("path");
const { getContext, runLoaders } = require("loader-runner");

var fixtures = path.resolve(__dirname);

function done(result) {
    console.log('\n');
    console.log(result);
    console.log('\n');
}

function runLoader(loaders) {
    runLoaders({
        resource: path.resolve(fixtures, "resource.bin"),
        loaders: loaders
    }, function(err, result) {
        if(err) return done(err);
        done(result);
    });
}

runLoader([
    path.resolve(fixtures, "simple-loader.js")
]);
// runLoader([
//     path.resolve(fixtures, "simple-async-loader.js")
// ]);
runLoader([
    path.resolve(fixtures, "simple-loader.js"),
    path.resolve(fixtures, "pitch-simple-loader.js"),
    path.resolve(fixtures, "pitching-loader.js"),
    path.resolve(fixtures, "simple-loader-2.js"),
    // path.resolve(fixtures, "simple-async-loader.js"),
]);
// runLoader([
//     path.resolve(fixtures, "simple-loader.js"),
//     path.resolve(fixtures, "pitch-async-undef-loader.js"),
//     path.resolve(fixtures, "pitch-promise-undef-loader.js")
// ]);



// runLoaders({
//     resource: path.resolve(fixtures, "resource.bin"),
//     loaders: [
//         path.resolve(fixtures, "simple-loader.js")
//     ]
// }, function(err, result) {
//     if(err) return done(err);
//     done(result);
// });

// runLoaders({
//     resource: path.resolve(fixtures, "resource.bin"),
//     loaders: [
//         path.resolve(fixtures, "simple-async-loader.js")
//     ]
// }, function(err, result) {
//     if(err) return done(err);
//     result.result.should.be.eql(["resource-async-simple"]);
//     result.cacheable.should.be.eql(true);
//     result.fileDependencies.should.be.eql([
//         path.resolve(fixtures, "resource.bin")
//     ]);
//     result.contextDependencies.should.be.eql([]);
//     done(result);
// });


// runLoaders({
//     resource: path.resolve(fixtures, "resource.bin"),
//     loaders: [
//         path.resolve(fixtures, "simple-loader.js"),
//         path.resolve(fixtures, "pitching-loader.js"),
//         path.resolve(fixtures, "simple-async-loader.js"),
//     ]
// }, function(err, result) {
//     if(err) return done(err);
//     result.result.should.be.eql([
//         path.resolve(fixtures, "simple-async-loader.js") + "!" +
//         path.resolve(fixtures, "resource.bin") + ":" +
//         path.resolve(fixtures, "simple-loader.js") +
//         "-simple"
//     ]);
//     result.cacheable.should.be.eql(true);
//     result.fileDependencies.should.be.eql([]);
//     result.contextDependencies.should.be.eql([]);
//     done();
// });

// runLoaders({
//     resource: path.resolve(fixtures, "resource.bin"),
//     loaders: [
//         path.resolve(fixtures, "simple-loader.js"),
//         path.resolve(fixtures, "pitch-async-undef-loader.js"),
//         path.resolve(fixtures, "pitch-promise-undef-loader.js")
//     ]
// }, function(err, result) {
//     if(err) return done(err);
//     result.result.should.be.eql([
//         "resource-simple"
//     ]);
//     result.cacheable.should.be.eql(true);
//     result.fileDependencies.should.be.eql([
//         path.resolve(fixtures, "resource.bin")
//     ]);
//     result.contextDependencies.should.be.eql([]);
//     done();
// });
