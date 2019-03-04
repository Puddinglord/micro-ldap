"use strict";

/**
 * This will provide access to starting/pausing/stopping
 * the service as well as a way to ocrcestrate other functionality and features that can extend and enhance the base
 * feature set.
 *
 * @class microLDAP
 */
class MicroLDAP {
  /**
   * Creates an instance of MicroLDAP.
   * @memberof MicroLDAP
   */
  constructor () {
    this.checkTypes = require("../helpers/checkTypes");
    this.passwordManager = require("../managers/passwordManager");

    this.configurationOptions = {
      existingMongoUsernameCollection: null,
      newMongoRulesetCollection: "UsersExpirationAndRulesets",
      defaultExpirationTime: 30,
      useDefaultRuleset: true,
      defaultServiceInterval: 86400000
    };

    // Configuration variables
    this.existingMongoUsernameCollection = null;
    this.newMongoRulesetCollection = null;
    this.defaultExpirationTime = null;
    this.useDefaultRuleset = null;
    this.defaultServiceInterval = null;

    // Timer based variables
    this.timerReference = null;
  }

  /**
   *
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
   *
   *
   * @memberof MicroLDAP
   */
  stopService () {
    // Stop the service
    clearInterval(this.timerReference);
  }

  /**
   *
   *
   * @param {*} newConfigurationOptions
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
    this.passwordManager.updateRuleset(this.configurationOptions.useDefaultRuleset);
  }

  /**
   *
   *
   * @param {*} passwordToCheck
   * @returns Boolean
   * @memberof MicroLDAP
   */
  checkPassword (passwordToCheck) {
    return this.passwordManager.checkPassword(passwordToCheck);
  }
}

module.exports = new MicroLDAP();
