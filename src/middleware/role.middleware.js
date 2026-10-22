
const userRole = (req, res, next) => {
    const user = req.user;

    if(user.role === "admin"){
        next();
    }
    else {
        res.status(403).json({
            success : false,
            message : "you are not allowed to do that"
        });
    }
}

module.exports = userRole;