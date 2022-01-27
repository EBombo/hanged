import initMiddleware from "../../lib";
import Cors from "cors";

export const middleware = async (req, res) => {
  const cors = initMiddleware(
    Cors({
      origin: "*",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    })
  );

  await cors(req, res);
};
