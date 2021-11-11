export const Acl = (props) => {
  const isEnabled = props.userAcls.some((acl) => acl === props.name);

  return isEnabled ? props.children : null;
};
