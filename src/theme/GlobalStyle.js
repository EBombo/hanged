import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`

  .firebase-emulator-warning {
    display: none;
  }

  /*------------efectos---------------*/
  @keyframes throb {
    from {
      transform: none;
    }
    50% {
      transform: scale(1.1);
    }
    to {
      transform: none;
    }
  }

  * {
    transition: all 0.5s ease;
  }

  .un-seg {
    transition: all 1s ease !important;
  }

  /*------------efectos---------------*/


  /*-------------- FIX SALTO DE LINEA GENERAL ----------------*/
  ::-webkit-scrollbar {
    width: 3px;
    height: 3px;
  }

  ::-webkit-scrollbar-track {
    background: ${(props) => props.theme.basic.blackDarken};
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${(props) => props.theme.basic.primary};
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: ${(props) => props.theme.basic.action};
  }

  /*-------------- FIX SALTO DE LINEA GENERAL ----------------*/
  .no-wrap {
    white-space: nowrap !important;
    text-overflow: ellipsis !important;
    overflow: hidden !important;
  }
  
  .pre-wrap {
    white-space: normal !important;
    text-overflow: ellipsis !important;
    overflow: hidden !important;
  }

  /*-------------- FIX SALTO DE LINEA GENERAL ----------------*/

  /*-------------- STYLES GENERAL ----------------*/

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
    background: ${(props) => props.theme.basic.secondary};
  }

  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background: ${(props) => props.theme.basic.secondary};
    font-family: Lato;
    overflow: auto !important;
  }

  h4, h5, h6 {
    margin: 0;
    padding: 0;
  }

  /*-------------- STYLES GENERAL ----------------*/

  /*-------------- INPUT NUMBER WITH OUT ARROWS ----------------*/
  .input-no-style {
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }

    -moz-appearance: textfield;
  }

  /*-------------- INPUT NUMBER WITH OUT ARROWS ----------------*/

  /*-------------- SELECT ANT----------------*/

  .ant-select-dropdown, .ant-select-dropdown--single, .ant-select-dropdown-placement-bottomLeft {
    background-color: ${(props) => props.theme.basic.whiteLight} !important;
  }


  /*-------------- PRIMARY----------------*/
  .ant-select-item-option.primary {
    .ant-select-item-option-content {
      color: ${(props) => props.theme.basic.primary};
    }
  }

  /*-------------- PRIMARY----------------*/
  .ant-select-item-option.secondary {
    .ant-select-item-option-content {
      color: ${(props) => props.theme.basic.secondary};
    }
  }

  /*-------------- WARNING----------------*/
  .ant-select-item-option.warning {
    .ant-select-item-option-content {
      color: ${(props) => props.theme.basic.warning};
    }
  }

  /*-------------- DANGER----------------*/
  .ant-select-item-option.danger {
    .ant-select-item-option-content {
      color: ${(props) => props.theme.basic.danger};
    }
  }

  /*-------------- BACKGROUNDS ACTIVE/SELECT----------------*/
  .ant-select-item-option.primary.ant-select-item-option-active {
    background-color: ${(props) => props.theme.basic.grayDarken} !important;
  }

  .ant-select-item-option.primary.ant-select-item-option-selected {
    background-color: ${(props) => props.theme.basic.blackLighten} !important;
  }

  /*-------------- SWITCH ANT----------------*/
  
  .ant-switch-checked {
    background-color: #85e4bf !important;
  }
  
  /*-------------- NOTIFICATIONS ANT---------------*/
  .ant-message {
    z-index: 999999;

    .ant-message-notice-content {
      background: ${(props) => props.theme.basic.blackDarken};
      color: ${(props) => props.theme.basic.white};
      z-index: 999999;
    @include fontWeightFont(500);
    }
  }

  .ant-notification-notice {
    color: ${(props) => props.theme.basic.white};
    height: 100%;
    padding: 12px;
    user-select: none;
    background: ${(props) => props.theme.basic.blackDarken};
    border: 0;
    border-radius: 2px;
    pointer-events: auto;

    .ant-notification-notice-message {
      color: ${(props) => props.theme.basic.primary};
      font-size: 13px;
    }

    .ant-notification-notice-close {
      color: ${(props) => props.theme.basic.white};
    }

    .ant-notification-notice-description {
      font-size: 12px;
    }
  }

  /*-------------- NOTIFICATIONS ANT---------------*/

  /*------------ANIMATION---------------*/
  @keyframes throb {
    from {
      transform: none;
    }
    50% {
      transform: scale(1.1);
    }
    to {
      transform: none;
    }
  }

  @keyframes right-to-left-shift {
    0% {
      background-position: 0 0;
    }
    50% {
      background-position: 50% 0;
    }
    100% {
      background-position: 35% 0;
    }
  }

  /*------------ANIMATION---------------*/


  /*-------------- FIELDSET ---------------*/
  fieldset {
    margin: 5px;
    padding: 10px;
    border: 1px solid ${(props) => props.theme.basic.primary};
    color: 1px solid ${(props) => props.theme.basic.primary};
    border-radius: 7px;

    legend {
      width: auto;
      margin: 0;
      color: ${(props) => props.theme.basic.primary};

      .title-legend {
      @include fontWeightFont(600);
        font-size: 0.8rem;
        padding: 0 10px 0 10px;
      }
    }
  }

  /*-------------- CONTAINER ---------------*/


  /*-------------- DISABLED ---------------*/
  .disabled {
    pointer-events: none;
    filter: brightness(0.4);
  }

  /*-------------- DISABLED ---------------*/

  /*-------------- MODAL CONFIRM ---------------*/
  .ant-modal-content {
    background: ${(props) => props.theme.basic.blackDarken};

    .ant-modal-body {
      .ant-modal-confirm-body-wrapper {
        .ant-modal-confirm-body {
          .anticon {
            color: ${(props) => props.theme.basic.primary};
          }

          .ant-modal-confirm-title {
            color: ${(props) => props.theme.basic.white};
          }

          .ant-modal-confirm-content {
            color: ${(props) => props.theme.basic.white};
          }
        }

        .ant-modal-confirm-btns {
          .ant-btn {
            color: ${(props) => props.theme.basic.white};
            background: ${(props) => props.theme.basic.blackDarken};
            border: 1px solid ${(props) => props.theme.basic.primary};
          }

          .ant-btn-info {
            color: ${(props) => props.theme.basic.white};
            background: ${(props) => props.theme.basic.primary};
          }
        }
      }
    }
  }

  /*-------------- MODAL CONFIRM ---------------*/
`;
