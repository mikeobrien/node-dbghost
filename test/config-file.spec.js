var expect = require('chai').expect,
    cases = require('cases'),
    _ = require('lodash'),
    temp = require('temp').track(),
    fs = require('fs'),
    path = require('path'),
    xmldom = require('xmldom'),
    xmlParser = new xmldom.DOMParser(),
    xpath = require('xpath'),
    configFile = require('../src/config-file');

function loadXml(path) {
    var document = xmlParser.parseFromString(fs.readFileSync(path, 'utf8'));
    return function(query) { return xpath.select1(query, document).textContent; };
}

describe('configFile', function() {

    var changeXPath = 'DBGhost/ChangeManager/';
    var scripterXPath = 'DBGhost/Scripter/';
    var templatePath, savePath;

    beforeEach(function() {
        templatePath = temp.path({ suffix: '.config' });
        savePath = temp.path({ suffix: '.config' });
        fs.writeFileSync(templatePath, '<DBGhost/>');
    });

    afterEach(function() {
        if (fs.existsSync(templatePath)) fs.unlinkSync(templatePath);
        if (fs.existsSync(savePath)) fs.unlinkSync(savePath);
    });

    it('should set the unique id', function () {

        var xml = loadXml(configFile(templatePath, null)
            .save({ configSavePath: savePath }, 'copy').path);

        var key = xml(changeXPath + 'TempUniqueKey');
        expect(key).to.match(/\d+/);

    });

    it('should preserve paths when artifacts path not specified', function () {

        var config = { 
            configSavePath: savePath,
            changeManager: {
                visualStudioDatabaseProjectFile: 'path/to/project',
                buildSQLFilename: 'path/to/build',
                deltaScriptsFilename: 'path/to/delta',
                reportFilename: 'path/to/changer/report'
            },
            scripter: {
                reportFilename: 'path/to/scripter/report'
            }
        };

        var file = configFile(templatePath)
            .save(config, 'copy');

        expect(file.path).to.equal(savePath);
        expect(fs.existsSync(file.path)).to.be.true;

        var xml = loadXml(file.path);

        expect(xml(changeXPath + 'SavePath'))
            .to.equal(savePath.replace(/\//g, '\\'));
        
        expect(xml(changeXPath + 'VisualStudioDatabaseProjectFile'))
            .to.equal('path/to/project'.replace(/\//g, '\\'));
        
        expect(xml(changeXPath + 'BuildSQLFileName'))
            .to.equal('path/to/build'.replace(/\//g, '\\'));
        
        expect(xml(changeXPath + 'DeltaScriptsFileName'))
            .to.equal('path/to/delta'.replace(/\//g, '\\'));
        
        expect(xml(changeXPath + 'ReportFileName'))
            .to.equal('path/to/changer/report'.replace(/\//g, '\\'));
        
        expect(xml(scripterXPath + 'ReportFilename'))
            .to.equal('path/to/scripter/report'.replace(/\//g, '\\'));

    });

    it('should join the artifacts path when specified', function () {

        var artifactsPath = path.dirname(savePath);
        var config = { 
            configSavePath: path.basename(savePath),
            changeManager: {
                visualStudioDatabaseProjectFile: 'path/to/project',
                buildSQLFilename: 'path/to/build',
                deltaScriptsFilename: 'path/to/delta',
                reportFilename: 'path/to/changer/report'
            },
            scripter: {
                reportFilename: 'path/to/scripter/report'
            }
        };

        var file = configFile(templatePath, artifactsPath)
            .save(config, 'copy');

        expect(file.path).to.equal(savePath);
        expect(fs.existsSync(file.path)).to.be.true;

        var xml = loadXml(file.path);

        expect(xml(changeXPath + 'SavePath'))
            .to.equal(savePath.replace(/\//g, '\\'));
        
        expect(xml(changeXPath + 'VisualStudioDatabaseProjectFile'))
            .to.equal(path.join(artifactsPath, 'path/to/project').replace(/\//g, '\\'));
        
        expect(xml(changeXPath + 'BuildSQLFileName'))
            .to.equal(path.join(artifactsPath, 'path/to/build').replace(/\//g, '\\'));
        
        expect(xml(changeXPath + 'DeltaScriptsFileName'))
            .to.equal(path.join(artifactsPath, 'path/to/delta').replace(/\//g, '\\'));
        
        expect(xml(changeXPath + 'ReportFileName'))
            .to.equal(path.join(artifactsPath, 'path/to/changer/report').replace(/\//g, '\\'));
        
        expect(xml(scripterXPath + 'ReportFilename'))
            .to.equal(path.join(artifactsPath, 'path/to/scripter/report').replace(/\//g, '\\'));

    });

    it('should not join the artifacts path to absolute paths', function () {

        var artifactsPath = path.dirname(savePath);
        var config = { 
            configSavePath: path.basename(savePath),
            changeManager: {
                visualStudioDatabaseProjectFile: 'c:/path/to/project',
                buildSQLFilename: 'c:/path/to/build',
                deltaScriptsFilename: '\\\\path\\to\\delta',
                reportFilename: '\\\\path\\to\\changer\\report'
            },
            scripter: {
                reportFilename: 'c:\\path\\to\\scripter\\report'
            }
        };

        var file = configFile(templatePath, artifactsPath)
            .save(config, 'copy');

        expect(file.path).to.equal(savePath);
        expect(fs.existsSync(file.path)).to.be.true;

        var xml = loadXml(file.path);

        expect(xml(changeXPath + 'SavePath'))
            .to.equal(savePath.replace(/\//g, '\\'));
        
        expect(xml(changeXPath + 'VisualStudioDatabaseProjectFile'))
            .to.equal('c:\\path\\to\\project');
        
        expect(xml(changeXPath + 'BuildSQLFileName'))
            .to.equal('c:\\path\\to\\build');
        
        expect(xml(changeXPath + 'DeltaScriptsFileName'))
            .to.equal('\\\\path\\to\\delta');
        
        expect(xml(changeXPath + 'ReportFileName'))
            .to.equal('\\\\path\\to\\changer\\report');
        
        expect(xml(scripterXPath + 'ReportFilename'))
            .to.equal('c:\\path\\to\\scripter\\report');

    });

    it('should use the config save path supplied', function () {

        var file = configFile()
            .save({ configSavePath: savePath }, 'copy');

        expect(file.path).to.equal(savePath);
        expect(fs.existsSync(file.path)).to.be.true;

        var xml = loadXml(file.path);
        expect(xml(changeXPath + 'SavePath'))
            .to.equal(savePath.replace(/\//g, '\\'));

        file.cleanup();

        expect(fs.existsSync(file.path)).to.be.true;

    });

    it('should use temporary path when config path not supplied', function () {

        var file = configFile().save({}, 'copy');

        expect(fs.existsSync(file.path)).to.be.true;

        var xml = loadXml(file.path);
        expect(xml(changeXPath + 'SavePath'))
            .to.equal(file.path.replace(/\//g, '\\'));

        file.cleanup();

        expect(fs.existsSync(file.path)).to.be.false;

    });

});