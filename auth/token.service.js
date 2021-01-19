const pool = require("../config/database");

module.exports = {
    token_valid: (token, callback) => {
        pool.query(
            `select isAdmin from users where token = ?`,
            [token],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results[0]);
            }
        );
    },
};
