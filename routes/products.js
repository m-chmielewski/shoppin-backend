const express = require("express");

const router = express.Router();

const dbHelper = require("../dbHelper");

router.post("/", (req, res, next) => {
 const db = dbHelper.getDb();

 db
  .collection("products")
  .insertOne(req.body)
  .then(response => {
   product = { ...req.body, _id: String(response.insertedId) };
   db
    .collection("lists")
    .updateOne({ current: true }, { $push: { products: product } })
    .then(response => res.json(response));
  })
  .catch(next);
});

router.get("/eatable/", (req, res, next) => {
 const db = dbHelper.getDb();

 db
  .collection("products")
  .find({ category: { $ne: "Chem" } })
  .sort({ name: 1 })
  .toArray()
  .then(products => {
   res.json(products);
  })
  .catch(next);
});

module.exports = router;
