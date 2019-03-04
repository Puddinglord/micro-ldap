"use strict";

/**
 * This will provide access to starting/pausing/stopping
 * the service as well as a way to ocrcestrate other functionality and features that can extend and enhance the base
 * feature set.
 *
 * @class microLDAP
 */
class MicroLDAP {
  constructor () {
    this.checkTypes = require("../helpers/checkTypes");

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

  startService () {
    // Start the service
    this.timerReference = setInterval(() => {
      // Do things in here
    }, this.defaultServiceInterval);
  }

  stopService () {
    // Stop the service
    clearInterval(this.timerReference);
  }

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
  }

  test () {
    console.log("test");
  }
}

module.exports = new MicroLDAP();
