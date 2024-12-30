const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const USER = mongoose.model("USER");  // Assuming you have a USER model defined in your project
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const requireLogin = require("../middlewares/requireLogin");  // Assuming you have this middleware

// Test route to check if the server is running
router.get('/', (req, res) => {
    res.send("hello");
});

// Signup route
router.post("/signup", (req, res) => {
    const { name, userName, email, password } = req.body;

    // Validate input fields
    if (!name || !email || !userName || !password) {
        return res.status(422).json({ error: "Please add all the fields" });
    }

    // Check if user already exists
    USER.findOne({ $or: [{ email: email }, { userName: userName }] })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({ error: "User already exists with that email or userName" });
            }

            // Hash password before saving
            bcrypt.hash(password, 12)
                .then((hashedPassword) => {
                    const user = new USER({
                        name,
                        email,
                        userName,
                        password: hashedPassword
                    });

                    // Save the new user
                    user.save()
                        .then(() => res.json({ message: "Registered successfully" }))
                        .catch((err) => console.log(err));
                });
        })
        .catch((err) => console.log(err));
});

// Signin route
router.post("/signin", (req, res) => {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
        return res.status(422).json({ error: "Please add email and password" });
    }

    // Check if user exists
    USER.findOne({ email: email })
        .then((savedUser) => {
            if (!savedUser) {
                return res.status(422).json({ error: "Invalid email" });
            }

            // Compare password with hashed password
            bcrypt.compare(password, savedUser.password)
                .then((match) => {
                    if (match) {
                        // Generate JWT token
                        const token = jwt.sign({ _id: savedUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                        
                        // Send response with token and user data
                        const { _id, name, email, userName } = savedUser;
                        res.json({ token, user: { _id, name, email, userName } });

                        console.log({ token, user: { _id, name, email, userName } });
                    } else {
                        return res.status(422).json({ error: "Invalid password" });
                    }
                })
                .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
});

module.exports = router;
