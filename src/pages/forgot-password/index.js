import React, { useGlobal, useState } from "reactn";
import { Card } from "antd";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { Anchor, ButtonAnt, Input } from "../../components/form";
import { useAuth } from "../../hooks/useAuth";
import { useSendError } from "../../hooks";

const ForgotPassword = (props) => {
  const { sendError } = useSendError();
  const { recoveryPassword } = useAuth();
  const [emailSent, setEmailSent] = useState(false);
  const [loadingSendEmailStatus, setLoadingSendEmailStatus] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [, setIsVisibleForgotPassword] = useGlobal("isVisibleForgotPassword");

  const schema = yup.object().shape({
    email: yup.string().email().required(),
  });

  const { register, errors, handleSubmit } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  const recoverPassword = async (data) => {
    try {
      setLoadingSendEmailStatus(true);

      const response = await recoveryPassword(data.email.toLowerCase());

      if (!response.success) {
        setErrorMessage(response.error);
        throw response.error;
      }

      setEmailSent(true);
    } catch (error) {
      console.error(error);
      await sendError(error, "recoverPassword");
    }
    setLoadingSendEmailStatus(false);
  };

  const cancelButton = () => setIsVisibleForgotPassword(false);

  return (
    <ContainerForgotPassword>
      <Card className="content-forgot-password">
        {emailSent ? (
          <React.Fragment>
            <h1 className="title">!Excellent!</h1>
            <p className="forgot-password-note">We have sent you an email with instructions to reset your password.</p>
            <Anchor variant="primary" onClick={() => cancelButton()} disabled={errorMessage}>
              Volver
            </Anchor>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <h1 className="title">Cambiar contraseña</h1>
            <p className="forgot-password-note">
              Por favor, introduce la dirección de correo electrónico asociada a tu cuenta. Te enviaremos un correo
              electrónico que te permitirá crear una nueva contraseña.
            </p>
            <form onSubmit={handleSubmit(recoverPassword)} className="login-form form-forgot-password" noValidate>
              {errorMessage ? <h3>{errorMessage}</h3> : <br />}
              <Input
                required
                variant="primary"
                type="email"
                name="email"
                ref={register}
                autoComplete="off"
                error={errors.email}
                className="input-forgot-password-desktop"
                placeholder="Email"
              />
              <div className="btn-footer-password">
                <ButtonAnt
                  block={true}
                  disabled={loadingSendEmailStatus}
                  height="35px"
                  width="170px"
                  onClick={() => cancelButton()}
                >
                  CANCELAR
                </ButtonAnt>
                <ButtonAnt
                  block={true}
                  height="35px"
                  width="170px"
                  htmlType="submit"
                  variant="primary"
                  loading={loadingSendEmailStatus}
                  disabled={loadingSendEmailStatus}
                >
                  ENVIAR
                </ButtonAnt>
              </div>
            </form>
          </React.Fragment>
        )}
      </Card>
    </ContainerForgotPassword>
  );
};

const ContainerForgotPassword = styled.div`
  color: ${(props) => props.theme.white};

  .content-forgot-password {
    margin: auto;
    background: none;
    border: none;
    padding: 0;

    .ant-card-body {
      padding: 0 20px;

      h1 {
      }
    }

    .btn-go-back {
      margin-top: 15px;
    }

    .title {
      color: ${(props) => props.theme.basic.white};
      font-size: 18px;
      margin-bottom: 10px;
    }

    .forgot-password-note {
      color: ${(props) => props.theme.basic.white};
      font-size: 15px;
      text-align: justify;
      margin-bottom: 0;
      line-height: 17px;
    }

    .form-forgot-password {
      h3 {
        color: ${(props) => props.theme.basic.danger};
      }

      .ant-form-item {
        margin-bottom: 10px;
      }

      .btn-footer-password {
        display: flex;
        justify-content: space-between;
      }

      .input-forgot-password-desktop {
        span {
          i {
            color: ${(props) => props.theme.basic.white} !important;
          }
        }
      }
    }
  }
`;

export default ForgotPassword;
