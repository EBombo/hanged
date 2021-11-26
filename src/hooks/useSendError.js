import { useGlobal } from "reactn";
import get from "lodash/get";
import { config, hostName } from "../firebase";
import { useRouter } from "next/router";
import { useFetch } from "./useFetch";

export const useSendError = () => {
  const { Fetch } = useFetch();
  const [authUser] = useGlobal("user");
  const { pathname } = useRouter();

  const sendError = async (error = {}, action) => {
    try {
      if (action) error.action = action;

      error = { error: Object(error).toString() };
      error.host = hostName;
      error.path = pathname;
      error.url = `${hostName}${pathname}`;
      error.userId = get(authUser, "id", null);

      if (process.env.NODE_ENV === "development") console.log(action, error);

      const response = await Fetch(`${config.serverUrl}/error-boundary`, "POST", error);

      if (response.error) throw Error(response.error.statusText);

      console.log("enviado correctamente");
    } catch (error) {
      console.error("error enviando el error", error);
    }
  };

  return { sendError: (error, action) => sendError(error, action) };
};
