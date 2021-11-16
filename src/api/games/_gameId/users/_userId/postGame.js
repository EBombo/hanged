import { firestore } from "../../../../../firebase";

const postGame = async (req, res) => {
  try {
    const { userId } = req.query;
    const game = req.body;

    const gamesRef = firestore.collection("games");
    const gameId = gamesRef.doc().id();

    await gamesRef.doc(gameId).set({
      ...game,
      id: gameId,
      usersIds: [userId],
      createAt: new Date(),
      updateAt: new Date(),
      deleted: false,
    });

    return res.send({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error?.message ?? "Something went wrong" });
  }
};

export default postGame;
