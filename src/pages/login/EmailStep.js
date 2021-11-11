import React, { useState } from "reactn";
import styled from "styled-components";
import { Image } from "../../components/common/Image";
import { config } from "../../firebase";
import { ButtonBingo, InputBingo } from "../../components/form";
import { object, string } from "yup";
import { useForm } from "react-hook-form";
import { ModalVerification } from "./ModalVerification";

export const EmailStep = (props) => {
  const [email, setEmail] = useState(null);

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
          setIsVisibleModalVerification={(email) => props.setEmailVerification(email)}
          {...props}
        />
      )}
      <Image src={`${config.storageUrl}/resources/white-icon-ebombo.png`} width="180px" margin="10px auto" />
      <div className="login-container">
        <div className="subtitle">Añadir identificación del jugador</div>
        <div className="description">
          El anfitrión del juego ha pedido que coloques tu mail cómo una medida de identificación para entrar al juego
        </div>
        <InputBingo
          ref={register}
          error={errors.email}
          name="email"
          align="center"
          width="100%"
          margin="10px auto"
          variant="default"
          disabled={props.isLoading}
          placeholder="Ingresa tu email"
        />
        <ButtonBingo width="100%" disabled={props.isLoading} htmlType="submit">
          Ingresar
        </ButtonBingo>
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
