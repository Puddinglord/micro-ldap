# micro-ldap

There is a time and place to integrate with a full LDAP but it is not this day, this day we micro service! If you need a full LDAP then this is not for you. If you just want a way to manage the expiration of passwords and other small stuff then boy do I have a deal for you!

For the super low price of free you can use everything here!

The follow features are included with more to come in future releases:

- Configure the service (Now you don't have to rename your collections!)
- Adding users to the tracked collection
- Going over said tracked collection every `serviceInteral` hours/days/whenever you want
- The ability to start (and stop) the service
- Check passwords against either the default rules or the ones you set

**Notice** *This package only work with MongoDB as of the current build! Support for more databases will come in the future!*

## Sweet Badges

[![codebeat badge](https://codebeat.co/badges/ac548d3c-ee04-495f-8931-04ab50b8e010)](https://codebeat.co/projects/github-com-puddinglord-micro-ldap-master)

## How to Install

``` JavaScript
npm i micro-ldap
```

## Usage

To use this package effetively you should probabaly do the following.

First require the package in your project like so:

``` JavaScript
let microLDAP = require('micro-ldap');
```

Once that is done the object will have some default values already provided for easy and quick use. You are not required to keep these values and can ovveride them if you wish.

The defaults are set up like this:

``` JavaScript
const configurationOptions = {
  existingMongoUsernameCollection: "Users",
  expirationTime: 30, // Measured in days
  serviceInterval: 86400000, // 24 hours in milliseconds
  passwordRules: {
    numberOfLowercase: 1,
    numberOfUppercase: 1,
    numberOfNumbers: 1,
    numberOfSpecialCharacters: 1,
    minimumLength: 8,
    maximumLength: 100
  },
  mongoDatabaseInformation: {
    mongoUrl: "mongodb://localhost:27017/microLDAP",
    databaseName: "microLDAP",
    collectionName: "Users",
    usernameName: "username",
    trackedCollectionName: "UserExpiration",
    ruleSet: "default"
  }
};
```

If you want to use your own values or the values procided don't match what you have in your database then it is really easy to set custom ones! All you have to do is create an object thats a copy of the one above and just change the values to your liking. Once you do that just call the micro-ldap object and use the `configureService(newConfigurationObject)` method and pass in the object with the new values you just created.

Let's break down these values!

- `existingMongoUsernameCollection: "Users"`
  - The name of the collection already in your database where your usernames are stored.

- `expirationTime: 30`
  - When we add a user to the tracked collection we add this many days to the current date. So with this number we would expire the users password 30 days from today.

- `serviceInterval: 86400000`
  - The interval when completed will check the tracked collection and mark any users expired if the current date is greater than the expiration date.

- `useDefaultRuleset: true`
  - Let's the service know if it is using the default values or not.

- `passwordRules.numberOfLowercase`
  - The **minimum** number of lowercase character(s) required for a password to be acceptable.

- `passwordRules.numberOfUppercase`
  - The **minimum** number of uppercase character(s) required for a password to be acceptable.

- `passwordRules.numberOfNumbers`
  - The **minimum** number of numbers required for a password to be acceptable.

- `passwordRules.numberOfSpecialCharacters`
  - The **minimum** number of special characters required for a password to be acceptable.

- `passwordRules.minimumLength`
  - The **minimum** number of characters required for a password to be acceptable.

- `passwordRules.maximumLength`
  - The **maximum** number of characters allowed for a password to be acceptable.

- `mongoDatabaseInformation.mongoUrl`
  - The URL used to connect to the mongoDB server.

- `mongoDatabaseInformation.databaseName`
  - The name of the database to use within the mongoDB server.

- `mongoDatabaseInformation.collectionName`
  - The name of the collection where the original usernames are stored.

- `mongoDatabaseInformation.usernameName`
  - The name of the field that is used to describe the username. Normally this would just be `username: Puddinglord`. So in this case the usernameName would be set to `username`.

- `mongoDatabaseInformation.trackedCollectionName`
  - The name of the new collection that this service will create and maintain.

- `mongoDatabaseInformation.ruleSet`
  - A boolean value that tells the service if you are using the default password ruleset or are using a custom one. If you change anything in the password rules please update this to the value of `"custom"`.

After all that configuration is done we can actually start the service. Please refer to the section below on how to start the service. Right now though we will go into how the service will let you know when someone has an expired password.

Currently the tracked collection will have a field called "expired". When a user is first added to the tracked collection that field is set to false. Once then service runs for the first time, if it see's anyone is past their expiration date then it will mark that field as "true".

Right now it's up to the developer (*cough cough* meaning you) to read this field when a user tries to login. If the field is true then you can give them a change password prompt or whatever you want really.

## Starting the Service

As noted in the configuration options there is a value called `serviceInterval`. When you have configured the service to your liking and are ready to have it do all the dirty work just call `microLDAP.start()`. This will start the service as an interval which has a timeout value that was set in the configuration options. By default the service will run itself every 24 hours.

***Note***: **Please make sure you set at least the database values in the configuration options. I highly doubt we both use the same values for everything.**

## Important Notes

Please make sure that you mark the tracked collection with a unique username field. I know that usernames should be unique anyways but marking the field as unique in the collection makes everything easier.

## Extras

If you have any problems or need something added please feel free to make an issue and I will take a look!

A full suite of unit tests will be coming soon.