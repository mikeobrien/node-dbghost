exports.changeManager = 
{
    buildDatabaseName: 'BuildDBName',
    visualStudioDatabaseProjectFile: 'VisualStudioDatabaseProjectFile',
    buildSQLFilename: 'BuildSQLFileName',
    deltaScriptsFilename: 'DeltaScriptsFileName',
    deltaFileEncoding: 'DeltaFileEncoding',
    reportFilename: 'ReportFileName',
    overwriteReportFileIfExists: 'OverwriteReportFileIfExists',
    savePath: 'SavePath',
    tempUniqueKey: 'TempUniqueKey',

    database: {
        name: 'DBName',
        server: 'DBServer',
        username: 'DBUserName',
        password: 'DBPassword'
    },

    sourceControl: {
        username: 'Username',
        password: 'Password',
        databaseIni: 'DatabaseIni',
        getLatest: 'GetLatest',
        versionLabel: 'VersionLabel'
    },

    schemaScripts: {
        recurseObjectFolders: 'RecurseObjectFolders',
        deriveRootDirectoryFromConfigFilePath: 'DeriveRootDirectoryFromSettingsFileLocation',
        rootDirectory: 'RootDirectory',
        dropCreateDatabaseScript: 'DropCreateDatabaseScript',
        logMissingBuildFolderWarnings: 'LogMissingBuildFolderWarnings',

        paths: {
            logins: 'Logins',
            usersAndRoles: 'UsersAndRoles',
            defaults: 'Defaults',
            rules: 'Rules',
            userDefinedTables: 'UDDT',
            tables: 'Tables',
            views: 'Views',
            userDefinedFunctions: 'UDFs',
            storedProcedures: 'StoredProcedures',
            triggers: 'Triggers',
            xmlSchemaCollections: 'XMLSchemaCollections',
            schemas: 'Schemas',
            staticData: 'StaticData',
            assemblies: 'Assemblies',
            ddlTriggers: 'DDLTriggers',
            serviceBrokerMessageTypes: 'ServiceBrokerMessageTypes',
            serviceBrokerContracts: 'ServiceBrokerContracts',
            serviceBrokerQueues: 'ServiceBrokerQueues',
            serviceBrokerRoutes: 'ServiceBrokerRoutes',
            serviceBrokerServices: 'ServiceBrokerServices',
            serviceBrokerRemoteServiceBindings: 'ServiceBrokerRemoteServiceBindings',
            aggregateFunctions: 'AggregateFunctions',
            asymmetricKeys: 'AsymmetricKeys',
            certificates: 'Certificates',
            fullTextCatalogs: 'FullTextCatalogs',
            partitionFunctionsAndSchemes: 'PartitionFunctionsAndSchemes',
            symmetricKeys: 'SymmetricKeys',
            synonyms: 'Synonyms',
            sequences: 'Sequences',
            afterBuildScript: 'AfterBuildScript',
            beforeSyncScript: 'BeforeSyncScript',
            afterSyncScript: 'AfterSyncScript'
        }
    },

    compareOptions: {
        differencesWithObjects: 'DifferencesWithObjects',
        duplicatedObjects: 'DuplicatedObjects',
        extraObjects: 'ExtraObjects',
        doNotDropTables: 'DoNotDropTables',
        doNotDropColumns: 'DoNotDropColumns',
        missingObjects: 'MissingObjects',
        disableForeignKeys: 'DisableForeignKeys',
        fireTriggers: 'FireTriggers',
        ignoreCollationDifferences: 'IgnoreCollationDifferences',
        ignoreIndexFillFactorDifferences: 'IgnoreIndexFillFactorDifferences',
        questionEachChange: 'QuestionEachChange',
        permissions: 'Permissions',
        columnOrdinal: 'ColumnOrdinal',
        extendedProperties: 'ExtendedProperties',
        dynamicallyAssignDatabaseName: 'DynamicallyAssignDatabaseName',
        keepNewDatabase: 'KeepNewDatabase',
        dropDBIfExistsForCpyDB: 'DropDBIfExistsForCpyDB',
        continueOnBuildBreak: 'ContinueOnBuildBreak',
        enableCustomScripts: 'EnableCustomScripts',
        loadAllFileTypes: 'LoadAllFileTypes',
        fileTypes: 'FileTypes',
        diffCommand: 'DiffCommand',
        diffArgs: 'DiffArgs',
        objectFilter: 'ObjectFilter',
        requestApplicationRolePassword: 'RequestApplicationRolePassword',

        detectPotentialColumnRenames: {
            execute: '@Execute',
            useExactMatch: '@UseExactMatch',
            raiseErrors: '@RaiseErrors',
            stopOnError: '@StopOnError',

            columnsToRename: {
                schema: '@Schema',
                tableName: '@TableName',
                oldColumnName: '@OldColumnName',
                newColumnName: '@NewColumnName'
            }
        },

        sqlObjectsOptions: {
            logins: 'Logins',
            schemas: 'Schemas',
            users: 'Users',
            roles: 'Roles',
            defaults: 'Defaults',
            rules: 'Rules',
            userDefinedTables: 'UDDT',
            tables: 'Tables',
            triggers: 'Triggers',
            views: 'Views',
            storedProcedures: 'StoredProcs',
            userDefinedFunctions: 'UDFs',
            assemblies: 'Assemblies',
            xmlSchemaCollections: 'XMLSchemaCollections',
            ddlTriggers: 'DDLTriggers',
            serviceBrokerMessageTypes: 'ServiceBrokerMessageTypes',
            serviceBrokerContracts: 'ServiceBrokerContracts',
            serviceBrokerQueues: 'ServiceBrokerQueues',
            serviceBrokerServices: 'ServiceBrokerServices',
            serviceBrokerRoutes: 'ServiceBrokerRoutes',
            serviceBrokerRemoteServiceBindings: 'ServiceBrokerRemoteServiceBindings',
            synonyms: 'Synonyms',
            partitionFunctionsAndSchemes: 'PartitionFunctionsAndSchemes',
            aggregateFunctions: 'AggregateFunctions',
            asymmetricKeys: 'AsymmetricKeys',
            certificates: 'Certificates',
            symmetricKeys: 'SymmetricKeys',
            fullTextCatalogs: 'FullTextCatalogs',
            sequences: 'Sequences',
            showSchemaGUI: 'ShowSchemaGUI'
        },

        dataComparisonOptions: {
            checkFor: {
                missingRows: '@MissingRows',
                differencesWithinRows: '@DifferencesWithinRows',
                additionalRows: '@AdditionalRows',
                automaticallySelectTables: '@AutomaticallySelectTables',
                fireTriggers: '@FireTriggers',
                disableForeignKeys: '@DisableForeignKeys',
                dataTableFilter: '@DataTableFilter',
                ignoreIdentityColumn: '@IgnoreIdentityColumn',
                userSuppliedTableList: {
                    table: {
                        schema: '@schema',
                        name: '@name',
                        checkforMissingRows: '@checkforMissingRows',
                        checkforDifferencesWithinRows: '@checkforDifferencesWithinRows',
                        checkforAdditionalRows: '@checkforAdditionalRows',
                        fireTriggers: '@FireTriggers',
                        disableForeignKeys: '@DisableForeignKeys',
                        filterWhereClause: '@FilterWhereClause',
                        ruleForMissingColumnsOnInsert: '@RuleForMissingColumnsOnInsert',
                        ignoreIdentityColumn: '@IgnoreIdentityColumn'
                    }
                }
            }
        }
    }
};

