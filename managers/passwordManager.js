"use strict";

/**
 *
 *
 * @class PasswordManager
 */
class PasswordManager {
  /**
   * Creates an instance of PasswordManager.
   * @memberof PasswordManager
   */
  constructor () {
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

    this.useDefaultRuleset = true;
  }

  /**
   * Updates the current ruleset as long as the newRuleset is not a boolean.
   * If it's a boolean then we know the user wants to use the default ruleset.
   * If not then we accept a ruleset object and update our current ruleset object
   *
   * @param {*} newRuleset
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
   * @param {*} passwordToCheck
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
