import axios from "axios";
import { useRef, useState } from "react";

function Password({ admin }) {
  const [loginText, setLoginText] = useState("Login");

  const usernameRef = useRef();
  const passwordRef = useRef();

  async function login() {
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    setLoginText("Logging In...");
    let options = {
      url: "http://localhost:8000/admin",
      method: "POST",
      credentials: "include",
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: {
        username,
        password,
        pwd: "Kamal",
      },
    };

    const response = await axios(options).catch((error) => console.log(error));
    setLoginText("Login");
    if (response.data.admin === true) {
      admin(true);
    }
  }

  return (
    <div>
      <div
        style={{
          fontSize: "3rem",
          display: "flex",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          backgroundColor: "black",
          color: "white",
          paddingTop: "200px",
        }}
      >
        <div style={{ display: "flex", gap: "15px" }}>
          <label>Username:</label>
          <input
            defaultValue={"Kamal Admin"}
            ref={usernameRef}
            style={{ fontSize: "3rem" }}
            type="text"
            name=""
            id=""
          />
        </div>
        <br />
        <div style={{ display: "flex", gap: "15px" }}>
          <label>Password:</label>
          <input
            defaultValue={"Admin Access"}
            ref={passwordRef}
            style={{ fontSize: "3rem" }}
            type="text"
            name=""
            id=""
          />
        </div>
        <br />
        <button
          disabled={loginText === "Login" ? false : true}
          style={{
            color: "white",
            backgroundColor: "red",
            padding: "10px 25px",
            borderRadius: "10px",
            fontSize: "2rem",
            userSelect: "none",
            transition: "all",
            transitionDuration: "1000ms",
          }}
          onClick={() => {
            login();
          }}
        >
          {loginText}
        </button>
      </div>
    </div>
  );
}

export default Password;
