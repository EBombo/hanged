import React, { useEffect, useGlobal, useRef } from "reactn";
import { authEvents, firestoreEvents } from "../firebase";
import { useAuth } from "../hooks/useAuth";
import { useUser } from "../hooks";

export const WithAuthentication = (props) => {
  const { createAccount } = useAuth();
  const [, setAuthUser] = useGlobal("user");
  const [, setAuthUserLocalStorage] = useUser();
  const [isLoadingUser, setIsLoadingUser] = useGlobal("isLoadingUser");
  const [isLoadingCreateUser, setIsLoadingCreateUser] = useGlobal("isLoadingCreateUser");

  const unSubScribeAuthUser = useRef(null);

  useEffect(() => {
    const fetchAuthUser = (user) =>
      (unSubScribeAuthUser.current = firestoreEvents
        .collection("users")
        .doc(user.uid)
        .onSnapshot(async (onSnapShotUser) => {
          const currentUser = onSnapShotUser.data();
          await setAuthUser(currentUser);
          setAuthUserLocalStorage(currentUser);

          await setIsLoadingUser(false);
          await setIsLoadingCreateUser(false);
        }));

    const unsubscribeAuthStateChanged = authEvents.onAuthStateChanged(async (user) => {
      if (!user) unSubScribeAuthUser.current && unSubScribeAuthUser.current();

      if (isLoadingCreateUser || !user) return;

      unSubScribeAuthUser.current && unSubScribeAuthUser.current();
      fetchAuthUser(user);
    });

    return () => unsubscribeAuthStateChanged();
  }, [isLoadingUser, isLoadingCreateUser]);

  useEffect(() => {
    const afterRedirect = async () => {
      const result = await authEvents.getRedirectResult();

      if (!result.user || !result?.additionalUserInfo?.isNewUser) {
        await setIsLoadingUser(false);
        await setIsLoadingCreateUser(false);
        return;
      }

      const mapRegister = (user) => ({
        id: user.uid,
        firstName: user.displayName.split(" ")[0],
        name: user.displayName.split(" ")[0],
        lastName: user.displayName.split(" ")[1],
        email: user.email,
        imageUrl: user.photoURL,
        thumbImageUrl: user.photoURL,
        providerData: { ...user.providerData[0] },
      });

      const register = mapRegister(result.user);

      await createAccount(register);

      await setIsLoadingUser(false);
      await setIsLoadingCreateUser(false);
    };

    afterRedirect();
  }, []);

  return props.children;
};
