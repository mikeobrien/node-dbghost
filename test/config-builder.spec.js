var chai = require('chai'),
    cases = require('cases'),
    _ = require('lodash'),
    chaiXml = require('chai-xml'),
    build = require('../src/config-builder');

var expect = chai.expect;
chai.use(chaiXml);

function attribute(name, value) {
    return name + '="' + value + '"';
}

function element() {
    var args = _.flatten(_.toArray(arguments));
    var element = args[0];
    var values = args.slice(1);
    var attributes, content;
    if (values) {
        var attribute = /^[^<].*=".*"$/;
        attributes = values.filter(function(x) { return attribute.test(x); }).join(' ');
        content = values.filter(function(x) { return !attribute.test(x); }).join('');
    }     
    return '<' + element + (attributes ? ' ' + attributes : '') + (content ? 
        '>' + content + '</' + element + '>' : '/>');
}

function rootElement() {
    return element('DBGhost', arguments);
}

function processTypeElement() {
    var args = _.flatten(_.toArray(arguments));
    return rootElement(element('ChangeManager', 
        element('ChangeManagerProcessType', args[0]), args.splice(1)));
}

function changerElement() {
    return processTypeElement('CopyDatabase', arguments);
}

function scripterElement() {
    return rootElement(
        element('ChangeManager', 
            element('ChangeManagerProcessType', 'CopyDatabase')),
        element('Scripter', _.flatten(_.toArray(arguments))));
}

describe('process type config', function() {

    it('should set process type', cases([
      [ 'copy', 'CopyDatabase' ],
      [ 'compare', 'CompareOnly' ],
      [ 'compareAndSync', 'CompareAndSynchronize' ],
      [ 'compareAndCreateDelta', 'CompareAndCreateDelta' ],
      [ 'script', 'ScriptDatabase' ],
      [ 'scriptAndBuild', 'ScriptDatabaseAndBuildDatabase' ],
      [ 'scriptBuildAndCompare', 'ScriptDatabaseAndBuildDatabaseAndCompare' ],
      [ 'scriptBuildCompareAndCreateDelta', 'ScriptDatabaseAndBuildDatabaseAndCompareAndCreateDelta' ],
      [ 'scriptBuildCompareAndSync', 'ScriptDatabaseAndBuildDatabaseAndCompareAndSynchronize' ],
      [ 'build', 'BuildDatabase' ],
      [ 'buildAndCompare', 'BuildDatabaseAndCompare' ],
      [ 'buildCompareAndSync', 'BuildDatabaseAndCompareAndSynchronize' ],
      [ 'buildCompareAndCreateDelta', 'BuildDatabaseAndCompareAndCreateDelta' ]
    ], function (property, name) {

        expect(build(rootElement())[property]({}))
            .xml.to.equal(processTypeElement(name));

    }));

});

