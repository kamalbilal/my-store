import { useRef, useState } from "react";
import Password from "../../../components/Admin/notLoggedIn/Password";
import LoggedIn from "../../../components/Admin/loggedIn/LoggedIn";

function offersManager2({ isAdmin }) {
  const [isAdminState, setIsAdminState] = useState(isAdmin ? true : false);
  return (
    <div>{isAdminState === true ? <LoggedIn admin={setIsAdminState} /> : <Password admin={setIsAdminState} />}</div>
  );
}

export default offersManager2;

export async function getServerSideProps({ req }) {
  let isAdmin = false;
  const adminCookie = req.cookies.admin_access_cookie;
  if (adminCookie === "Kamal you now are have admin access!") {
    isAdmin = true;
  }

  return {
    props: { isAdmin },
  };
}