exports.scripter = 
{
    fileEncodingForObjects: 'FileEncodingForObjects',
    fileEncodingForData: 'FileEncodingForData',
    dataBatchSize: 'DataBatchSize',
    printInserts: 'PrintInserts',
    dataScriptColumnOrderBy: 'DataScriptColumnOrderBy',
    includeCollations: 'IncludeCollations',
    includePermissions: 'IncludePermissions',
    outputFolder: 'OutputFolder',
    outputFolderOption: 'OutputFolderOption',
    createVSProject: 'CreateVSProject',
    reportFilename: 'ReportFilename',
    overwriteReportFilename: 'OverwriteReportFilename',

    databaseToScript: {
        type: 'ServerType',
        name: 'Database',
        server: 'Server',
        username: 'Username',
        password: 'Password',
        includeDropAndCreateStatements: 'IncludeDropAndCreateDatabaseStatements'
    },

    objectFilters: {
        typeFilter: 'TypeFilter',
        schemaFilter: 'SchemaFilter',
        nameFilter: 'NameFilter',
        invert: 'Invert'
    },

    tableFilters: {
        scope: 'scope',
        schemaFilter: 'schemafilter',
        nameFilter: 'namefilter',
        invert: 'invert',
        minRows: 'minrows',
        maxRows: 'maxrows'
    }
}