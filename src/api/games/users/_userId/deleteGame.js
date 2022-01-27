import { firestore } from "../../../../firebase";

export const deleteGame = async (req, res) => {
  try {
    console.log("deleteGame->", req.params, req.query, req.body);

    const { gameId } = req.params;

    await firestore.doc(`games/${gameId}`).update({
      deleted: true,
      updateAt: new Date()
    });

    return res.send({ success: true });
  } catch (error) {
    console.error(error);
  }
};