describe('change manager config', function() {

    it('should set db with windows auth', cases([
      [ 'templateDatabase', 'TemplateDB' ],
      [ 'sourceDatabase', 'SourceDB' ],
      [ 'targetDatabase', 'TargetDB' ]
    ], function (optionName, elementName) {

        var config = { changeManager: {} };

        config.changeManager[optionName] = {
            name: 'name',
            server: 'server'
        };

        expect(build(rootElement()).copy(config))
            .xml.to.equal(changerElement(
                element(elementName, 
                    element('DBName', 'name'), 
                    element('DBServer', 'server'), 
                    element('AuthenticationMode', 'Windows'))));

    }));

    it('should set db with sql auth', cases([
      [ 'templateDatabase', 'TemplateDB' ],
      [ 'sourceDatabase', 'SourceDB' ],
      [ 'targetDatabase', 'TargetDB' ]
    ], function (optionName, elementName) {

        var config = { changeManager: {} };

        config.changeManager[optionName] = {
            name: 'name',
            server: 'server',
            username: 'username',
            password: 'password'
        };

        expect(build(rootElement()).copy(config))
            .xml.to.equal(changerElement(
                element(elementName, 
                    element('DBName', 'name'), 
                    element('DBServer', 'server'), 
                    element('DBUserName', 'username'), 
                    element('DBPassword', 'password'), 
                    element('AuthenticationMode', 'SQLServer'))));

    }));

    it('should set options', cases([
      [ 'buildDatabaseName', 'name', 'BuildDBName', 'name'],
      [ 'visualStudioDatabaseProjectFile', 'path/to/file', 'VisualStudioDatabaseProjectFile', 'path\\to\\file'],
      [ 'buildSQLFilename', 'path/to/file', 'BuildSQLFileName', 'path\\to\\file'],
      [ 'deltaScriptsFilename', 'path/to/file', 'DeltaScriptsFileName', 'path\\to\\file'],
      [ 'deltaFileEncoding', 'encoding', 'DeltaFileEncoding', 'encoding'],
      [ 'reportFilename', 'path/to/file', 'ReportFileName', 'path\\to\\file'],
      [ 'overwriteReportFileIfExists', true, 'OverwriteReportFileIfExists', 'True'],
      [ 'savePath', 'path/to/file', 'SavePath', 'path\\to\\file'],
      [ 'tempUniqueKey', 'key', 'TempUniqueKey', 'key']
    ], function (optionName, optionValue, elementName, elementValue) {

        var config = { changeManager: {} };

        config.changeManager[optionName] = optionValue;

        expect(build(rootElement()).copy(config))
            .xml.to.equal(changerElement(
                element(elementName, elementValue)));

    }));

    it('should set source control options', cases([
      [ 'username', 'username', 'Username', 'username'],
      [ 'password', 'password', 'Password', 'password'],
      [ 'databaseIni', 'path/to/file', 'DatabaseIni', 'path\\to\\file'],
      [ 'getLatest', true, 'GetLatest', 'True'],
      [ 'versionLabel', 'version', 'VersionLabel', 'version']
    ], function (optionName, optionValue, elementName, elementValue) {

        var config = { changeManager: { sourceControl: { use: true } } };

        config.changeManager.sourceControl[optionName] = optionValue;

        expect(build(rootElement()).copy(config))
            .xml.to.equal(changerElement(
                element('UseSourceControl', 'True'),
                element('SourceControlSettings', 
                    element(elementName, elementValue))));

    }));

    it('should set schema script options', cases([
      [ 'recurseObjectFolders', true, 'RecurseObjectFolders', 'True'],
      [ 'logMissingBuildFolderWarnings', true, 'LogMissingBuildFolderWarnings', 'True'],
      [ 'deriveRootDirectoryFromConfigFilePath', true, 'DeriveRootDirectoryFromSettingsFileLocation', 'True'],
      [ 'rootDirectory', 'path/to/file', 'RootDirectory', 'path\\to\\file'],
      [ 'dropCreateDatabaseScript', 'path/to/file', 'DropCreateDatabaseScript', 'path\\to\\file']
    ], function (optionName, optionValue, elementName, elementValue) {

        var config = { changeManager: { schemaScripts: {} } };

        config.changeManager.schemaScripts[optionName] = optionValue;

        expect(build(rootElement()).copy(config))
            .xml.to.equal(changerElement(
                element('SchemaScripts', 
                    element(elementName, elementValue))));

    }));

    it('should set schema script paths', cases([
      [ 'logins', 'Logins' ],
      [ 'usersAndRoles', 'UsersAndRoles' ],
      [ 'defaults', 'Defaults' ],
      [ 'rules', 'Rules' ],
      [ 'userDefinedTables', 'UDDT' ],
      [ 'tables', 'Tables' ],
      [ 'views', 'Views' ],
      [ 'userDefinedFunctions', 'UDFs' ],
      [ 'storedProcedures', 'StoredProcedures' ],
      [ 'triggers', 'Triggers' ],
      [ 'xmlSchemaCollections', 'XMLSchemaCollections' ],
      [ 'schemas', 'Schemas' ],
      [ 'staticData', 'StaticData' ],
      [ 'assemblies', 'Assemblies' ],
      [ 'ddlTriggers', 'DDLTriggers' ],
      [ 'serviceBrokerMessageTypes', 'ServiceBrokerMessageTypes' ],
      [ 'serviceBrokerContracts', 'ServiceBrokerContracts' ],
      [ 'serviceBrokerQueues', 'ServiceBrokerQueues' ],
      [ 'serviceBrokerRoutes', 'ServiceBrokerRoutes' ],
      [ 'serviceBrokerServices', 'ServiceBrokerServices' ],
      [ 'serviceBrokerRemoteServiceBindings', 'ServiceBrokerRemoteServiceBindings' ],
      [ 'aggregateFunctions', 'AggregateFunctions' ],
      [ 'asymmetricKeys', 'AsymmetricKeys' ],
      [ 'certificates', 'Certificates' ],
      [ 'fullTextCatalogs', 'FullTextCatalogs' ],
      [ 'partitionFunctionsAndSchemes', 'PartitionFunctionsAndSchemes' ],
      [ 'symmetricKeys', 'SymmetricKeys' ],
      [ 'synonyms', 'Synonyms' ],
      [ 'sequences', 'Sequences' ],
      [ 'afterBuildScript', 'AfterBuildScript' ],
      [ 'beforeSyncScript', 'BeforeSyncScript' ],
      [ 'afterSyncScript', 'AfterSyncScript' ]
    ], function (optionName, elementName) {

        var config = { changeManager: { schemaScripts: {} } };

        config.changeManager.schemaScripts[optionName] = [ 'path/to/file1', 'path/to/file2' ];

        expect(build(rootElement()).copy(config))
            .xml.to.equal(changerElement(
                element('SchemaScripts', 
                    element(elementName, 
                        element('Path', 'path\\to\\file1'),
                        element('Path', 'path\\to\\file2'))
                )));

    }));

    it('should set compare options', cases([
        [ 'differencesWithObjects', true, 'DifferencesWithObjects', 'True' ],
        [ 'duplicatedObjects', true, 'DuplicatedObjects', 'True' ],
        [ 'extraObjects', true, 'ExtraObjects', 'True' ],
        [ 'doNotDropTables', true, 'DoNotDropTables', 'True' ],
        [ 'doNotDropColumns', true, 'DoNotDropColumns', 'True' ],
        [ 'missingObjects', true, 'MissingObjects', 'True' ],
        [ 'disableForeignKeys', true, 'DisableForeignKeys', 'True' ],
        [ 'fireTriggers', true, 'FireTriggers', 'True' ],
        [ 'ignoreCollationDifferences', true, 'IgnoreCollationDifferences', 'True' ],
        [ 'ignoreIndexFillFactorDifferences', true, 'IgnoreIndexFillFactorDifferences', 'True' ],
        [ 'questionEachChange', true, 'QuestionEachChange', 'True' ],
        [ 'permissions', true, 'Permissions', 'True' ],
        [ 'columnOrdinal', true, 'ColumnOrdinal', 'True' ],
        [ 'extendedProperties', true, 'ExtendedProperties', 'True' ],
        [ 'dynamicallyAssignDatabaseName', true, 'DynamicallyAssignDatabaseName', 'True' ],
        [ 'keepNewDatabase', true, 'KeepNewDatabase', 'True' ],
        [ 'dropDBIfExistsForCpyDB', true, 'DropDBIfExistsForCpyDB', 'True' ],
        [ 'continueOnBuildBreak', true, 'ContinueOnBuildBreak', 'True' ],
        [ 'enableCustomScripts', true, 'EnableCustomScripts', 'True' ],
        [ 'loadAllFileTypes', true, 'LoadAllFileTypes', 'True' ],
        [ 'fileTypes', 'types', 'FileTypes', 'types' ],
        [ 'requestApplicationRolePassword', true, 'RequestApplicationRolePassword', 'True' ],
        [ 'diffCommand', 'command', 'DiffCommand', 'command' ],
        [ 'diffArgs', 'args', 'DiffArgs', 'args' ],
        [ 'objectFilter', 'filter', 'ObjectFilter', 'filter' ]
    ], function (optionName, optionValue, elementName, elementValue) {

        var config = { changeManager: { compareOptions: {} } };

        config.changeManager.compareOptions[optionName] = optionValue;

        expect(build(rootElement()).copy(config))
            .xml.to.equal(changerElement(
                element('CompareOptions', 
                    element(elementName, elementValue))));

    }));

    it('should set potential column rename options', cases([
        [ 'execute', 'Execute' ],
        [ 'useExactMatch', 'UseExactMatch' ],
        [ 'raiseErrors', 'RaiseErrors' ],
        [ 'stopOnError', 'StopOnError' ],
    ], function (optionName, attributeName) {

        var config = { changeManager: { compareOptions: { detectPotentialColumnRenames: {} } } };

        config.changeManager.compareOptions.detectPotentialColumnRenames[optionName] = true;

        expect(build(rootElement()).copy(config))
            .xml.to.equal(changerElement(
                element('CompareOptions',
                    element('DetectPotentialColumnRenames', 
                        attribute(attributeName, 'True')))));

    }));

    it('should set potential column rename columns', function () {

        var config = { changeManager: { compareOptions: { detectPotentialColumnRenames: {} } } };

        config.changeManager.compareOptions.detectPotentialColumnRenames.columnsToRename = [
            {
                schema: 'schema1',
                tableName: 'table1',
                oldColumnName: 'oldcolumn1',
                newColumnName: 'newcolumn1'
            },
            {
                schema: 'schema2',
                tableName: 'table2',
                oldColumnName: 'oldcolumn2',
                newColumnName: 'newcolumn2'
            }
        ];

        expect(build(rootElement()).copy(config))
            .to.equal(changerElement(
                element('CompareOptions',
                    element('DetectPotentialColumnRenames',
                        element('ColumnToRename', 
                            attribute('Schema', 'schema1'), 
                            attribute('TableName', 'table1'), 
                            attribute('OldColumnName', 'oldcolumn1'), 
                            attribute('NewColumnName', 'newcolumn1')),
                        element('ColumnToRename', 
                            attribute('Schema', 'schema2'), 
                            attribute('TableName', 'table2'), 
                            attribute('OldColumnName', 'oldcolumn2'), 
                            attribute('NewColumnName', 'newcolumn2'))))));

    });

    it('should set compare sql object options', cases([
        [ 'logins', 'Logins' ],
        [ 'schemas', 'Schemas' ],
        [ 'users', 'Users' ],
        [ 'roles', 'Roles' ],
        [ 'defaults', 'Defaults' ],
        [ 'rules', 'Rules' ],
        [ 'userDefinedTables', 'UDDT' ],
        [ 'tables', 'Tables' ],
        [ 'triggers', 'Triggers' ],
        [ 'views', 'Views' ],
        [ 'storedProcedures', 'StoredProcs' ],
        [ 'userDefinedFunctions', 'UDFs' ],
        [ 'assemblies', 'Assemblies' ],
        [ 'xmlSchemaCollections', 'XMLSchemaCollections' ],
        [ 'ddlTriggers', 'DDLTriggers' ],
        [ 'serviceBrokerMessageTypes', 'ServiceBrokerMessageTypes' ],
        [ 'serviceBrokerContracts', 'ServiceBrokerContracts' ],
        [ 'serviceBrokerQueues', 'ServiceBrokerQueues' ],
        [ 'serviceBrokerServices', 'ServiceBrokerServices' ],
        [ 'serviceBrokerRoutes', 'ServiceBrokerRoutes' ],
        [ 'serviceBrokerRemoteServiceBindings', 'ServiceBrokerRemoteServiceBindings' ],
        [ 'synonyms', 'Synonyms' ],
        [ 'partitionFunctionsAndSchemes', 'PartitionFunctionsAndSchemes' ],
        [ 'aggregateFunctions', 'AggregateFunctions' ],
        [ 'asymmetricKeys', 'AsymmetricKeys' ],
        [ 'certificates', 'Certificates' ],
        [ 'symmetricKeys', 'SymmetricKeys' ],
        [ 'fullTextCatalogs', 'FullTextCatalogs' ],
        [ 'sequences', 'Sequences' ],
        [ 'showSchemaGUI', 'ShowSchemaGUI' ]
    ], function (optionName, elementName) {

        var config = { changeManager: { compareOptions: { sqlObjectsOptions: {} } } };

        config.changeManager.compareOptions.sqlObjectsOptions[optionName] = true;

        expect(build(rootElement()).copy(config))
            .xml.to.equal(changerElement(
                element('CompareOptions',
                    element('SQLObjectsOptions', 
                        element(elementName, 'True')))));

    }));

    it('should set compare sql data compare option', function () {

        var config = { changeManager: { compareOptions: { dataCompareOptions: { compare: true} } } };

        expect(build(rootElement()).copy(config))
            .xml.to.equal(changerElement(
                element('CompareOptions',
                    element('DataComparisonOptions', 
                        attribute('compare', 'True')))));

    });

    it('should set compare sql data compare check for options', cases([
        [ 'missingRows', true, 'MissingRows', 'True' ],
        [ 'differencesWithinRows', true, 'DifferencesWithinRows', 'True' ],
        [ 'additionalRows', true, 'AdditionalRows', 'True' ],
        [ 'automaticallySelectTables', true, 'AutomaticallySelectTables', 'True' ],
        [ 'fireTriggers', true, 'FireTriggers', 'True' ],
        [ 'disableForeignKeys', true, 'DisableForeignKeys', 'True' ],
        [ 'ignoreIdentityColumn', true, 'IgnoreIdentityColumn', 'True' ],
        [ 'dataTableFilter', 'filter', 'DataTableFilter', 'filter' ]
    ], function (optionName, optionValue, attributeName, attributeValue) {

        var config = { changeManager: { compareOptions: { dataCompareOptions: { checkFor: {} } } } };

        config.changeManager.compareOptions.dataCompareOptions.checkFor[optionName] = optionValue;

        expect(build(rootElement()).copy(config))
            .xml.to.equal(changerElement(
                element('CompareOptions',
                    element('DataComparisonOptions', 
                        element('CheckFor', 
                            attribute(attributeName, attributeValue))))));

    }));

    it('should set compare sql data compare check for options', function () {

        var config = { changeManager: { compareOptions: { dataCompareOptions: 
            { checkFor: { userSuppliedTableList: [
                {
                    schema: 'schema1',
                    name: 'name1',
                    checkforMissingRows: true,
                    checkforDifferencesWithinRows: true,
                    checkforAdditionalRows: true,
                    fireTriggers: true,
                    disableForeignKeys: true,
                    filterWhereClause: 'where1',
                    ruleForMissingColumnsOnInsert: 'missing1',
                    ignoreIdentityColumn: true
                },
                {
                    schema: 'schema2',
                    name: 'name2',
                    checkforMissingRows: true,
                    checkforDifferencesWithinRows: true,
                    checkforAdditionalRows: true,
                    fireTriggers: true,
                    disableForeignKeys: true,
                    filterWhereClause: 'where2',
                    ruleForMissingColumnsOnInsert: 'missing2',
                    ignoreIdentityColumn: true,
                    userSuppliedColumnList: [ 'column1', 'column2' ]
                }
            ] } } } } };

        expect(build(rootElement()).copy(config))
            .xml.to.equal(changerElement(
                element('CompareOptions',
                    element('DataComparisonOptions', 
                        element('CheckFor', 
                            element('UserSuppliedTableList',
                                element('Table',
                                    attribute('schema', 'schema1'),
                                    attribute('name', 'name1'),
                                    attribute('FilterWhereClause', 'where1'),
                                    attribute('RuleForMissingColumnsOnInsert', 'missing1'),
                                    attribute('checkforMissingRows', 'True'),
                                    attribute('checkforDifferencesWithinRows', 'True'),
                                    attribute('checkforAdditionalRows', 'True'),
                                    attribute('FireTriggers', 'True'),
                                    attribute('DisableForeignKeys', 'True'),
                                    attribute('IgnoreIdentityColumn', 'True')),
                                element('Table',
                                    attribute('schema', 'schema2'),
                                    attribute('name', 'name2'),
                                    attribute('checkforMissingRows', 'True'),
                                    attribute('checkforDifferencesWithinRows', 'True'),
                                    attribute('checkforAdditionalRows', 'True'),
                                    attribute('FireTriggers', 'True'),
                                    attribute('DisableForeignKeys', 'True'),
                                    attribute('IgnoreIdentityColumn', 'True'),
                                    attribute('FilterWhereClause', 'where2'),
                                    attribute('RuleForMissingColumnsOnInsert', 'missing2'),
                                    element('UserSuppliedColumnList', 
                                        element('Column', attribute('name', 'column1')), 
                                        element('Column', attribute('name', 'column2'))))))))));

    });

    it('should set and update compare sql data compare check for options', function () {

        var config = { changeManager: { compareOptions: { dataCompareOptions: 
            { checkFor: { userSuppliedTableList: [
                {
                    schema: 'schema1',
                    name: 'name1',
                    checkforMissingRows: true,
                    checkforDifferencesWithinRows: true,
                    checkforAdditionalRows: true,
                    fireTriggers: true,
                    disableForeignKeys: true,
                    filterWhereClause: 'where1',
                    ruleForMissingColumnsOnInsert: 'missing1'
                },
                {
                    schema: 'schema2',
                    name: 'name2',
                    checkforMissingRows: true,
                    checkforDifferencesWithinRows: true,
                    checkforAdditionalRows: true,
                    fireTriggers: true,
                    disableForeignKeys: true,
                    filterWhereClause: 'where2',
                    ruleForMissingColumnsOnInsert: 'missing2',
                    userSuppliedColumnList: [ 'column1', 'column2' ]
                }
            ] } } } } };

        expect(build(changerElement(
                element('CompareOptions',
                    element('DataComparisonOptions', 
                        element('CheckFor',
                            element('UserSuppliedTableList',
                                element('Table',
                                    attribute('schema', 'schema1'),
                                    attribute('name', 'name1'),
                                    attribute('FilterWhereClause', 'yada'),
                                    attribute('RuleForMissingColumnsOnInsert', 'yada')))))))).copy(config))
            .xml.to.equal(changerElement(
                element('CompareOptions',
                    element('DataComparisonOptions', 
                        element('CheckFor', 
                            element('UserSuppliedTableList',
                                element('Table',
                                    attribute('schema', 'schema1'),
                                    attribute('name', 'name1'),
                                    attribute('FilterWhereClause', 'where1'),
                                    attribute('RuleForMissingColumnsOnInsert', 'missing1'),
                                    attribute('checkforMissingRows', 'True'),
                                    attribute('checkforDifferencesWithinRows', 'True'),
                                    attribute('checkforAdditionalRows', 'True'),
                                    attribute('FireTriggers', 'True'),
                                    attribute('DisableForeignKeys', 'True')),
                                element('Table',
                                    attribute('schema', 'schema2'),
                                    attribute('name', 'name2'),
                                    attribute('checkforMissingRows', 'True'),
                                    attribute('checkforDifferencesWithinRows', 'True'),
                                    attribute('checkforAdditionalRows', 'True'),
                                    attribute('FireTriggers', 'True'),
                                    attribute('DisableForeignKeys', 'True'),
                                    attribute('FilterWhereClause', 'where2'),
                                    attribute('RuleForMissingColumnsOnInsert', 'missing2'),
                                    element('UserSuppliedColumnList', 
                                        element('Column', attribute('name', 'column1')), 
                                        element('Column', attribute('name', 'column2'))))))))));

    });

});

