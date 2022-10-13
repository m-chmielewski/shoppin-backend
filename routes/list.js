const express = require("express");

const router = express.Router();

const dbHelper = require("../dbHelper");

router.get("", (req, res) => {
 const db = dbHelper.getDb();

 db
  .collection("lists")
  .findOne({ current: true }, { projection: { _id: 0 } })
  .then(currentList => {
   if (currentList != null) return res.json(currentList);
   else {
    db
     .collection("products")
     .find()
     .toArray()
     .then(allProducts => {
      const output = { leftColumn: { products: {} }, current: true };
      allProducts.forEach(product => {
       !output.leftColumn.products[product.category]
        ? (output.leftColumn.products[product.category] = [product])
        : output.leftColumn.products[product.category].push(product);
      });
      res.json(output);
     });
   }
  });
});

router.post("/", (req, res) => {
 const db = dbHelper.getDb();

 try {
  db
   .collection("lists")
   .replaceOne({ current: true }, req.body, { upsert: true })
   .then(result => res.json(result));
 } catch (error) {
  console.log(error);
 }
});

module.exports = router;
