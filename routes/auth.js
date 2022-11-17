const express = require("express");
const bcrypt = require("bcryptjs");

const router = express.Router();

const dbHelper = require("../dbHelper");

router.post("/signIn", (req, res, next) => {
 const db = dbHelper.getDb();

 res.json({ token: "test123" });
});

router.post("/signUp/", (req, res, next) => {
 const db = dbHelper.getDb();
});

module.exports = router;
