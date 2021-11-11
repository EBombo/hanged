import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { firestore } from "../../../firebase";
import * as yup from "yup";
import get from "lodash/get";
import defaultTo from "lodash/defaultTo";
import mapKeys from "lodash/mapKeys";
import mapValues from "lodash/mapValues";
import { FileUpload } from "../../../components/common/FileUpload";
import { spinLoader } from "../../../components/common/loader";
import { Input } from "../../../components/form/Input";
import { ButtonAnt } from "../../../components/form/Button";

export const AdminManifest = (props) => {
  const schema = yup.object().shape({});

  const [isLoading, setIsLoading] = useState(true);
  const [manifests, setManifests] = useState({});

  const { register, handleSubmit } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  useEffect(() => {
    fetchManifests();
  }, []);

  const fetchManifests = async () => {
    const manifestsRef = await firestore.doc("settings/manifest").get();

    setManifests(defaultTo(manifestsRef.data(), {}));
    setIsLoading(false);
  };

  const mapManifest = (data) => mapKeys(data, (value) => value.domain.replaceAll(".", "&"));

  const mapIcons = (data) =>
    mapValues(data, (values) => {
      const currentDomain = values.domain.replaceAll(".", "&");
      const currentIcons = get(manifests, `${currentDomain}.icons`, []);
      return { ...values, icons: currentIcons };
    });

  const saveManifests = async (data) => {
    try {
      setIsLoading(true);
      let newManifest = mapManifest(data);
      newManifest = mapIcons(newManifest);
      await firestore.doc("settings/manifest").set({ ...newManifest });
      props.showNotification("REGISTRADO", "Registro actualizado.", "success");
      fetchManifests();
    } catch (error) {
      console.error(error);
      props.showNotification("ERROR", "Algo salio mal, intente nuevamente.");
    }
  };

  const updateIcons = async (domain, icons) => {
    const currentDomain = domain.replaceAll(".", "&");
    const newManifest = {
      ...manifests,
      [currentDomain]: {
        ...manifests[currentDomain],
        icons: icons.map((icon) => ({
          src: icon.url,
          sizes: icon.size,
          type: icon.type,
        })),
      },
    };
    await firestore.doc("settings/manifest").set(newManifest);
    setIsLoading(true);
    fetchManifests();
  };

  if (isLoading) return spinLoader();

  return (
    <ManifestCss>
      <form onSubmit={handleSubmit(saveManifests)} autoComplete="off" noValidate>
        <div>
          <FieldsetContainer>
            <legend>Manifest por dominio</legend>
            {Object.keys(manifests).map((domain, index) => (
              <div className={"manifests"} key={`instruction-${domain}`}>
                <div>
                  {!domain.includes("domain") && (
                    <FileUpload
                      file={get(manifests[domain], "icons[0].src", null)}
                      fileName="src"
                      filePath={`manifests/${domain}/`}
                      sizes="48x48,72x72,96x96,144x144,168x168,192x192"
                      buttonLabel="Subir iconos"
                      accept="image/png"
                      afterUpload={(icons) => updateIcons(domain, icons)}
                    />
                  )}
                  <Input
                    variant="primary"
                    label="Dominio"
                    type="text"
                    defaultValue={domain.replaceAll("&", ".")}
                    placeholder="Dominio"
                    ref={register}
                    name={`domain${index}.domain`}
                  />
                  <Input
                    variant="primary"
                    label="Name"
                    type="text"
                    onBlur={(event) => {
                      let newManifests = manifests;
                      newManifests[domain].name = event.target.value;
                      setManifests({ ...newManifests });
                    }}
                    defaultValue={get(manifests[domain], "name", "")}
                    placeholder="Nombre de la aplicación"
                    ref={register}
                    name={`domain${index}.name`}
                  />
                  <Input
                    variant="primary"
                    label="Short Name"
                    defaultValue={get(manifests[domain], "short_name", "")}
                    placeholder="Nombre corto usado en apps"
                    type="text"
                    onBlur={(event) => {
                      let newManifests = manifests;
                      newManifests[domain]["short_name"] = event.target.value;
                      setManifests({ ...newManifests });
                    }}
                    ref={register}
                    name={`domain${index}.short_name`}
                  />
                  <Input
                    variant="primary"
                    label="Start URL"
                    defaultValue={get(manifests[domain], "start_url", "")}
                    placeholder="Url donde inicia la app"
                    type="text"
                    onBlur={(event) => {
                      let newManifests = manifests;
                      newManifests[domain]["start_url"] = event.target.value;
                      setManifests({ ...newManifests });
                    }}
                    ref={register}
                    name={`domain${index}.start_url`}
                  />
                  <Input
                    variant="primary"
                    label="Display fullscreen, standalone, minimal-ui, browser"
                    defaultValue={get(manifests[domain], "display", "")}
                    placeholder="Orientación"
                    type="text"
                    onBlur={(event) => {
                      let newManifests = manifests;
                      newManifests[domain]["display"] = event.target.value;
                      setManifests({ ...newManifests });
                    }}
                    ref={register}
                    name={`domain${index}.display`}
                  />
                  <Input
                    variant="primary"
                    label="Theme color"
                    defaultValue={get(manifests[domain], "theme_color", "")}
                    placeholder="Color de tema de la aplicación"
                    type="color"
                    onBlur={(event) => {
                      let newManifests = manifests;
                      newManifests[domain]["theme_color"] = event.target.value;
                      setManifests({ ...newManifests });
                    }}
                    ref={register}
                    name={`domain${index}.theme_color`}
                  />
                  <Input
                    variant="primary"
                    label="Background Color"
                    defaultValue={get(manifests[domain], "background_color", "")}
                    placeholder="Color de fondo"
                    type="color"
                    onBlur={(event) => {
                      let newManifests = manifests;
                      newManifests[domain]["background_color"] = event.target.value;
                      setManifests({ ...newManifests });
                    }}
                    ref={register}
                    name={`domain${index}.background_color`}
                  />
                  <ButtonAnt
                    variant="danger"
                    onClick={() => {
                      let newManifests = manifests;
                      delete newManifests[domain];
                      setManifests({ ...newManifests });
                    }}
                  >
                    Eliminar Manifest
                  </ButtonAnt>
                </div>
              </div>
            ))}
            <ButtonAnt
              variant="primary"
              onClick={() => {
                setManifests({
                  ...manifests,
                  ...{
                    [`domain${Object.keys(manifests).length}`]: {},
                  },
                });
              }}
            >
              Agregar Manifest
            </ButtonAnt>
          </FieldsetContainer>
        </div>
        <ButtonAnt htmlType="submit" variant="primary">
          GUARDAR
        </ButtonAnt>
      </form>
    </ManifestCss>
  );
};

const ManifestCss = styled.div`
  margin: auto;
  padding: 10px;
  width: 100%;
  max-width: 500px;
`;

const FieldsetContainer = styled.fieldset`
  width: auto;
  border-radius: 7px;
  padding: 15px 20px;
  height: 100%;
  margin-top: 1rem;

  .manifests {
    margin: 1rem 0;
  }
`;
