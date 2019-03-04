"use strict";

/**
 * This class manages all of the password functionallity such as checking the password
 * to make sure it's following the ruleset and so on.
 *
 * @class PasswordManager
 */
class PasswordManager {
  constructor () {
    this.defaultRuleset = this.initializeDefaultRuleset();
    this.currentRuleset = this.initializeCurrentRuleset();

    this.useDefaultRuleset = true;
  }

  initializeDefaultRuleset () {
    this.defaultRuleset = {
      requireLowercase: true,
      numberOfLowercase: 1,
      requireUppercase: true,
      numberOfUppercase: 1,
      requireNumber: true,
      numberOfNumbers: 1,
      requireSpecialCharacter: true,
      numberOfSpecialCharacters: 1,
      minimumLength: 8,
      maximumLength: 100
    };
  }

  initializeCurrentRuleset () {
    this.currentRuleset = {
      requireLowercase: null,
      numberOfLowercase: null,
      requireUppercase: null,
      numberOfUppercase: null,
      requireNumber: null,
      numberOfNumbers: null,
      requireSpecialCharacter: null,
      numberOfSpecialCharacters: null,
      minimumLength: null,
      maximumLength: null
    };
  }

  /**
   * Updates the current ruleset as long as the newRuleset is not a boolean.
   * If it's a boolean then we know the user wants to use the default ruleset.
   * If not then we accept a ruleset object and update our current ruleset object
   *
   * @param {Boolean | Object} newRuleset If it's a boolean then we know the user wants to use the default
   * ruleset. If not then it must be an object which we will take as our new current ruleset.
   * @memberof PasswordManager
   */
  updateRuleset (newRuleset) {
    if (newRuleset) {
      this.useDefaultRuleset = true;
      this.currentRuleset = this.defaultRuleset;
    } else {
      this.useDefaultRuleset = false;
      this.currentRuleset = newRuleset;
    }
  }

  /**
   * Checks the password against the current ruleset to make sure it conforms to it.
   * If it does then we simply return true.
   * If not then we return false.
   *
   * @param {String} passwordToCheck The plain-text password that needs to be checked to make sure it's
   * complying with the current ruleset.
   * @memberof PasswordManager
   */
  checkPassword (passwordToCheck) {
    let returnValue = true;

    // Check to see if the password minimum and maximum length are ok or not
    if (passwordToCheck.length <= this.currentRuleset.minimumLength || passwordToCheck.length >= this.currentRuleset.maximumLength) {
      returnValue = false;
    }

    // Check to see if the password has the required number of lowercase characters
    if (this.currentRuleset.requireLowercase) {
      const regexTest = /(.*[a-z]){1}/g;

      if (!regexTest.test(passwordToCheck)) {
        returnValue = false;
      }
    }

    // Check to see if the password has the required number of uppercase characters
    if (this.currentRuleset.requireUppercase) {
      const regexTest = /(.*[A-Z]){1}/g;

      if (!regexTest.test(passwordToCheck)) {
        returnValue = false;
      }
    }

    // Check to see if the password has the required number of lowercase characters
    if (this.currentRuleset.requireNumber) {
      const regexTest = /(.*[0-9]){1}/g;

      if (!regexTest.test(passwordToCheck)) {
        returnValue = false;
      }
    }

    // Check to see if the password has the required number of lowercase characters
    if (this.currentRuleset.requireSpecialCharacter) {
      const regexTest = /(.*[#$@!%&*?]){1}/g;

      if (!regexTest.test(passwordToCheck)) {
        returnValue = false;
      }
    }

    return returnValue;
  }
}

module.exports = new PasswordManager();
