//import express
const express = require('express');
const mongoose = require('mongoose');
const dns = require('dns');
const authRouter = require('./routes/auth');
const bannerRouter = require('./routes/banner');
const categoryRouter = require('./routes/category');
const subcategoryRouter = require('./routes/sub_category');
const productRouter = require('./routes/product');
const productReviewRouter = require('./routes/product_review');
const vendorRouter = require('./routes/vendor');
const cors = require('cors');

// Enable CORS for all routes


// 强制 Node 使用公共 DNS（避免本机/ISP DNS 导致的 SRV/TXT 查询超时）
dns.setServers(['8.8.8.8', '1.1.1.1']);
console.log('Node DNS servers:', dns.getServers());


//Define the port
const PORT = 3000;
//Create an instance of express
const app = express();
//mongodb connection string
const DB = "mongodb+srv://zylyw123_db_user:CmWCowNqXccdzGzr@cluster0.jhujrwm.mongodb.net/?appName=Cluster0";
//middleware to register the hello route
app.use(express.json());
app.use(cors());
app.use(authRouter);
app.use(bannerRouter);
app.use(categoryRouter);
app.use(subcategoryRouter);
app.use(productRouter);
app.use(productReviewRouter);
app.use(vendorRouter);

mongoose.connect(DB)
    .then(() => {
        console.log("DB connection successful");
    })
    .catch((err) => {
        console.error("DB connection error:", err);
        process.exit(1);
    });

//start the server and listen on the defined port
app.listen(PORT, "0.0.0.0", function () {
    console.log(`Server is running on port ${PORT}`);
});
