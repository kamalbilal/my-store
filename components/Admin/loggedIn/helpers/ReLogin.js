import { IoSyncCircleSharp } from "react-icons/io5";
import { deleteCookie } from "cookies-next";

function ReLogin({ admin }) {
  return (
    <div>
      <button
        onClick={() => {
          admin(false);
          deleteCookie("admin_access_cookie");
        }}
        style={{
          position: "absolute",
          right: "10px",
          top: "10px",
          color: "red",
          backgroundColor: "white",
          borderRadius: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: "scale(2)",
          padding: "0",
          margin: "0",
        }}
      >
        <IoSyncCircleSharp />
      </button>
    </div>
  );
}

export default ReLogin;
