import getGames from "../../../../../src/api/games/users/_userId/getGames";
import Cors from "cors";
import initMiddleware from "../../../../../lib";
import { deleteGame } from "../../../../../src/api/games/users/_userId/deleteGame";

// Initialize the cors middleware
const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    origin: "*",
    // Only allow requests with GET, POST and OPTIONS
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  })
);

const apiGame = async (req, res) => {
  // Run cors
  await cors(req, res);

  switch (req.method) {
    case "GET":
      return await getGames(req, res);
    case "DELETE":
      return await deleteGame(req, res);
    default:
      return res.status(500).send({ error: "Method is not defined" });
  }
};

export default apiGame;
