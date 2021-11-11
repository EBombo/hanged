import { ButtonAnt, Input, InputGroup, Select } from "../../components/form";
import { Divider } from "../../components/common/Divider";
import { Controller, useForm } from "react-hook-form";
import React, { useEffect, useGlobal } from "reactn";
import { useAuth } from "../../hooks/useAuth";
import { mediaQuery } from "../../constants";
import styled from "styled-components";
import { dialCodes } from "../../utils";
import { useRouter } from "next/router";
import { getData } from "country-list";
import { object, string } from "yup";
import get from "lodash/get";

export const Register = (props) => {
  const validationSchema = object().shape({
    name: string().required(),
    lastName: string().required(),
    email: string()
      .required()
      .email()
      .test("", "Email invalid!", (email_) => !email_.includes("yopmail.com")),
    password: string().required().min(6),
    countryCode: string().required(),
    phoneNumber: string().required().min(5),
  });

  const { signUp, ButtonsProviders } = useAuth();
  const [authUser] = useGlobal("user");
  const [isLoadingUser] = useGlobal("isLoadingUser");
  const [isLoadingCreateUser] = useGlobal("isLoadingCreateUser");

  const { register, errors, handleSubmit, control, watch } = useForm({
    validationSchema,
    reValidateMode: "onSubmit",
  });

  const router = useRouter();

  useEffect(() => {
    if (authUser) return router.push("/home");
  }, [authUser]);

  const dialCode = (countryCode) => {
    const country = dialCodes.find((country) => country.code === countryCode);

    return get(country, "dialCode", null);
  };

  return (
    <RegisterContainer>
      <div className="title">Registrate</div>
      <form onSubmit={handleSubmit(signUp)} autoComplete="off" noValidate>
        <Input
          error={errors.name}
          type="text"
          ref={register}
          name="name"
          variant="primary"
          autoComplete="off"
          placeholder="nombre"
        />
        <Input
          error={errors.lastName}
          type="text"
          ref={register}
          name="lastName"
          variant="primary"
          autoComplete="off"
          placeholder="Apellidos"
        />
        <Input
          error={errors.email}
          type="email"
          ref={register}
          name="email"
          variant="primary"
          autoComplete="off"
          placeholder="email"
        />
        <Input
          error={errors.password}
          type="password"
          ref={register}
          name="password"
          variant="primary"
          autoComplete="off"
          placeholder="assword"
        />
        <InputGroup gridTemplateColumns="2fr 50px 3fr">
          <Controller
            name="countryCode"
            control={control}
            as={
              <Select
                placeholder="Country"
                showSearch
                virtual={false}
                variant="primary"
                autoComplete="off"
                error={errors.countryCode}
                optionFilterProp="children"
                optionsdom={getData().map((country) => ({
                  key: country.code,
                  code: country.code,
                  name: country.name,
                }))}
                filterOption={(input, option) =>
                  get(option, "props.children", "").toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              />
            }
          />
          <CountryCode>{dialCode(watch("countryCode"))}</CountryCode>
          <Input
            error={errors.phoneNumber}
            type="number"
            ref={register}
            name="phoneNumber"
            variant="primary"
            autoComplete="off"
            placeholder={"phoneNumber"}
          />
        </InputGroup>
        <ButtonAnt
          loading={isLoadingCreateUser}
          disabled={isLoadingUser || isLoadingCreateUser}
          variant="primary"
          htmlType="submit"
          width="100%"
        >
          Registrar
        </ButtonAnt>
      </form>
      <Divider>o</Divider>
      <ButtonsProviders google facebook />
    </RegisterContainer>
  );
};

const RegisterContainer = styled.div`
  padding: 15px 10px;
  margin: 10px auto;

  ${mediaQuery.afterTablet} {
    max-width: 400px;
  }

  .title {
    color: ${(props) => props.theme.basic.white};
    text-align: center;
  }

  form {
    svg {
      color: ${(props) => props.theme.basic.white};
    }
  }
`;

const CountryCode = styled.div`
  height: 30px;
  line-height: 34px;
  text-align: center;
  border: none;
  border-radius: 0 !important;
  background: ${(props) => props.theme.basic.primary};
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  color: ${(props) => props.theme.basic.white};
  font-size: 10px;
`;
