// import { getCookies, getCookie, setCookie, deleteCookie } from "cookies-next";
import { setCookie, deleteCookie } from "cookies-next";

function registerAuthentication() {
  return <div>authenticating...</div>;
}

export async function getServerSideProps({ req, res, query }) {
  const queryLink = query.links;
  if (!queryLink) {
    return {
      redirect: {
        permanent: true,
        destination: "/",
      },
    };
  }
  const links = JSON.parse(query.links) || [];
  const redirectToLink = links.length - 1 > 0 ? links[links.length - 1] : "/";
  const email = req.cookies.email;
  const password = req.cookies.password;

  if (!email && !password) {
    return {
      redirect: {
        permanent: true,
        destination: redirectToLink,
      },
    };
  }

  let response = await fetch(`http://localhost:8000/signup`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, pwd: "Kamal" }),
  });

  const status = response.status;
  response = await response.json();

  if (status === 201) {
    // success
    setCookie("web_token", response["token"], { req, res, maxAge: 60 * 6 * 24, httpOnly: true });
    deleteCookie("email", { req, res });
    deleteCookie("password", { req, res });
    return {
      redirect: {
        permanent: true,
        destination: redirectToLink,
      },
    };
  } else if (status === 409) {
    // email already exist
    deleteCookie("email", { req, res });
    deleteCookie("password", { req, res });
    return {
      redirect: {
        permanent: true,
        destination: "/register?error=Email already exists.",
      },
    };
  } else {
    // error somethings wrong
  }

  return {
    props: {},
  };
}
export default registerAuthentication;
