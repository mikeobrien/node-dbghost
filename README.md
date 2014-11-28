# dbghost

[![npm version](http://img.shields.io/npm/v/dbghost.svg)](https://npmjs.org/package/dbghost) [![build status](http://img.shields.io/travis/mikeobrien/node-dbghost.svg)](https://travis-ci.org/mikeobrien/node-dbghost) [![Dependency Status](http://img.shields.io/david/mikeobrien/node-dbghost.svg)](https://david-dm.org/mikeobrien/node-dbghost) [![npm downloads](http://img.shields.io/npm/dm/dbghost.svg)](https://npmjs.org/package/dbghost)

Node wrapper for [DB Ghost](http://www.innovartis.co.uk/).

*NOTE: Currently only the Change Manager and Scripter supported by this module.*

## Install

```bash
$ npm install dbghost --save
```

## Usage

A promise is returned and fulfilled when DB Ghost succeeds or rejected if it fails. Global options are passed into the DB Ghost constructor; operation specific options are passed into the operation.

*NOTE: Forward slashes in paths are automatically converted to backslashes so either can be used.*

```js
var DBGhost = require('dbghost');

var dbghost = DBGhost({

    // Optional DB Ghost bin path. If omitted it is assumed to be in the PATH.
    binPath: 'path/to/dbghost',

    // Optional configuration file used as a template. It will contain 
    // default configuration you want applied to all DB Ghost operations.
    // Options passed into the operation will override these defaults.
    templateConfigPath: 'path/to/template/config',

    // Optional path for artifacts such as reports. If specified these files
    // will be saved relative to this path.
    artifactsPath: 'artifacts/path'
    
});

dbghost.script({ ... })
    .catch(function(error) { console.log('Failed: ' + error.message); })
    .done(function() { console.log('Done.'); });
```

## Operations

```js
// Creates a copy of a database on a server.
dbghost.copy({ ... });

// Looks for differences between databases.
dbghost.compare({ ... });

// Looks for differences and synchronizes the target 
// database with the source database.
dbghost.compareAndSync({ ... });

// Looks for differences and creates a SQL Delta of the differences.
dbghost.compareAndCreateDelta({ ... });

// Scripts a database to files.
dbghost.script({ ... });

// Scripts a database to files and builds a new database.
dbghost.scriptAndBuild({ ... });

// Scripts a database to files, builds the source database 
// and checks the target database for differences.
dbghost.scriptBuildAndCompare({ ... });

// Scripts a database to files and builds the source database 
// and checks the target database for differences, creating a 
// SQL Delta of the differences.
dbghost.scriptBuildCompareAndCreateDelta({ ... });

// Scripts a database to files and builds the source database 
// and looks for differences and synchronizes the target database 
// with the newly built database.
dbghost.scriptBuildCompareAndSync({ ... });

// Build Database: Builds a database.
dbghost.build({ ... });

// Builds the source database and checks the target database for differences.
dbghost.buildAndCompare({ ... });

// Builds the source database and looks for differences and synchronizes 
// the target database with the newly built database.
dbghost.buildCompareaAndSync({ ... });

// Builds the source database and checks the target database for 
// differences, creating a SQL Delta of the differences.
dbghost.buildCompareAndCreateDelta({ ... });
```

## Options

Operation options map closely to the [DBGhost.config](https://github.com/mikeobrien/node-dbghost/blob/master/misc/DBGhost.config) file.

```js
dbghost.*({

    // Optional path where the config file created for the operation will be saved.
    // This path will be relative to the artifacts path if specified.
    configSavePath: 'path/to/config',

    changeManager: {

        // Name of the database to build.
        buildDatabaseName: 'Database',

        // SQL object directories are derived from this project if it exists.
        visualStudioDatabaseProjectFile: 'path/to/vs/proj',

        // The fullname for the Build File, if not provided no Build SQL file will 
        // be created. This path will be relative to the artifacts path if specified.
        buildSQLFilename: 'path/to/build',

        // The fullname for the Delta Script File, if not provided none will be created.
        // This path will be relative to the artifacts path if specified.
        deltaScriptsFilename: 'path/to/delta',

        // Encoding of the delta file.
        deltaFileEncoding: 'Unicode|US-ASCII',

        // The fullname for the ReportFile, if not provided none will be created.
        // This path will be relative to the artifacts path if specified.
        reportFilename: 'path/to/report',

        // Overwrite the report file each time the process runs.
        overwriteReportFileIfExists: true|false,

        // This is used when a database build is part of the processing.
        // This database's attributes are used for the CREATE DATABASE 
        // statement at the start of the build. Generally the target 
        // database is used as the template. 
        templateDatabase: {

            server: 'sqlserver',
            name: 'Database',

            // SQL Server credentials. If a username and password
            // are not specified Windows authentication is assumed.
            username: 'user',
            password: 'P@$$w0rd'
        },

        sourceDatabase: {

            server: 'sqlserver',
            name: 'Database',

            // SQL Server credentials. If a username and password
            // are not specified Windows authentication is assumed.
            username: 'user',
            password: 'P@$$w0rd'
        },

        targetDatabase: {

            server: 'sqlserver',
            name: 'Database',

            // SQL Server credentials. If a username and password
            // are not specified Windows authentication is assumed.
            username: 'user',
            password: 'P@$$w0rd'
        },

        // Connection Settings for source control.
        sourceControl: {

            // Flag indicating whether or not to use source control.
            use: true|false,

            // Source control credentials.
            username: 'user',
            password: 'P@$$w0rd',

            // Path to the database ini file.
            databaseIni: 'path/to/ini',

            // Flag indicating whether or not the latest version is to be retrieved.
            getLatest: true|false,

            // Version label to retrieve. Ignored if getLatest is set to true.
            versionLabel: '1.0.0.0'
        },

        // Directory containing SQL Objects for the Build.
        schemaScripts: {

            // Flag indicating whether or not to recurse script folders.
            recurseObjectFolders: true|false,

            // Flag indicating whether or not to derive the root 
            // directory from the config file path.
            deriveRootDirectoryFromConfigFilePath: true|false,

            // Root directory of the scripts.
            rootDirectory: 'path/to/scripts',

            // The location of a SQL script that has definitions for the database properties 
            // including the CREATE DATABASE statement. Omit if you need to use an 
            // existing database as the source for all the build database properties.
            dropCreateDatabaseScript: 'path/to/script',

            logMissingBuildFolderWarnings: true|false,

            // Paths to the specific types of objects. These paths are 
            // relative to the root path.
            paths: {
                logins: [ 'Logins', ... ],
                usersAndRoles: [ 'UsersAndRoles', ... ],
                defaults: [ 'Defaults', ... ],
                rules: [ 'Rules', ... ],
                userDefinedTables: [ 'UDDT', ... ],
                tables: [ 'Tables', ... ],
                views: [ 'Views', ... ],
                userDefinedFunctions: [ 'UDFs', ... ],
                storedProcedures: [ 'StoredProcedures', ... ],
                triggers: [ 'Triggers', ... ],
                xmlSchemaCollections: [ 'XMLSchemaCollections', ... ],
                schemas: [ 'Schemas', ... ],
                staticData: [ 'StaticData', ... ],
                assemblies: [ 'Assemblies', ... ],
                ddlTriggers: [ 'DDLTriggers', ... ],
                serviceBrokerMessageTypes: [ 'ServiceBrokerMessageTypes', ... ],
                serviceBrokerContracts: [ 'ServiceBrokerContracts', ... ],
                serviceBrokerQueues: [ 'ServiceBrokerQueues', ... ],
                serviceBrokerRoutes: [ 'ServiceBrokerRoutes', ... ],
                serviceBrokerServices: [ 'ServiceBrokerServices', ... ],
                serviceBrokerRemoteServiceBindings: [ 'ServiceBrokerRemoteBindings', ... ],
                aggregateFunctions: [ 'AggregateFunctions', ... ],
                asymmetricKeys: [ 'AsymmetricKeys', ... ],
                certificates: [ 'Certificates', ... ],
                fullTextCatalogs: [ 'FullTextCatalogs', ... ],
                partitionFunctionsAndSchemes: [ 'PartitionFunctionsAndSchemes', ... ],
                symmetricKeys: [ 'SymmetricKeys', ... ],
                synonyms: [ 'Synonyms', ... ],
                sequences: [ 'Sequences', ... ],

                // The scripts in the AfterBuildScript node are run on the 
                // build source database after all other scripts have run.
                afterBuildScript: [ 'AfterBuildScript', ... ],

                // The scripts in the BeforeSyncScript node are run on the 
                // target database before synchronization takes place.
                beforeSyncScript: [ 'BeforeSyncScript', ... ],

                // The scripts in the AfterSyncScript node are run on the 
                // target database after synchronization takes place.
                afterSyncScript: [ 'AfterSyncScript', ... ]
            }
        },

        compareOptions: {

            differencesWithObjects: true|false,
            duplicatedObjects: true|false,
            extraObjects: true|false,
            doNotDropTables: true|false,
            doNotDropColumns: true|false,
            missingObjects: true|false,
            disableForeignKeys: true|false,
            fireTriggers: true|false,
            ignoreCollationDifferences: true|false,
            ignoreIndexFillFactorDifferences: true|false,
            questionEachChange: true|false,
            permissions: true|false,
            columnOrdinal: true|false,
            extendedProperties: true|false,
            dynamicallyAssignDatabaseName: true|false,
            keepNewDatabase: true|false,
            dropDBIfExistsForCpyDB: true|false,
            continueOnBuildBreak: true|false,
            enableCustomScripts: true|false,
            loadAllFileTypes: true|false,
            requestApplicationRolePassword: true|false,
            fileTypes: 'type',
            diffCommand: '"ExamDiff.exe"',
            diffArgs: '"%1" "%2" /l /e /t /n',
            objectFilter: 'filter',

            detectPotentialColumnRenames: {

                // When this attribute is true, the detection and renaming process can run.
                execute: true|false,

                // When this attribute is true, the columns must be 
                // exactly the same except for name.
                useExactMatch: true|false,

                // When this attribute is true, the process will return errors when  
                // potential column renames are detected and you are creating a change 
                // script or synchronizing the target database - otherwise warnings 
                // are returned.
                raiseErrors: true|false,

                // When this attribute is true, the process will stop if all the following 
                // conditions are true. You are creating a change script or synchronizing 
                // the target database or raiseErrors == true.
                stopOnError: true|false,

                // Renaming of columns only happens when execute is true and creating 
                // a change script or synchronizing the target database. A column 
                // rename will only happen if the old column exists and the new 
                // column does not exist.
                columnsToRename: [
                    {
                        schema: 'dbo',
                        tableName: 'Table',
                        oldColumnName: 'OldColumn',
                        newColumnName: 'NewColumn'
                    },
                    ...
                ]
            }

            // Flags indicating what object to compare.
            sqlObjectsOptions: {
                logins: true|false,
                schemas: true|false,
                users: true|false,
                roles: true|false,
                defaults: true|false,
                rules: true|false,
                userDefinedTables: true|false,
                tables: true|false,
                triggers: true|false,
                views: true|false,
                storedProcedures: true|false,
                userDefinedFunctions: true|false,
                assemblies: true|false,
                xmlSchemaCollections: true|false,
                ddlTriggers: true|false,
                serviceBrokerMessageTypes: true|false,
                serviceBrokerContracts: true|false,
                serviceBrokerQueues: true|false,
                serviceBrokerServices: true|false,
                serviceBrokerRoutes: true|false,
                serviceBrokerRemoteServiceBindings: true|false,
                synonyms: true|false,
                partitionFunctionsAndSchemes: true|false,
                aggregateFunctions: true|false,
                asymmetricKeys: true|false,
                certificates: true|false,
                symmetricKeys: true|false,
                fullTextCatalogs: true|false,        
                sequences: true|false,
                showSchemaGUI: true|false
            },

            dataComparisonOptions: {

                // Data will not be compared when false, when true the 
                // comparison options are derived from child nodes below.
                compare: true|false,

                checkFor: {

                    // The comparison process will look for missing rows and create insert 
                    // statements as needed.
                    missingRows: true|false,

                    // The comparison process will look for differences within rows using 
                    // a unique key to identify the row and then compare them for equality, 
                    // creating update statements as needed.
                    differencesWithinRows: true|false,

                    // The comparison process will look for extra rows and create delete 
                    // statements as needed.
                    additionalRows: true|false,

                    // When this option is true, the table list to compare is created 
                    // from the source database. The list will contain all those user 
                    // defined tables within the source database that contain any data. 
                    // When this option is false the list of tables from the node 
                    // UserSuppliedTableList are used.
                    automaticallySelectTables: true|false,

                    // When this is false, all triggers are disabled on the user defined 
                    // tables before any data changing statements are executed. The triggers 
                    // are then re-enabled once the process completes. When this is true, 
                    // you can then enable individual tables to fire triggers if 
                    // AutomaticallySelectTables is false, otherwise all triggers will 
                    // fire. This setting when true could produce undesirable effects.
                    fireTriggers: true|false,

                    // When this is false, foreign keys remain as they are. When this is 
                    // true, you can disable or enable foreign keys for individual tables 
                    // if AutomaticallySelectTables is false, otherwise all foreign keys 
                    // will be disabled that used by any data statement. Once the process 
                    // completes the foreign keys will be re-enabled. You should consider 
                    // this option when creating a script where you are not synchronizing 
                    // the database. This will allow the process to perform must faster 
                    // but could result in errors in the script when the foreign keys are 
                    // re-enabled as your target database fails the referential integrity 
                    // that your foreign key defines.
                    disableForeignKeys: true|false,

                    dataTableFilter: 'filter',
                    ignoreIdentityColumn: true|false,

                    userSuppliedTableList: [
                        {
                            // The schema of the table typically dbo. In SQL 2000 this is 
                            // the owner of the table.
                            schema: 'dbo',

                            // The name of the table.
                            name: 'Table',
                            
                            // Allows you to turn off or on the process of looking for 
                            // missing rows for individual tables.  The value is ignored 
                            // if the attribute MissingRows for the node CheckFor is false.
                            checkforMissingRows: true|false,
                            
                            // Allows you to turn off or on the process of looking for 
                            // differences within rows for individual tables. The value is 
                            // ignored if the attribute DifferencesWithinRows for the node 
                            // CheckFor is false.
                            checkforDifferencesWithinRows: true|false,
                            
                            // Allows you to turn off or on the process of looking for extra 
                            // rows for individual tables. The value is ignored if the 
                            // attribute AdditionalRows for the node CheckFor is false.
                            checkforAdditionalRows: true|false,
                            
                            // If the value is true, all the triggers for the individual 
                            // table will fire for all data statements. If the value is 
                            // false, the triggers is disabled before any data statement 
                            // and re-enabled at the end of the process. The value is 
                            // ignored if the attribute FireTriggers for the node CheckFor 
                            // is false.
                            fireTriggers: true|false,
                            
                            // If the value is true, all foreign keys for the individual 
                            // table are disabled for all data statements. When false the 
                            // foreign keys remain as they are. The value is ignored if 
                            // the attribute DisableForeignKeys for the node CheckFor 
                            // is false.
                            disableForeignKeys: true|false,
                            
                            // Use this attribute to filter the data set to be compared. 
                            // NB: Do not include the keyword "where" in the string.
                            filterWhereClause: "[Column] = 'value' AND ...",
                            
                            // When a column is not within the list and the list is to be 
                            // used, what value is used for the missing column when an 
                            // insert statement is created? You can either have the column 
                            // use the value from the source table, if it exists, or exclude 
                            // the column from the insert statement which would result in a 
                            // null value for the column or the default value if the column 
                            // has a default defined on it. If the column doesn't allow 
                            // nulls and there is no default then an error will be reported 
                            // for the insert.
                            ruleForMissingColumnsOnInsert: 
                                'UseSourceValue|ExcludeFromStatement',

                            ignoreIdentityColumn: true|false,

                            // If there are no columns in the list the values of all columns 
                            // within the table are compared, otherwise only those columns 
                            // within the supplied list are compared.
                            userSuppliedColumnList: [ 'Column1', 'Column2' ]
                        },
                        ...
                    ]
                }
            }
        }
    },

    scripter: {

        // Encoding to be used for object scripts.
        fileEncodingForObjects: 'Unicode|US-ASCII',

        // Encoding to be used for data scripts.
        fileEncodingForData: 'Unicode|US-ASCII',

        // The size of each batch of rows in a static data/lookup script.
        dataBatchSize: 200,

        // Option to print inserted row counts in a static data/lookup script.
        printInserts: true|false,

        // Governs the order of the columns in the data scripts. 
        //   0: No order (default).
        //   1: Order by column ordinal position.
        //   2: Order by column name.
        dataScriptColumnOrderBy: 0|1|2,

        // Flag to indication the use of the collate clause in table creation scripts.
        includeCollations: true|false,

        // Flag to indicate if permissions are scripted with the objects.
        includePermissions: true|false,

        // Target root folder for the SQL scripts.
        outputFolder: 'path/to/script/output',

        // Options to delete output folders
        //   DeleteAll: This option will delete all the object directories 
        //       below the root output directory.
        //   DeleteByObject: This option will delete only those directories 
        //       where you are scripting objects. For example if you are 
        //       only scripting Stored Procedures then only the Stored 
        //       Procedures directory will be deleted.
        //   DeleteNothing: this option will not delete any directories.
        outputFolderOption: 'DeleteAll|DeleteByObject|DeleteNothing',

        // Flag to indicate that a Visual Studio database project file should be created.
        createVSProject: true|false,

        // The name of the log/report file. This path will be relative to the 
        // artifacts path if specified.
        reportFilename: 'path/to/report',

        // Overwrite log/report file if it exists.
        overwriteReportFilename: true|false,

        // Details of the database to be scripted out.
        databaseToScript: {

            // Type of the database to script.
            type: 'Unknown|SQLServer7|SQLServer2000|SQLServer2005|SQLServer2008',

            // Name of the database to script.
            name: 'Database',

            // Name of the database server.
            server: 'sqlserver',

            // SQL Server credentials. If a username and password
            // are not specified Windows authentication is assumed.
            username: 'user',
            password: 'P@$$w0rd'

            // Flag indicating if DROP and CREATE statements are to be included.
            includeDropAndCreateStatements: true|false
        },

        // SQL object filter criteria. Filters are regular expressions.
        objectFilters: {

            // Type name filter.
            typeFilter: '.*',

            // Schema name filter.
            schemaFilter: 'dbo',

            // Object name filter.
            nameFilter: '^DEPRICATED',

            // Invert the specified filters.
            invert: true|false
        },

        // Table filter criteria. Filters are regular expressions.
        tableFilters: {

            // Scope of tables to script out.
            scope: 'ScriptAllTables|ScriptFilteredTables|
                    ScriptSelectedTables|DoNotScriptTables',

            // Schema name filter.
            schemaFilter: 'dbo',

            // Table name filter.
            nameFilter: '^DEPRICATED',

            // Invert the specified filters.
            invert: true|false,

            // Minimum number of rows to script out.
            minRows: 1,

            // Maximum number of rows to script out.
            maxRows: 1000,

            // Name of tables to script.
            tablesToScript: [ 'table1', 'table2' ]
        }
    }
});
```

## License
MIT License
