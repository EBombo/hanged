import firebaseAuthenticationErrors from "./firebaseAuthenticationErrors";
import createUserErrors from "./createUserErrors";

export const authenticationErrors = {
  ...firebaseAuthenticationErrors,
  ...createUserErrors,
};
