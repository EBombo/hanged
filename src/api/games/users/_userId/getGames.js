import { firestore } from "../../../../firebase";
import { snapshotToArray } from "../../../../utils/snapshotToArray";

const getGames = async (req, res) => {
  try {
    const { userId, folderId } = req.query;

    let gamesRef = firestore
      .collection("games")
      .where("usersIds", "array-contains", userId)
      .where("deleted", "==", false);

    if (folderId) gamesRef = gamesRef.where("parentId", "==", folderId);

    const gamesQuery = await gamesRef.get();

    let games = snapshotToArray(gamesQuery);

    games = games.map((game) => ({
      ...game,
      createAt: game.createAt.toDate().toString(),
      updateAt: game.updateAt.toDate().toString(),
    }));

    return res.send(games);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: error?.message ?? "Something went wrong" });
  }
};

export default getGames;
