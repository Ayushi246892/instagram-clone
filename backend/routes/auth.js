const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const USER = mongoose.model("USER");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

router.post("/signin", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(422).json({ error: "Please add email and password" });
    }

    USER.findOne({ email: email }).then((savedUser) => {
        if (!savedUser) {
            return res.status(422).json({ error: "Invalid email" });
        }

        bcrypt.compare(password, savedUser.password).then((match) => {
            if (match) {
                // Debugging line to check if JWT_SECRET is loaded
                console.log("JWT_SECRET:", process.env.JWT_SECRET);  

                if (!process.env.JWT_SECRET) {
                    return res.status(500).json({ error: "JWT_SECRET is not defined" });
                }

                const token = jwt.sign({ _id: savedUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                const { _id, name, email, userName } = savedUser;

                res.json({ token, user: { _id, name, email, userName } });
            } else {
                return res.status(422).json({ error: "Invalid password" });
            }
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
});

module.exports = router;
