const express = require("express");

const router = express.Router();

const userService = require("../services/userService");

router.get("/", (req, res) => {

    userService.getAllUsers((err, rows) => {

        if (err) {

            return res.status(500).json({
                status: "ERROR",
                message: "Unable to fetch users"
            });

        }

        res.json({

            status: "SUCCESS",

            message: "Users fetched successfully",

            data: rows

        });

    });

});

module.exports = router;