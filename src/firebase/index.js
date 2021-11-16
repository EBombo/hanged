import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/analytics";
import "firebase/storage";
import "firebase/database";
import "firebase/auth";
import configJson from "./config.json";
import isEmpty from "lodash/isEmpty";

const DOMAIN = process.env.DOMAIN ?? "localhost:3001";
console.log("process.env.DOMAIN", DOMAIN);

const ENVIRONMENT = process.env.ENV ?? "development";
console.log("process.env.ENV", ENVIRONMENT);

const version = "0.0.1";

const hostName = typeof window === "undefined" ? "" : window.location.hostname.replace("subdomain.", "");

let config;

let firestore;
let storage;
let auth;
let analytics;
let database;

let analyticsEvents;
let firestoreEvents;
let storageEvents;
let authEvents;

let firestoreBomboGames;

if (environment?.includes("production")) {
  config = configJson.production;

  console.log("prod", version);
} else {
  config = configJson.development;

  console.log("dev", version);
}

if (isEmpty(firebase.apps)) {
  // Default connection.
  try {
    console.log("initializeApp", isEmpty(firebase.apps));
    firebase.initializeApp(config.firebase);

    firestore = firebase.firestore();
    database = firebase.database();
    storage = firebase.storage();
    auth = firebase.auth();

    if (typeof window !== "undefined") analytics = firebase.analytics();

    firestore.settings({ ignoreUndefinedProperties: true });
  } catch (error) {
    console.error("error initializeApp", error);
  }
  // Events connection.
  try {
    firebase.initializeApp(config.firebaseEvents, "events");
    firestoreEvents = firebase.app("events").firestore();
    storageEvents = firebase.app("events").storage();
    authEvents = firebase.app("events").auth();

    if (typeof window !== "undefined") {
      analyticsEvents = firebase.app("events").analytics();
    }

    firestoreEvents.settings({ ignoreUndefinedProperties: true });
  } catch (error) {
    console.error("error initializeApp", error);
  }
  // Allow connection with bombo-games firebase
  try {
    firebase.initializeApp(config.firebaseBomboGames, "bombo-games");
    firestoreBomboGames = firebase.app("bombo-games").firestore();

    firestoreBomboGames.settings({ ignoreUndefinedProperties: true });
  } catch (error) {
    console.error("error initializeApp", error);
  }
}

if (DOMAIN?.includes("localhost")) {
  //config.serverUrl = config.serverUrlLocal;
  //firestore.useEmulator("localhost", 8080);
  //auth.useEmulator("http://localhost:9099/");
}

export {
  analyticsEvents,
  firestoreEvents,
  firestoreBomboGames,
  storageEvents,
  authEvents,
  firestore,
  analytics,
  database,
  firebase,
  hostName,
  version,
  storage,
  config,
  auth,
};
