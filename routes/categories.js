const express = require("express");

const router = express.Router();

const dbHelper = require("../dbHelper");

router.get("", (req, res) => {
 const db = dbHelper.getDb();

 db
  .collection("products")
  .distinct("category")
  .then(categories => res.json(categories))
  .catch(error => {
   console.log(error);
   res.status(500).json({ error: error });
  });
});

// router.post("/", (req, res) => {
//  const db = dbHelper.getDb();

//  try {
//   db
//    .collection("lists")
//    .replaceOne({ current: true }, req.body, { upsert: true })
//    .then(result => res.json(result));
//  } catch (error) {
//   console.log(error);
//  }
// });

module.exports = router;
