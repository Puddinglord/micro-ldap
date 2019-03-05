"use strict";

let name = require("../index");

// let newConfigurationOptions = {
//   existingMongoUsernameCollection: "Users",
//   newMongoRulesetCollection: "UsersExpirationAndRulesets",
//   defaultExpirationTime: 30,
//   useDefaultRuleset: true,
//   defaultServiceInterval: 86400000
// };

// name.configureService();

console.log(name.checkPassword("Aa5%"));

name.setupDatabaseInformation("mongodb://localhost:27017/microLDAP", "microLDAP", "Users", "username");

name.databaseManagerMongo.initializeDatabaseConnection(callbackInit);

function callbackInit () {
  name.databaseManagerMongo.findAllUsers().then((result) => {
    console.log(JSON.stringify(result, undefined, 2));
    console.log("Done");
    process.exit();
  });
}

// function callbackGetUsers (usernameList) {
//   console.log("In get users callback");
//   console.log(JSON.stringify(usernameList, undefined, 2));
// }
