import React, { useEffect } from "react";
import { useGlobal } from "reactn";

export const Form = (props) => {
  const [languageCode] = useGlobal("languageCode");

  useEffect(() => {
    const { clearError, triggerValidation } = props;

    const updateErrors = async () => {
      await triggerValidation();
      clearError();
    };

    updateErrors();
  }, [languageCode, props]);

  return <form {...props}>{props.children}</form>;
};
