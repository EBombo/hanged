import { spinLoaderMin } from "../../../components/common/loader";
import React, { useEffect, useGlobal, useState } from "reactn";
import { config, firestore, firestoreBomboGames } from "../../../firebase";
import { useFetch } from "../../../hooks/useFetch";
import { useRouter } from "next/router";
import { useSendError, useTranslation, useUser } from "../../../hooks";
import { GameMenu } from "../../../components/GameMenu";
import { defaultHandMan, limbsOrder, PLAYING, secondsPerRoundOptions, languages } from "../../../components/common/DataList";

export const CreateLobby = (props) => {
  const { Fetch } = useFetch();

  const router = useRouter();
  const { userId, tokenId, gameId } = router.query;

  const { locale, setLocale } = useTranslation();

  const { sendError } = useSendError();

  const [, setLSAuthUser] = useUser();

  const [audios] = useGlobal("audios");
  const [, setAuthUser] = useGlobal("user");

  const [game, setGame] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const [settings, setSettings] = useState({ secondsPerRound: secondsPerRoundOptions[0], language: locale });

  useEffect(() => {
    if ((!tokenId && !userId) || !gameId) return;

    const verifyUser = async () => {
      try {
        const url = `${config.serverUrlEvents}/api/tokens`;
        const { response, error } = await Fetch(url, "POST", { tokenId, userId });

        if (error) {
          props.showNotification("ERROR", "Error al validar la cuenta");

          if (typeof window !== "undefined") window.location.href = "/";
          return;
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

        if (!game.usersIds.includes(formatUser.id) && typeof window !== "undefined") {
          window.location.href = "/";
        }

        await setAuthUser(formatUser);
        setLSAuthUser(formatUser);
        setGame(game);
        setSettings({ ...settings, phrases: game.phrases });
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserByToken();
  }, [tokenId, gameId]);

  const createLobby = async (typeOfGame, phrases) => {
    setIsLoadingSave(true);
    try {
      const pin = await generatePin();

      const lobbiesRef = firestore.collection("lobbies");
      const lobbiesBomboGamesRef = firestoreBomboGames.collection("lobbies");
      const lobbyId = lobbiesRef.doc().id;

      const newLobby = {
        id: lobbyId,
        pin,
        game,
        lettersPressed: {},
        hangedMan: defaultHandMan,
        lives: limbsOrder.length,
        currentPhraseIndex: 0,
        state: PLAYING,
        typeOfGame,
        updateAt: new Date(),
        createAt: new Date(),
        startAt: new Date(),
        isLocked: false,
        isClosed: false,
        deleted: false,
        settings: {
          ...settings,
          phrases: phrases.filter((phrase) => phrase !== ""),
          audio: settings.audio ?? { id: audios[0]?.id },
        },
      };

      const promiseLobby = lobbiesRef.doc(lobbyId).set(newLobby);
      const promiseLobbyBomboGames = lobbiesBomboGamesRef.doc(lobbyId).set(newLobby);

      const promiseCountPlays = firestore.doc(`games/${game.id}`).update({ countPlays: (game?.countPlays ?? 0) + 1 });

      await Promise.all([promiseLobby, promiseLobbyBomboGames, promiseCountPlays]);

      return router.push(`/hanged/lobbies/${lobbyId}`);
    } catch (error) {
      console.log(error);
      sendError(error, "createLobby");
    }
    setIsLoadingSave(false);
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

  if (isLoading) return spinLoaderMin();

  return (
    <GameMenu
      {...props}
      game={game}
      audios={audios}
      showChooseGameMode
      settings={settings}
      createLobby={createLobby}
      isLoadingSave={isLoadingSave}
      onAudioChange={(audioId) => setSettings({ ...settings, audio: { id: audioId } })}
      onSecondsPerRoundChange={(seconds) => setSettings({ ...settings, secondsPerRound: seconds })}
      addNewPhrase={(newPhrase) => setSettings({ ...settings, phrases: [...settings.phrases, newPhrase] })}
      onLanguageChange={(language) => {
        setLocale(language);
        setSettings({ ...settings, language });
      }}
    />
  );
};
