import styles from "./ProductLayout.module.css";
import Image from "next/image";
import cn from "classnames";
import { useRef, useState, useEffect, createRef } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { AiFillMinusCircle, AiFillPlusCircle } from "react-icons/ai";
import { MdLocationPin } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { ImRadioUnchecked } from "react-icons/im";
import Tippy from "@tippyjs/react";
import Tooltip from "../Desktop/Tooltip/Tooltip";
import Tabs from "./Tabs";
import { useContext } from "react";
import { CartContext, GiftContext, HeartContext } from "../../userContext";
import { replaceAll } from "../../libs/replace";
// require("dotenv").config();
import axios from "axios";

function ProductLayout({ productData }) {
  const { cartNumber, setCartNumber } = useContext(CartContext);

  useEffect(() => {
    // //console.log(cartNumber);
  }, [cartNumber]);

  //console.log(productData);
  const allImagesRefs = useRef([]);
  const modalRef = useRef();
  const allImagesModalRefs = useRef([]);
  const [allImages, setAllImages] = useState(productData["images"]);
  const [mainImage, setMainImage] = useState(productData["images"][0]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const sizeColors_allRefs = {};
  const [sizeColorsSelectedData, setSizeColorsSelectedData] = useState({});
  const [defaultQuality, setDefaultQuality] = useState(productData["quantityAvaliable"]);
  const [mappingQuality_state, setMappingQuality_state] = useState();
  const [onClickGetSelectedItems, setOnClickGetSelectedItems] = useState();
  const mappingQuality = {};
  const [containHash, setContainHash] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [inputFocused, setInputFocused] = useState(false);
  const plusBtnRef = useRef();
  const quantityInput = useRef();
  const [addToCart, setAddToCart] = useState(false);
  const [maxPurchaseLimit, setMaxPurchaseLimit] = useState(productData["maxPurchaseLimit"]);

  const [mainshippingFee, setMainshippingFee] = useState();
  const [shippingData, setShippingData] = useState();
  const [shippingDataSelected, setShippingDataSelected] = useState(null);
  const [allShippingCharges, setAllShippingCharges] = useState();
  const [productSelectedDetailsIndex, setProductSelectedDetailsIndex] = useState({});
  const [toggleCheckBtn, setToggleCheckBtn] = useState({});
  const [productSelectedImageForCart, setProductSelectedImageForCart] = useState();
  const [productDataContainImage, setProductDataContainImage] = useState(false);
  const [totalNumberOfProductDetails, setTotalNumberOfProductDetails] = useState(0);
  const shippingMethodModalRef = useRef();
  const addToCardDiv_ref = useRef();
  const addToCart_BuyNow_ref = useRef();
  const addToCart_AddToCart_ref = useRef();
  const cartErrorRef = useRef();
  const runUseEffect1 = useRef(true);
  const runUseEffect2 = useRef(true);
  const runUseEffect3 = useRef(true);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function splitAll(string, split) {
    string = replaceAll(string, split, "@^");
    string = string.split("^");
    const array = [];
    string.forEach((element) => {
      if (element.includes("@")) {
        element = element.split("@")[0];
        array.push(element);
      }
    });

    return array;
  }

  useEffect(() => {
    // if (runUseEffect1.current === true) {
    // runUseEffect1.current = false;
    let tempArray = [];
    productData["priceList"].forEach((element, index) => {
      let tempString = "";
      const value = element["skuVal"]["availQuantity"];
      let key = element["skuAttr"];
      let count = 0;
      if (key.includes("#")) {
        setContainHash(true);
        let keys = replaceAll(key, "#", "@^");
        let first = true;
        keys = keys.split("@");
        let newKeys = [];
        keys.forEach((element, index) => {
          if (element.includes("^")) {
            element = element.split(";")[0].split("^")[1];
            newKeys.push(element);
            if (first === true) {
              first = false;
              tempString += replaceAll(element, " ", "-");
            } else {
              tempString += ":" + replaceAll(element, " ", "-");
            }

            if (!tempArray.includes(element)) {
              tempArray.push(element);
            }
            setOnClickGetSelectedItems((prevState) => ({
              ...prevState,
              total: count,
              allowedNames: tempArray,
              focused: false,
            }));
            count += 1;
          }
        });
      } else {
        // for only numbers
        key = splitAll(key, ";");
        key.forEach((element, index) => {
          if (index !== key.length - 1) {
            tempString += element.split(":")[1] + ":";
          } else {
            tempString += element.split(":")[1];
          }

          if (!tempArray.includes(element)) {
            tempArray.push(element);
          }

          setOnClickGetSelectedItems((prevState) => ({
            ...prevState,
            total: count,
            allowedNames: tempArray,
            focused: false,
          }));
          count += 1;
        });
      }
      if (mappingQuality[tempString] === undefined) {
        mappingQuality[tempString] = value;
      } else if (mappingQuality[tempString] == 0 && value > 0) {
        mappingQuality[tempString] = value;
      } else if (value < mappingQuality[tempString]) {
        mappingQuality[tempString] = value;
      }
    });
    setMappingQuality_state(mappingQuality);
    // }
  }, []);

  useEffect(() => {
    if (onClickGetSelectedItems) {
      // //console.log(onClickGetSelectedItems);
      const length = Object.keys(onClickGetSelectedItems).length - 3 || 0; // removing "total" and "allowedNames" and "focused" from length
      if (length >= onClickGetSelectedItems["total"] && onClickGetSelectedItems["focused"] === true) {
        let tempString = "";
        let first = true;
        for (let x in onClickGetSelectedItems) {
          if (x !== "total" && x !== "focused" && x !== "allowedNames") {
            if (first === true) {
              first = false;
              tempString += replaceAll(onClickGetSelectedItems[x], " ", "-");
            } else {
              tempString += ":" + replaceAll(onClickGetSelectedItems[x], " ", "-");
            }
          }
        }
        // //console.log({ tempString, mappingQuality_state });
        setDefaultQuality(mappingQuality_state[tempString]);
        const qualityInputValue = quantityInput.current.value * 1;
        if (qualityInputValue > mappingQuality_state[tempString]) {
          setQuantity(mappingQuality_state[tempString]);
        }
      } else {
        setDefaultQuality(productData["quantityAvaliable"]);
      }
    }
  }, [onClickGetSelectedItems]);

  useEffect(() => {
    if (defaultQuality > 0 && quantity === 0) {
      setQuantity(1);
    }
  }, [defaultQuality]);

  useEffect(() => {
    document.addEventListener("keydown", onkeyDown_func, false);

    return () => {
      document.removeEventListener("keydown", onkeyDown_func, false);
    };
  }, []);

  useEffect(() => {
    if (quantity > defaultQuality) {
      setQuantity(defaultQuality);
    }
    if (maxPurchaseLimit > 0 && quantity > maxPurchaseLimit) {
      setQuantity(maxPurchaseLimit);
    }
    changeShippingPrices();
  }, [quantity]);

  useEffect(() => {
    const tempArray = [];
    // productData["shipping"][0]["generalFreightInfo"]["originalLayoutResultList"].forEach((element, index) => {
    productData["shipping"]["generalFreightInfo"]["originalLayoutResultList"].forEach((element, index) => {
      //console.log(element);
      tempArray.push(element["bizData"]["shippingFee"]);
      if (index === 0) {
        setToggleCheckBtn((prev) => ({ ...prev, [index]: true }));
      } else {
        setToggleCheckBtn((prev) => ({ ...prev, [index]: false }));
      }
    });
    setAllShippingCharges(tempArray);
  }, []);

  useEffect(() => {
    if (allShippingCharges) {
      let allAreFree = true;
      allShippingCharges.forEach((element, index) => {
        if ((allAreFree = true)) {
          if (element === "free" || element === "Free") {
            allAreFree = true;
          } else {
            allAreFree = false;
          }
        }
      });
      if (allAreFree === true) {
        setMaxPurchaseLimit(1);
      }
    }
  }, [allShippingCharges]);

  function getChangeShippingPricesValues(price) {
    if (price < 1) {
      return 0.15;
    } else if (price < 2) {
      return 0.35;
    } else if (price < 3) {
      return 0.55;
    } else if (price < 4) {
      return 0.75;
    } else if (price < 5) {
      return 0.9;
    } else if (price < 6) {
      return 1.05;
    } else if (price < 7) {
      return 1.3;
    } else if (price < 8) {
      return 1.45;
    } else if (price < 9) {
      return 1.65;
    } else if (price < 10) {
      return 1.8;
    } else if (price >= 10) {
      return 2.0;
    } else {
      return 2.0;
    }
  }
  useEffect(() => {
    // productData["shipping"][0]["generalFreightInfo"]["originalLayoutResultList"].map((element, index) => {
    productData["shipping"]["generalFreightInfo"]["originalLayoutResultList"].map((element, index) => {
      const newPrice = element["bizData"]["displayAmount"] || "free";
      const oldPrice = element["bizData"]["displayAmount"] || "free";
      const fulldate = new Date(element["bizData"]["deliveryDate"]);
      const month = monthNames[fulldate.getMonth()];
      const date = fulldate.getDate();
      element["bizData"]["deliveryDate"] = `${month} ${date}`;
      const bizData = element["bizData"];
      setShippingData((prev) => ({
        ...prev,
        [index]: {
          oldPrice,
          newPrice,
          increment: getChangeShippingPricesValues(oldPrice),
          display: true,
          selected: false,
          bizData: { ...bizData },
        },
      }));

      if (index === 0) {
        setMainshippingFee({
          oldPrice,
          newPrice,
          increment: getChangeShippingPricesValues(oldPrice),
          display: true,
          selected: false,
          bizData: { ...bizData },
        });
      }
    });
  }, []);

  function showImageModal() {
    modalRef.current.classList.add(styles.imageModalShow);
    allImagesModalRefs.current[currentImageIndex].focus();
    setTimeout(() => {
      // setTimeout for animation
      document.querySelector("body").style.overflowY = "hidden";
    }, 200);
  }
  function hideImageModal() {
    modalRef.current.classList.remove(styles.imageModalShow);
    // allImagesRefs.current[currentImageIndex].focus();
    document.querySelector("body").style.overflowY = "visible";
  }

  const onkeyDown_func = (event) => {
    if (event.keyCode === 27) {
      //Do whatever when esc is pressed
      hideImageModal();
    }
  };

  function smallImageFunctionality(e) {
    const id = e.target.id * 1;
    setMainImage(allImages[id * 1]);
    setCurrentImageIndex(id * 1);
    allImagesRefs.current.map((element) => {
      element.classList.remove(styles.smallImagesOutline);
    });
    allImagesRefs.current[id].classList.add(styles.smallImagesOutline);
    allImagesRefs.current[id].focus();

    // modal
    allImagesModalRefs.current.map((element) => {
      element.classList.remove(styles.smallImagesOutline);
    });
    allImagesModalRefs.current[id].classList.add(styles.smallImagesOutline);
    allImagesModalRefs.current[id].focus();
  }
  function smallImageModalFunctionality(e) {
    const id = e.target.id * 1;
    setMainImage(allImages[id * 1]);
    setCurrentImageIndex(id * 1);

    allImagesModalRefs.current.map((element) => {
      element.classList.remove(styles.smallImagesOutline);
    });
    allImagesModalRefs.current[id].classList.add(styles.smallImagesOutline);
    allImagesModalRefs.current[id].focus();
    allImagesRefs.current.map((element) => {
      element.classList.remove(styles.smallImagesOutline);
    });
    allImagesRefs.current[id].classList.add(styles.smallImagesOutline);
  }

  function showShippingMethodModal() {
    setTimeout(() => {
      // setTimeout for animation
      document.querySelector("body").style.overflowY = "hidden";
    }, 20);
    shippingMethodModalRef.current.classList.remove(styles.shippingModalHide);
  }
  function hideShippingMethodModal() {
    document.querySelector("body").style.overflowY = "visible";
    shippingMethodModalRef.current.classList.add(styles.shippingModalHide);
  }

  function round(value, exp) {
    if (typeof exp === "undefined" || +exp === 0) return Math.round(value);

    value = +value;
    exp = +exp;

    if (isNaN(value) || !(typeof exp === "number" && exp % 1 === 0)) return NaN;

    // Shift
    value = value.toString().split("e");
    value = Math.round(+(value[0] + "e" + (value[1] ? +value[1] + exp : exp)));

    // Shift back
    value = value.toString().split("e");
    return +(value[0] + "e" + (value[1] ? +value[1] - exp : -exp));
  }

  useEffect(() => {
    if (shippingData) {
      // //console.log(toggleCheckBtn);

      const data = shippingData;
      const keys = Object.keys(data);
      if (shippingDataSelected === null) {
        let run = true;
        keys.map((element, index) => {
          if (data[element]["display"] === true && run === true) {
            run = false;
            setMainshippingFee(data[element]);
            for (let x in toggleCheckBtn) {
              if (x == element) {
                setToggleCheckBtn((prev) => ({ ...prev, [index]: true }));
              } else {
                setToggleCheckBtn((prev) => ({ ...prev, [x]: false }));
              }
            }
          }
        });
      } else {
        const isSelectedFree = data[keys[shippingDataSelected]]["oldPrice"];
        // //console.log(isSelectedFree);
        if (isSelectedFree === "free") {
          let run = true;
          keys.map((element, index) => {
            // //console.log(data[element]);
            if (data[element]["display"] === true && data[element]["oldPrice"] !== "free" && run === true) {
              run = false;
              setMainshippingFee(data[element]);
              for (let x in toggleCheckBtn) {
                if (x == element) {
                  setToggleCheckBtn((prev) => ({ ...prev, [index]: true }));
                } else {
                  setToggleCheckBtn((prev) => ({ ...prev, [x]: false }));
                }
              }
            }
          });
        }
      }
    }
  }, [shippingDataSelected, quantity]);

  useEffect(() => {
    // //console.log({ shippingData });
  }, [shippingData]);

  useEffect(() => {
    if (runUseEffect2.current === true) {
      runUseEffect2.current = false;
      productData["sizesColors"].map((element, index) => {
        const propertyName = element["skuPropertyName"];
        if (propertyName === "Ships From") {
          return;
        }
        setTotalNumberOfProductDetails((prev) => prev + 1);
      });
    }
  }, []);

  // useEffect(() => {
  //   const alreadyInCart = cartNumber["ids"].hasOwnProperty(productData["_id"]);
  //   if (alreadyInCart) {
  //     const tempCartNumber = cartNumber;
  //     tempCartNumber["count"] = Object.keys(tempCartNumber["ids"]).length;
  //     setCartNumber({ ...tempCartNumber });
  //     setAddToCart(true);
  //   }
  // }, []);

  // useEffect(() => {
  //   if (
  //     runUseEffect3.current === true &&
  //     setQuantity &&
  //     mappingQuality_state &&
  //     sizeColors_allRefs &&
  //     addToCart &&
  //     cartNumber
  //   ) {
  //     const alreadyInCart = cartNumber["ids"].hasOwnProperty(productData["_id"]);
  //     runUseEffect3.current = false;
  //     if (alreadyInCart === true) {
  //       try {
  //         const keys = Object.keys(sizeColors_allRefs);
  //         keys.map((element, index) => {
  // //console.log(element);
  //           sizeColors_allRefs[element][
  //             cartNumber["ids"][productData["_id"]]["productSelectedDetailsIndex"][element]
  //           ].current.click();
  //         });
  //         setAddToCart(true);
  //         setQuantity(cartNumber["ids"][productData["_id"]]["quantity"]);
  //       } catch {
  // //console.log("Auto select UnSuccessfull");
  //       }
  //     }
  //   }
  // }, [cartNumber]);

  // useEffect(() => {
  //   const keys = Object.keys(cartNumber);
  //   if (keys.length > 0 && cartNumber["ids"].hasOwnProperty(productData["_id"])) {
  //     const productSelectedDetails_names = cartNumber[productData["_id"]]["productSelectedDetails"];
  //     const productSelectedDetailsIndex_values = cartNumber[productData["_id"]]["productSelectedDetailsIndex"];
  //   }
  // }, [cartNumber]);

  function changeShippingPrices() {
    if (shippingData) {
      const data = shippingData;
      let value = quantityInput.current.value * 1;
      Object.keys(data).map((element, index) => {
        if (data[element]["oldPrice"] === "free" && value != 1) {
          data[element]["display"] = false;
          return;
        }
        if (data[element]["oldPrice"] === "free" && value == 1) {
          data[element]["display"] = true;
          return;
        }

        if (value === 1) {
          data[element]["newPrice"] = data[element]["oldPrice"];
        } else {
          data[element]["newPrice"] = data[element]["oldPrice"] + round((value - 1) * data[element]["increment"], 2);
        }
      });
      setShippingData({ ...data });
    }
  }

  useEffect(() => {
    // //console.log(mainImage);
  }, [mainImage]);

  async function addToCart_To_Server(cartData, type) {
    let options = {
      url: "http://localhost:8000/addtocart",
      method: "POST",
      credentials: "include",
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: {
        cartData,
        pwd: "Kamal",
        type: type, // add or remove
      },
    };

    const response = await axios(options).catch((error) => console.log(error));
    console.log(response);
  }

  Array.prototype.remove = function (from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
  };
  return (
    <div className={styles.container}>
      {/* left */}
      {/* MODAL START */}
      <div ref={modalRef} className={styles.imageModal}>
        {/* button */}
        <div>
          <Tippy
            duration={0}
            placement="left"
            content={
              <Tooltip Place="left">
                <span>
                  Press <span style={{ color: "red" }}>ESC</span> To Close
                </span>
              </Tooltip>
            }
          >
            <button className={cn(styles.escBtn)} onClick={hideImageModal}>
              <IoCloseSharp className={styles.closeIcon} />
            </button>
          </Tippy>
        </div>
        {/* button end */}element
        <div className={styles.left} onClick={hideImageModal}>
          <div className={styles.mainImageModalDiv}>
            <Image
              id="image"
              src={mainImage}
              unoptimized={true}
              className={styles.modalImage}
              // width={550}
              // height={550}
              draggable={false}
              objectFit="contain"
              layout="fill"
            />
          </div>
          <div className={cn(styles.smallImages, styles.smallImagesModal)} onClick={(event) => event.stopPropagation()}>
            {productData["images"].map((element, index) => {
              let classnames;
              if (index === 0) {
                classnames = cn(styles.smallImagesBtn, styles.smallImagesOutline);
              } else {
                classnames = styles.smallImagesBtn;
              }
              return (
                <button
                  className={classnames}
                  key={index}
                  ref={(element) => {
                    allImagesModalRefs.current[index] = element;
                  }}
                  id={index}
                  onMouseOver={(e) => {
                    smallImageModalFunctionality(e);
                  }}
                  onClick={(e) => {
                    smallImageModalFunctionality(e);
                  }}
                  onFocus={(e) => {
                    smallImageModalFunctionality(e);
                  }}
                >
                  <Image
                    key={index}
                    id={index}
                    src={element}
                    className={styles.smallImage}
                    width={50}
                    height={50}
                    draggable={false}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {/* MODAL END */}
      <div className={styles.left}>
        <button className={styles.mainImageBtn} onClick={showImageModal}>
          <Image
            src={mainImage}
            unoptimized={true}
            className={styles.image}
            width={400}
            height={400}
            draggable={false}
          />
        </button>
        <div className={styles.smallImages}>
          {productData["images"].map((element, index) => {
            let classnames;
            if (index === 0) {
              classnames = cn(styles.smallImagesBtn, styles.smallImagesOutline);
            } else {
              classnames = styles.smallImagesBtn;
            }
            return (
              <button
                className={classnames}
                key={index}
                ref={(element) => {
                  allImagesRefs.current[index] = element;
                }}
                id={index}
                onMouseOver={(e) => {
                  smallImageFunctionality(e);
                }}
                onClick={(e) => {
                  smallImageFunctionality(e);
                }}
                onFocus={(e) => {
                  smallImageFunctionality(e);
                }}
              >
                <Image
                  key={index}
                  id={index}
                  src={element}
                  className={styles.smallImage}
                  width={50}
                  height={50}
                  draggable={false}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* right */}
      <div className={styles.right}>
        {/* title */}
        <div className={styles.title}>
          <span className={styles.heading}>Product:</span>
          {productData["title"]}
        </div>

        {/* Price */}
        <div className={cn(styles.title, styles.price)}>
          <span className={styles.heading}>Price:</span>US ${productData["maxPrice"]}
        </div>

        {/* sizesColors */}
        {productData["sizesColors"].map((element, index) => {
          const propertyName = element["skuPropertyName"];
          if (propertyName === "Ships From") {
            return;
          }

          return (
            <div key={index}>
              <span className={styles.heading}>
                {propertyName}:<span className={styles.selectedValue}>{sizeColorsSelectedData[propertyName]}</span>
              </span>
              <div className={styles.values}>
                {element["skuPropertyValues"].map((element2, index2) => {
                  if (index2 === 0) {
                    sizeColors_allRefs[propertyName] = [];
                  }
                  const newRef = createRef();
                  sizeColors_allRefs[propertyName].push(newRef);

                  const containImage = element2.hasOwnProperty("skuPropertyImagePath");
                  return (
                    <div
                      id={index2}
                      className={cn(styles.item, containImage === true ? "" : styles.item_padding)}
                      key={index2}
                      ref={newRef}
                      data-attribute={element2["propertyValueDisplayName"]}
                      data-attribute-numbers={element2["propertyValueIdLong"]}
                      onClick={(e) => {
                        //console.log({ defaultQuality, quantity });

                        if (containImage === true) {
                          setProductDataContainImage(true);
                        }
                        const id = e.target.id * 1;
                        const dataAttribute = e.target.getAttribute("data-attribute");
                        const dataAttributeNumbers = e.target.getAttribute("data-attribute-numbers");

                        setSizeColorsSelectedData((prevState) => ({
                          ...prevState,
                          [propertyName]: dataAttribute,
                        }));
                        setProductSelectedDetailsIndex((prevState) => ({
                          ...prevState,
                          [propertyName]: index2,
                        }));
                        setAddToCart(false);
                        if (sizeColors_allRefs[propertyName][id].current.classList.contains(styles.itemFocus)) {
                          sizeColors_allRefs[propertyName][id].current.classList.remove(styles.itemFocus);
                          const sizeColorsSelectedDataVar = sizeColorsSelectedData;
                          sizeColorsSelectedDataVar[propertyName] = null;
                          setSizeColorsSelectedData({ ...sizeColorsSelectedDataVar });

                          if (containHash === true) {
                            if (onClickGetSelectedItems["allowedNames"].includes(dataAttribute)) {
                              setOnClickGetSelectedItems((prevState) => ({
                                ...prevState,
                                [index]: dataAttribute,
                                focused: false,
                              }));
                            }
                          } else {
                            if (onClickGetSelectedItems["allowedNames"].includes(dataAttributeNumbers)) {
                              setOnClickGetSelectedItems((prevState) => ({
                                ...prevState,
                                [index]: dataAttributeNumbers,
                                focused: false,
                              }));
                            }
                          }
                          if (!isNaN(mappingQuality_state[element2["propertyValueDisplayName"]])) {
                            setDefaultQuality(productData["quantityAvaliable"]);
                          }
                        } else {
                          sizeColors_allRefs[propertyName].map((test_e) => {
                            test_e.current.classList.remove(styles.itemFocus);
                          });
                          sizeColors_allRefs[propertyName][id].current.classList.add(styles.itemFocus);

                          if (containHash === true) {
                            if (onClickGetSelectedItems["allowedNames"].includes(dataAttribute)) {
                              setOnClickGetSelectedItems((prevState) => ({
                                ...prevState,
                                [index]: dataAttribute,
                                focused: true,
                              }));
                            }
                          } else {
                            if (onClickGetSelectedItems["allowedNames"].includes(dataAttributeNumbers)) {
                              setOnClickGetSelectedItems((prevState) => ({
                                ...prevState,
                                [index]: dataAttributeNumbers,
                                focused: true,
                              }));
                            }
                          }

                          if (containImage) {
                            setMainImage(element2["skuPropertyImagePath"]);
                            setProductSelectedImageForCart(element2["skuPropertyImagePath"]);
                            allImagesRefs.current.map((element3) => {
                              element3.classList.remove(styles.smallImagesOutline);
                            });
                          }

                          if (!isNaN(mappingQuality_state[element2["propertyValueDisplayName"]])) {
                            setDefaultQuality(mappingQuality_state[dataAttribute]);
                          }
                        }
                      }}
                    >
                      {containImage === true ? (
                        <span className={cn(styles.smallImage2)} onClick={(e) => e.preventDefault()}>
                          <Image
                            src={element2["skuPropertyImagePath"]}
                            width={50}
                            height={50}
                            objectFit="contain"
                            draggable={false}
                          />
                        </span>
                      ) : (
                        element2["propertyValueDisplayName"]
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Quantity */}
        <div className={cn(styles.colors, styles.quantityDiv)}>
          <div className={styles.quantityTitle}>
            Quantity:<span className={styles.colorName}>{quantity}</span>
          </div>
          <div className={styles.quantityCounter}>
            <button
              className={styles.counterBtn}
              onClick={() => {
                quantityInput.current.focus();
                setQuantity((prev) => prev - 1);
              }}
              disabled={quantity <= 1 ? true : false}
            >
              <AiFillMinusCircle />
            </button>
            <div className={styles.quantityInputDiv}>
              <input
                ref={quantityInput}
                size={2}
                type="text"
                placeholder={quantity}
                value={quantity}
                onBlur={() => {
                  setInputFocused(false);
                  if ((quantity === 0 && inputFocused === true) || quantity === "0" || quantity < 0) {
                    setQuantity(1);
                  }
                }}
                onFocus={() => {
                  if (quantity !== 0) {
                    setInputFocused(true);
                  } else if (inputFocused === true) {
                    setInputFocused(false);
                  }
                }}
                onInput={(e) => {
                  const value = e.target.value * 1;
                  if (!isNaN(value)) {
                    setQuantity(value);
                  }
                  if (value > defaultQuality) {
                    setQuantity(defaultQuality);
                  }
                }}
                className={
                  quantity <= 9 ? styles.quantityText0To9 : cn(styles.quantityText0To9, styles.quantityText10To99)
                }
              />
            </div>
            <button
              className={styles.counterBtn}
              ref={plusBtnRef}
              disabled={
                maxPurchaseLimit > 0
                  ? quantity >= maxPurchaseLimit
                    ? true
                    : quantity === 0
                    ? true
                    : false
                  : quantity >= defaultQuality
                  ? true
                  : false
              }
              onClick={() => {
                //console.log({ maxPurchaseLimit, quantity, defaultQuality });
                quantityInput.current.focus();
                setQuantity((prev) => prev + 1);
              }}
            >
              <AiFillPlusCircle />
            </button>
            <div>
              {quantity === 0 && inputFocused === false ? (
                <span className={(styles.colorName, styles.outOfStock)}>Out of Stock.</span>
              ) : maxPurchaseLimit > 0 ? (
                `${maxPurchaseLimit} ${
                  maxPurchaseLimit > 1
                    ? productData["multiUnitName"] || "pieces"
                    : productData["oddUnitName"] || "piece"
                }${productData["buyLimitText"] || " at most per customer"}`
              ) : (
                `${defaultQuality} ${productData["multiUnitName"]} Avaliable`
              )}
            </div>
          </div>
        </div>

        {/* Shipping to */}
        <div className={styles.shippingTo}>
          Ship to
          <span>
            <MdLocationPin />
          </span>
          <div className={styles.shippingCountry}>
            <Tippy
              duration={0}
              placement="bottom"
              content={
                <Tooltip Place="bottom-shippingTo">
                  <span className={styles.tooltip}>Currently we only ship to</span>
                  <span className={cn(styles.shippingCountryName, styles.shippingCountryNameTooltip)}>
                    United States
                  </span>
                </Tooltip>
              }
            >
              <button className={styles.shippingCountryName}>United States</button>
            </Tippy>
          </div>
        </div>

        {/* Shipping Method */}
        {mainshippingFee ? (
          <div onClick={showShippingMethodModal} className={cn(styles.colors, styles.shippingDiv)}>
            <div>
              Shipping Fee:
              {mainshippingFee["newPrice"] == "free" ? " Free" : " $" + round(mainshippingFee["newPrice"], 2)}
            </div>
            <div className={styles.shippingDetail}>
              <div>
                {`To 
            ${mainshippingFee["bizData"]["shipTo"]}
            via
            ${mainshippingFee["bizData"]["deliveryProviderName"]}`}
              </div>
              <div className={styles.moreOptions}>
                <div>
                  {`Estimated Date: ${
                    mainshippingFee["bizData"].hasOwnProperty("deliveryDate") === true
                      ? mainshippingFee["bizData"]["deliveryDate"]
                      : mainshippingFee["bizData"]["deliveryTime"] + " Days"
                  }`}
                </div>
                <button onClick={showShippingMethodModal} className={styles.showMoreOptions}>
                  More Options <IoIosArrowDown />
                </button>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}

        {/* shipping Method Modal */}
        <div
          ref={shippingMethodModalRef}
          onClick={hideShippingMethodModal}
          className={cn(styles.colors, styles.shippingModal, styles.shippingModalHide)}
        >
          <div className={styles.shippingModalDiv}>
            <div className={styles.shippingModalTitle}>
              <p>Shipping Method</p>
            </div>
            <div className={styles.shippingModalData}>
              {/* Data */}
              {shippingData
                ? Object.keys(shippingData).map((element, index) => {
                    if (shippingData[element]["display"] === false) {
                      return;
                    }
                    return (
                      <button
                        key={index}
                        onClick={() => {
                          for (let x in toggleCheckBtn) {
                            setToggleCheckBtn((prev) => ({ ...prev, [x]: false }));
                          }
                          setToggleCheckBtn((prev) => ({ ...prev, [index]: true }));
                          setMainshippingFee(shippingData[element]);
                          if (shippingData[element]["oldPrice"] === "free") {
                            setShippingDataSelected(null);
                          } else {
                            setShippingDataSelected(element);
                          }
                        }}
                        className={styles.shippingDetailList}
                      >
                        <div className={styles.shippingFeeTitle}>
                          {shippingData[element]["newPrice"] === "free" ? "Free" : ""} Shipping
                          {shippingData[element]["newPrice"] !== "free"
                            ? ": $" + round(shippingData[element]["newPrice"], 2)
                            : ""}
                        </div>
                        <div className={cn(styles.shippingDetail, styles.shippingDetailLineHeight)}>
                          <div>
                            {`To ${shippingData[element]["bizData"]["shipTo"]} via
                            ${shippingData[element]["bizData"]["deliveryProviderName"]}`}
                          </div>
                          <div>
                            Estimated Date:{" "}
                            {shippingData[element]["bizData"].hasOwnProperty("deliveryDate") === true
                              ? shippingData[element]["bizData"]["deliveryDate"]
                              : shippingData[element]["bizData"]["deliveryTime"] + " Days"}
                          </div>
                        </div>
                        {/* checkbox */}
                        <div className={styles.checkBtn}>
                          {toggleCheckBtn[index] !== true ? (
                            <ImRadioUnchecked className={styles.check} />
                          ) : (
                            <FaCheckCircle className={styles.check} />
                          )}
                        </div>
                      </button>
                    );
                  })
                : ""}

              {/* Data End */}
            </div>
          </div>
        </div>
        {/* shipping Method Modal end */}

        {/* Add to cart */}
        <div ref={addToCardDiv_ref} className={styles.buyDiv}>
          <button
            disabled={quantity == 0 ? true : false}
            ref={addToCart_BuyNow_ref}
            className={cn(styles.buyButton, styles.buyNow)}
          >
            Buy Now
          </button>
          <button
            ref={addToCart_AddToCart_ref}
            disabled={quantity == 0 ? true : false}
            onMouseOver={() => {
              const numberOfSelectedProductsDetails = Object.keys(sizeColorsSelectedData);
              const totalNumberOfProductsDetails = totalNumberOfProductDetails;
              let userSelecedAll = true;
              if (numberOfSelectedProductsDetails.length === totalNumberOfProductsDetails) {
                numberOfSelectedProductsDetails.map((element3, index3) => {
                  if (sizeColorsSelectedData[element3] == null) {
                    userSelecedAll = false;
                    return;
                  }
                });
              } else {
                userSelecedAll = false;
              }
              if (userSelecedAll === false) {
                cartErrorRef.current.classList.add(styles.cartErrorDiv_show);

                return;
              }
            }}
            onMouseLeave={() => {
              cartErrorRef.current.classList.remove(styles.cartErrorDiv_show);
            }}
            onClick={() => {
              //console.log("buy now");
              if (addToCart === false) {
                const numberOfSelectedProductsDetails = Object.keys(sizeColorsSelectedData);
                const totalNumberOfProductsDetails = totalNumberOfProductDetails;

                let userSelecedAll = true;
                if (numberOfSelectedProductsDetails.length === totalNumberOfProductsDetails) {
                  numberOfSelectedProductsDetails.map((element3, index3) => {
                    if (sizeColorsSelectedData[element3] == null) {
                      userSelecedAll = false;
                      return;
                    }
                  });
                } else {
                  userSelecedAll = false;
                }

                if (userSelecedAll === false) {
                  cartErrorRef.current.classList.add(styles.cartErrorDiv_show);
                  setTimeout(() => {
                    cartErrorRef.current.classList.remove(styles.cartErrorDiv_show);
                  }, 2000);

                  return;
                } else {
                  if (quantity <= 0) {
                    return;
                  }
                  const tempCartNumber = cartNumber;
                  const alreadyInCart = tempCartNumber["ids"].hasOwnProperty(productData["_id"]);
                  const cartData = {
                    _id: productData["_id"],
                    productPrice: productData["maxPrice"],
                    title: productData["title"],
                    discount: productData["discount"],
                    maxPrice_AfterDiscount: productData["maxPrice_AfterDiscount"],
                    shippingDetails: { ...mainshippingFee },
                    productSelectedDetails: { ...sizeColorsSelectedData },
                    productSelectedDetailsIndex: { ...productSelectedDetailsIndex },
                    quantity: quantity,
                    selectedImage: productDataContainImage === true ? productSelectedImageForCart : mainImage,
                    totalProductOptions: totalNumberOfProductDetails,
                    totalSelectedProductOptions: Object.keys(sizeColorsSelectedData).length,
                  };
                  tempCartNumber["ids"].push(cartData);
                  if (alreadyInCart === false) {
                    tempCartNumber["count"] = Object.keys(tempCartNumber["ids"]).length;
                  }
                  setCartNumber({ ...tempCartNumber });
                  addToCart_To_Server(cartData, "add");
                }
              } else {
                const tempCartNumber = cartNumber;
                // const alreadyInCart = tempCartNumber["ids"].hasOwnProperty(productData["_id"]);
                tempCartNumber["ids"].forEach((element, index) => {
                  if (element["_id"] === productData["_id"]) {
                    addToCart_To_Server(productData["_id"], "remove");
                    tempCartNumber["ids"].remove(index);
                    console.log(tempCartNumber["ids"].length);
                    tempCartNumber["count"] = tempCartNumber["ids"].length;
                    setCartNumber({ ...tempCartNumber });
                  }
                });
              }
              setAddToCart((prev) => !prev);
            }}
            className={cn(styles.buyButton, styles.cartBtn, addToCart === false ? styles.addToCart : styles.success)}
          >
            <div ref={cartErrorRef} className={styles.cartErrorDiv}>
              <div className={styles.cartError}>Please Select All Product Options</div>
              <div className={styles.arrow}>
                <div class={styles.triangleLeft}>
                  <div class={styles.innerTriangle}></div>
                </div>
              </div>
            </div>
            {addToCart === false ? "Add to Cart" : "Added to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductLayout;
