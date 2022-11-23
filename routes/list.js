const express = require("express");

const router = express.Router();

const dbHelper = require("../dbHelper");

const createList = db => {
 return new Promise((resolve, reject) => {
  db
   .collection("products")
   .find()
   .sort({ category: 1, name: 1 })
   .toArray()
   .then(products => {
    const list = { products: products, current: true };
    db
     .collection("lists")
     .insertOne(list)
     .then(() => resolve());
   });
 });
};

const getCurrentList = db => {
 return new Promise((resolve, reject) => {
  db
   .collection("lists")
   .findOne({ current: true })
   .then(currentList => {
    if (!currentList) {
     createList(db).then(() =>
      getCurrentList(db).then(currentList => resolve(currentList))
     );
    } else {
     resolve(currentList);
    }
   });
 });
};

router.get("", (req, res, next) => {
 const db = dbHelper.getDb();

 getCurrentList(db)
  .then(currentList => {
   const productsList = currentList.products;
   productsList.sort((a, b) => {
    if (a.category > b.category) return 1;
    if (a.category < b.category) return -1;
    if (a.name > b.name) return 1;
    if (a.name < b.name) return -1;
    return 0;
   });
   res.json(productsList);
  })
  .catch(next);
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

router.post("/addFromRecipe", (req, res, next) => {
 const db = dbHelper.getDb();

 const ingredientsToAdd = req.body.selectedIngredients;

 getCurrentList(db)
  .then(currentList => {
   currentList.products.forEach(product => {
    if (ingredientsToAdd.includes(product.name)) {
     product.onList = true;
    }
   });
   db.collection("lists").replaceOne({ current: true }, currentList);
  })
  .catch(next);

 res.json();
});

module.exports = router;
