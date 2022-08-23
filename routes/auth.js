//create register and login routes
const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//register
router.post("/register", async (req, res) => {
    //create new User
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString(),
    });

    //send to DB
    try {
        const user = await newUser.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json(err);
    }
});

//login
router.post("/login", async (req, res) => {
    try {
        //find user in DB with input data
        const user = await User.findOne({ email: req.body.email });
        //if data doesnt match
        !user && res.status(401).json("User not found!");
        //if data matches, match password then
        //decrypt user password from DB
        const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
        const originalPassword = bytes.toString(CryptoJS.enc.Utf8);
        //compare input password with DB password
        //if not same
        originalPassword !== req.body.password && res.status(401).json("Wrong Password!");
        //access token
        const accessToken = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.SECRET_KEY, { expiresIn: "5d" }
        );
        //if same
        //destructure password and other things to avoid password expose
        const { password, ...info } = user._doc;
        //send data
        res.status(200).json({ ...info, accessToken });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;