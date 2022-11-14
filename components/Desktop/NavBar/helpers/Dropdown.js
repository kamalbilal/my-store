import cn from "classnames";
import styles from "./Dropdown.module.css";
import {IoLogOut} from "react-icons/io5"
import {BsPersonCircle} from "react-icons/bs"
import {RiSettings4Fill} from "react-icons/ri"
import { useEffect, useState } from "react";
import axios from "axios";

function Dropdown({ userData, setUserData, router, hideDropDown, CartIcon, HeartIcon }) {
  const [isUserLoggedIn, setisUserLoggedIn] = useState(userData.hasOwnProperty("email"));
  
  useEffect(() => {
    setisUserLoggedIn(userData.hasOwnProperty("email"))
  }, [userData])
  

  function register(params) {
    hideDropDown();
    router.push("/register");
  }
  
  function login(params) {
    hideDropDown();
    router.push("/login");
  }
  async function logout() {
    // hideDropDown();
    const url = "http://localhost:8000/logout";
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
        pwd: "Kamal",
      },
      // const response = await fetch(url, options);
    };

    setUserData({})
    const response = await axios(options);
    
  }
  return (
    <div>
      {isUserLoggedIn === false ? (
        <div className={styles.noAccount}>
          <button onClick={register} className={styles.button}>
            Register
          </button>
          <button onClick={login} className={cn(styles.button, styles.login)}>
            Login
          </button>
        </div>
      ) : (
        <div className={styles.account}>
          <div className={styles.accountTitle}>Welcome Back!</div>
          <div className={styles.accountDetail}>{userData.email}</div>
        </div>
      )}

      <div className={styles.dropdown}>
        {isUserLoggedIn === true ? (
          <button onClick={() => logout()}>
            <BsPersonCircle className={cn(styles.icons, styles.accountIcons)} />
            <div>My Account</div>
          </button>
        ) : (
          ""
        )}
        <button onClick={() => hideDropDown()}>
          <CartIcon className={styles.icons} />
          <div>My Cart</div>
        </button>
        <button onClick={() => hideDropDown()}>
          <HeartIcon className={styles.icons} />
          <div>My Wish List</div>
        </button>
       
          <button onClick={() => logout()}>
            <RiSettings4Fill className={cn(styles.icons, styles.settingIcon)} />
            <div>Settings</div>
          </button>
        
        {isUserLoggedIn === true ? (
          <button onClick={() => logout()}>
            <IoLogOut className={cn(styles.icons, styles.logoutIcon)} />
            <div>Logout</div>
          </button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default Dropdown;
