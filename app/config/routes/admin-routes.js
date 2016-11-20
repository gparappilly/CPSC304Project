const passport = require('passport');

module.exports = function(app) {

    var requiresLogin = require('./auth-routes').requiresLogin;
    var hasAuthorization = require('./auth-routes').hasAuthorization;
  //keep a list of information so we don't have to fetch it again
  function renderAdminDisplayInformation(req, res) {
    const connection = require("../connection");
    connection.query('SELECT * from cpsc304_test.Program', function(err, programs, fields) {
        if (err)
          console.log("Error in admin-routes.js: " + err);
        else
        connection.query('SELECT * from cpsc304_test.Location', function(err, locations, fields) {
            if (err)
              console.log("Error in admin-routes.js: " + err);
            else
            connection.query('SELECT * from cpsc304_test.User', function(err, users, fields) {
                if (err)
                  console.log("Error in admin-routes.js: " + err);
                else
                connection.query(
                    'SELECT * from cpsc304_test.User U where U.isInstructor=1',
                    function(err, instructors, fields) {
                        console.log("Admin Route");
                        if (err) {
                            console.log("Error in admin-routes.js: " + err);
                        } else {
                            res.render('admin', {
                                title: 'Admin',
                                message: 'Admin',
                                userName: (req.user) ? req.user.username : undefined,
                                flashMessage: req.flash('flashMessage'),
                                programs : programs,
                                locations : locations,
                                users : users,
                                instructors : instructors
                            });
                        }
                });
            });
        });
    });
  }
  /**
   * Receive Signin Form Data
  **/
  app.post('/signin',
    passport.authenticate('local-login', { failureRedirect: '/' }),
    function(req, res) {
      res.redirect('/');
  });

  /**
   * Display Admin Console
  **/

  app.get('/admin', function(req, res) {
    renderAdminDisplayInformation(req, res);
  });

  /**
   * Receive Signup Form Data
  **/
  app.post('/addbuilding',
    passport.authenticate('local-signup', { failureRedirect: '/addbuilding' }),
    function(req, res) {
      res.redirect('/');
  });

  app.post('/adminDropProgram', function(req, res) {
    console.log(req.body);
    var programId = req.body.submit;
    const connection = require("../connection");
    //delete from program table
    connection.query('DELETE FROM cpsc304_test.TeachesClass where programId=?',[programId], function(err, users, fields) {
        if (err) {
            console.log(err);
            console.log("Error in dropping program from TeachesClass table: programId = " + programId)
        } else {
            connection.query('DELETE FROM cpsc304_test.Registers where programId=?', [programId], function(err, users, fields) {
                if (err) {
                    console.log(err);
                    console.log("Error in dropping program from Registers table: programId = " + programId);
                } else {
                    connection.query('DELETE FROM cpsc304_test.IsLocated where programId = ?', [programId], function(err, users, fields) {
                        if (err) {
                            console.log(err)
                        } else {
                            connection.query('DELETE FROM cpsc304_test.Occurs where programId = ?', [programId], function(err, users, fields) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    connection.query('DELETE FROM cpsc304_test.Program where programId = ?', [programId], function(err, users, fields) {
                                        if (err) {
                                            console.log(err);
                                            console.log("Error in dropping program from Program table: programId = " + programId);
                                        } else {
                                            renderAdminDisplayInformation(req, res);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });

  });

  app.post('/adminDropLocation', function(req, res) {
    console.log(req.body);
  });

  app.post('/adminDeleteUser', function(req, res) {
    console.log(req.body);
  });

  app.post('/adminAddProgram', function(req, res) {
    console.log(req.body);
    const connection = require("../connection");
    connection.query('INSERT INTO cpsc304_test.Program VALUES (?, ?, ?, ?, ?)',
        [req.body.programType, req.body.term, req.body.price, req.body.name, req.body.programId],
        function(err, result) {
            if (err) {
                console.log(err);
                console.log("Error while adding program: " + req.body.name);
            } else {
                renderAdminDisplayInformation(req, res);
            }
        });
  });
}