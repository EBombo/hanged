import { firestore } from "../../../../../firebase";

const postGame = async (req, res) => {
  try {
    const { userId } = req.params;
    const game = req.body;
    const gamesRef = firestore.collection("games");
    const gameId = game.id;

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
    res.status(500).send({ error: "Something went wrong" });
  }
};

export default postGame;
