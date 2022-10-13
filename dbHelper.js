const { MongoClient } = require("mongodb");

const encodedDbPassword = encodeURIComponent(process.env.DB_PASS);

const connectionString = `mongodb://${process.env.DB_NAME}:${encodedDbPassword}@${process.env.DB_HOST}/${process.env.DB_NAME}`;

const client = new MongoClient(connectionString);

//I dont get why it doesnt get garbage collected
let db;

module.exports = {
 connectToServer: function (callback) {
  client
   .connect()
   .then(connection => {
    db = connection.db(process.env.DB_NAME);
    console.log("Successfully connected to MongoDB.");
    return callback();
   })
   .catch(err => console.log(err));
 },
 getDb: function () {
  return db;
 },
};
