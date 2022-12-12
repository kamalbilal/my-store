import Image from "next/image";
import styles from "./CartItems.module.css";
import Item from "./helpers/Item";
import { SlArrowRight } from "react-icons/sl";
import { useRef } from "react";
import Tippy from "@tippyjs/react";
import { IoCloseSharp } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import MyAxios from "../../libs/MyAxios";

function CartItems({ cartData, wishLishContent, ImRadioUnchecked, FaCheckCircle, cn, checkedButton, HiOutlineTrash, RiHeart2Line, FiEdit, useEffect, useState }) {
  const { cartNumber, setCartNumber } = cartData;
  const { wishListData, setWishListData } = wishLishContent;
  const { checkedButtonsData, setCheckedButtonsData } = checkedButton;

  const [wishListCheckButtons, setWishListCheckButtons] = useState();
  const [wishListSelectedAttributes, setWishListSelectedAttributes] = useState();
  const addToWishListDialog = useRef();
  const allWishListCheckButtonsRef = useRef({});
  const wishListToastRef = useRef(null);

  function openWishListDialog(event) {
    console.log(cartNumber);
    setWishListSelectedAttributes((prev) => ({
      ...prev,
      cartName: event.target.getAttribute("data-attribute-cartname"),
      cartId: parseInt(event.target.getAttribute("data-attribute-cartid")),
      selectedProductId: parseInt(event.target.getAttribute("data-attribute-productid")),
      selectedimageurl: event.target.getAttribute("data-attribute-imageurl"),
    }));
    console.log(wishListData);
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
    if (wishListData && wishListData.hasOwnProperty("wishListNames")) {
      const temp = {};
      for (let index = 0; index < wishListData["wishListNames"].length; index++) {
        const element = wishListData["wishListNames"][index];
        if (element == "default") {
          temp[element] = true;
        } else {
          temp[element] = false;
        }
      }

      setWishListCheckButtons(temp);
      setWishListSelectedAttributes((prev) => ({
        ...prev,
        name: wishListData["wishListNames"][0],
        id: parseInt(wishListData["wishListIds"][0]),
      }));
    }
  }, [wishListData]);

  useEffect(() => {
    console.log(wishListCheckButtons);
  }, [wishListCheckButtons]);

  useEffect(() => {
    console.log(wishListSelectedAttributes);
  }, [wishListSelectedAttributes]);

  async function onClickWishListCheckButtons(e, clickedName) {
    console.log(allWishListCheckButtonsRef);

    setWishListSelectedAttributes((prev) => ({
      ...prev,
      id: parseInt(e.target.getAttribute("data-attribute-id")),
      name: e.target.getAttribute("data-attribute-name"),
    }));

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

  async function saveToWishList() {
    console.log(wishListSelectedAttributes);
    const url = "http://localhost:8000/addtowishlist";
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
        cartId: wishListSelectedAttributes["cartId"],
        productId: wishListSelectedAttributes["selectedProductId"],
        wishListNameId: wishListSelectedAttributes["id"],
        selectedImageUrl: wishListSelectedAttributes["selectedimageurl"],
      },
      // const response = await fetch(url, options);
    };

    addToWishListDialog.current.close();
    const temp2 = { count: cartNumber["count"], data: { ...cartNumber["data"] } };

    wishListToastRef.current = toast("Successfully moved to wishlist", {
      theme: "dark",
      type: "success",
      position: "top-right",
      pauseOnHover: true,
      pauseOnFocusLoss: false,
      autoClose: 5000,
      limit: 1,
    });
    setCartNumber((prev) => {
      const temp = { ...prev };
      temp["count"] = temp["count"] - 1;
      delete temp["data"][wishListSelectedAttributes["cartName"]];
      return temp;
    });

    const response = await MyAxios(options);
    if (response["success"] === false || response.data.success !== true) {
      setCartNumber(temp2);
      toast.dismiss(wishListToastRef.current);
      toast("Somethings goes wrong!", {
        theme: "colored",
        type: "error",
        position: "top-right",
        pauseOnHover: true,
        pauseOnFocusLoss: false,
        autoClose: 5000,
        limit: 1,
      });
    }
  }

  return (
    <div>
      <ToastContainer style={{ fontSize: "1.4rem" }} />
      <dialog
        onClick={(event) => {
          const rect = addToWishListDialog.current.getBoundingClientRect();
          if (event.clientY < rect.top || event.clientY > rect.bottom || event.clientX < rect.left || event.clientX > rect.right) {
            addToWishListDialog.current.close();
          }
        }}
        ref={addToWishListDialog}
        className={styles.addToWishListDialog}
      >
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
            trigger="mouseenter"
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
          {wishListData && wishListCheckButtons && wishListData.hasOwnProperty("wishListNames")
            ? wishListData["wishListNames"].map((name, index) => {
                return (
                  <div
                    data-attribute-name={name}
                    data-attribute-id={wishListData["wishListIds"][index]}
                    ref={(element) => {
                      allWishListCheckButtonsRef.current[index] = element;
                    }}
                    onClick={(e) => {
                      onClickWishListCheckButtons(e, name);
                    }}
                    key={index}
                    className={cn(styles.wishListItem, wishListCheckButtons[name] === true ? styles.selected : "")}
                  >
                    {wishListCheckButtons[name] === true ? <FaCheckCircle className={cn(styles.wishListCheckBox, styles.scaleAnimate)} /> : <ImRadioUnchecked className={styles.wishListCheckBox} />}
                    <span>{name}</span>
                  </div>
                );
              })
            : ""}
        </div>
        <div className={styles.wishLishSaveButtonDiv}>
          <button onClick={saveToWishList}>Save</button>
        </div>
      </dialog>
      {cartNumber.hasOwnProperty("data")
        ? Object.values(cartNumber.data)
            .reverse()
            .map((element, index) => {
              return (
                <Item
                  wishListData={wishListData}
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
