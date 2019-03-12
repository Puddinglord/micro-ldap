"use strict";

/**
 * This class manages all of the password functionallity such as checking the password
 * to make sure it's following the ruleset and so on.
 *
 * @class PasswordManager
 */
class PasswordManager {
  constructor () {
    this.configurationOptions = null;
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
    if (passwordToCheck.length <= this.configurationOptions.passwordRules.minimumLength || passwordToCheck.length >= this.configurationOptions.passwordRules.maximumLength) {
      returnValue = false;
    }

    // Check to see if the password has the required number of lowercase characters
    if (this.configurationOptions.passwordRules.requireLowercase) {
      const regexTest = /(.*[a-z]){1}/g;

      if (!regexTest.test(passwordToCheck)) {
        returnValue = false;
      }
    }

    // Check to see if the password has the required number of uppercase characters
    if (this.configurationOptions.passwordRules.requireUppercase) {
      const regexTest = /(.*[A-Z]){1}/g;

      if (!regexTest.test(passwordToCheck)) {
        returnValue = false;
      }
    }

    // Check to see if the password has the required number of lowercase characters
    if (this.configurationOptions.passwordRules.requireNumber) {
      const regexTest = /(.*[0-9]){1}/g;

      if (!regexTest.test(passwordToCheck)) {
        returnValue = false;
      }
    }

    // Check to see if the password has the required number of lowercase characters
    if (this.configurationOptions.passwordRules.requireSpecialCharacter) {
      const regexTest = /(.*[#$@!%&*?]){1}/g;

      if (!regexTest.test(passwordToCheck)) {
        returnValue = false;
      }
    }

    return returnValue;
  }

  // Getters and Setters
  getConfigurationOptions () { return this.configurationOptions; };
  setConfigurationOptions (configurationOptions) { this.configurationOptions = configurationOptions; };
}

module.exports = new PasswordManager();
