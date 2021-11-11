import React, { useEffect, useState } from "reactn";
import { firestore } from "../../../../firebase";
import { darkTheme } from "../../../../theme";
import { Progress } from "antd";

export const UserProgress = (props) => {
  const [numberWinners, setNumberWinners] = useState(props.numberWinners);
  const [userCard, setUserCard] = useState(JSON.parse(props.user.card));

  useEffect(() => {
    // This useEffect is just to work with auto fill.
    if (!props.lobby.settings.cardAutofill) return;

    const currentUsers = Object.values(props.lobby.users);
    const currentUser = currentUsers.find((user) => user.id === props.user.id);

    setNumberWinners(props.numberWinners);
    setUserCard(JSON.parse(currentUser.card));
  }, [props.lobby.users, props.numberWinners]);

  useEffect(() => {
    if (props.lobby?.settings?.cardAutofill) return null;

    const fetchMyWiningCard = () =>
      firestore
        .collection("lobbies")
        .doc(props.lobby.id)
        .collection("users")
        .doc(props.user.id)
        .onSnapshot((userOnShapShot) => {
          const user = userOnShapShot.data();
          setNumberWinners(user?.myWinningCard ?? []);
        });

    const sub = fetchMyWiningCard();
    return () => sub && sub();
  }, []);

  const progress = (user) => {
    try {
      const userPattern = JSON.parse(user.card);

      let hits = 0;
      let sizePattern = 0;

      props.lobbyPattern.forEach((y, indexY) =>
        y.forEach((x, indexX) => {
          if (!!x) sizePattern++;
          if (!!x && numberWinners.includes(userPattern[indexY][indexX])) hits++;
        })
      );

      const percentage = (hits / sizePattern) * 100;

      return (percentage || 0).toFixed(0);
    } catch (error) {
      console.error(error);
    }
  };

  return props.isCard ? (
    <React.Fragment key={numberWinners?.length}>
      {userCard.map((axiX, indexX) =>
        axiX.map((axiY, indexY) => (
          <div className={`matrix-num ${numberWinners?.includes(axiY) && "active"}`} key={`${indexX}-${indexY}`} />
        ))
      )}
    </React.Fragment>
  ) : (
    <Progress percent={progress(props.user)} strokeColor={darkTheme.basic.primary} />
  );
};
