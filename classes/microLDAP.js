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

  configureService (existingMongoUsernameCollection, newMongoRulesetCollection = "UsersExpirationAndRulesets", defaultExpirationTime = 30,
    useDefaultRuleset = true, defaultServiceInterval = 86400000) {
    // Check to make sure the parameters passed in are of the correct type
    // If they are not of the correct type then the checkTypes function will throw an error
    this.checkTypes(existingMongoUsernameCollection, String);
    this.checkTypes(newMongoRulesetCollection, String);
    this.checkTypes(defaultExpirationTime, Number);
    this.checkTypes(useDefaultRuleset, Boolean);
    this.checkTypes(defaultServiceInterval, Number);

    this.existingMongoUsernameCollection = existingMongoUsernameCollection;
    this.newMongoRulesetCollection = newMongoRulesetCollection;
    this.defaultExpirationTime = defaultExpirationTime;
    this.useDefaultRuleset = useDefaultRuleset;
    this.defaultServiceInterval = defaultServiceInterval;
  }

  test () {
    console.log("test");
  }
}

module.exports = new MicroLDAP();
