import { storage as storageDefault } from "../firebase";
import get from "lodash/get";

const buckets = {
  defaultStorage: storageDefault,
};

const secondsByDay = 86400;

export const useUploadToStorage = () => {
  const uploadToStorageAndGetURL = (file, path, fileName, fileSuffix, bucket, maxAgeDays = 7, type) =>
    new Promise((resolve) => {
      const storage = get(buckets, `${bucket}`, "defaultStorage");

      const uploadTask = type.includes("image")
        ? storage.ref(`${path}/${fileName}.${fileSuffix}`).putString(file, "base64", {
            contentType: type,
            cacheControl: `public,max-age=${+maxAgeDays * secondsByDay}`,
          })
        : storage.ref(`${path}/${fileName}.${fileSuffix}`).put(file);

      uploadTask.on(
        "state_changed",
        (snapshot) => console.log("snapshot", snapshot),
        (error) => console.log(error),
        async () => {
          const _fileUrl = await storage.ref(`/${path}`).child(`${fileName}.${fileSuffix}`).getDownloadURL();

          resolve(_fileUrl);
        }
      );
    });

  return {
    uploadToStorageAndGetURL: (file, path, fileName, fileSuffix, bucket = "defaultStorage", maxAgeDays, type) =>
      uploadToStorageAndGetURL(file, path, fileName, fileSuffix, bucket, maxAgeDays, type),
  };
};
