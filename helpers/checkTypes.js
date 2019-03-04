"use strict";

module.exports = function checkType (value, type, i) {
  // perform the appropiate test to the passed
  // value according to the provided type
  switch (type) {
    case Boolean :
      if (typeof value === "boolean") return true;
      break;
    case String :
      if (typeof value === "string") return true;
      break;
    case Number :
      if (typeof value === "number") return true;
      break;
    default :
      throw new Error("TypeError : Unknown type provided in argument");
  }
  // test didn't succeed , throw error
  throw new Error(`TypeError : Expecting a ${type.name} in argument`);
};
