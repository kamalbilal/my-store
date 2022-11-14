import Manager from "../../../components/Admin/manager/Manager";
import styles from "./manager.module.css";
function manager({ offerId, isAdmin }) {
  return (
    <div>
      {isAdmin === true ? <Manager offerId={offerId} /> : <div className={styles.notAuthorized}>Not Authorized</div>}
    </div>
  );
}

export async function getServerSideProps({ req, query }) {
  const { id } = query;
  if (!id) {
    return {
      notFound: true,
    };
  }
  const offerId = id;
  let isAdmin = false;
  const adminCookie = req.cookies.admin_access_cookie;
  if (adminCookie === "Kamal you now are have admin access!") {
    isAdmin = true;
  }

  return {
    props: { offerId, isAdmin },
  };
}

export default manager;
