import { useRef, useEffect } from "react";
import Router from "next/router";
import Link from "next/link";
import { useContext } from "react";
import { VisitedLinksArray } from "../userContext";
import axios from "axios";
// import { deleteCookie } from "cookies-next";

function Login() {
  const { visitedLinksArray, setVisitedLinksArray } = useContext(VisitedLinksArray);
  const emailRef = useRef();
  const passwordRef = useRef();

  // function setCredentials() {
  //   document.cookie = "email=" + email.current.value;
  //   document.cookie = "password=" + password.current.value;
  //   Router.push("/loginAuthentication?links=" + JSON.stringify(visitedLinksArray));
  // }

  // const getCookies = function () {
  //   var pairs = document.cookie.split(";");
  //   var cookies = {};
  //   for (var i = 0; i < pairs.length; i++) {
  //     var pair = pairs[i].split("=");
  //     cookies[(pair[0] + "").trim()] = unescape(pair.slice(1).join("="));
  //   }
  //   return cookies;
  // };

  async function login(e) {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    
    const url = "http://localhost:8000/login";
    let options = {
      url: url,
      method: "POST",
      credentials: "include",
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: {
        email,
        password,
        pwd: "Kamal",
      },
      // const response = await fetch(url, options);
    };

    const response = await axios(options);
    console.log(response.data);
    if (response.data.success === true) {
      localStorage.setItem("userData", JSON.stringify({email: response.data.email}))
      console.log(visitedLinksArray);
      const redirectToLink = visitedLinksArray.length > 0 ? visitedLinksArray[visitedLinksArray.length - 1] : "/";
      Router.replace(redirectToLink)
    }
  }

  return (
    <div>
      <div>
        <input ref={emailRef} defaultValue="kamalbilalhuawei@gmail.com" type="email" name="" />
      </div>
      <div>
        <input ref={passwordRef} defaultValue="kamal" type="password" name="" />
      </div>
      <button onClick={login}>Login</button>
      <br />
      <div>
        <Link href="/register">
          <a>signUp</a>
        </Link>
      </div>
    </div>
  );
}

export async function getServerSideProps({ req, res }) {
  const token = req.cookies.token;
  if (token) {
    // deleteCookie("email", { req, res });
    // deleteCookie("password", { req, res });
    return {
      redirect: {
        permanent: true,
        destination: "/",
      },
    };
  }

  return {
    props: {},
  };
}
export default Login;
