const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");

//routes
const authRoute = require("./routes/auth");

//dotenv configuration
dotenv.config();

//mongoose connection
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    }).then(() => {
        console.log("DB Connection Successful!")
    }).catch((err) => console.log(err));

//for sending as json file
app.use(express.json());

//using routes
app.use("/api/auth", authRoute);

//listening port
app.listen(8800, () => {
    console.log("Backend server is running!");
})
