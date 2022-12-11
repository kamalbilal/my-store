import styles from "./ProductLayout.module.css";
import Image from "next/image";
import cn from "classnames";
import { useRef, useState, useEffect, memo, useCallback } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { AiFillMinusCircle, AiFillPlusCircle } from "react-icons/ai";
import { MdLocationPin } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { ImRadioUnchecked } from "react-icons/im";
import Tippy from "@tippyjs/react";
import { useContext } from "react";
import { CartContext, GiftContext, HeartContext } from "../../userContext";
import { replaceAll } from "../../libs/replace";
// require("dotenv").config();
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

function ProductLayout({ productData }) {
  const router = useRouter();

  const { cartNumber, setCartNumber } = useContext(CartContext);

  useEffect(() => {
    console.log(cartNumber);
  }, [cartNumber]);

  // console.log(productData);
  const allImagesRefs = useRef([]);
  const modalRef = useRef();
  const allImagesModalRefs = useRef([]);
  const allSizeColorsImagesModalRefs = useRef([]);
  const [allImages, setAllImages] = useState(productData["images"]);
  const [mainImage, setMainImage] = useState(productData["images"][0]);
  const [allImagesSizeColors, setAllImagesSizeColors] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  let sizeColors_allRefs = useRef();
  sizeColors_allRefs = {};
  const [sizeColorsSelectedData, setSizeColorsSelectedData] = useState({});
  const [defaultQuality, setDefaultQuality] = useState(productData["quantityAvaliable"]);
  const [onClickGetSelectedItems, setOnClickGetSelectedItems] = useState();
  const [quantity, setQuantity] = useState(1);
  const [inputFocused, setInputFocused] = useState(false);
  const plusBtnRef = useRef();
  const quantityInput = useRef();
  const [maxPurchaseLimit, setMaxPurchaseLimit] = useState(productData["maxPurchaseLimit"]);
  const [priceList, setPriceList] = useState(productData["priceList"]);
  const [currentPrice, setCurrentPrice] = useState(productData["maxPrice"]);

  const [mainshippingFee, setMainshippingFee] = useState();
  const [shippingData, setShippingData] = useState();
  const [shippingDataSelected, setShippingDataSelected] = useState(null);
  const [allShippingCharges, setAllShippingCharges] = useState();
  const [toggleCheckBtn, setToggleCheckBtn] = useState({});
  const [productSelectedImageForCart, setProductSelectedImageForCart] = useState();
  const [showMainImageModal_OR_SizesColorsModal, setShowMainImageModal_OR_SizesColorsModal] = useState("mainImage"); // true for main image and false for sizeColors modal
  const [totalNumberOfProductDetails, setTotalNumberOfProductDetails] = useState(0);
  const [showAddedCartToast, setShowAddedCartToast] = useState(false);
  const [sizeColorsImagePropertyIndex, setSizeColorsImagePropertyIndex] = useState(null);
  const shippingMethodModalRef = useRef();
  const addToCardDiv_ref = useRef();
  const addToCart_BuyNow_ref = useRef();
  const addToCart_AddToCart_ref = useRef();
  const cartErrorRef = useRef();
  const cartAddedRef = useRef();
  const runUseEffect2 = useRef(true);
  const autoClick = useRef(true);
  const autoSelectShipping = useRef(true);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  useEffect(() => {
    console.log(priceList);
  }, [priceList]);

  useEffect(() => {
    if (sizeColorsImagePropertyIndex === null) {
      const index = productData["sizesColors"].findIndex((el) => el["skuPropertyValues"][0].hasOwnProperty("skuPropertyImagePath"));
      if (index !== -1) {
        setSizeColorsImagePropertyIndex(index);
        setAllImagesSizeColors(productData["sizesColors"][index]["skuPropertyValues"].map((el) => el["skuPropertyImagePath"]));
      }
    }
  }, [sizeColorsImagePropertyIndex]);

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
    if (quantity === 0) {
      return;
    }
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
    productData["shipping"].forEach((element, index) => {
      //console.log(element);
      tempArray.push(element["shippingFee"]);
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
    productData["shipping"].map((element, index) => {
      const newPrice = element["displayAmount"] || "free";
      const oldPrice = element["displayAmount"] || "free";
      if (element["deliveryDate"]) {
        const fulldate = new Date(element["deliveryDate"]);
        const month = monthNames[fulldate.getMonth()];
        const date = fulldate.getDate();
        element["deliveryDate"] = `${month} ${date}`;
      }
      const bizData = element;
      setShippingData((prev) => ({
        ...prev,
        [index]: {
          oldPrice,
          newPrice,
          increment: getChangeShippingPricesValues(oldPrice),
          display: true,
          selected: false,
          bizData: { ...bizData, index },
        },
      }));

      if (index === 0) {
        setMainshippingFee({
          oldPrice,
          newPrice,
          increment: getChangeShippingPricesValues(oldPrice),
          display: true,
          selected: false,
          bizData: { ...bizData, index },
        });
      }
    });
  }, []);

  const onInputArrowKeys = useCallback((e) => {
    if(e.keyCode === 39) {
      console.log("Right Arrow");
      console.log(showMainImageModal_OR_SizesColorsModal);
    } else if(e.keyCode === 37) {
      console.log("Left Arrow");

    }
    return () => {
    document.removeEventListener("keydown", onInputArrowKeys);
    }
  }, [showMainImageModal_OR_SizesColorsModal]);

  function showImageModal() {
    document.addEventListener("keydown", onInputArrowKeys);
    modalRef.current.classList.add(styles.imageModalShow);

    if (showMainImageModal_OR_SizesColorsModal === "mainImage") {
      allImagesModalRefs.current[currentImageIndex].focus();
    } else {
      allSizeColorsImagesModalRefs.current.map((el) => {
        el.classList.remove(styles.smallImagesOutline);
      });
      allSizeColorsImagesModalRefs.current[currentImageIndex].focus();
    }

    setTimeout(() => {
      // setTimeout for animation
      document.querySelector("body").style.overflowY = "hidden";
    }, 200);
  }
  function hideImageModal() {
    document.removeEventListener("keydown", onInputArrowKeys);
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
    if (showMainImageModal_OR_SizesColorsModal === "mainImage") {
      allImagesModalRefs.current.map((element) => {
        element.classList.remove(styles.smallImagesOutline);
      });
      allImagesModalRefs.current[id].classList.add(styles.smallImagesOutline);
      allImagesModalRefs.current[id].focus();
    }
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
  function smallImageSizeColorModalFunctionality(e) {
    if (allImagesSizeColors.length === 0) return;
    const id = e.target.id * 1;
    setMainImage(allImagesSizeColors[id * 1]);
    setCurrentImageIndex(id * 1);

    allSizeColorsImagesModalRefs.current.map((element) => {
      element.classList.remove(styles.smallImagesOutline);
    });
    allSizeColorsImagesModalRefs.current[id].classList.add(styles.smallImagesOutline);
    allSizeColorsImagesModalRefs.current[id].focus();

    // (sizeColors_allRefs[productData["sizesColors"][sizeColorsImagePropertyIndex]["skuPropertyId"]][id]).click()
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

      if (autoSelectShipping.current === true && router.query.hasOwnProperty("s") && router.query.s) {
        const shippingIndex = router.query.s.split(":")[0];
        const shippingCompany = router.query.s.split(":")[1];
        let selectedShippingIndex = Object.values(shippingData).findIndex((el) => el["bizData"]["index"] == shippingIndex && el["bizData"]["company"] == shippingCompany);
        console.log(selectedShippingIndex);
        if (selectedShippingIndex == -1) {
          selectedShippingIndex = Object.values(shippingData).findIndex((el) => el["bizData"]["index"] == shippingIndex);
          if (selectedShippingIndex == -1) {
            selectedShippingIndex = Object.values(shippingData).findIndex((el) => el["bizData"]["company"] == shippingCompany);
            if (selectedShippingIndex == -1) {
              selectedShippingIndex = 0;
            }
          }
        }
        setMainshippingFee(shippingData[selectedShippingIndex]);
        const tempToggleCheckBtn = toggleCheckBtn;
        for (let x in tempToggleCheckBtn) {
          if (x == selectedShippingIndex) {
            tempToggleCheckBtn[x] = true;
          } else {
            tempToggleCheckBtn[x] = false;
          }
        }
        setToggleCheckBtn(tempToggleCheckBtn);
        setShippingDataSelected(selectedShippingIndex);
        autoSelectShipping.current = false;
      }
    }
  }, [quantity, shippingData]);

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

  async function addToCart_To_Server(cartData) {
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
        ...cartData,
        pwd: "Kamal",
      },
    };

    const response = await axios(options).catch((error) => console.log(error));
    console.log(response);
    if(response.data.success === true) {
      setCartNumber((prev) => ({
        ...prev,
        data: {...prev["data"], [cartData.cartName] : {...prev["data"][cartData.cartName], cartId : response.data.id}}
      }))
    } else {
      setCartNumber((prev) => {
        const temp = {...prev}
        delete temp["data"][cartData.cartName]
        return temp
      })
    }
  }

  useEffect(() => {
    setShowAddedCartToast(false);
    let test = "";
    let canRunFully = true;
    for (const key in sizeColorsSelectedData) {
      if (sizeColorsSelectedData[key]["isSelected"] === true) {
        test += sizeColorsSelectedData[key]["Data"];
      } else {
        canRunFully = false;
        break;
      }
    }
    if (canRunFully === false) {
      setDefaultQuality(productData["quantityAvaliable"]);
      return setCurrentPrice(productData["maxPrice"]);
    }

    let index = priceList["InNumbers"].indexOf(test);
    if (index === -1) {
      index = priceList["InNumbers"].indexOf(test.slice(0, -1)); // slice ; from last
      if (index === -1) {
        setDefaultQuality(productData["quantityAvaliable"]);
        return setCurrentPrice(productData["maxPrice"]);
      }
    }
    setCurrentPrice(priceList["Data"][index]["skuCalPrice"]);
    setDefaultQuality(priceList["Data"][index]["availQuantity"]);
    if (quantity > priceList["Data"][index]["availQuantity"]) {
      setQuantity(priceList["Data"][index]["availQuantity"]);
    }
    console.log(quantity);
    console.log(priceList["Data"][index]);
  }, [sizeColorsSelectedData]);

  Array.prototype.remove = function (from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
  };

  function createNewRefs(el, index, skuPropertyId) {
    if (el == null) return;
    if (index === 0) {
      sizeColors_allRefs[skuPropertyId] = [];
    }
    sizeColors_allRefs[skuPropertyId].push(el);
    // console.log({ el, propertyName });
  }

  function hideToastOnClickAnywhere(e) {
    if (e.target.id === "addToCart_button") return;
    console.log("toast added to cart ==> hidden");
    setShowAddedCartToast(false);
  }
  useEffect(() => {
    if (showAddedCartToast === true) {
      cartAddedRef.current.classList.add(styles.cartErrorDiv_show);
      window.addEventListener("click", hideToastOnClickAnywhere);
    } else {
      cartAddedRef.current.classList.remove(styles.cartErrorDiv_show);
    }

    return () => {
      window.removeEventListener("click", hideToastOnClickAnywhere);
    };
  }, [showAddedCartToast]);

  useEffect(() => {
    if (!mainshippingFee || !quantity) return;
    if (autoClick.current === true && (router.query.select || router.query.q || router.query.s) && Object.keys(sizeColorsSelectedData).length == 0) {
      autoClick.current = false;
      setQuantity(router.query.hasOwnProperty("q") ? parseInt(router.query.q) : 1);
      if (router.query.select) {
        let autoSelect = router.query.select;
        autoSelect = autoSelect.includes("-") ? autoSelect : autoSelect + "-";
        router.query.select.split("-").map((el) => {
          if (!el) return;
          el = el.split(":");
          const first = el[0];
          const second = el[1];
          try {
            const element = document.querySelector(`[data-attribute-first='${first}'][data-attribute-second='${second}']`);
            if (element) element.click();
          } catch {
            //
          }
        });
        
      }
      console.log("Clicked");
    } else if (Object.keys(sizeColorsSelectedData).length > 0) {
      let query = "";
      const values = Object.values(sizeColorsSelectedData).filter((el) => el["isSelected"] === true);
      for (let index = 0; index < values.length; index++) {
        const element = values[index];
        if (element["isSelected"] === true) {
          query += element["Data"].replace(";", "");
        }
        console.log({ index, len: values.length });
        if (index !== values.length - 1) {
          query += "-";
        }
      }

      if (query) {
        router.push(`${router.asPath.split("?")[0]}?select=${query}&q=${quantity == 0 ? 1 : quantity}&s=${mainshippingFee["bizData"]["index"] + ":" + mainshippingFee["bizData"]["company"]}`, undefined, { shallow: true });
      } else {
        router.push(router.asPath.split("?")[0], undefined, { shallow: true });
      }
    } else if(totalNumberOfProductDetails === 0) {
      router.push(`${router.asPath.split("?")[0]}?q=${quantity == 0 ? 1 : quantity}&s=${mainshippingFee["bizData"]["index"] + ":" + mainshippingFee["bizData"]["company"]}`, undefined, { shallow: true });
    }
    console.log(totalNumberOfProductDetails);
    console.log(sizeColorsSelectedData);
  }, [sizeColorsSelectedData, mainshippingFee, quantity]);

  return (
    <div className={styles.container}>
      {/* left */}
      {/* MODAL START */}
      <div ref={modalRef} className={styles.imageModal}>
        {/* button */}
        <div>
          <Tippy
            className="customTippy"
            duration={200}
            animation="scale"
            theme="light-border"
            allowHTML={true}
            placement="left"
            content={
              <span>
                Press <span style={{ color: "red" }}>ESC</span> To Close
              </span>
            }
          >
            <button className={cn(styles.escBtn)} onClick={hideImageModal}>
              <IoCloseSharp className={styles.closeIcon} />
            </button>
          </Tippy>
        </div>
        {/* button end */}
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
            {sizeColorsImagePropertyIndex !== null && showMainImageModal_OR_SizesColorsModal === "sizeColorsModal"
              ? productData["sizesColors"][sizeColorsImagePropertyIndex]["skuPropertyValues"].map((element, index) => {
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
                        allSizeColorsImagesModalRefs.current[index] = element;
                      }}
                      id={index}
                      onMouseOver={(e) => {
                        smallImageSizeColorModalFunctionality(e);
                      }}
                      onClick={(e) => {
                        // smallImageModalFunctionality(e);
                      }}
                      onFocus={(e) => {
                        // smallImageModalFunctionality(e);
                      }}
                    >
                      <Image key={index} id={index} src={element["skuPropertyImagePath"]} className={styles.smallImage} width={50} height={50} draggable={false} />
                    </button>
                  );
                })
              : productData["images"].map((element, index) => {
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
                      <Image key={index} id={index} src={element} className={styles.smallImage} width={50} height={50} draggable={false} />
                    </button>
                  );
                })}
          </div>
        </div>
      </div>
      {/* MODAL END */}
      <div className={styles.left}>
        <button className={styles.mainImageBtn} onClick={showImageModal}>
          <Image src={mainImage} unoptimized={true} className={styles.image} width={400} height={400} draggable={false} />
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
                  setShowMainImageModal_OR_SizesColorsModal("mainImage");
                  smallImageFunctionality(e);
                }}
                onClick={(e) => {
                  setShowMainImageModal_OR_SizesColorsModal("mainImage");
                  smallImageFunctionality(e);
                }}
                onFocus={(e) => {
                  setShowMainImageModal_OR_SizesColorsModal("mainImage");
                  smallImageFunctionality(e);
                }}
              >
                <Image key={index} id={index} src={element} className={styles.smallImage} width={50} height={50} draggable={false} />
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
          <span className={styles.heading}>Price:</span>US ${currentPrice}
        </div>

        {/* sizesColors */}
        {productData["sizesColors"].map((element, index) => {
          const propertyName = element["skuPropertyName"];
          const propertyId = element["skuPropertyId"];
          if (propertyName === "Ships From") {
            return;
          }
          return (
            <div key={index}>
              <span className={styles.heading}>
                {propertyName}:<span className={styles.selectedValue}>{sizeColorsSelectedData.hasOwnProperty(index) ? sizeColorsSelectedData[index]["selected"] : ""}</span>
              </span>
              <div className={styles.values}>
                {element["skuPropertyValues"].map((element2, index2) => {
                  const containImage = element2.hasOwnProperty("skuPropertyImagePath");
                  return (
                    <div
                      id={index2}
                      className={cn(styles.item, containImage === true ? "" : styles.item_padding)}
                      key={index2}
                      ref={(ref) => createNewRefs(ref, index2, propertyId)}
                      data-attribute-first={element["skuPropertyId"]}
                      data-attribute-second={element2["propertyValueId"]}
                      data-attribute-third={element2["propertyValueDisplayName"]}
                      onClick={(e) => {
                        const id = e.target.id * 1;
                        setCurrentImageIndex(id);
                        if (containImage === true) {
                          setShowMainImageModal_OR_SizesColorsModal("sizeColorsModal");
                        }

                        const dataAttributeFirst = e.target.getAttribute("data-attribute-first");
                        const dataAttributeSecond = e.target.getAttribute("data-attribute-second");
                        const dataAttributeThird = e.target.getAttribute("data-attribute-third");

                        if (sizeColors_allRefs[dataAttributeFirst][id].classList.contains(styles.itemFocus)) {
                          sizeColors_allRefs[dataAttributeFirst][id].classList.remove(styles.itemFocus);

                          setSizeColorsSelectedData((prevState) => ({
                            ...prevState,
                            [index]: {
                              propertyName,
                              isSelected: false,
                              selected: "",
                              Data: `${dataAttributeFirst}:${dataAttributeSecond};`,
                            },
                          }));
                        } else {
                          sizeColors_allRefs[dataAttributeFirst].map((test_e) => {
                            test_e.classList.remove(styles.itemFocus);
                          });
                          sizeColors_allRefs[dataAttributeFirst][id].classList.add(styles.itemFocus);
                          setSizeColorsSelectedData((prevState) => ({
                            ...prevState,
                            [index]: {
                              propertyName,
                              isSelected: true,
                              selected: dataAttributeThird,
                              Data: `${dataAttributeFirst}:${dataAttributeSecond};`,
                            },
                          }));
                        }

                        if (containImage) {
                          setMainImage(element2["skuPropertyImagePath"]);
                          setProductSelectedImageForCart(element2["skuPropertyImagePath"]);
                          allImagesRefs.current.map((element3) => {
                            element3.classList.remove(styles.smallImagesOutline);
                          });
                        }
                      }}
                    >
                      {containImage === true ? (
                        <span className={cn(styles.smallImage2)} onClick={(e) => e.preventDefault()}>
                          <Image src={element2["skuPropertyImagePath"]} width={50} height={50} objectFit="contain" draggable={false} />
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
                disabled={maxPurchaseLimit > 0 ? (quantity >= maxPurchaseLimit ? true : quantity === 0 ? true : false) : quantity >= defaultQuality ? true : false}
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
                className={quantity <= 9 ? styles.quantityText0To9 : cn(styles.quantityText0To9, styles.quantityText10To99)}
              />
            </div>
            <button
              className={styles.counterBtn}
              ref={plusBtnRef}
              disabled={maxPurchaseLimit > 0 ? (quantity >= maxPurchaseLimit ? true : quantity === 0 ? true : false) : quantity >= defaultQuality ? true : false}
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
                `${maxPurchaseLimit} ${maxPurchaseLimit > 1 ? productData["multiUnitName"] || "pieces" : productData["oddUnitName"] || "piece"}${productData["buyLimitText"] || " at most per customer"}`
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
              className="customTippy"
              duration={200}
              theme="light-border"
              allowHTML={true}
              placement="right"
              animation="scale"
              trigger="click"
              content={
                <>
                  <span className={styles.tooltip}>Currently we only ship to</span>
                  <span className={cn(styles.shippingCountryName, styles.shippingCountryNameTooltip)}>United States</span>
                </>
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
                <div>{`Estimated Date: ${mainshippingFee["bizData"].hasOwnProperty("deliveryDate") === true ? mainshippingFee["bizData"]["deliveryDate"] : mainshippingFee["bizData"]["deliveryTime"] + " Days"}`}</div>
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
        <div ref={shippingMethodModalRef} onClick={hideShippingMethodModal} className={cn(styles.colors, styles.shippingModal, styles.shippingModalHide)}>
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
                          console.log(shippingData);
                          console.log(element);
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
                          {shippingData[element]["newPrice"] !== "free" ? ": $" + round(shippingData[element]["newPrice"], 2) : ""}
                        </div>
                        <div className={cn(styles.shippingDetail, styles.shippingDetailLineHeight)}>
                          <div>
                            {`To ${shippingData[element]["bizData"]["shipTo"]} via
                            ${shippingData[element]["bizData"]["deliveryProviderName"]}`}
                          </div>
                          <div>Estimated Date: {shippingData[element]["bizData"].hasOwnProperty("deliveryDate") === true ? shippingData[element]["bizData"]["deliveryDate"] : shippingData[element]["bizData"]["deliveryTime"] + " Days"}</div>
                        </div>
                        {/* checkbox */}
                        <div className={styles.checkBtn}>{toggleCheckBtn[index] !== true ? <ImRadioUnchecked className={styles.check} /> : <FaCheckCircle className={styles.check} />}</div>
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
            onClick={() => {
              console.log(mainImage);
            }}
            disabled={quantity == 0 ? true : false}
            ref={addToCart_BuyNow_ref}
            className={cn(styles.buyButton, styles.buyNow)}
          >
            Buy Now
          </button>
          <button
            id="addToCart_button"
            ref={addToCart_AddToCart_ref}
            disabled={quantity == 0 ? true : false}
            onMouseOver={() => {
              if (totalNumberOfProductDetails === 0) return // no properties(sizeColors) are available
              if (showAddedCartToast === true) return;
              console.log(sizeColorsSelectedData);
              const numberOfSelectedProductsDetails = Object.keys(sizeColorsSelectedData);
              // const totalNumberOfProductsDetails = totalNumberOfProductDetails;
              if ((numberOfSelectedProductsDetails.length === 0 && totalNumberOfProductDetails > 0) || numberOfSelectedProductsDetails.length !== totalNumberOfProductDetails) {
                return cartErrorRef.current.classList.add(styles.cartErrorDiv_show);
              }

              const isAllSelected = !numberOfSelectedProductsDetails.some((el) => sizeColorsSelectedData[el]["isSelected"] === false);
              if (isAllSelected === false) {
                setShowAddedCartToast(false);
                return cartErrorRef.current.classList.add(styles.cartErrorDiv_show);
              }
            }}
            onMouseLeave={() => {
              cartErrorRef.current.classList.remove(styles.cartErrorDiv_show);
            }}
            onClick={() => {
              if (showAddedCartToast === true) return;
              console.log(sizeColorsSelectedData);
              const numberOfSelectedProductsDetails = Object.keys(sizeColorsSelectedData);
              // const totalNumberOfProductsDetails = totalNumberOfProductDetails;
              if ((numberOfSelectedProductsDetails.length === 0 && totalNumberOfProductDetails > 0) || numberOfSelectedProductsDetails.length !== totalNumberOfProductDetails) {
                return cartErrorRef.current.classList.add(styles.cartErrorDiv_show);
              }

              const isAllSelected = !numberOfSelectedProductsDetails.some((el) => sizeColorsSelectedData[el]["isSelected"] === false);
              if (isAllSelected === true) {
                const cartName = productData["productId"] + "-" + numberOfSelectedProductsDetails.map((el) => sizeColorsSelectedData[el]["Data"].replaceAll(";", "")).join("-");
                const shippingDetails = mainshippingFee["bizData"];
                const shippingPrice = mainshippingFee["newPrice"] === "free" ? 0 : round(mainshippingFee["newPrice"], 2);
                const order_quantity = quantity;
                const selectedProperties = sizeColorsSelectedData;
                const selectedDiscount = 0;

                const serverCartData = {
                  productId: productData["productId"],
                  cartName,
                  selectedImageUrl: mainImage,
                  quantity: order_quantity,
                  price: Number(currentPrice),
                  shippingPrice,
                  discount: selectedDiscount,
                  selectedProperties,
                  shippingDetails,
                };
                console.log(serverCartData);
                addToCart_To_Server(serverCartData);

                const cartDataLocalStorage = {
                  title: productData["title"],
                  productId: productData["productId"],
                  longProductId: productData["longProductId"],
                  cartName,
                  selectedImageUrl: mainImage,
                  selectedQuantity: order_quantity,
                  selectedPrice: Number(currentPrice),
                  selectedShippingPrice: shippingPrice,
                  selectedDiscount,
                  selectedProperties,
                  selectedShippingDetails: shippingDetails,
                  // images: productData["images"],
                  minPrice: productData["minPrice"],
                  maxPrice: productData["maxPrice"],
                  multiUnitName: productData["multiUnitName"],
                  oddUnitName: productData["oddUnitName"],
                  maxPurchaseLimit: productData["maxPurchaseLimit"],
                  buyLimitText: productData["buyLimitText"],
                  quantityAvaliable: productData["quantityAvaliable"],
                  priceList_InNames: productData["priceList_InNames"],
                  priceList_InNumbers: productData["priceList_InNumbers"],
                  priceList_Data: productData["priceList_Data"],
                };
                setCartNumber((prev) => {
                  if (prev.data.hasOwnProperty(cartName)) {
                    return {
                      ...prev,
                      data: {
                        ...prev.data,
                        [cartName]: {
                          ...cartDataLocalStorage,
                        },
                      },
                    };
                  } else {
                    return {
                      ...prev,
                      count: prev.count + 1,
                      data: {
                        ...prev.data,
                        [cartName]: {
                          ...cartDataLocalStorage,
                        },
                      },
                    };
                  }
                });
                setShowAddedCartToast(true);
                // api thing
              } else {
                setShowAddedCartToast(false);
                return cartErrorRef.current.classList.add(styles.cartErrorDiv_show);
              }
            }}
            className={cn(styles.buyButton, styles.cartBtn)}
          >
            <div ref={cartErrorRef} className={styles.cartErrorDiv}>
              <div className={styles.cartError}>Please Select All Product Options</div>
              <div className={styles.arrow}>
                <div class={styles.triangleLeft}>
                  <div class={styles.innerTriangle}></div>
                </div>
              </div>
            </div>
            <div ref={cartAddedRef} className={styles.cartErrorDiv}>
              <div className={cn(styles.cartError, styles.cartAdded)}>
                Successfully Added To Cart
                <br />
                <div className={styles.viewCartBtn}>
                  <Link href="/cart">Go to Cart</Link>
                </div>
              </div>
              <div className={styles.arrow}>
                <div class={cn(styles.triangleLeft, styles.cartAddedTriangleLeft)}>
                  <div class={styles.innerTriangle}></div>
                </div>
              </div>
            </div>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(ProductLayout);
