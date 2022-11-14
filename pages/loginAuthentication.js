// import { getCookies, getCookie, setCookie, deleteCookie } from "cookies-next";
import { setCookie, deleteCookie } from "cookies-next";

function loginAuthentication() {
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

  let response = await fetch(`http://localhost:8000/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, pwd: "Kamal" }),
  });

  const status = response.status;
  response = await response.json();

  console.log(response);

  if (status === 200) {
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
  } else if (status === 401) {
    // credentials error
    deleteCookie("email", { req, res });
    deleteCookie("password", { req, res });
    return {
      redirect: {
        permanent: true,
        destination: "/login?error=Credentials error.",
      },
    };
  } else {
    // error somethings wrong
  }

  return {
    props: {},
  };
}
export default loginAuthentication;
