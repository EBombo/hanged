import { authenticationErrors } from "../firebase/authentication";
import React, { useEffect, useGlobal, useState } from "reactn";
import { authEvents, config, firebase } from "../firebase";
import { useUser } from "./useLocalStorageState";
import acls from "../hooks/acl/acls.json";
import styled from "styled-components";
import { useFetch } from "./useFetch";
import { dialCodes } from "../utils";
import { notification } from "antd";
import get from "lodash/get";

const GOOGLE_PROVIDER = "google";
const FACEBOOK_PROVIDER = "facebook";

const signInProviders = {
  google: {
    instance: new firebase.auth.GoogleAuthProvider(),
    scopes: ["email", "profile"],
  },
  facebook: {
    instance: new firebase.auth.FacebookAuthProvider(),
    scopes: ["email"],
  },
  twitter: {
    instance: new firebase.auth.TwitterAuthProvider(),
    scopes: [],
  },
  github: {
    instance: new firebase.auth.GithubAuthProvider(),
    scopes: [],
  },
};

const facebookIconSvg = (
  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18">
    <path
      d="M3 1a2 2 0 00-2 2v12c0 1.1.9 2 2 2h12a2 2 0 002-2V3a2 2 0 00-2-2H3zm6.55 16v-6.2H7.46V8.4h2.09V6.61c0-2.07 1.26-3.2 3.1-3.2.88 0 1.64.07 1.87.1v2.16h-1.29c-1 0-1.19.48-1.19 1.18V8.4h2.39l-.31 2.42h-2.08V17h-2.5z"
      fill="white"
    ></path>
  </svg>
);

const googleIconSvg = (
  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18">
    <path
      d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z"
      fill="#4285F4"
    ></path>
    <path
      d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z"
      fill="#34A853"
    ></path>
    <path d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z" fill="#FBBC05"></path>
    <path
      d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.3z"
      fill="#EA4335"
    ></path>
  </svg>
);

export const useAuth = () => {
  const { Fetch } = useFetch();
  const [, setLSAuthUser] = useUser();
  const [error, setError] = useState(null);
  const [, setAuthUser] = useGlobal("user");
  const [isLoadingUser, setIsLoadingUser] = useGlobal("isLoadingUser");
  const [isLoadingCreateUser, setIsLoadingCreateUser] = useGlobal("isLoadingCreateUser");

  useEffect(() => {
    if (!error) return;

    notification.error({
      message: "ERROR",
      description: error,
    });

    setError(null);
  }, [error]);

  const signOut = async () => {
    await authEvents.signOut();
    setLSAuthUser.reset();
    await setAuthUser(null);
  };

  const signIn = async (user) => {
    try {
      await setIsLoadingUser(true);
      await authEvents.signInWithEmailAndPassword(user.email.trim().toLowerCase(), user.password);
    } catch (error) {
      let errorMessage = authenticationErrors[error.code];
      setError(errorMessage || "Ha ocurrido un error, intenta nuevamente");
      await setIsLoadingUser(false);
    }
  };

  const signInWithToken = async (token) => {
    try {
      await setIsLoadingUser(true);
      await authEvents.signInWithCustomToken(token);
    } catch (error) {
      let errorMessage = authenticationErrors[error.code];
      setError(errorMessage || "Ha ocurrido un error, intenta nuevamente");
      await setIsLoadingUser(false);
    }
  };

  const signUp = async (user) => {
    try {
      await setIsLoadingUser(true);
      await setIsLoadingCreateUser(true);

      const result = await authEvents.createUserWithEmailAndPassword(user.email.toLowerCase().trim(), user.password);

      const dialCode = (countryCode) => {
        const country = dialCodes.find((country) => country.code === countryCode);
        return get(country, "dialCode", null);
      };

      const mapRegister = (user, result) => ({
        id: result.uid,
        ...user,
        dialCode: dialCode(user.countryCode),
        providerData: { ...result.providerData[0] },
      });

      const register = mapRegister(user, result.user);

      await createAccount(register);
    } catch (error) {
      const errorMessage = authenticationErrors[error.code];
      setError(errorMessage || "Ha ocurrido un error, intenta nuevamente");
    }
    await setIsLoadingUser(false);
    await setIsLoadingCreateUser(false);
  };

  const createAccount = async (user) => {
    try {
      const { error } = await Fetch(`${config.serverUrl}/api/users/${user.id}`, "POST", {
        ...user,
        acls: {
          common: Object.keys(acls.common.items),
        },
      });

      if (error) throw get(error, "message", "ha ocurrido un problema");
    } catch (error) {
      setError(error);
    }
  };

  const currentProvider = (provider) => {
    const providerInstance = signInProviders[provider].instance;

    signInProviders[provider].scopes.forEach((scope) => providerInstance.addScope(scope));

    return providerInstance;
  };

  const loginWithProvider = async (provider) => {
    try {
      await setIsLoadingUser(true);
      await setIsLoadingCreateUser(true);

      const currentProvider_ = currentProvider(provider);

      await authEvents.signInWithRedirect(currentProvider_);
    } catch (error) {
      setError(error);
      await setIsLoadingUser(false);
      await setIsLoadingCreateUser(false);
    }
  };

  const recoveryPassword = async (email) => {
    try {
      await authEvents.sendPasswordResetEmail(email);
    } catch (error) {
      const errorMessage = authenticationErrors[error.code];
      setError(errorMessage || "Ha ocurrido un error, intenta nuevamente");
      return { success: false, error: errorMessage };
    }
    return { success: true };
  };

  const ButtonsProviders = (props) => (
    <>
      {props.google && (
        <ButtonsCss
          onClick={() => loginWithProvider(GOOGLE_PROVIDER)}
          disabled={isLoadingUser || isLoadingCreateUser}
          color="black"
        >
          <div className="icon">{googleIconSvg}</div>
          <div className="label">{props.googleLabel ? props.googleLabel : "Sign up using Google"}</div>
        </ButtonsCss>
      )}
      {props.facebook && (
        <ButtonsCss
          onClick={() => loginWithProvider(FACEBOOK_PROVIDER)}
          disabled={isLoadingUser || isLoadingCreateUser}
          background="#395697"
          color="white"
          border="black"
        >
          <div className="icon">{facebookIconSvg}</div>
          <div className="label">{props.facebookLabel ? props.facebookLabel : "Sign up using Facebook"}</div>
        </ButtonsCss>
      )}
    </>
  );

  return {
    ButtonsProviders,
    signOut: () => signOut(),
    signIn: (user) => signIn(user),
    signUp: (user) => signUp(user),
    createAccount: (user) => createAccount(user),
    signInWithToken: (token) => signInWithToken(token),
    recoveryPassword: (email) => recoveryPassword(email),
    loginWithProvider: (provider) => loginWithProvider(provider),
  };
};

const ButtonsCss = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  padding: 0.8em;
  border: 1px solid ${(props) => props.border || props.theme.basic.gray};
  background-color: ${(props) => props.background || props.theme.basic.white};
  color: ${(props) => props.color || props.theme.basic.white};
  border-radius: 3px;
  font-size: 13px;
  font-weight: normal;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  margin: 8px auto;

  .icon {
    display: flex;
    margin: auto 5px;
  }

  .label {
    display: flex;
    margin: auto 5px;
  }

  :hover {
    box-shadow: 0 0 4px ${(props) => props.shadow || props.theme.basic.white};
  }

  ${(props) => props.disabled && "pointer-events: none;filter: brightness(0.4);"}
`;
