import React, { useGlobal, useState } from "reactn";
import UrlAssembler from "url-assembler";
import styled from "styled-components";
import { config } from "../../firebase";
import { ButtonAnt } from "../../components/form";
import get from "lodash/get";

const Verify = (props) => {
  const [authUser] = useGlobal("user");
  const [loadingResendCodeEmail, setLoadingResendCodeEmail] = useState(false);
  const [messageResendCodeEmail, setMessageResendCodeEmail] = useState("");

  const resendCodeEmail = async () => {
    let message = "CODIGO DE VERIFICACION ENVIADO!";
    try {
      setLoadingResendCodeEmail(true);

      setMessageResendCodeEmail("");

      const response = await fetch(urlApiResendCodeEmail(), { method: "GET" });

      if (!response.ok) {
        message = "ALGO SALIO MAL, VUELVE A INTENTARLO!";
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.error(error);
    }

    setLoadingResendCodeEmail(false);
    setMessageResendCodeEmail(message);
  };

  const urlApiResendCodeEmail = () =>
    new UrlAssembler(`${config.serverUrl}/api`)
      .template("/verify/:userId/resend-code")
      .param({
        userId: authUser.id,
      })
      .toString();

  return (
    <VerifyContainer>
      <div className="header-modal">
        <span className="name-user">
          Hola <b>{get(authUser, "name")}</b>{" "}
        </span>
        <span className="text-title-modal">
          Verifique su cuenta en su correo, si el correo no aparece por favor revisar en <b>Spam</b>, sino le llegó el
          correo vuelva a reenviar uno nuevo.
        </span>
        <span className="message-verified-email">{messageResendCodeEmail}</span>
      </div>
      <div className="body-modal">
        <ButtonAnt
          type="primary"
          width="100%"
          height="auto"
          loading={loadingResendCodeEmail}
          onClick={() => resendCodeEmail()}
        >
          REENVIAR CÓDIGO
        </ButtonAnt>
      </div>
      <div className="footer-modal">
        <div className="link-sing-up" onClick={() => props.logOut()}>
          Cerrar sesión
        </div>
      </div>
    </VerifyContainer>
  );
};

const VerifyContainer = styled.div`
  .header-modal {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

    .name-user {
      font-size: 1.3rem;
      font-weight: 500;
      margin-bottom: 10px;
    }

    .text-title-modal {
      font-size: 1rem;
    }

    .message-verified-email {
      color: ${(props) => props.theme.white};
      font-weight: 500;
      padding: 10px 0;
    }
  }

  .body-modal {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem 0;
  }

  .footer-modal {
    width: 100%;
    display: flex;
    justify-content: flex-end;

    .link-sing-up {
      color: ${(props) => props.theme.basic.danger};
      text-decoration: underline;
      font-size: 0.9rem;
      cursor: pointer;
    }
  }
`;

export default Verify;
