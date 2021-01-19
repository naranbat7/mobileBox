const { verify } = require("jsonwebtoken");
const { token_valid } = require("./token.service");

module.exports = {
    checkAdminToken: (req, res, next) => {
        let token = req.get("authorization");
        if (token) {
            // token = token.slice(7);
            verify(token, process.env.PASSWORD_ENC, (err, decoded) => {
                if (err) {
                    res.json({
                        success: false,
                        message: "Invalid token",
                    });
                } else {
                    token_valid(token, (err, results) => {
                        if (err) {
                            console.log(err);
                        }
                        if (results.isAdmin == 1) {
                            next();
                        } else {
                            res.json({
                                success: false,
                                message: "Access denied!",
                            });
                        }
                    });
                }
            });
        } else {
            res.json({
                success: false,
                message: "Access denied!",
            });
        }
    },
    checkUserToken: (req, res, next) => {
        let token = req.get("authorization");
        if (token) {
            // token = token.slice(7);
            verify(token, process.env.PASSWORD_ENC, (err, decoded) => {
                if (err) {
                    res.json({
                        success: false,
                        message: "Invalid token",
                    });
                } else {
                    token_valid(token, (err, results) => {
                        if (err) {
                            console.log(err);
                        } else {
                            next();
                        }
                    });
                }
            });
        } else {
            res.json({
                success: false,
                message: "Access denied!",
            });
        }
    },
};
