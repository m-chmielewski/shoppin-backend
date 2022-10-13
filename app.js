const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
//CORS - handle settings for dev and for prod
const cors = require("cors");
require("dotenv").config();

const dbHelper = require("./dbHelper.js");

const productsSeed = require("./productsSeed");

const listRoutes = require("./routes/list");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join("client")));

app.use("/backend/list/", listRoutes);

app.use((req, res) => {
 res.sendFile(path.resolve(__dirname, "client", "index.html"));
});

dbHelper.connectToServer(function () {
 app.listen(process.env.PORT);
 // const db = dbHelper.getDb();
 // db.collection("products").insertMany(productsSeed);
});
