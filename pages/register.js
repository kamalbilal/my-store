import { useRef, useEffect } from "react";
import Router from "next/router";
import Link from "next/link";
import { useContext } from "react";
import { VisitedLinksArray } from "../userContext";
import { deleteCookie } from "cookies-next";
import axios from "axios";

function Register() {
  const { visitedLinksArray, setVisitedLinksArray } = useContext(VisitedLinksArray);
  const emailRef = useRef();
  const passwordRef = useRef();

  // const getCookies = function () {
  //   var pairs = document.cookie.split(";");
  //   var cookies = {};
  //   for (var i = 0; i < pairs.length; i++) {
  //     var pair = pairs[i].split("=");
  //     cookies[(pair[0] + "").trim()] = unescape(pair.slice(1).join("="));
  //   }
  //   return cookies;
  // };

  async function register(e) {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    let options = {
      url: "http://localhost:8000/signup",
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
    };

    const response = await axios(options);

    if (response.data.success === true) {
      localStorage.setItem("userData", JSON.stringify({email: response.data.email}))
      const redirectToLink = visitedLinksArray.length > 0 ? visitedLinksArray[visitedLinksArray.length - 1] : "/";
      Router.replace(redirectToLink)
    }
  }

  return (
    <div>
      <div>
        <input ref={emailRef} defaultValue="kamalbilalhuawei@gmail.com" type="email" name="" id="" />
      </div>
      <div>
        <input ref={passwordRef} defaultValue="kamal" type="password" name="" id="" />
      </div>
      <button onClick={register}>Submit</button>
      <br />
      <div>
        <Link href="/login">
          <a>signIn</a>
        </Link>
      </div>
    </div>
  );
}

export async function getServerSideProps({ req, res }) {
  const token = req.cookies.token;
  if (token) {
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
export default Register;
