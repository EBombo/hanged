import React, { useEffect, useGlobal, useRef, useState } from "reactn";
import styled from "styled-components";
import { config, firestore } from "../../firebase";
import isEmpty from "lodash/isEmpty";
import { snapshotToArray } from "../../utils";
import { spinLoader } from "../common/loader";
import { useFetch } from "../../hooks/useFetch";
import { useSendError } from "../../hooks";
import { mediaQuery } from "../../constants";
import { ButtonAnt, Input } from "../form";
import { useRouter } from "next/router";
import { ChatMessage } from "./ChatMessage";
import { object, string } from "yup";
import { useForm } from "react-hook-form";

export const Chat = (props) => {
  const router = useRouter();
  const chatRef = useRef(null);
  const { lobbyId } = router.query;

  const [authUser] = useGlobal("user");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoadingSendMessage, setIsLoadingSendMessage] = useState(false);

  const { sendError } = useSendError();
  const { Fetch } = useFetch();

  const schema = object().shape({
    message: string().required(),
  });

  const { register, errors, handleSubmit } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  useEffect(() => {
    fetchMessages();
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setTimeout(scrollToBottom, 200);
  }, [messages]); //eslint-disable-line react-hooks/exhaustive-deps

  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current ? chatRef.current.scrollHeight : null;
    }
  };

  const fetchMessages = () =>
    firestore
      .collection("messages")
      .where("lobbyId", "==", lobbyId)
      .orderBy("createAt", "asc")
      .onSnapshot((messagesSnapshot) => {
        setMessages(snapshotToArray(messagesSnapshot));
        setLoading(false);
      });

  const sendMessage = async (data) => {
    try {
      setIsLoadingSendMessage(true);
      setMessage("");

      // TODO: Consider add "data.message" to "messages" to optimize load messages.

      const { error } = await Fetch(`${config.serverUrl}/api/messages`, "POST", {
        message: data.message,
        user: authUser,
        lobbyId,
      });

      if (error) return setMessage(message);
    } catch (error) {
      sendError({ error: Object(error).toString(), action: "sendMessage" });
    }
    setIsLoadingSendMessage(false);
  };

  return (
    <Container>
      <div className="title" key={`key-title1-${lobbyId}`}>
        Chat del Bingo
      </div>
      <Content>
        <div className="chat-body" ref={chatRef}>
          {loading ? (
            <div className="spin-loading">{spinLoader()}</div>
          ) : isEmpty(messages) ? (
            <div className="chat-empty">Comienza a chatear</div>
          ) : (
            messages.map((message, index) => (
              <ChatMessage
                key={message.id}
                message={message}
                previousMessage={index > 1 ? messages[index - 1] : null}
                index={index}
              />
            ))
          )}
        </div>
      </Content>
      <div className="footer">
        <form className="send-message" onSubmit={handleSubmit(sendMessage)}>
          <Input
            placeholder="Escribe tu mensaje aqui"
            autoComplete="off"
            className="input-message"
            name="message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            error={errors.message}
            ref={register}
          />
          <ButtonAnt
            disabled={isLoadingSendMessage}
            loading={isLoadingSendMessage}
            htmlType="submit"
            className="btn-submit"
            color="secondary"
          >
            Enviar
          </ButtonAnt>
        </form>
      </div>
    </Container>
  );
};

const Content = styled.div`
  background: ${(props) => props.theme.basic.whiteLight};
  padding: 0.5rem;

  .chat-body {
    height: 400px;
    overflow-y: auto;
    scroll-behavior: smooth;

    ::-webkit-scrollbar-track {
      background: ${(props) => props.theme.basic.default};
    }

    ::-webkit-scrollbar-thumb {
      background-color: ${(props) => props.theme.basic.primary};
    }

    .chat-empty {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      text-align: center;
      font-weight: 500;
      font-size: 1rem;
      color: ${(props) => props.theme.basic.blackDarken};
    }
  }

  ${mediaQuery.afterTablet} {
    height: calc(100vh - 195px);
    .chat-body {
      height: 100%;
    }
  }
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  margin: 0 auto;
  background: ${(props) => props.theme.basic.whiteDark};

  .chat-info {
    margin-top: 5px;
    display: flex;
    justify-content: space-between;

    div:first-child {
      width: auto;
      color: ${(props) => props.theme.basic.primary};
    }

    div:nth-child(2n) {
      width: auto;
      color: ${(props) => props.theme.basic.white};
    }
  }

  .title {
    height: 44px;
    display: flex;
    align-items: center;
    color: ${(props) => props.theme.basic.blackDarken};
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 15px;
    line-height: 18px;
    padding: 0.5rem;
    border-bottom: 1px solid ${(props) => props.theme.basic.grayLighten};
    background: ${(props) => props.theme.basic.white};
  }

  .footer {
    background: ${(props) => props.theme.basic.whiteDark};
    box-shadow: 0px -2px 4px rgba(0, 0, 0, 0.08);
    padding: 0.5rem;
    width: 100%;

    .input-message {
      height: 42px;
      font-family: Lato;
      font-style: normal;
      font-weight: 600;
      font-size: 12px;
      line-height: 14px;
      border-radius: 4px;
      border: 2px solid ${(props) => props.theme.basic.primaryDark};
    }

    .btn-submit {
      margin: 10px 0 auto auto;
      font-style: normal;
      font-weight: 600;
      font-size: 13px;
      line-height: 18px;
      padding: 5px 30px !important;
    }
  }
`;
