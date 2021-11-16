import { firestore } from "../../../../../firebase";

const putGame = async (req, res) => {
  try {
    const { gameId, userId } = req.query;
    const game = req.body;

    await firestore.doc(`games/${gameId}`).update({
      ...game,
      updateAt: new Date(),
    });

    return res.send({ success: true });
  } catch (error) {
    res.status(500).send({ error: "Something went wrong" });
  }
};

export default putGame;
