function loggedOut(req, res, next) {
    if (req.session && req.session.username) {
        return res.redirect('/');
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