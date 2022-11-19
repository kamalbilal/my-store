import styles from "./Navbar.module.css";
import cn from "classnames";
import Image from "next/image";
import Buttons from "./helpers/Buttons";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { RiHeart2Fill } from "react-icons/ri";
import { BsGiftFill } from "react-icons/bs";
import { MdKeyboardArrowDown } from "react-icons/md";
import { IoSearchSharp } from "react-icons/io5";
import { useRef, useEffect, useState } from "react";
import AllCategories from "./helpers/AllCategories";
import { useContext } from "react";
import { CartContext, GiftContext, HeartContext , UserData_context} from "../../../userContext";
import { useRouter } from "next/router";
import Dropdown from "./helpers/Dropdown";

function Navbar() {
  const router = useRouter();
  const { cartNumber, setCartNumber } = useContext(CartContext);
  const { heartNumber, setHeartNumber } = useContext(HeartContext);
  const { giftNumber, setGiftNumber } = useContext(GiftContext);
  const { userData, setUserData } = useContext(UserData_context);

  const dropdownRef = useRef();
  const closeDropdownFromAnywhere_Ref = useRef();
  const allCategoriesOverlay = useRef();
  const allCategoriesOverlayBtn = useRef();
  const searcInputRef = useRef();

  const [allCategoriesOverlay_showing, setallCategoriesOverlay_showing] = useState(false);

  function show_hide_dropdown(hide = null) {
    if (dropdownRef.current.classList.contains(styles.hide)) {
      dropdownRef.current.classList.remove(styles.hide);
    } else {
      dropdownRef.current.classList.add(styles.hide);
    }

    if (closeDropdownFromAnywhere_Ref.current.classList.contains(styles.hide)) {
      closeDropdownFromAnywhere_Ref.current.classList.remove(styles.hide);
    } else {
      closeDropdownFromAnywhere_Ref.current.classList.add(styles.hide);
    }
  }

  function showAllCategoriesOverlay() {
    setallCategoriesOverlay_showing(true);
    allCategoriesOverlay.current.classList.add(styles.showAllCategoriesOverlay);

    setTimeout(() => {
      // setTimeout for animation
      document.querySelector("body").style.overflowY = "hidden";
    }, 200);
  }
  function hideAllCategoriesOverlay() {
    allCategoriesOverlay.current.classList.remove(styles.showAllCategoriesOverlay);
    if (allCategoriesOverlay_showing === true) {
      allCategoriesOverlayBtn.current.focus();
    }
    setallCategoriesOverlay_showing(false);
    document.querySelector("body").style.overflowY = "visible";
  }

  const onkeyDown_func = (event) => {
    if (event.keyCode === 27) {
      //Do whatever when esc is pressed
      hideAllCategoriesOverlay();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", onkeyDown_func, false);

    return () => {
      document.removeEventListener("keydown", onkeyDown_func, false);
    };
  }, []);

  function searchClick() {
    const href = `/search/${searcInputRef.current.value}/1/bestMatch`;
    router.push(href);
  }

  return (
    <div className={styles.navWrapper}>
      <div className={styles.logoDiv}>
        <p className={styles.logo}>Logo</p>
      </div>

      <div className={styles.inputWrapper}>
        <button ref={allCategoriesOverlayBtn} onClick={showAllCategoriesOverlay} className={styles.allCategories_Btn}>
          All Categories <MdKeyboardArrowDown />
        </button>
        <div
          ref={allCategoriesOverlay}
          className={cn(
            // styles.fixed,
            styles.allCategoriesOverlay,
            styles.hideAllCategoriesOverlay
          )}
        >
          <AllCategories HideOverlay_Func={hideAllCategoriesOverlay} />
        </div>
        <input
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.keyCode === 13) {
              searchClick();
            }
          }}
          ref={searcInputRef}
          className={styles.input}
          placeholder="Search"
          type="text"
        />

        <button onClick={searchClick} className={styles.searchIconDiv}>
          <IoSearchSharp className={styles.searchIcon} />
        </button>
      </div>

      <div className={styles.buttons}>
        <Buttons Router={router} Value={giftNumber} Name="Gift" Icon={BsGiftFill} Count={1} Color="blue" />
        <Buttons Router={router} Value={cartNumber} Name="Cart" Icon={FaShoppingCart} Count={1} />
        <Buttons Router={router} Value={heartNumber} Name="Heart" Icon={RiHeart2Fill} Count={7} Color="blue" />
        <Buttons Router={router} Name="Profile" Icon={FaUserCircle} Show_hide_dropdown_Func={show_hide_dropdown} />
        <div ref={closeDropdownFromAnywhere_Ref} className={cn(styles.fixed, styles.hide)} onClick={() => show_hide_dropdown()}></div>

        <div ref={dropdownRef} className={cn(styles.profileDropdown, styles.hide)}>
          <Dropdown userData={userData} setUserData={setUserData} router={router} hideDropDown={show_hide_dropdown} CartIcon={FaShoppingCart} HeartIcon={RiHeart2Fill}/>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
