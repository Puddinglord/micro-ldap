"use strict";

class DatabaseManager {
  constructor () {
    this.databaseReference = null;
  }

  setDatabaseReference (databaseReference) {
    this.databaseReference = databaseReference;
  }
}

module.exports = new DatabaseManager();
