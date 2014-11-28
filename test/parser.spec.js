var expect = require('chai').expect,
    cases = require('cases'),
    _ = require('lodash'),
    parse = require('../src/parser');

var stdoutA =
"7/20/2012 4:48:22 PM...Executing file 1 of 1 files - D:\\Stored Procedures\\dbo.Do_Something.sql\r\n\
7/20/2012 4:48:22 PM...<ERROR>\r\n\
7/20/2012 4:48:22 PM...Error in D:\\Stored Procedures\\dbo.Do_Something.sql\r\n\
7/20/2012 4:48:22 PM...Msg 207, Level 16, State 1, Procedure Do_Something, Line 24\r\n\
\r\n\
7/20/2012 4:48:22 PM...Invalid column name 'Column1'.\r\n\
\r\n\
7/20/2012 4:48:22 PM...Msg 207, Level 16, State 1, Procedure Do_Something, Line 24\r\n\
\r\n\
7/20/2012 4:48:22 PM...Invalid column name 'Column2'.\r\n\
7/20/2012 4:48:22 PM...</ERROR>\r\n\
7/20/2012 4:48:22 PM...Disabling triggers before running data scripts\r\n\
12/19/2012 5:35:28 PM...Executing file 1 of 1 files - D:\\Stored Procedures\\dbo.Do_Something.sql\r\n\
12/19/2012 5:35:28 PM...<ERROR>\r\n\
12/19/2012 5:35:28 PM...Error in D:\\Stored Procedures\\dbo.Do_Something.sql\r\n\
12/19/2012 5:35:28 PM...Msg 137, Level 15, State 2, Procedure Do_Something, Line 154\r\n\
\r\n\
12/19/2012 5:35:28 PM...Must declare the scalar variable \"@param\".\r\n\
12/19/2012 5:35:28 PM...</ERROR>\r\n\
12/19/2012 5:35:28 PM...Disabling triggers before running data scripts";

var stdoutB =
"12/13/2014 11:12:02 PM...Executing file 11 of 12 files - X:\\dbo.ih_user_rfq.sql\r\n\
\r\n\
12/13/2014 11:12:02 PM...Executing file 12 of 12 files - X:\\dbo.user_info.sql\r\n\
\r\n\
12/13/2014 11:12:02 PM...Error! Error in X:\\dbo.CalendarView.sql\r\n\
12/13/2014 11:12:02 PM...Error! Msg 208, Level 16, State 1, Procedure CalendarView, Line 7\r\n\
12/13/2014 11:12:02 PM...Error! Invalid object name 'dbo.user_data'.\r\n\
12/13/2014 11:12:02 PM...Error! Error in X:\\dbo.user_info.sql\r\n\
12/13/2014 11:12:02 PM...Error! Msg 208, Level 16, State 1, Procedure user_info, Line 9\r\n\
\r\n\
12/13/2014 11:12:02 PM...Error! Invalid object name 'dbo.user_data'.\r\n\
12/13/2014 11:12:02 PM...Retrying failed scripts Completed with Errors\r\n\
\r\n\
12/13/2014 11:12:02 PM...Running DBCC CHECKCONSTRAINTS on all tables";

var errorA = 
"Error in D:\\Stored Procedures\\dbo.Do_Something.sql\r\n\
Msg 207, Level 16, State 1, Procedure Do_Something, Line 24\r\n\
Invalid column name 'Column1'.\r\n\
Msg 207, Level 16, State 1, Procedure Do_Something, Line 24\r\n\
Invalid column name 'Column2'.\r\n\
Error in D:\\Stored Procedures\\dbo.Do_Something.sql\r\n\
Msg 137, Level 15, State 2, Procedure Do_Something, Line 154\r\n\
Must declare the scalar variable \"@param\".";

var errorB =
"Error in X:\\dbo.CalendarView.sql\r\n\
Msg 208, Level 16, State 1, Procedure CalendarView, Line 7\r\n\
Invalid object name 'dbo.user_data'.\r\n\
Error in X:\\dbo.user_info.sql\r\n\
Msg 208, Level 16, State 1, Procedure user_info, Line 9\r\n\
Invalid object name 'dbo.user_data'.";

describe('parser', function() {

    it('should return empty value when no errors found', function () {

        expect(parse('')).to.be.empty;

    });

    it('should parse errors', cases([
          [ stdoutA, errorA ],
          [ stdoutB, errorB ]
      ], function (stdout, error) {

        expect(parse(stdout)).to.equal(error);

    }));

});