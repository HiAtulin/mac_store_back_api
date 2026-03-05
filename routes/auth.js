const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authRouter = express.Router();

authRouter.post("/api/signup", async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password) {
            return res.status(400).json({ error: "Please enter all the fields" });
        }
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ msg: "user with this email already exists" });
        } else {
            // Hash the password before saving the user
            if(password.length < 8){
                return res.status(400).json({ msg: "Password must be at least 8 characters long" });
            }
            const salt = await bcrypt.genSalt(10);// Generate a salt for hashing
            // Hash the password using the generated salt
            const hashedPassword = await bcrypt.hash(password, salt);
            let user = new User({ fullName, email, password: hashedPassword });
            user = await user.save();
            res.status(200).json({ msg: "user created successfully", user });
        }

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

//signin route
authRouter.post("/api/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        const findUser = await User.findOne({ email });
        if (!findUser) {
            return res.status(400).json({ msg: "user with this email does not exist" });
        } else {
            const isMatch = await bcrypt.compare(password, findUser.password);
            if (!isMatch) {
                return res.status(400).json({ msg: "incorrect password" });
            } else {
                const token = jwt.sign({ id: findUser._id }, "passwordKey");
                //remove password from the user object before sending the response
                const { password, ...userWithoutPassword } = findUser._doc;
                return res.status(200).json({ token, user: userWithoutPassword });
            }
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


module.exports = authRouter;