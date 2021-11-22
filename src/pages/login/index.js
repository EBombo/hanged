import React, { useEffect, useGlobal, useMemo, useState } from "reactn";
import { config, firestore } from "../../firebase";
import { NicknameStep } from "./NicknameStep";
import { snapshotToArray } from "../../utils";
import { EmailStep } from "./EmailStep";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useUser } from "../../hooks";
import { PinStep } from "./PinStep";

const Login = (props) => {
  const router = useRouter();

  const [, setAuthUserLs] = useUser();
  const [authUser, setAuthUser] = useGlobal("user");

  const [isLoading, setIsLoading] = useState(false);

  const fetchLobby = async (pin) => {
    try {
      const lobbyRef = await firestore.collection("lobbies").where("pin", "==", pin.toString()).limit(1).get();

      if (lobbyRef.empty) throw Error("No encontramos tu sala, intenta nuevamente");

      const currentLobby = snapshotToArray(lobbyRef)[0];

      const usersIds = Object.keys(currentLobby?.users ?? {});

      if (!usersIds.includes(authUser?.id) && currentLobby?.isLocked) throw Error("Este juego esta cerrado");

      if (currentLobby?.isClosed) {
        await setAuthUser({
          id: firestore.collection("users").doc().id,
          email: null,
          lobby: null,
          nickname: null,
          isAdmin: false,
        });

        throw Error("Esta sala ha concluido");
      }

      await setAuthUser({ ...authUser, lobby: currentLobby });
      setAuthUserLs({ ...authUser, lobby: currentLobby });
    } catch (error) {
      props.showNotification("UPS", error.message, "warning");
    }
    setIsLoading(false);
  };

  // Redirect to lobby.
  useEffect(() => {
    if (!authUser?.lobby) return;
    if (!authUser?.nickname) return;
    if (authUser?.lobby?.settings?.userIdentity && !authUser?.email) return;

    router.push(`/lobbies/${authUser.lobby.id}`);
  }, [authUser]);

  // Auto login.
  useEffect(() => {
    if (!authUser?.lobby?.pin) return;

    setIsLoading(true);
    fetchLobby(authUser.lobby.pin);
  }, [authUser?.lobby?.pin]);

  const emailIsRequired = useMemo(() => {
    return !!authUser?.lobby?.settings?.userIdentity;
  }, [authUser]);

  return (
    <LoginContainer storageUrl={config.storageUrl}>
      <div className="main-container">
        {!authUser?.lobby && (
          <PinStep isLoading={isLoading} setIsLoading={setIsLoading} fetchLobby={fetchLobby} {...props} />
        )}

        {authUser?.lobby && (
          <>
            {emailIsRequired && !authUser?.email && (
              <EmailStep isLoading={isLoading} setIsLoading={setIsLoading} {...props} />
            )}

            {(emailIsRequired && authUser?.email && !authUser.nickname) || (!emailIsRequired && !authUser?.nickname) ? (
              <NicknameStep isLoading={isLoading} setIsLoading={setIsLoading} {...props} />
            ) : null}
          </>
        )}
      </div>
    </LoginContainer>
  );
};

const LoginContainer = styled.div`
  color: ${(props) => props.theme.basic.white};
  width: 100%;
  height: 100vh;
  background-image: url("${(props) => `${props.storageUrl}/resources/balls/coral-pattern-tablet.svg`}");
  background-position: center;
  background-size: contain;

  .main-container {
    padding: 10px;
    max-width: 400px;
    margin: 0 auto;
  }

  .login-container {
    padding: 15px;
    border-radius: 4px;
    background: ${(props) => props.theme.basic.white};

    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
`;

export default Login;
