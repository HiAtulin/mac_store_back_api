const express = require('express');
const Vendor = require('../models/vendor');
const e = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const vendorRouter = express.Router();
vendorRouter.post("/api/vendor/signup", async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password) {
            return res.status(400).json({ error: "Please enter all the fields" });
        }
        const existingEmail = await Vendor.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ msg: "vendor with this email already exists" });
        } else {
            // Hash the password before saving the vendor
            if(password.length < 8){
                return res.status(400).json({ msg: "Password must be at least 8 characters long" });
            }
            const salt = await bcrypt.genSalt(10);// Generate a salt for hashing
            // Hash the password using the generated salt
            const hashedPassword = await bcrypt.hash(password, salt);
            let vendor = new Vendor({ fullName, email, password: hashedPassword });
            vendor = await vendor.save();
            res.status(200).json({ msg: "vendor created successfully", vendor });
        }

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

vendorRouter.post("/api/vendor/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        const findVendor = await Vendor.findOne({ email });
        if (!findVendor) {
            return res.status(400).json({ msg: "vendor with this email does not exist" });
        } else {
            const isMatch = await bcrypt.compare(password, findVendor.password);
            if (!isMatch) {
                return res.status(400).json({ msg: "incorrect password" });
            } else {
                const token = jwt.sign({ id: findVendor._id }, "passwordKey");
                //remove password from the vendor object before sending the response
                const { password, ...vendorWithoutPassword } = findVendor._doc;
                return res.status(200).json({ token, vendor: vendorWithoutPassword });
            }
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = vendorRouter;
