import Cors from "cors";
import initMiddleware from "../../../../../../lib";
import postGame from "../../../../../../src/api/games/_gameId/users/_userId/postGame";
import putGame from "../../../../../../src/api/games/_gameId/users/_userId/putGame";
import deleteGame from "../../../../../../src/api/games/_gameId/users/_userId/deleteGame";

// TODO: refactor common wrapper: cors
// You can read more about the available options here:
// https://github.com/expressjs/cors#configuration-options
// https://nextjs.org/docs/api-routes/api-middlewares#connectexpress-middleware-support
const cors = initMiddleware(
  Cors({
    methods: ["GET", "POST", "DELETE"],
  })
);

const apiGame = async (req, res) => {
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
