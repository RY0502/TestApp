exports.setSuccessHeaders = function (res) {
    res.status(200);
    res.set('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
}

exports.setFailureHeaders = function (res) {
    //res.status(200);
    res.set('Content-Type', 'application/json');
}