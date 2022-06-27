import React, { useEffect, useGlobal, useState } from "reactn";
import { ButtonLobby, InputBingo } from "../../components/form";
import { Image } from "../../components/common/Image";
import { useForm } from "react-hook-form";
import { config, database } from "../../firebase";
import styled from "styled-components";
import { object, string } from "yup";
import { useSendError, useUser } from "../../hooks";
import { ValidateNickname } from "./ValidateNickname";
import { useTranslation } from "../../hooks/useTranslation";

export const NicknameStep = (props) => {
  const { sendError } = useSendError();

  const [, setAuthUserLs] = useUser();
  const [authUser, setAuthUser] = useGlobal("user");

  const { t } = useTranslation();

  const [users, setUsers] = useState(null);
  const [isValidating, setIsValidating] = useState(false);

  const validationSchema = object().shape({
    nickname: string().required(),
  });

  const { register, errors, handleSubmit } = useForm({
    validationSchema,
    reValidateMode: "onSubmit",
  });

  useEffect(() => {
    if (!authUser?.lobby) return;

    const fetchUsers = async () => {
      const userStatusDatabaseRef = database.ref(`lobbies/${authUser.lobby.id}/users`);

      userStatusDatabaseRef.on("value", (snapshot) => {
        let users_ = Object.values(snapshot.val() ?? {});
        users_ = users_.filter((user) => user.state.includes("online"));
        setUsers(users_);
      });
    };

    fetchUsers();
  }, [authUser.lobby]);

  const validateNickname = async (data) => {
    setIsValidating(true);

    try {
      props.setIsLoading(true);

      if (users.some((user) => user.nickname === data.nickname)) {
        setIsValidating(false);
        throw Error("ERROR", t("pages.login.already-registered-nikname-error-message"));
      }

      await setAuthUser({ ...authUser, nickname: data.nickname });
      setAuthUserLs({ ...authUser, nickname: data.nickname });
    } catch (error) {
      props.showNotification("Error", error.message);

      await sendError({
        error: Object(error).toString(),
        action: "nicknameSubmit",
      });
    }

    props.setIsLoading(false);
    setIsValidating(false);
  };

  return (
    <NicknameForm onSubmit={handleSubmit(validateNickname)}>
      {isValidating && <ValidateNickname {...props} />}

      <Image src={`${config.storageUrl}/resources/white-icon-ebombo.png`} width="180px" margin="10px auto" />

      <div className="login-container">
        <InputBingo
          ref={register}
          error={errors.nickname}
          name="nickname"
          align="center"
          width="100%"
          margin="10px auto"
          variant="default"
          defaultValue={authUser?.nickname ?? null}
          disabled={props.isLoading}
          placeholder={t("pages.login.nickname-step-input-placeholder")}
        />

        <ButtonLobby width="100%" disabled={props.isLoading} loading={props.isLoading} htmlType="submit">
          {t("ingress-button-label")}
        </ButtonLobby>
      </div>
    </NicknameForm>
  );
};

const NicknameForm = styled.form`
  padding: 10px;
  max-width: 400px;
  margin: 10% auto auto auto;
  color: ${(props) => props.theme.basic.white};
`;
