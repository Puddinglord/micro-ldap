"use strict";

/**
 * This class provides access to the mongo database that contains the list of
 * usernames that we will be managing.
 *
 * @class DatabaseManagerMongo
 */
class DatabaseManagerMongo {
  constructor () {
    this.mongoClient = null;
    this.mongoUrl = null;
    this.databaseName = null;
    this.collectionName = null;
    this.usernameName = null;
    this.database = { databaseObject: null, db: null };
    this.isDbConnected = false;
  }

  async initializeDatabaseConnection () {
    if (!this.isDbConnected) {
      await this.mongoClient.connect(this.mongoUrl, { useNewUrlParser: true }, (err, db) => {
        if (err) {
          console.error(err);
        } else {
          this.database.db = db;
          this.database.databaseObject = db.db(this.databaseName);
          this.isDbConnected = true;
        }
      });
    }
  }

  async isDatabaseReadyForQuery () {
    if (!this.isDbConnected) {
      await this.initializeDatabaseConnection();
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

    await this.isDatabaseReadyForQuery.then((result) => {
      if (result) {
        this.database.databaseObject.collection(this.collectionName).find({}, { usernameName: 1, _id: 0 }).forEach((document, error) => {
          if (error) {
            console.error(error);
          }

          usernameList.push(document);
        });
      }
    });

    return usernameList;
  }

  // Getters and Setters
  getMongoClient () { return this.mongoClient; };
  setMongoClient (mongoClient) { this.mongoClient = mongoClient; };

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
