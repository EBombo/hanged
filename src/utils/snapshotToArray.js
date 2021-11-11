export const snapshotToArray = (snapshot) => {
  const returnArray = [];
  snapshot.forEach((childSnapshot) => returnArray.push(childSnapshot.data()));
  return returnArray;
};
