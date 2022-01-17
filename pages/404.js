import { useEffect } from "react";
import styled from "styled-components";
import { timeoutPromise } from "../src/utils/promised";
import { useRouter } from "next/router";

const ErrorPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/");

    const redirect = async () => {
      await timeoutPromise(3000);

      await router.push("/");
    };

    redirect();
  }, []);

  return (
    <ErrorPageStyled>
      <div className="content">
        <h1>404</h1>
        <div className="description">
          <h2>This page could not be found.</h2>
        </div>
      </div>
    </ErrorPageStyled>
  );
};

const ErrorPageStyled = styled.div`
  background: #1f1e1e;
  height: 100vh;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;

  .content {
    margin: auto;
  }

  h1 {
    color: white;
    display: inline-block;
    border-right: 1px solid white;
    margin: 0;
    margin-right: 20px;
    padding: 10px 23px 10px 0;
    font-size: 24px;
    font-weight: 500;
    vertical-align: top;
  }

  .description {
    display: inline-block;
    text-align: left;
    line-height: 49px;
    height: 49px;

    h2 {
      color: white;
      font-size: 14px;
      font-weight: normal;
      line-height: inherit;
      margin: 0;
      padding: 0;
    }
  }
`;

export default ErrorPage;
