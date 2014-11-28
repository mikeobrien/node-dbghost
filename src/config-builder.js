var xmlpoke = require('xmlpoke'),
    _ = require('lodash'),
    fs = require('fs'),
    path = require('path'),
    mapping = require('./config-mapping');

_.mixin(require('underscore.string').exports());

function toWindowsPath(path) {
    return path.replace(/\//g, '\\');
}

function convertToWindowsPaths(source, properties) {
    properties.forEach(function(property) {
        if (source[property]) source[property] = 
            toWindowsPath(source[property]);
    });
}

function setDatabaseConfigValues(config, xml, xpath) {
    setValues(config, mapping.changeManager.database, xml, xpath);
    xml.setOrAdd(xpath + '/' + 'AuthenticationMode', 
        config.username && config.password ? 'SQLServer' : 'Windows');
}

function mapAndAddElements(config, mapping, xml, xpath, addElement, map) {
    _.forOwn(mapping, function(elementName, propertyName) {
        var property = config[propertyName];
        if (property) property.forEach(function(value) { 
                var elementXPath = xpath + '/' + elementName;
                xml.ensure(elementXPath);
                xml.add(elementXPath + '/' + addElement, map(value));
            });
    });
}

function setValues(config, mapping, xml, xpath, add) {
    var values = {};
    _.forOwn(mapping, function(elementName, propertyName) {
        var property = config[propertyName];
        if (property && (_.isString(property) || 
            _.isBoolean(property) || _.isNumber(property))) { 
            values[elementName] = _.isBoolean(property) ? 
                _.capitalize(property) : String(property);
        };
    });
    if (!add) xml.ensure(xpath);
    xml[add ? 'add' : 'setOrAdd'](xpath, values);
}

var changerXPath = 'DBGhost/ChangeManager';

function setChangeManagerConfig(xml, config) {
    var changer = config.changeManager;
    var changerMapping = mapping.changeManager;

    convertToWindowsPaths(changer, ['visualStudioDatabaseProjectFile', 'buildSQLFilename', 
        'deltaScriptsFilename', 'reportFilename', 'savePath']);
    setValues(changer, changerMapping, xml, changerXPath);

    if (changer.templateDatabase)
        setDatabaseConfigValues(changer.templateDatabase, xml, changerXPath + '/TemplateDB');

    if (changer.sourceDatabase) 
        setDatabaseConfigValues(changer.sourceDatabase, xml, changerXPath + '/SourceDB');

    if (changer.targetDatabase)
        setDatabaseConfigValues(changer.targetDatabase, xml, changerXPath + '/TargetDB');
    
    if (changer.sourceControl) {
        var sourceControl = changer.sourceControl;
        xml.setOrAdd(changerXPath + '/UseSourceControl', _.capitalize(!!sourceControl.use));
        convertToWindowsPaths(sourceControl, ['databaseIni']);
        setValues(sourceControl, changerMapping.sourceControl, xml, changerXPath + '/SourceControlSettings');
    }

    if (changer.schemaScripts) {
        var schemaScripts = changer.schemaScripts;
        var schemaScriptMapping = changerMapping.schemaScripts;
        var schemaScriptsXPath = changerXPath + '/SchemaScripts';

        convertToWindowsPaths(schemaScripts, ['rootDirectory', 'dropCreateDatabaseScript']);
        setValues(schemaScripts, schemaScriptMapping, xml, schemaScriptsXPath);
        mapAndAddElements(schemaScripts, schemaScriptMapping.paths, xml, schemaScriptsXPath, 'Path',
            function(path) { return toWindowsPath(path); });
    }

    if (changer.compareOptions) {
        var compareOptions = changer.compareOptions;
        var compareOptionsMapping = changerMapping.compareOptions;
        var compareOptionsXPath = changerXPath + '/CompareOptions';

        setValues(compareOptions, compareOptionsMapping, xml, compareOptionsXPath);

        if (compareOptions.detectPotentialColumnRenames) {
            var columnsRenames = compareOptions.detectPotentialColumnRenames;
            var columnsRenamesMapping = compareOptionsMapping.detectPotentialColumnRenames;
            var columnRenamesXPath = compareOptionsXPath + '/DetectPotentialColumnRenames';
            setValues(columnsRenames, columnsRenamesMapping, xml, columnRenamesXPath);

            if (columnsRenames.columnsToRename)
                columnsRenames.columnsToRename.forEach(function(column) {
                    setValues(column, columnsRenamesMapping.columnsToRename, 
                        xml, columnRenamesXPath + '/ColumnToRename', true);
                });
        }

        if (compareOptions.sqlObjectsOptions) {
            setValues(compareOptions.sqlObjectsOptions, 
                compareOptionsMapping.sqlObjectsOptions, 
                xml, compareOptionsXPath + '/SQLObjectsOptions');
        }

        if (compareOptions.dataCompareOptions) {
            var dataCompareOptions = compareOptions.dataCompareOptions;
            var dataComparisonOptionsMapping = compareOptionsMapping.dataComparisonOptions;
            var dataCompareOptionsXPath = compareOptionsXPath + '/DataComparisonOptions';

            if (dataCompareOptions.compare) {
                var compareXPath = dataCompareOptionsXPath + '/@compare';
                xml.ensure(compareXPath);
                xml.set(compareXPath, _.capitalize(dataCompareOptions.compare));
            }

            if (dataCompareOptions.checkFor) {
                var checkFor = dataCompareOptions.checkFor;
                var checkForMapping = dataComparisonOptionsMapping.checkFor;
                var checkForXPath = dataCompareOptionsXPath + '/CheckFor';
                setValues(checkFor, checkForMapping, xml, checkForXPath);

                if (checkFor.userSuppliedTableList) {
                    var userSuppliedTableList = checkFor.userSuppliedTableList;
                    var tableMapping = checkForMapping.userSuppliedTableList.table;
                    var tablesXPath = checkForXPath + '/UserSuppliedTableList/Table';
                    userSuppliedTableList.forEach(function(table) {
                        var tableXPath = tablesXPath + 
                            "[@schema='" + table.schema + "' and " + 
                             "@name='" + table.name + "']";
                        
                        setValues(table, tableMapping, xml, tableXPath);

                        if (table.userSuppliedColumnList) {
                            var columnListXPath = tableXPath + '/UserSuppliedColumnList';
                            xml.ensure(columnListXPath);
                            table.userSuppliedColumnList.forEach(function(column) {
                                var columnXPath = columnListXPath + '/Column' + 
                                    "[@name='" + column + "']";
                                xml.ensure(columnXPath);
                            });
                        }
                    });
                }
            }
        }
    }
}

function setScripterConfig(xml, config) {
    var scripterXPath = 'DBGhost/Scripter';
    var scripter = config.scripter;
    var scripterMapping = mapping.scripter;

    convertToWindowsPaths(scripter, ['outputFolder', 'reportFilename']);
    setValues(scripter, scripterMapping, xml, scripterXPath);

    if (scripter.databaseToScript)
        setValues(scripter.databaseToScript, scripterMapping.databaseToScript, 
            xml, scripterXPath + '/DatabaseToScript');

    if (scripter.objectFilters)
        setValues(scripter.objectFilters, scripterMapping.objectFilters, 
            xml, scripterXPath + '/ObjectFilter');

    if (scripter.tableFilters) {
        var tableFilterXPath = scripterXPath + '/TableFilter';
        setValues(scripter.tableFilters, scripterMapping.tableFilters, 
            xml, tableFilterXPath);

        if (scripter.tableFilters.tablesToScript) {
            var tablesToScriptXPath = tableFilterXPath + '/tablestoscript';
            xml.ensure(tablesToScriptXPath);
            scripter.tableFilters.tablesToScript.forEach(function(table) {
                xml.add(tablesToScriptXPath + '/table', table);
            });
        }
    }

}

function setConfig(configFile, processType, config) {
    return xmlpoke(configFile, function(xml) {

        var processTypeXPath = changerXPath + '/ChangeManagerProcessType';
        xml.ensure(processTypeXPath)
        xml.set(processTypeXPath, processType);

        if (config.changeManager) {
            setChangeManagerConfig(xml, config);
        }

        if (config.scripter) { 
            setScripterConfig(xml, config);
        }
    });
}

module.exports = function(configFile) {

    return {

        copy: function(config) { 
            return setConfig(configFile, 'CopyDatabase', config); 
        },

        compare: function(config) { 
            return setConfig(configFile, 'CompareOnly', config); 
        },

        compareAndSync: function(config) { 
            return setConfig(configFile, 'CompareAndSynchronize', config); 
        },

        compareAndCreateDelta: function(config) { 
            return setConfig(configFile, 'CompareAndCreateDelta', config); 
        },

        script: function(config) { 
            return setConfig(configFile, 'ScriptDatabase', config); 
        },

        scriptAndBuild: function(config) { 
            return setConfig(configFile, 'ScriptDatabaseAndBuildDatabase', config); 
        },

        scriptBuildAndCompare: function(config) { 
            return setConfig(configFile, 'ScriptDatabaseAndBuildDatabaseAndCompare', config); 
        },

        scriptBuildCompareAndCreateDelta: function(config) { 
            return setConfig(configFile, 'ScriptDatabaseAndBuildDatabaseAndCompareAndCreateDelta', config); 
        },

        scriptBuildCompareAndSync: function(config) { 
            return setConfig(configFile, 'ScriptDatabaseAndBuildDatabaseAndCompareAndSynchronize', config); 
        },

        build: function(config) { 
            return setConfig(configFile, 'BuildDatabase', config); 
        },

        buildAndCompare: function(config) { 
            return setConfig(configFile, 'BuildDatabaseAndCompare', config); 
        },

        buildCompareaAndSync: function(config) { 
            return setConfig(configFile, 'BuildDatabaseAndCompareAndSynchronize', config); 
        },

        buildCompareAndCreateDelta: function(config) { 
            return setConfig(configFile, 'BuildDatabaseAndCompareAndCreateDelta', config); 
        }
    }
};