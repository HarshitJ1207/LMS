exports.authAdmin = (req , res , next) => {
    if(!req.user || !req.user.admin) res.redirect('/');
    else next();
}
