var dbModels = require('./Model');
var utils = require('../Utils');
var Q = require('q');

exports.getFixturesFromDb = function (match) {

    var deferred = Q.defer();
    var fixMod = dbModels.dbFixtureModel.fixtureModel;
    var datetime = new Date();
    if (match == utils.constants.NEXT) {
        fixMod.find({})
            .where('matchdate').gt(datetime)
            .sort({ matchdate: 'ascending' })
            .limit(1)
            .exec(function (err, fixtures) {
                if (err) {
                    deferred.reject(new Error(err));
                }
                deferred.resolve(fixtures);
            });

    } else if (match == utils.constants.LAST) {
        fixMod.find({})
            .where('matchdate').lt(datetime)
            .sort({ matchdate: 'descending' })
            .limit(1)
            .exec(function (err, fixtures) {
                if (err) {
                    deferred.reject(new Error(err));
                }
                deferred.resolve(fixtures);
            });

    } else {
        fixMod.find(function (err, fixtures) {
            if (err) {
                deferred.reject(new Error(err));
            }
            deferred.resolve(fixtures);
        });
    }

    return deferred.promise;
}