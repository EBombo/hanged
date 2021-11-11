import React, { useGlobal, useState } from "reactn";
import styled from "styled-components";
import { useRouter } from "next/router";
import { Anchor, ButtonAnt, Input } from "../../../../components/form";
import { object, string } from "yup";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useForm } from "react-hook-form";
import get from "lodash/get";
import { useSendError } from "../../../../hooks";
import { useFetch } from "../../../../hooks/useFetch";
import { config } from "../../../../firebase";

export const EditProfile = (props) => {
  const router = useRouter();
  const { sendError } = useSendError();
  const { Fetch } = useFetch();

  const [authUser] = useGlobal("user");
  const [loading, setLoading] = useState(false);

  const schema = object().shape({
    name: string().required(),
    lastName: string().required(),
    phoneNumber: string().required().min(5),
  });

  const { register, errors, handleSubmit } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  const updateProfile = async (data) => {
    setLoading(true);
    try {
      const { error } = await Fetch(`${config.serverUrl}/api/users/${get(authUser, "id")}/edit`, "PUT", mapUser(data));

      props.showNotification(
        error ? "ERROR" : "OK",
        error ? "Algo salió mal" : "Realizado",
        error ? "error" : "success"
      );
    } catch (error) {
      await sendError(error, "updateProfile");
    }
    setLoading(false);
  };

  const mapUser = (data) => ({
    name: data.name,
    lastName: data.lastName,
    phoneNumber: data.phoneNumber,
  });

  return (
    <EditContainer>
      <Anchor variant="primary" onClick={() => router.back()}>
        <ArrowLeftOutlined /> Volver
      </Anchor>
      <div>Editar Perfil</div>
      <form onSubmit={handleSubmit(updateProfile)}>
        <Input
          name="name"
          variant="primary"
          error={errors.name}
          ref={register}
          autoComplete="off"
          defaultValue={get(authUser, "name", "")}
          placeholder="Nombre"
        />
        <Input
          name="lastName"
          variant="primary"
          error={errors.lastName}
          ref={register}
          autoComplete="off"
          defaultValue={get(authUser, "lastName", "")}
          placeholder="Apellido"
        />
        <Input
          name="phoneNumber"
          variant="primary"
          error={errors.phoneNumber}
          ref={register}
          autoComplete="off"
          defaultValue={get(authUser, "phoneNumber", "")}
          placeholder="Telefono"
        />
        <ButtonAnt variant="primary" htmlType="submit" disabled={loading} loading={loading}>
          ACTUALIZAR
        </ButtonAnt>
      </form>
    </EditContainer>
  );
};

const EditContainer = styled.div`
  width: 100%;
  padding: 1rem;
  color: ${(props) => props.theme.basic.white};
`;
