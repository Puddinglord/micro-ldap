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

  /**
   * Initializes the database connection. Also provides a callback so the caller can tell
   * when the database has connected as it is not instantaneous.
   *
   * @param {Function} callback
   * @memberof DatabaseManagerMongo
   */
  initializeDatabaseConnection (callback) {
    this.mongoClient.connect(this.configurationOptions.mongoDatabaseInformation.mongoUrl, { useNewUrlParser: true }, (err, db) => {
      if (err) {
        console.error(err);
      } else {
        this.database.db = db;
        this.database.databaseObject = db.db(this.databaseName);
        this.isDbConnected = true;
        callback();
      }
    });
  }

  /**
   * Checks to see if the database is connected or not.
   * If we are connected then we just return with a true value
   * (since the database hasn't disconnected it will be true).
   * If the database isn't connected then we reconnect it.
   *
   * @returns isDbConnected (Boolean)
   * @memberof DatabaseManagerMongo
   */
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
    const expirationDateMillis = currentDate.setDate(currentDate.getDate() + this.configurationOptions.expirationTime);
    const expirationDate = new Date(expirationDateMillis);

    const newTrackedUser = {
      username: userToAdd,
      expirationDate: expirationDate,
      expired: false,
      ruleset: this.configurationOptions.mongoDatabaseInformation.ruleSet
    };

    await this.database.databaseObject.collection(this.configurationOptions.mongoDatabaseInformation.trackedCollectionName).insertOne(newTrackedUser, (err) => {
      if (err) {
        console.error(err);
        this.isDatabaseReadyForQuery();
      }
    });
  }

  /**
   * Crawls the tracked collection and for every username we find we check to see if the
   * user has an expired password or not.
   *
   * @memberof DatabaseManagerMongo
   */
  async crawlTrackedCollection () {
    // We are using the usernameName varaible to query the database but ESLint doesn't think so hence disabling the next line
    // eslint-disable-next-line no-unused-vars
    const usernameName = this.configurationOptions.mongoDatabaseInformation.usernameName;

    await this.database.databaseObject.collection(this.configurationOptions.mongoDatabaseInformation.trackedCollectionName).find({}).forEach((document, error) => {
      if (error) {
        console.error(error);
        this.isDatabaseReadyForQuery();
      }

      this.checkIfExpired(document);
    });
  }

  /**
   * Checks to see if the current date is less than the documents expiration date.
   * If so then everything is good and we don't need to do anything. If not then
   * we need to mark the user as expired.
   *
   * @param {JSON} document
   * @memberof DatabaseManagerMongo
   */
  checkIfExpired (document) {
    const currentDate = new Date();

    if (currentDate.getTime() < document.expirationDate.getTime()) {
      // The password has not yet expired so we are good
    } else {
      // The password has expired so we need to mark the user as expired (password wise)
      this.markUserAsExpired(document.username);
    }
  }

  /**
   * Updates one document in the tracked collection to be expired by setting the expired
   * element to true.
   *
   * @param {String} username
   * @memberof DatabaseManagerMongo
   */
  async markUserAsExpired (username) {
    const query = { username: username };
    const valueToUpdate = { $set: { expired: true } };

    await this.database.databaseObject.collection(this.configurationOptions.mongoDatabaseInformation.trackedCollectionName).updateOne(query, valueToUpdate, (error) => {
      if (error) {
        console.error(error);
      }
    });
  }

  // Getters and Setters
  getConfigurationOptions () { return this.configurationOptions; };
  setConfigurationOptions (configurationOptions) { this.configurationOptions = configurationOptions; };
}

module.exports = new DatabaseManagerMongo();
