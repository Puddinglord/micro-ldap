"use strict";

let name = require("../index");

console.log(name.passwordManager.checkPassword("Aa5%"));

name.databaseManagerMongo.initializeDatabaseConnection(callbackInit);

function callbackInit () {
  name.databaseManagerMongo.findAllUsers().then((result) => {
    console.log(JSON.stringify(result, undefined, 2));
    console.log("Done getting users");

    const newTrackedUser = result[0];

    console.log(newTrackedUser);

    name.databaseManagerMongo.addToTrackedCollection(newTrackedUser);

    name.databaseManagerMongo.crawlTrackedCollection().then(() => {
      setTimeout(() => {
        process.exit();
      }, 3000);
    });
  });
}
