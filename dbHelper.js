const { MongoClient } = require("mongodb");

const encodedDbPassword = encodeURIComponent(process.env.DB_PASS);

const connectionString = `mongodb://${process.env.DB_NAME}:${encodedDbPassword}@${process.env.DB_HOST}/${process.env.DB_NAME}`;

const client = new MongoClient(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//I dont get why it doesnt get garbage collected
let dbConnection;

module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      if (err || !db) {
        return callback(err);
      }

      dbConnection = db.db(process.env.DB_NAME);
      console.log("Successfully connected to MongoDB.");

      return callback();
    });
  },

  getDb: function () {
    return dbConnection;
  },
};
