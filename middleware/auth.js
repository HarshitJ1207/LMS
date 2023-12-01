exports.authAdmin = (req , res , next) => {
    if(!req.session.user || !req.session.user.admin) res.redirect('/');
    else next();
}
