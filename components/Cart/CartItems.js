import Image from "next/image";
import styles from "./CartItems.module.css";
import Item from "./helpers/Item";
import { SlArrowRight } from "react-icons/sl";
import { useRef } from "react";
import Tippy from "@tippyjs/react";
import { IoCloseSharp } from "react-icons/io5";

function CartItems({ cartData, wishLishContent, ImRadioUnchecked, FaCheckCircle, cn, checkedButton, HiOutlineTrash, RiHeart2Line, FiEdit, useEffect, useState }) {
  const { cartNumber, setCartNumber } = cartData;
  const { wishLishData, setWishLishData } = wishLishContent;
  const { checkedButtonsData, setCheckedButtonsData } = checkedButton;

  const [wishListCheckButtons, setWishListCheckButtons] = useState();
  const addToWishListDialog = useRef();
  const allWishListCheckButtonsRef = useRef({});

  function openWishListDialog() {
    console.log(wishLishData);
    addToWishListDialog.current.showModal();
    setTimeout(() => {
      document.body.style.overflow = "hidden";
    }, 100);

    addToWishListDialog.current.addEventListener(
      "close",
      () => {
        document.body.style.overflow = "auto";
      },
      { once: true }
    );
  }

  useEffect(() => {
    if (wishLishData && wishLishData.hasOwnProperty("wishListNames")) {
      const temp = {};
      for (let index = 0; index < wishLishData["wishListNames"].length; index++) {
        const element = wishLishData["wishListNames"][index];
        if (element == "default") {
          temp[element] = true;
        } else {
          temp[element] = false;
        }
      }

      setWishListCheckButtons(temp);
    }
  }, [wishLishData]);

  useEffect(() => {
    console.log(wishListCheckButtons);
  }, [wishListCheckButtons]);
  
  async function onClickWishListCheckButtons(e, clickedName) {
    console.log(allWishListCheckButtonsRef);
    
    // Object.keys(allWishListCheckButtonsRef.current).forEach((el) => {
    //   allWishListCheckButtonsRef.current[el].classList.remove(styles.selected)
    // })
    // Object.values(allWishListCheckButtonsRef.current).forEach((el) => el.target.classList.remove(styles.selected))
    // e.target.classList.add(styles.selected)

    setWishListCheckButtons((prev) => {
      const temp = { ...prev };
      const keys = Object.keys(temp);
      for (let index = 0; index < keys.length; index++) {
        const element = keys[index];
        if (element === clickedName) {
          temp[element] = true;
        } else {
          temp[element] = false;
        }
      }
      return temp;
    });
  }

  return (
    <div>
      <dialog onClick={(event) => {
        const rect = addToWishListDialog.current.getBoundingClientRect();
        if (event.clientY < rect.top || event.clientY > rect.bottom ||
            event.clientX < rect.left || event.clientX > rect.right) {
            addToWishListDialog.current.close()
        }
        }} ref={addToWishListDialog} className={styles.addToWishListDialog}>
        <h1>Add to wishlist</h1>
        <div>
        <Tippy
            className={cn("customTippy", styles.tippy)}
            duration={200}
            animation="scale"
            theme="light-border"
            allowHTML={true}
            delay={[1000, 0]}
            placement="right"
            trigger='mouseenter'
            appendTo={addToWishListDialog.current}
            zIndex={99999}
            content={
              <span>
                Press <span style={{ color: "red" }}>ESC</span> To Close
              </span>
            }
          >
            <button className={cn(styles.escBtn)} onClick={() => addToWishListDialog.current.close()}>
              <IoCloseSharp className={styles.closeIcon} />
            </button>
          </Tippy>
        </div>
        <p>Please select the category</p>
        <div className={styles.wishlistCategories}>
          {wishLishData && wishListCheckButtons && wishLishData.hasOwnProperty("wishListNames")
            ? wishLishData["wishListNames"].map((name, index) => {
                return (
                  <div ref={(element) => {
                    allWishListCheckButtonsRef.current[index] = (element);
                  }} onClick={(e) => {onClickWishListCheckButtons(e, name)}} key={index} className={cn(styles.wishListItem, wishListCheckButtons[name] === true ? styles.selected : "")}>
                    {wishListCheckButtons[name] === true ? <FaCheckCircle className={cn(styles.wishListCheckBox, styles.scaleAnimate)} /> : <ImRadioUnchecked className={styles.wishListCheckBox} />}
                    <span>{name}</span>
                  </div>
                );
              })
            : ""}
        </div>
        <div className={styles.wishLishSaveButtonDiv}>
          <button>Save</button>
        </div>
      </dialog>
      {cartNumber.hasOwnProperty("data")
        ? Object.values(cartNumber.data)
            .reverse()
            .map((element, index) => {
              return (
                <Item
                  wishLishData={wishLishData}
                  openWishListDialog={openWishListDialog}
                  key={index}
                  cn={cn}
                  Image={Image}
                  data={element}
                  ImRadioUnchecked={ImRadioUnchecked}
                  FaCheckCircle={FaCheckCircle}
                  SlArrowRight={SlArrowRight}
                  checkedButtonsData={checkedButtonsData}
                  setCheckedButtonsData={setCheckedButtonsData}
                  HiOutlineTrash={HiOutlineTrash}
                  RiHeart2Line={RiHeart2Line}
                  FiEdit={FiEdit}
                  useEffect={useEffect}
                />
              );
            })
        : "Loading"}
    </div>
  );
}

export default CartItems;
