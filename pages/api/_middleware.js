import Cors from "cors";
import initMiddleware from "../../lib";

export const middleware = async (req, res) => {
  const cors = initMiddleware(
    Cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    })
  );

  await cors(req, res);
};
