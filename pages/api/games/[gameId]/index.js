import postGame from "../../../../src/api/games/[gameId]/postGame";
import putGame from "../../../../src/api/games/[gameId]/putGame";

const apiGame = async (req, res, next) => {
  switch (req.method) {
    case "POST":
      return await postGame(req, res, next);
    case "PUT":
      return await putGame(req, res, next);
    default:
      return await postGame(req, res, next);
  }
};

export default apiGame;
