import Cors from "cors";
import initMiddleware from "../../../../../lib";
import getGames from "../../../../../src/api/games/users/_userId/getGames";

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
    case "GET":
      return await getGames(req, res);
    default:
      return res.status(500).send({ error: "Method is not defined" });
  }
};

export default apiGame;

