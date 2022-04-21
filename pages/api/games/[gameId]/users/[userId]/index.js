import postGame from "../../../../../../src/api/games/_gameId/users/_userId/postGame";
import putGame from "../../../../../../src/api/games/_gameId/users/_userId/putGame";
import deleteGame from "../../../../../../src/api/games/_gameId/users/_userId/deleteGame";
import Cors from "cors";
import initMiddleware from "../../../../../../lib";

// Initialize the cors middleware
const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
  })
);

const apiGame = async (req, res) => {
  // Run cors
  await cors(req, res);

  switch (req.method) {
    case "POST":
      return await postGame(req, res);
    case "PUT":
      return await putGame(req, res);
    case "DELETE":
      return await deleteGame(req, res);
    default:
      return res.status(500).send({ error: "Method is not defined" });
  }
};

export default apiGame;
