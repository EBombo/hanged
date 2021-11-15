import postGame from "../../../../../../src/api/games/_gameId/users/_userId/postGame";
import putGame from "../../../../../../src/api/games/_gameId/users/_userId/putGame";

const apiGame = async (req, res) => {
  switch (req.method) {
    case "POST":
      return await postGame(req, res);
    case "PUT":
      return await putGame(req, res);
    default:
      return res.status(500).send({ error: "Method is not defined" });
  }
};

export default apiGame;
