import getGames from "../../../../../src/api/games/users/_userId/getGames";

const apiGame = async (req, res) => {
  switch (req.method) {
    case "GET":
      return await getGames(req, res);
    default:
      return res.status(500).send({ error: "Method is not defined" });
  }
};

export default apiGame;
