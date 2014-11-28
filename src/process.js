var process = require('child_process'),
    path = require('path'),
    Q = require('q'),
    parser = require('./parser');

module.exports = function(binPath, configFile) {

    var changeManager = 'ChangeManagerCmd.exe';
    var processPath = binPath ? 
        path.join(binPath, changeManager) :
        changeManager;

    console.log();
    console.log(processPath + ' ' + configFile.path);
    console.log();

    var dbghost = process.spawn(processPath, [ configFile.path ]);

    var log = function(message) { 
        message = message.toString('utf8');
        console.log(message); 
        return message;
    };

    var stdout = '';
    var stderr = '';

    dbghost.stdout.on('data', function(message) { stdout += log(message); });
    dbghost.stderr.on('data', function(message) { stderr += log(message); });

    var deferred = Q.defer();

    dbghost.on('exit', function(code) { 
        if (code > 0) {
            var errors = parser(stdout) || stderr;
            var message = 'DB Ghost failed' + (errors ? 
                ': \r\n\r\n' + errors : '.');
            deferred.reject(new Error(message));
        }
        else deferred.resolve();
        configFile.cleanup();
    });

    return deferred.promise;   

};