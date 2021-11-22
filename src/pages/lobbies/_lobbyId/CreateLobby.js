import { spinLoaderMin } from "../../../components/common/loader";
import React, { useEffect, useGlobal, useState } from "reactn";
import { config, firestore, firestoreBomboGames } from "../../../firebase";
import { useFetch } from "../../../hooks/useFetch";
import { useRouter } from "next/router";
import { useUser } from "../../../hooks";
import { GameMenu } from "../../../components/GameMenu";
import { secondsPerRoundOptions, limbsOrder, defaultHandMan } from "../../../components/common/DataList";

export const CreateLobby = (props) => {
  const { Fetch } = useFetch();

  const router = useRouter();
  const { userId, tokenId, gameId } = router.query;

  const [, setLSAuthUser] = useUser();

  const [audios] = useGlobal("audios");
  const [, setAuthUser] = useGlobal("user");

  const [game, setGame] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSave, setIsLoadingSave] = useState(false);

  useEffect(() => {
    if ((!tokenId && !userId) || !gameId) return;

    const verifyUser = async () => {
      try {
        const url = `${config.serverUrlEvents}/api/tokens`;
        const { response, error } = await Fetch(url, "POST", { tokenId, userId });

        if (error) {
          props.showNotification("ERROR", "Error al validar la cuenta");
          return router.push("/login");
        }

        return response.user;
      } catch (error) {
        console.error(error);
      }
    };

    const fetchGame = async () => {
      const gameRef = await firestore.doc(`games/${gameId}`).get();
      return gameRef.data();
    };

    const fetchUserByToken = async () => {
      try {
        const promiseUser = verifyUser();
        const promiseGame = fetchGame();

        const response = await Promise.all([promiseUser, promiseGame]);

        const authUser = response[0];
        const game = response[1];

        const formatUser = {
          id: authUser.uid,
          nickname: authUser.name,
          email: authUser.email,
          isAdmin: true,
        };

        if (!game.usersIds.includes(formatUser.id)) return router.push("/login");

        await setAuthUser(formatUser);
        setLSAuthUser(formatUser);
        setGame({ ...game, secondsPerRound: secondsPerRoundOptions[0] });
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserByToken();
  }, [tokenId, gameId]);

  const createLobby = async (typeOfGame) => {
    setIsLoadingSave(true);
    try {
      const pin = await generatePin();

      const lobbiesRef = firestore.collection("lobbies");
      const lobbiesBomboGamesRef = firestoreBomboGames.collection("lobbies");
      const lobbyId = lobbiesRef.doc().id;

      const newLobby = {
        pin,
        game: {
          ...game,
          hangedMan: { ...defaultHandMan },
          lettersPressed: {},
          lives: limbsOrder.length,
          currentPhraseIndex: 0,
          state: "PLAYING",
        },
        typeOfGame,
        id: lobbyId,
        updateAt: new Date(),
        createAt: new Date(),
        isLocked: false,
        isClosed: false,
        startAt: null,
        settings: {
        },
      };

      const promiseLobby = lobbiesRef.doc(lobbyId).set(newLobby);
      const promiseLobbyBomboGames = lobbiesBomboGamesRef.doc(lobbyId).set(newLobby);

      const promiseCountPlays = firestore.doc(`games/${game.id}`).update({ countPlays: (game?.countPlays ?? 0) + 1 });

      await Promise.all([promiseLobby, promiseLobbyBomboGames, promiseCountPlays]);

      return router.push(`/hanged/lobbies/${lobbyId}`);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingSave(false);
    }
  };

  const generatePin = async () => {
    const pin = Math.floor(100000 + Math.random() * 900000);
    const isValid = await validatePin(pin);

    return isValid && pin > 99999 ? pin.toString() : await generatePin();
  };

  const validatePin = async (pin) => {
    const gamesRef = await firestoreBomboGames.collection("lobbies").where("pin", "==", pin).get();

    return gamesRef.empty;
  };

  const addNewPhrase = (newPhrase) => {
    setGame({...game, phrases: [...game.phrases, newPhrase]});
  };

  if (isLoading) return spinLoaderMin();

  return (
    <GameMenu {...props}
      showChooseGameMode={true}
      game={game}
      audios={audios}
      isLoadingSave={isLoadingSave}
      createLobby={createLobby}
      addNewPhrase={addNewPhrase}
      onAudioChange={(audioId) => setGame({...game, audio: {...game.audio, id: audioId}})}
      onSecondsPerRoundChange={(seconds) => setGame({...game, secondsPerRound: seconds})}
    />
  );
};

