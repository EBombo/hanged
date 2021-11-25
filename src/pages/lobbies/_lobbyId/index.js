import React, { useEffect, useGlobal, useRef, useState } from "reactn";
import { firestore } from "../../../firebase";
import { useRouter } from "next/router";
import { spinLoaderMin } from "../../../components/common/loader";
import { LobbyInPlay } from "./play/LobbyInPlay";

import { useUser } from "../../../hooks";
import { LobbyClosed } from "./closed/LobbyClosed";

export const Lobby = (props) => {
  const router = useRouter();
  const { lobbyId } = router.query;

  const [, setAuthUserLs] = useUser();

  const [authUser, setAuthUser] = useGlobal("user");

  const [lobby, setLobby] = useState(null);
  const [isLoading, setLoading] = useState(true);

  const audioRef = useRef(null);

  const logout = async () => {
    await setAuthUser({ id: firestore.collection("users").doc().id });
    setAuthUserLs(null);
    router.push("/");
  };

  useEffect(() => {
    if (!authUser?.nickname && !authUser.isAdmin) return router.push("/");
  }, [authUser]);

  useEffect(() => {
    if (!lobbyId) return;

    const fetchLobby = () =>
      firestore.doc(`lobbies/${lobbyId}`).onSnapshot((lobbyRef) => {
        const currentLobby = lobbyRef.data();

        // Lobby not found.
        if (!currentLobby) {
          props.showNotification("UPS", "No encontramos tu sala, intenta nuevamente", "warning");
          logout();
        }

        // If the game is closed, log out the user.
        if (currentLobby?.isClosed && !authUser?.isAdmin) logout();

        setLobby(currentLobby);
        setLoading(false);
      });

    const sub = fetchLobby();
    return () => sub && sub();
  }, [lobbyId]);

  if (isLoading || (!authUser?.nickname && !authUser.isAdmin) || !lobby) return spinLoaderMin();

  const additionalProps = {
    audioRef: audioRef,
    logout: logout,
    lobby: lobby,
    ...props,
  };

  const lobbyIsClosed = lobby?.isClosed && authUser?.isAdmin;

  if (lobbyIsClosed) return <LobbyClosed {...additionalProps} />;

  return <LobbyInPlay {...additionalProps} />;
};
