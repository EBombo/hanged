import React, { forwardRef } from "reactn";
import styled from "styled-components";
import Button from "antd/lib/button";

export const ButtonAnt = forwardRef((props, ref) => (
  <ButtonAntCss
    ref={ref}
    size={props.size ? props.size : "medium"}
    width={props.width ? props.width : "auto"}
    {...props}
  />
));

const ButtonAntCss = styled(Button)`
  padding: ${(props) =>
    props.size === "small" ? "10px" : props.size === "medium" ? "6px 20px" : props.size === "big" ? "10px 30px" : ""};
  margin: ${(props) => props.margin || 0};
  border-radius: ${(props) => (props.borderRadius ? props.borderRadius : "4px")};
  cursor: pointer;
  width: ${(props) => props.width};
  height: ${(props) => (props.height ? props.height : "auto")};
  display: flex;
  align-items: center;
  justify-content: space-evenly;

  ${({ variant = "contained", theme, color = "primary" }) =>
    variant === "contained"
      ? `
      background: ${
        color === "primary"
          ? theme.basic.primary
          : color === "secondary"
          ? theme.basic.secondary
          : color === "secondaryDark"
          ? theme.basic.secondaryDarken
          : color === "warning"
          ? theme.basic.warning
          : color === "danger"
          ? theme.basic.danger
          : color === "default"
          ? theme.basic.whiteDark
          : color === "success"
          ? theme.basic.success
          : color
      };
        color: ${
          color === "white"
            ? theme.basic.secondaryLight
            : color === "default" || color === "success"
            ? theme.basic.blackDarken
            : color === "warning"
            ? theme.basic.blackDarken
            : theme.basic.white
        };
      border: none;
      box-shadow: 0 4px ${
        color === "primary"
          ? theme.basic.primaryDark
          : color === "secondary"
          ? theme.basic.secondaryDark
          : color === "secondaryDark"
          ? theme.basic.secondaryDarken
          : color === "warning"
          ? theme.basic.warningDark
          : color === "danger"
          ? theme.basic.dangerDark
          : color === "default"
          ? "#979797"
          : color === "success"
          ? theme.basic.successDark
          : color
      };
      `
      : variant === "outlined"
      ? `
      background: transparent;
      color: ${
        color === "primary"
          ? theme.basic.primary
          : color === "secondary"
          ? theme.basic.secondary
          : color === "secondaryDark"
          ? theme.basic.secondaryDarken
          : color === "warning"
          ? theme.basic.warning
          : color === "danger"
          ? theme.basic.danger
          : color === "default"
          ? theme.basic.blackDarken
          : color === "success"
          ? theme.basic.success
          : color
      };
      border: 1px solid ${
        color === "primary"
          ? theme.basic.primary
          : color === "secondary"
          ? theme.basic.secondary
          : color === "secondaryDark"
          ? theme.basic.secondaryDarken
          : color === "warning"
          ? theme.basic.warning
          : color === "danger"
          ? theme.basic.danger
          : color === "default"
          ? theme.basic.whiteDark
          : color === "success"
          ? theme.basic.successDark
          : color
      };
      `
      : `
      background: transparent;
      color: ${
        color === "primary"
          ? theme.basic.primary
          : color === "secondary"
          ? theme.basic.secondary
          : color === "warning"
          ? theme.basic.warning
          : color === "danger"
          ? theme.basic.danger
          : color === "default"
          ? theme.basic.blackDarken
          : color
      };  
      border: none;
      `}
  &:active, &:focus {
    ${({ variant = "contained", theme, color = "primary" }) =>
      variant === "contained"
        ? `
      background: ${
        color === "primary"
          ? theme.basic.primary
          : color === "secondary"
          ? theme.basic.secondary
          : color === "secondaryDark"
          ? theme.basic.secondaryDarken
          : color === "warning"
          ? theme.basic.warning
          : color === "danger"
          ? theme.basic.danger
          : color === "default"
          ? theme.basic.whiteDark
          : color === "success"
          ? theme.basic.success
          : color
      }!important;
        color: ${
          color === "white"
            ? theme.basic.secondaryLight
            : color === "default" || color === "success"
            ? theme.basic.blackDarken
            : color === "warning"
            ? theme.basic.blackDarken
            : theme.basic.white
        }!important;
      border: none;
      box-shadow: 0 4px ${
        color === "primary"
          ? theme.basic.primaryDark
          : color === "secondary"
          ? theme.basic.secondaryDark
          : color === "secondaryDark"
          ? theme.basic.secondaryDarken
          : color === "warning"
          ? theme.basic.warningDark
          : color === "danger"
          ? theme.basic.dangerDark
          : color === "default"
          ? "#979797"
          : color === "success"
          ? theme.basic.successDark
          : color
      };
      `
        : variant === "outlined"
        ? `
      background: transparent!important;
      color: ${
        color === "primary"
          ? theme.basic.primary
          : color === "secondary"
          ? theme.basic.secondary
          : color === "warning"
          ? theme.basic.warning
          : color === "danger"
          ? theme.basic.danger
          : color === "default"
          ? theme.basic.blackDarken
          : color
      }!important;
      border: 1px solid ${
        color === "primary"
          ? theme.basic.primary
          : color === "secondary"
          ? theme.basic.secondary
          : color === "warning"
          ? theme.basic.warning
          : color === "danger"
          ? theme.basic.danger
          : color === "default"
          ? theme.basic.whiteDark
          : color
      };
      `
        : `
      background: transparent!important;
      color: ${
        color === "primary"
          ? theme.basic.primary
          : color === "secondary"
          ? theme.basic.secondary
          : color === "warning"
          ? theme.basic.warning
          : color === "danger"
          ? theme.basic.danger
          : color === "default"
          ? theme.basic.blackDarken
          : color
      }!important;  
      border: none;
      `}
  }

  &:hover {
    ${({ variant = "contained", theme = darkTheme, color = "primary" }) =>
      variant === "contained"
        ? `
      background: ${
        color === "primary"
          ? theme.basic.primaryLight
          : color === "secondary"
          ? theme.basic.primaryLight
          : color === "warning"
          ? theme.basic.warning
          : color === "danger"
          ? theme.basic.danger
          : color === "default"
          ? theme.basic.whiteDark
          : color === "success"
          ? theme.basic.successLight
          : `${color}90`
      }!important;
      color: ${
        color === "white"
          ? theme.basic.secondaryLight
          : color === "default" || color === "success"
          ? theme.basic.blackDarken
          : color === "warning"
          ? theme.basic.blackDarken
          : theme.basic.white
      }!important;
      border: none;
      `
        : variant === "outlined"
        ? `
      background: transparent!important;
      color: ${
        color === "primary"
          ? theme.basic.primaryLight
          : color === "secondary"
          ? theme.basic.secondaryLight
          : color === "warning"
          ? theme.basic.warning
          : color === "danger"
          ? theme.basic.danger
          : color === "default"
          ? theme.basic.whiteDark
          : `${color}CC`
      }!important;
      border: 1px solid ${
        color === "primary"
          ? theme.basic.primaryLight
          : color === "secondary"
          ? theme.basic.secondaryLight
          : color === "warning"
          ? theme.basic.warning
          : color === "danger"
          ? theme.basic.danger
          : color === "default"
          ? theme.basic.whiteDark
          : `${color}CC`
      };
      `
        : `
      background: transparent!important;
      color: ${
        color === "primary"
          ? theme.basic.primaryLight
          : color === "secondary"
          ? theme.basic.secondaryLight
          : color === "warning"
          ? theme.basic.warning
          : color === "danger"
          ? theme.basic.danger
          : color === "default"
          ? theme.basic.blackDarken
          : `${color}CC`
      }!important;  
      border: none;
      `}
  }
`;
