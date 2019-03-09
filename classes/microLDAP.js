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
    this.checkTypes = require("../helpers/CheckTypes");
    this.passwordManager = require("../managers/PasswordManager");
    this.databaseManagerMongo = require("../managers/DatabaseManagerMongo");

    // Configuration Object
    this.configurationOptions = {
      existingMongoUsernameCollection: "Users",
      newMongoRulesetCollection: "UserExpiration",
      defaultExpirationTime: 30, // Measured in days
      useDefaultRuleset: true,
      defaultServiceInterval: 86400000 // 24 hours in milliseconds
    };

    // Timer based variables
    this.timerReference = null;

    // List of usernames
    this.usernameList = [];
  }

  /**
   * Starts the Micro LDAP service
   *
   * @memberof MicroLDAP
   */
  startService () {
    // Start the service
    this.timerReference = setInterval(() => {
      // Check to see if a password has expired
    }, this.defaultServiceInterval);
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
   * This lets the user configure the micro LDAP to suit their needs.
   * It also allows us to access the list of users we will be managing and
   * set some default timer lengths.
   *
   * @param {Object} newConfigurationOptions This object takes the following parameters:
   * - existingMongoUsernameCollection which is a String that represents the current Users collection name in the users database
   * - newMongoRulesetCollection which is a String that represents the new collections name where the users expiration and ruleset will be stored
   * - defaultExpirationTime which is a Number that represents the default expiration time for which a client will have to change their password
   * - useDefaultRuleset which is a Boolean which lets us know if the user wants to use the default ruleset or define their own
   * - defaultServiceInterval which is a Number that represents the default interval the service runs at and checks the collection to see if anyone has expired
   * @memberof MicroLDAP
   */
  configureService (newConfigurationOptions) {
    // Check to make sure the parameters passed in are of the correct type
    // If they are not of the correct type then the checkTypes function will throw an error
    this.checkTypes(newConfigurationOptions.existingMongoUsernameCollection, String);
    this.checkTypes(newConfigurationOptions.newMongoRulesetCollection, String);
    this.checkTypes(newConfigurationOptions.defaultExpirationTime, Number);
    this.checkTypes(newConfigurationOptions.useDefaultRuleset, Boolean);
    this.checkTypes(newConfigurationOptions.defaultServiceInterval, Number);

    this.configurationOptions.existingMongoUsernameCollection = newConfigurationOptions.existingMongoUsernameCollection;
    this.configurationOptions.newMongoRulesetCollection = newConfigurationOptions.newMongoRulesetCollection;
    this.configurationOptions.defaultExpirationTime = newConfigurationOptions.defaultExpirationTime;
    this.configurationOptions.useDefaultRuleset = newConfigurationOptions.useDefaultRuleset;
    this.configurationOptions.defaultServiceInterval = newConfigurationOptions.defaultServiceInterval;

    // Now we need to pass on these configurations to their respective classes
    // this.passwordManager.updateRuleset(this.configurationOptions.useDefaultRuleset);
    this.databaseManagerMongo.setConfigurationOptions(this.configurationOptions);
  }
}

module.exports = new MicroLDAP();
