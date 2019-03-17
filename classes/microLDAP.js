"use strict";

/**
 * This will provide access to starting/pausing/stopping
 * the service as well as a way to ocrcestrate other functionality and features that can extend and enhance the base
 * feature set.
 *
 * This class also provides passthrough functions that are used to extend functionallity
 * while keeping the code base clean and tidy.
 *
 * @class MicroLDAP
 */
class MicroLDAP {
  constructor () {
    // Configuration Object
    this.configurationOptions = this.initializeDefaultConfiguration();

    this.checkTypes = require("../helpers/CheckTypes");
    this.passwordManager = require("../managers/PasswordManager");
    this.databaseManagerMongo = require("../managers/DatabaseManagerMongo");

    // Timer based variables
    this.timerReference = null;

    // List of usernames
    this.usernameList = [];

    this.start();
  }

  /**
   * Pass along all the needed information to all subclasses so they
   * all have the correct and default configuration options
   *
   * @memberof MicroLDAP
   */
  start () {
    this.passwordManager.setConfigurationOptions(this.configurationOptions);
    this.databaseManagerMongo.setConfigurationOptions(this.configurationOptions);
  }

  /**
   * Starts the Micro LDAP service
   *
   * Every time the timer has completed an interval
   * (Set by the serviceInterval value in the configuration options)
   * we check to see if a user's password has expired or not.
   *
   * @memberof MicroLDAP
   */
  startService () {
    // Start the service
    this.timerReference = setInterval(() => {
      // Check to see if a password has expired
      this.databaseManagerMongo.crawlTrackedCollection();
    }, this.configurationOptions.serviceInterval);
  }

  /**
   * Stops the service
   *
   * @memberof MicroLDAP
   */
  stopService () {
    clearInterval(this.timerReference);
  }

  /**
   * Initializes the default configuration object.
   *
   * @returns configurationOptions (The configuration object).
   * @memberof MicroLDAP
   */
  initializeDefaultConfiguration () {
    const configurationOptions = {
      existingMongoUsernameCollection: "Users",
      expirationTime: 30, // Measured in days
      serviceInterval: 86400000, // 24 hours in milliseconds
      passwordRules: {
        numberOfLowercase: 1,
        numberOfUppercase: 1,
        numberOfNumbers: 1,
        numberOfSpecialCharacters: 1,
        minimumLength: 8,
        maximumLength: 100
      },
      mongoDatabaseInformation: {
        mongoUrl: "mongodb://localhost:27017/microLDAP",
        databaseName: "microLDAP",
        collectionName: "Users",
        usernameName: "username",
        trackedCollectionName: "UserExpiration",
        ruleSet: "default"
      }
    };

    return configurationOptions;
  }

  /**
   * This lets the user configure the micro LDAP to suit their needs.
   * It also allows us to access the list of users we will be managing and
   * set some default timer lengths.
   *
   * @param {Object} newConfigurationOptions This object takes the following parameters:
   * - existingMongoUsernameCollection which is a String that represents the current Users collection name in the users database
   * - newMongoTrackedCollection which is a String that represents the new collections name where the users expiration and ruleset will be stored
   * - expirationTime which is a Number that represents the default expiration time for which a client will have to change their password
   * - useDefaultRuleset which is a Boolean which lets us know if the user wants to use the default ruleset or define their own
   * - serviceInterval which is a Number that represents the default interval the service runs at and checks the collection to see if anyone has expired
   * @memberof MicroLDAP
   */
  configureService (newConfigurationOptions) {
    // Check to make sure the parameters passed in are of the correct type
    // If they are not of the correct type then the checkTypes function will throw an error
    this.checkConfigurationValues(newConfigurationOptions);

    this.configurationOptions = newConfigurationOptions;

    // Now we need to pass on these configurations to their respective classes
    this.passwordManager.setConfigurationOptions(this.configurationOptions);
    this.databaseManagerMongo.setConfigurationOptions(this.configurationOptions);
  }

  checkConfigurationValues (newConfigurationOptions) {
    this.checkTypes(newConfigurationOptions.existingMongoUsernameCollection, String);
    this.checkTypes(newConfigurationOptions.expirationTime, Number);
    this.checkTypes(newConfigurationOptions.useDefaultRuleset, Boolean);
    this.checkTypes(newConfigurationOptions.serviceInterval, Number);
  }
}

module.exports = new MicroLDAP();
