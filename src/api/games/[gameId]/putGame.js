import { firestore } from "../../../firebase";

const putGame = async (req, res, next) => {
  try {
    const game = req.body;

    await firestore.doc(`games/${game.id}`).update({
      ...game,
      updateAt: new Date(),
    });

    return res.send({ success: true });
  } catch (error) {
    next(error);
  }
};

export default putGame;
