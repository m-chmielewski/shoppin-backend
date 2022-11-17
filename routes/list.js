const express = require("express");

const router = express.Router();

const dbHelper = require("../dbHelper");

router.get("", (req, res, next) => {
 const db = dbHelper.getDb();

 db
  .collection("lists")
  .findOne({ current: true })
  .then(currentList => {
   if (currentList != null) {
    const productsList = currentList.products;
    productsList.sort((a, b) => {
     if (a.category > b.category) return 1;
     if (a.category < b.category) return -1;
     if (a.name > b.name) return 1;
     if (a.name < b.name) return -1;
     return 0;
    });
    res.json(productsList);
   } else {
    db
     .collection("products")
     .find()
     .sort({ category: 1, name: 1 })
     .toArray()
     .then(products => {
      res.json(products);
     })
     .catch(next);
   }
  });
});

router.post("/", (req, res, next) => {
 const db = dbHelper.getDb();

 const data = { products: req.body, current: true };

 db
  .collection("lists")
  .replaceOne({ current: true }, data, { upsert: true })
  .then(result => res.json(result))
  .catch(next);
});

router.post("/finalize", (req, res, next) => {
 const db = dbHelper.getDb();

 db
  .collection("lists")
  .updateOne(
   { current: true },
   {
    $set: {
     current: false,
    },
   }
  )
  .then(result => res.json(result))
  .catch(next);
});

module.exports = router;
