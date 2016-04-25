var Kilometrikisa = require('../lib/kilometrikisa.js');
var SyncModel = require('../models/SyncModel.js');
var strava = require('strava-v3');
var User = require('../models/UserModel.js');

/**
 * Handle syncing from Stara to Kilometrikisa.
 * @type {Object}
 */
var SyncController = {



    /**
     * Main page.
     *
     * @param  {[type]}   req  [description]
     * @param  {[type]}   res  [description]
     * @param  {Function} next [description]
     * @return {[type]}        [description]
     */
    index:  function(req, res, next) {

        // Load user.
        User.findOne({stravaUserId: req.session.stravaUserId}, function(err, user) {

            if (err) {
                res.redirect('/error?code=DATABASE_CONNECTION_FAILED');
                return;
            }

            if (!user) {
                res.redirect('/error?code=USER_NOT_FOUND');
                return;
            }

            SyncModel.getStravaActivities(
                user.stravaToken,
                function(activities) {

                    res.render('sync-index', {
                        activities: activities,
                        stravaToken: user.stravaToken,
                        kilometrikisaToken: user.kilometrikisaToken,
                        kilometrikisaSessionId: user.kilometrikisaSessionId,
                    });

                },
                function() {

                    res.render('sync-index', {
                        activities: false,
                        stravaToken: user.stravaToken,
                        kilometrikisaToken: user.kilometrikisaToken,
                        kilometrikisaSessionId: user.kilometrikisaSessionId,
                    });

                }
            )


        })



    },


    /**
     * Sync kilometers.
     *
     * @param  {[type]}   req  [description]
     * @param  {[type]}   res  [description]
     * @param  {Function} next [description]
     * @return {[type]}        [description]
     */
    doSync: function(req, res, next) {

        SyncModel.doSync(
            req.session.stravaToken,
            req.session.kilometrikisaToken,
            req.session.kilometrikisaSessionId,
            function(activities) {

                res.render('sync-dosync', {
                    success: true
                });

            },
            function() {

                res.render('sync-dosync', {
                    success: false
                });

            }
        )

    }


};
module.exports = SyncController;
