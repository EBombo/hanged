export const animatedBackground = ({ backgroundUrl }) => `
  background-image: url("${backgroundUrl}");
  background-repeat: repeat;
  background-position: center;
  animation: right-to-left-shift 20s linear infinite alternate;
`;
