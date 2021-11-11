import React, { useEffect, useState } from "reactn";
import { ButtonBingo, InputBingo } from "../../components/form";
import { Image } from "../../components/common/Image";
import { useForm } from "react-hook-form";
import { config, database } from "../../firebase";
import styled from "styled-components";
import { object, string } from "yup";
import { useSendError } from "../../hooks";
import { ValidateNickname } from "./ValidateNickname";

export const NicknameStep = (props) => {
  const [isValidating, setIsValidating] = useState(false);
  const [users, setUsers] = useState(null);
  const { sendError } = useSendError();

  const validationSchema = object().shape({
    nickname: string().required(),
  });

  const { register, errors, handleSubmit } = useForm({
    validationSchema,
    reValidateMode: "onSubmit",
  });

  useEffect(() => {
    if (!props.lobby) return;
    fetchUsers();
  }, [props.lobby]);

  const validateNickname = async (data) => {
    setIsValidating(true);
    try {
      if (users.some((user) => user.nickname === data.nickname)) {
        setIsValidating(false);
        props.showNotification("ERROR", "El nickname ya se encuentra registrado");
        return;
      }

      props.setIsLoading(true);
      props.setNickname(data.nickname);
      props.setIsLoading(false);
    } catch (error) {
      await sendError({
        error: Object(error).toString(),
        action: "nicknameSubmit",
      });
    }

    setIsValidating(false);
  };

  const fetchUsers = async () => {
    const userStatusDatabaseRef = database.ref(`lobbies/${props.lobby.id}/users`);
    userStatusDatabaseRef.on("value", (snapshot) => {
      let users_ = Object.values(snapshot.val() ?? {});
      users_ = users_.filter((user) => user.state.includes("online"));
      setUsers(users_);
    });
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
          disabled={props.isLoading}
          placeholder="Apodo"
        />
        <ButtonBingo width="100%" disabled={props.isLoading} htmlType="submit">
          Ingresar
        </ButtonBingo>
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
