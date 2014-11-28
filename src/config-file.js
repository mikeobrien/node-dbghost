var fs = require('fs'),
    Build = require('./config-builder'),
    path = require('path'),
    temp = require('temp');

function getUniqueKey() {
    return String(Math.random() * Math.pow(10, 18));
}

function joinArtifactsPath(basePath, relativePath) {
    return relativePath && basePath && !/\w?:|^\\\\/.test(relativePath) ? 
        path.join(basePath, relativePath) : relativePath;
}

function decode(buffer) {
    var encoding = 
        buffer.length >= 2 && 
        buffer[0] == 255 && 
        buffer[1] == 254 ? 'utf16le' : 'utf8';
    return buffer.toString(encoding).trim();
}

module.exports = function(templateConfigPath, artifactsPath) {
    var build = Build(templateConfigPath ? 
        decode(fs.readFileSync(templateConfigPath)) : '<DBGhost/>');

    return {
        save: function(config, operation) {

            var configPath, tempConfig;

            config = config || {};
            config.changeManager = config.changeManager || {};

            if (config.configSavePath) 
                configPath = joinArtifactsPath(artifactsPath, config.configSavePath);
            else {
                tempConfig = true;
                configPath = temp.path({suffix: '.config'});
            }

            config.changeManager.savePath = configPath;
            config.changeManager.tempUniqueKey = getUniqueKey();

            config.changeManager.visualStudioDatabaseProjectFile = joinArtifactsPath(artifactsPath, 
                config.changeManager.visualStudioDatabaseProjectFile);

            config.changeManager.buildSQLFilename = joinArtifactsPath(artifactsPath, 
                config.changeManager.buildSQLFilename);

            config.changeManager.deltaScriptsFilename = joinArtifactsPath(artifactsPath, 
                config.changeManager.deltaScriptsFilename);

            config.changeManager.reportFilename = joinArtifactsPath(artifactsPath, 
                config.changeManager.reportFilename);

            if (config.scripter)
                config.scripter.reportFilename = joinArtifactsPath(artifactsPath, 
                    config.scripter.reportFilename);

            fs.writeFileSync(configPath, build[operation](config));

            return {
                path: configPath,
                cleanup: function() {
                    if (tempConfig) fs.unlinkSync(configPath);
                }
            }
        }
    };
};