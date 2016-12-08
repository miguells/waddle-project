function loggedOut(req, res, next) {
    if (req.session && req.session.username) {
        var error = new Error('This is page is not for you! You should not be logged in');
        return next(error);
    }
    return next();
}

function requiresLogin(req, res, next) {
    if (req.session && req.session.username) {
        return next();
    } else {
        var err = new Error('You must be logged in to view this page')
        return next(err);
    }
}
module.exports.loggedOut = loggedOut;
module.exports.requiresLogin = requiresLogin;