describe('scripter config', function() {

    it('should set options', cases([
      [ 'fileEncodingForObjects', 'encoding', 'FileEncodingForObjects', 'encoding' ],
      [ 'fileEncodingForData', 'encoding', 'FileEncodingForData', 'encoding' ],
      [ 'dataBatchSize', 50, 'DataBatchSize', '50' ],
      [ 'printInserts', true, 'PrintInserts', 'True' ],
      [ 'dataScriptColumnOrderBy', 5, 'DataScriptColumnOrderBy', '5' ],
      [ 'includeCollations', true, 'IncludeCollations', 'True' ],
      [ 'includePermissions', true, 'IncludePermissions', 'True' ],
      [ 'outputFolder', 'path/to/file', 'OutputFolder', 'path\\to\\file' ],
      [ 'outputFolderOption', 'option', 'OutputFolderOption', 'option' ],
      [ 'createVSProject', true, 'CreateVSProject', 'True' ],
      [ 'reportFilename', 'path/to/file', 'ReportFilename', 'path\\to\\file' ],
      [ 'overwriteReportFilename', true, 'OverwriteReportFilename', 'True' ]
    ], function (optionName, optionValue, elementName, elementValue) {

        var config = { scripter: {} };

        config.scripter[optionName] = optionValue;

        expect(build(rootElement()).copy(config))
            .xml.to.equal(scripterElement(
                element(elementName, elementValue)));

    }));

    it('should set database options', cases([
      [ 'type', 'type', 'ServerType', 'type'],
      [ 'name', 'name', 'Database', 'name'],
      [ 'server', 'server', 'Server', 'server'],
      [ 'username', 'username', 'Username', 'username'],
      [ 'password', 'password', 'Password', 'password'],
      [ 'includeDropAndCreateStatements', true, 'IncludeDropAndCreateDatabaseStatements', 'True']
    ], function (optionName, optionValue, elementName, elementValue) {

        var config = { scripter: { databaseToScript: {} } };

        config.scripter.databaseToScript[optionName] = optionValue;

        expect(build(rootElement()).copy(config))
            .xml.to.equal(scripterElement(
                element('DatabaseToScript', 
                    element(elementName, elementValue))));

    }));

    it('should set object filters', cases([
      [ 'typeFilter', 'TypeFilter'],
      [ 'schemaFilter', 'SchemaFilter'],
      [ 'nameFilter', 'NameFilter'],
      [ 'invert', 'Invert']
    ], function (optionName, elementName) {

        var config = { scripter: { objectFilters: {} } };
        var filter = '^LIST_|^LOG_';

        config.scripter.objectFilters[optionName] = filter;

        expect(build(rootElement()).copy(config))
            .xml.to.equal(scripterElement(
                element('ObjectFilter', 
                    element(elementName, filter))));

    }));

    it('should set table filters', cases([
      [ 'scope', 'scope', 'scope', 'scope'],
      [ 'schemaFilter', 'filter', 'schemafilter', 'filter'],
      [ 'nameFilter', 'filter', 'namefilter', 'filter'],
      [ 'invert', true, 'invert', 'True'],
      [ 'minRows', 50, 'minrows', '50' ],
      [ 'maxRows', 50, 'maxrows', '50' ]
    ], function (optionName, optionValue, elementName, elementValue) {

        var config = { scripter: { tableFilters: {} } };

        config.scripter.tableFilters[optionName] = optionValue;

        expect(build(rootElement()).copy(config))
            .xml.to.equal(scripterElement(
                element('TableFilter', 
                    element(elementName, elementValue))));

    }));

    it('should set table filter tables', function () {

        var config = { scripter: { tableFilters: { tablesToScript: ['table1', 'table2'] } } };

        expect(build(rootElement()).copy(config))
            .xml.to.equal(scripterElement(
                element('TableFilter',
                    element('tablestoscript',
                        element('table', 'table1'),
                        element('table', 'table2')))));

    });

});