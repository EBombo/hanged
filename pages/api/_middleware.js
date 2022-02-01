import initMiddleware from "../../lib/init-middleware.js";
import Cors from "cors";

export const middleware = async (req, res) => {
  const cors = initMiddleware(
    Cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    })
  );

  await cors(req, res);
};
