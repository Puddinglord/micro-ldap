"use strict";

const name = require("../index");

name.test();

let newConfigurationOptions = {
  existingMongoUsernameCollection: "Users",
  newMongoRulesetCollection: "UsersExpirationAndRulesets",
  defaultExpirationTime: 30,
  useDefaultRuleset: true,
  defaultServiceInterval: 86400000
};

name.configureService(newConfigurationOptions);
