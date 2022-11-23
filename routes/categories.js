const express = require("express");

const router = express.Router();

const dbHelper = require("../dbHelper");

router.get("", (req, res, next) => {
 const db = dbHelper.getDb();

 db
  .collection("products")
  .distinct("category")
  .then(categories => res.json(categories))
  .catch(next);
});

module.exports = router;
