import { firestore } from "../../../../../firebase";

const deleteGame = async (req, res) => {
  try {
    const { gameId } = req.query;

    await firestore.doc(`games/${gameId}`).update({
      deleted: true,
      updateAt: new Date(),
    });

    return res.send({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: error?.message ?? "Something went wrong" });
  }
};

export default deleteGame;

