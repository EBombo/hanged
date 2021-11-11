export const aclRoutes = (props) => props.userAcls.filter((userAcl) => !userAcl.includes("#"));
