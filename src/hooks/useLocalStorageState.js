import { createLocalStorageStateHook } from "use-local-storage-state";
import defaultTo from "lodash/defaultTo";
import get from "lodash/get";
import isArray from "lodash/isArray";
import isObject from "lodash/isObject";
import map from "lodash/map";
import mapValues from "lodash/mapValues";
import firebase from "firebase";

export const useUser = createLocalStorageStateHook("user", null);

export const useSettings = createLocalStorageStateHook("settings", {});

export const useLocation = createLocalStorageStateHook("location", {});

export const useLanguageCode = createLocalStorageStateHook("languageCode", "es");

export const useChats = createLocalStorageStateHook("chats", []);

export const useEnvironment = createLocalStorageStateHook("environment", "");

export const timeToString = (collection) =>
  isArray(collection) ? map(defaultTo(collection, []), (value) => toString(value)) : toString(collection);

const toString = (collection) =>
  mapValues(defaultTo(collection, {}), (value) => (get(value, "seconds") ? value.toDate().toJSON() : value));

export const collectionToDate = (collection) =>
  isArray(collection)
    ? map(defaultTo(collection, []), (value) =>
        isArray(value) ? collectionToDate(value) : isObject(value) ? objectToDate(value) : value
      )
    : objectToDate(collection);

const objectToDate = (collection) =>
  mapValues(defaultTo(collection, {}), (value) =>
    isArray(value) ? collectionToDate(value) : get(value, "seconds") ? toDate(value) : value
  );

const toDate = (value) => new firebase.firestore.Timestamp(value.seconds, value.nanoseconds);
