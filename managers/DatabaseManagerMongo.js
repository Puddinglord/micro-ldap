"use strict";

/**
 * This class provides access to the mongo database that contains the list of
 * usernames that we will be managing.
 *
 * @class DatabaseManagerMongo
 */
class DatabaseManagerMongo {
  constructor () {
    this.mongoClient = require("mongodb").MongoClient;
    this.mongoUrl = null;
    this.databaseName = null;
    this.collectionName = null;
    this.usernameName = null;
    this.database = { databaseObject: null, db: null };
    this.isDbConnected = false;
  }

  initializeDatabaseConnection (callback) {
    if (!this.isDbConnected) {
      this.mongoClient.connect(this.mongoUrl, { useNewUrlParser: true }, (err, db) => {
        if (err) {
          console.error(err);
        } else {
          this.database.db = db;
          this.database.databaseObject = db.db(this.databaseName);
          this.isDbConnected = true;
          console.log("connected");
          callback();
        }
      });
    }
  }

  isDatabaseReadyForQuery () {
    if (!this.isDbConnected) {
      this.initializeDatabaseConnection();
    } else {
      return this.isDbConnected;
    }
  }

  /**
   * Find all usernames located within the collection that was specified by the user.
   * After grabbing each doument we push that data to a list and then return the list.
   *
   * @returns {List} usernameList The list of usernames returned by the database
   * @memberof DatabaseManagerMongo
   */
  async findAllUsers () {
    let usernameList = [];

    // We are using the usernameName varaible to query the database but ESLint doesn't think so hence disabling the next line
    // eslint-disable-next-line no-unused-vars
    const usernameName = this.usernameName;

    if (this.isDatabaseReadyForQuery()) {
      await this.database.databaseObject.collection(this.collectionName).find({}, { usernameName: 1, _id: 0 }).forEach((document, error) => {
        if (error) {
          console.error(error);
        }

        usernameList.push(document.username);
      });

      return usernameList;
    };
  }

  /**
   * This functions sets up the required information so we can connect to the correct database
   * and read the data we need to perform our task. This should only be called once and right
   * after setting up the microLDAP object.
   *
   * @param {String} mongoUrl The URL of the mongo database either external or locally hosted.
   * @param {String} databaseName The name of the database to connect to.
   * @param {String} collectionName The name of the collection where the users are stored.
   * @param {String} usernameName The name of the field that relates to the usernames in the collection.
   * @memberof DatabaseManagerMongo
   */
  setupDatabaseInformation (mongoUrl, databaseName, collectionName, usernameName) {
    this.mongoUrl = mongoUrl;
    this.databaseName = databaseName;
    this.collectionName = collectionName;
    this.usernameName = usernameName;
  }

  // Getters and Setters
  getMongoUrl () { return this.mongoUrl; };
  setMongoUrl (mongoUrl) { this.mongoUrl = mongoUrl; };

  getDatabaseName () { return this.databaseName; };
  setDatabaseName (databaseName) { this.databaseName = databaseName; };

  getCollectionName () { return this.collectionName; };
  setCollectionName (collectionName) { this.collectionName = collectionName; };

  getUsernameName () { return this.usernameName; };
  setUsernameName (usernameName) { this.usernameName = usernameName; };
}

module.exports = new DatabaseManagerMongo();
