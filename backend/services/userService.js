const db = require("../database/database");

// Get all users
function getAllUsers(callback) {

    const sql = "SELECT * FROM users";

    db.all(sql, [], (err, rows) => {

        callback(err, rows);

    });

}

module.exports = {
    getAllUsers
};