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
    this.database = { databaseObject: null, db: null };
    this.isDbConnected = false;

    this.configurationOptions = null;
  }

  initializeDatabaseConnection (callback) {
    this.mongoClient.connect(this.configurationOptions.mongoDatabaseInformation.mongoUrl, { useNewUrlParser: true }, (err, db) => {
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
    const usernameName = this.configurationOptions.mongoDatabaseInformation.usernameName;

    await this.database.databaseObject.collection(this.configurationOptions.mongoDatabaseInformation.collectionName).find({}, { usernameName: 1, _id: 0 }).forEach((document, error) => {
      if (error) {
        console.error(error);
        this.isDatabaseReadyForQuery();
      }

      usernameList.push(document.username);
    });

    return usernameList;
  }

  /**
   * This adds the specified username to the tracked collection that this
   * service manages. This only adds a single username to the collection
   *
   * @param {String} userToAdd The username to be added to the tracked collection. It will follow the
   * configuration options that have already been set such as the expiration date and the ruleset it should
   * follow for passwords.
   * @memberof DatabaseManagerMongo
   */
  async addToTrackedCollection (userToAdd) {
    const currentDate = new Date();
    const expirationDateMillis = currentDate.setDate(currentDate.getDate() + this.configurationOptions.defaultExpirationTime);
    const expirationDate = new Date(expirationDateMillis);

    const newTrackedUser = {
      username: userToAdd,
      expirationDate: expirationDate,
      ruleset: this.configurationOptions.mongoDatabaseInformation.ruleSet
    };

    await this.database.databaseObject.collection(this.configurationOptions.mongoDatabaseInformation.trackedCollectionName).insertOne(newTrackedUser, (err) => {
      if (err) {
        console.error(err);
        this.isDatabaseReadyForQuery();
      }
    });
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

  getConfigurationOptions () { return this.configurationOptions; };
  setConfigurationOptions (configurationOptions) { this.configurationOptions = configurationOptions; };
}

module.exports = new DatabaseManagerMongo();
