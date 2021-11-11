import React, { useGlobal, useState } from "reactn";
import styled from "styled-components";
import { ModalContainer } from "../../../../components/common/ModalContainer";
import { ButtonAnt } from "../../../../components/form";
import { Input } from "antd";
import defaultTo from "lodash/defaultTo";
import { firestore } from "../../../../firebase";
import { ModalConfirm } from "../../../../components/modal/ModalConfirm";

export const ModalAwards = (props) => {
  const [authUser] = useGlobal("user");
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isVisibleModalConfirm, setIsVisibleModalConfirm] = useState(false);
  const [awards, setAwards] = useState(defaultTo(props.lobby.settings.awards, []));
  const [award, setAward] = useState("");

  const deleteAward = async (index) => {
    const newAwards = [...awards];
    newAwards.splice(index, 1);
    setAwards(newAwards);
    setIsUpdating(true);
  };

  const addAward = async () => {
    const newAwards = [...awards];
    newAwards.push(award);
    setAwards(newAwards);
    setAward("");
    setIsUpdating(true);
  };

  const saveAwards = async () => {
    setIsSaving(true);

    const newSettings = props.lobby.settings;

    newSettings.awards = awards;

    await firestore.doc(`lobbies/${props.lobby.id}`).update({
      settings: newSettings,
      updateAt: new Date(),
    });

    setIsSaving(false);
    setIsUpdating(false);
    props.setIsVisibleModalAwards(false);
  };

  return (
    <ModalContainer
      background="#FAFAFA"
      footer={null}
      topDesktop="10%"
      visible={props.isVisibleModalAwards}
      onCancel={() => props.setIsVisibleModalAwards(false)}
    >
      {isVisibleModalConfirm && (
        <ModalConfirm
          isVisibleModalConfirm={isVisibleModalConfirm}
          setIsVisibleModalConfirm={setIsVisibleModalConfirm}
          title="¿Estás seguro que deseas volver?"
          description={"Si vuelves no se guardaran los cambios."}
          action={() => props.setIsVisibleModalAwards(false)}
          buttonName={"Volver"}
          {...props}
        />
      )}
      <AwardsContainer key={props.lobby.settings}>
        <div className="title">{authUser.isAdmin ? "Editar " : ""} Premios</div>
        {defaultTo(awards, []).map((award, index) => (
          <div className="award" key={index}>
            <div className="label">Premio {index + 1}</div>
            <div className="content">
              <Input
                defaultValue={award.name}
                onBlur={(e) => {
                  const newAwards = [...awards];
                  newAwards[index] = {
                    name: e.target.value,
                    order: index + 1,
                  };
                  setAwards([...newAwards]);
                }}
                placeholder={`Premio ${index + 1}`}
              />
              {authUser.isAdmin && (
                <ButtonAnt color="danger" onClick={() => deleteAward(index)}>
                  Borrar
                </ButtonAnt>
              )}
            </div>
          </div>
        ))}
        {authUser.isAdmin && (
          <>
            <div className="label">Agregar premio</div>
            <form>
              <Input
                placeholder="Premio"
                name="award"
                value={award.name}
                onChange={(event) =>
                  setAward({
                    name: event.target.value,
                    order: defaultTo(props.lobby.settings.awards, []).length + 1,
                  })
                }
              />
              <ButtonAnt color="secondary" onClick={() => addAward()}>
                Agregar
              </ButtonAnt>
            </form>
            <div className="btns-container">
              <ButtonAnt
                color="default"
                onClick={() => (isUpdating ? setIsVisibleModalConfirm(true) : props.setIsVisibleModalAwards(false))}
              >
                Cancelar
              </ButtonAnt>
              <ButtonAnt loading={isSaving} onClick={() => saveAwards()}>
                Guardar
              </ButtonAnt>
            </div>
          </>
        )}
      </AwardsContainer>
    </ModalContainer>
  );
};

const AwardsContainer = styled.div`
  width: 100%;
  font-family: Lato;

  .title {
    font-style: normal;
    font-weight: bold;
    font-size: 17px;
    line-height: 20px;
    color: ${(props) => props.theme.basic.blackDarken};
    margin-bottom: 1rem;
  }

  .label {
    font-style: normal;
    font-weight: bold;
    font-size: 15px;
    line-height: 18px;
    color: ${(props) => props.theme.basic.blackDarken};
    margin-top: 0.5rem;
    margin-bottom: 5px;
  }

  .award {
    .content {
      display: grid;
      grid-template-columns: 80% 20%;
      grid-gap: 15px;
      align-items: center;
    }
  }

  form {
    display: grid;
    grid-template-columns: 80% 20%;
    grid-gap: 15px;
    align-items: center;
  }

  .btns-container {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    margin: 1rem 0;
  }
`;
