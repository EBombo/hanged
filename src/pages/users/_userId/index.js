import React, { useEffect, useGlobal, useState } from "reactn";
import styled from "styled-components";
import { useRouter } from "next/router";
import { firestore } from "../../../firebase";
import { spinLoader } from "../../../components/common/loader";
import { ButtonAnt } from "../../../components/form";
import get from "lodash/get";

export const UserProfile = (props) => {
  const [authUser] = useGlobal("user");
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const { userId } = router.query;

  const canEdit = userId === get(authUser, "id");

  useEffect(() => {
    const fetchUser = () =>
      firestore
        .collection("users")
        .doc(userId)
        .onSnapshot((userOnSnapShot) => {
          if (!userOnSnapShot.exists) return router.back();

          setUser(userOnSnapShot.data());
          setLoadingUser(false);
        });

    const unSub = fetchUser();
    return () => unSub && unSub();
  }, [userId]);

  if (loadingUser) return spinLoader();

  return (
    <UserContainer>
      Profile container
      <div>Nombre: {user.name}</div>
      <div>Apellido: {user.lastName}</div>
      <div>Correo: {user.email}</div>
      {canEdit && (
        <ButtonAnt onClick={() => router.push(`/users/${userId}/edit`)} variant="primary" margin="0">
          Editar Perfil
        </ButtonAnt>
      )}
    </UserContainer>
  );
};

const UserContainer = styled.div`
  width: 100%;
  padding: 1rem;
  color: ${(props) => props.theme.basic.white};
`;
