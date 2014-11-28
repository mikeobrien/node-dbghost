var ConfigFile = require('./config-file'),
    process = require('./process');

module.exports = function(options) {

    options = options || {};
    var configFile = ConfigFile(options.templateConfigPath, options.artifactsPath);

    var run = function(config, operation) {
        return process(options.binPath, configFile.save(config, operation)); 
    }

    return {
        copy: function(config) { return run(config, 'copy'); },
        compare: function(config) { return run(config, 'compare'); },
        compareAndSync: function(config) { return run(config, 'compareAndSync'); },
        compareAndCreateDelta: function(config) { return run(config, 'compareAndCreateDelta'); },
        script: function(config) { return run(config, 'script'); },
        scriptAndBuild: function(config) { return run(config, 'scriptAndBuild'); },
        scriptBuildAndCompare: function(config) { return run(config, 'scriptBuildAndCompare'); },
        scriptBuildCompareAndCreateDelta: function(config) { return run(config, 'scriptBuildCompareAndCreateDelta'); },
        scriptBuildCompareAndSync: function(config) { return run(config, 'scriptBuildCompareAndSync'); },
        build: function(config) { return run(config, 'build'); },
        buildAndCompare: function(config) { return run(config, 'buildAndCompare'); },
        buildCompareaAndSync: function(config) { return run(config, 'buildCompareaAndSync'); },
        buildCompareAndCreateDelta: function(config) { return run(config, 'buildCompareAndCreateDelta'); }
    }
};