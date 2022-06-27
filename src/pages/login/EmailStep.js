import React, { useGlobal, useState } from "reactn";
import styled from "styled-components";
import { Image } from "../../components/common/Image";
import { config } from "../../firebase";
import { ButtonLobby, InputBingo } from "../../components/form";
import { object, string } from "yup";
import { useForm } from "react-hook-form";
import { ModalVerification } from "./ModalVerification";
import { useUser } from "../../hooks";
import { useTranslation } from "../../hooks/useTranslation";

export const EmailStep = (props) => {
  const [, setAuthUserLs] = useUser();
  const [authUser, setAuthUser] = useGlobal("user");

  const [email, setEmail] = useState(null);

  const { t } = useTranslation();

  const validationSchema = object().shape({
    email: string().required().email(),
  });

  const { register, errors, handleSubmit } = useForm({
    validationSchema,
    reValidateMode: "onSubmit",
  });

  const emailVerification = async (data) => setEmail(data.email);

  return (
    <EmailForm onSubmit={handleSubmit(emailVerification)}>
      {email && (
        <ModalVerification
          email={email}
          isVisibleModalVerification={!!email}
          setIsVisibleModalVerification={async (email) => {
            await setAuthUser({ ...authUser, email: email });
            setAuthUserLs({ ...authUser, email: email });
          }}
          {...props}
        />
      )}

      <Image src={`${config.storageUrl}/resources/white-icon-ebombo.png`} width="180px" margin="10px auto" />

      <div className="login-container">
        <div className="subtitle">{t("pages.login.email-step.subtitle")}</div>
        <div className="description">{t("pages.login.email-step.description")}</div>

        <InputBingo
          ref={register}
          error={errors.email}
          name="email"
          align="center"
          width="100%"
          variant="default"
          margin="10px auto"
          defaultValue={authUser?.email ?? null}
          disabled={props.isLoading}
          placeholder={t("pages.login.placeholder-email-input")}
        />
        <ButtonLobby width="100%" disabled={props.isLoading} htmlType="submit">
          {t("ingress-button-label")}
        </ButtonLobby>
      </div>
    </EmailForm>
  );
};

const EmailForm = styled.form`
  padding: 10px;
  max-width: 400px;
  margin: 10% auto auto auto;
  color: ${(props) => props.theme.basic.white};

  .subtitle {
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    line-height: 22px;
    color: ${(props) => props.theme.basic.blackDarken};
    text-align: center;
    margin-bottom: 0.5rem;
  }

  .description {
    font-family: Lato;
    font-style: normal;
    font-weight: normal;
    font-size: 15px;
    line-height: 18px;
    color: ${(props) => props.theme.basic.blackDarken};
    text-align: center;
  }
`;
