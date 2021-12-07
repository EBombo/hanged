import initMiddleware from "../../lib";
import Cors from "cors";

export const middleware = async (req) => {
  const cors = initMiddleware(
    Cors({
      methods: ["GET", "POST", "DELETE"],
    })
  );

  await cors(req);
};
