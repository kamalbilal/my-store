import styles from "./ProductLayout.module.css";
import Image from "next/image";
import { useState, createRef, useRef } from "react";
import cn from "classnames";
import { AiFillMinusCircle, AiFillPlusCircle } from "react-icons/ai";
import { MdLocationPin } from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";
import Tippy from "@tippyjs/react";
import Tooltip from "../Desktop/Tooltip/Tooltip";

function ProductLayout({ productData }) {
  const [images, setImages] = useState(productData.images);
  const [mainImage, setMainImage] = useState(productData.images[0]);
  const [colorsImages, setColorsImages] = useState(productData.sizesColors);
  const [colorsNames, setColorsNames] = useState(productData.colors);
  const [colorsName, setColorsName] = useState();
  const [sizes, setSizes] = useState(productData.sizes);
  const [size, setSize] = useState();
  const [quantity, setQuantity] = useState(1);
  const [addToCart, setAddToCart] = useState(false);
  const allRefs = [];
  const allRefsForModal = [];
  const allRefsColorsForModal = [];
  const allRefsColors = [];
  const allRefsSizes = [];
  const quantityInput = useRef();
  const mainImage_Modal = useRef();

  function toggleMainImage_Modal() {
    if (mainImage_Modal.current.classList.contains(styles.none)) {
      mainImage_Modal.current.classList.remove(styles.none);
      document.querySelector("body").style.overflowY = "hidden";
    } else {
      mainImage_Modal.current.classList.add(styles.none);
      document.querySelector("body").style.overflowY = "visible";
    }
  }

  return (
    <div className={styles.container}>
      {/* modals start */}
      <div
        ref={mainImage_Modal}
        id="imageOverlay"
        className={cn(styles.mainImageView, styles.none)}
        onClick={toggleMainImage_Modal}
      >
        <div
          className={styles.mainImageModalDiv}
          onClick={(event) => event.stopPropagation()}
        >
          <Image
            src={mainImage}
            className={styles.modalImage}
            width={550}
            height={550}
            draggable={false}
          />
        </div>
        <div
          className={styles.moreImages}
          onClick={(event) => event.stopPropagation()}
        >
          {images.map((element, index) => {
            const src = element;
            const ref = createRef();
            allRefsForModal.push(ref);
            let classnames;
            if (index === 0) {
              classnames = cn(styles.moreImage, styles.moreImageHover);
            } else {
              classnames = styles.moreImage;
            }
            return (
              <button
                key={index}
                id={index}
                ref={ref}
                className={classnames}
                onMouseOver={(e) => {
                  const id = e.target.id;
                  setMainImage(images[id * 1]);
                  allRefsForModal.forEach((elementRef) => {
                    elementRef.current.classList.remove(styles.moreImageHover);
                  });
                  allRefsColorsForModal.forEach((elementRef) => {
                    elementRef.current.classList.remove(styles.moreImageHover);
                  });
                  allRefsForModal[index].current.classList.add(
                    styles.moreImageHover
                  );
                  //
                  allRefs.forEach((elementRef) => {
                    elementRef.current.classList.remove(styles.moreImageHover);
                  });
                  allRefsColors.forEach((elementRef) => {
                    elementRef.current.classList.remove(styles.moreImageHover);
                  });
                  allRefs[index].current.classList.add(styles.moreImageHover);
                }}
                onClick={(e) => {
                  const id = e.target.id;
                  setMainImage(images[id]);
                  allRefsForModal.forEach((elementRef) => {
                    elementRef.current.classList.remove(styles.moreImageHover);
                  });
                  allRefsColorsForModal.forEach((elementRef) => {
                    elementRef.current.classList.remove(styles.moreImageHover);
                  });
                  allRefsForModal[index].current.classList.add(
                    styles.moreImageHover
                  );
                  //
                  allRefs.forEach((elementRef) => {
                    elementRef.current.classList.remove(styles.moreImageHover);
                  });
                  allRefsColors.forEach((elementRef) => {
                    elementRef.current.classList.remove(styles.moreImageHover);
                  });
                  allRefs[index].current.classList.add(styles.moreImageHover);
                }}
              >
                <Image
                  id={index}
                  src={src}
                  className={styles.image}
                  width={50}
                  height={50}
                  draggable={false}
                />
              </button>
            );
          })}
        </div>

        <button
          className={styles.closeModal}
          onClick={(e) => {
            e.stopPropagation();
            toggleMainImage_Modal();
          }}
        >
          <IoCloseSharp />
        </button>
      </div>
      {/* modals end */}

      <div>
        <div className={styles.mainImage}>
          <Image
            onClick={toggleMainImage_Modal}
            src={mainImage}
            className={styles.image}
            width={400}
            height={400}
            draggable={false}
          />
        </div>
        <div className={cn(styles.moreImages, styles.moreImagesMargin)}>
          {images.map((element, index) => {
            const src = element;
            const ref = createRef();
            allRefs.push(ref);
            let classnames;
            if (index === 0) {
              classnames = cn(styles.moreImage, styles.moreImageHover);
            } else {
              classnames = styles.moreImage;
            }
            return (
              <button
                key={index}
                id={index}
                ref={ref}
                className={classnames}
                onMouseOver={(e) => {
                  const id = e.target.id;
                  setMainImage(images[id * 1]);
                  allRefs.forEach((elementRef) => {
                    elementRef.current.classList.remove(styles.moreImageHover);
                  });
                  allRefsColors.forEach((elementRef) => {
                    elementRef.current.classList.remove(styles.moreImageHover);
                  });
                  allRefs[index].current.classList.add(styles.moreImageHover);
                  //
                  allRefsForModal.forEach((elementRef) => {
                    elementRef.current.classList.remove(styles.moreImageHover);
                  });
                  allRefsColorsForModal.forEach((elementRef) => {
                    elementRef.current.classList.remove(styles.moreImageHover);
                  });
                  allRefsForModal[index].current.classList.add(
                    styles.moreImageHover
                  );
                }}
                onClick={(e) => {
                  const id = e.target.id;
                  setMainImage(images[id]);
                  allRefs.forEach((elementRef) => {
                    elementRef.current.classList.remove(styles.moreImageHover);
                  });
                  allRefsColors.forEach((elementRef) => {
                    elementRef.current.classList.remove(styles.moreImageHover);
                  });
                  allRefs[index].current.classList.add(styles.moreImageHover);
                  //
                  allRefsForModal.forEach((elementRef) => {
                    elementRef.current.classList.remove(styles.moreImageHover);
                  });
                  allRefsColorsForModal.forEach((elementRef) => {
                    elementRef.current.classList.remove(styles.moreImageHover);
                  });
                  allRefsForModal[index].current.classList.add(
                    styles.moreImageHover
                  );
                }}
              >
                <Image
                  id={index}
                  src={src}
                  className={styles.image}
                  width={50}
                  height={50}
                  draggable={false}
                />
              </button>
            );
          })}
        </div>
      </div>
      {/* Right */}
      <div className={styles.right}>
        <div className={styles.productName}>
          Summer Polo Shirt Men Cotton Casual Business Tops Mens Striped
          Poloshirts for Men Shirts Short Sleeve Clothing Ice Felling K522
        </div>
        <div className={styles.price}>
          <div className={styles.afterDiscountPrice}>US $4.88</div>
          <div className={styles.orignalPrice}>US $7.88</div>
          <div className={styles.percentage}>-48%</div>
        </div>
        {/* Colors */}
        <div className={styles.colors}>
          <p>
            Color:<span className={styles.colorName}>{colorsName}</span>
          </p>
          <div className={styles.colorsDiv}>
            {colorsImages.map((element, index) => {
              const src = element;
              const ref = createRef();
              allRefsColors.push(ref);
              const classnames = styles.moreImage;
              return (
                <button
                  key={index}
                  id={index}
                  ref={ref}
                  className={classnames}
                  onMouseOver={(e) => {
                    const id = e.target.id;
                    setMainImage(colorsImages[id * 1]);
                    setColorsName(colorsNames[id * 1]);
                    allRefsColors.forEach((elementRef) => {
                      elementRef.current.classList.remove(
                        styles.moreImageHover
                      );
                    });
                    allRefs.forEach((elementRef) => {
                      elementRef.current.classList.remove(
                        styles.moreImageHover
                      );
                    });
                    allRefsColors[index].current.classList.add(
                      styles.moreImageHover
                    );
                  }}
                  onClick={(e) => {
                    const id = e.target.id;
                    setMainImage(colorsImages[id]);
                    setColorsName(colorsNames[id * 1]);
                    allRefsColors.forEach((elementRef) => {
                      elementRef.current.classList.remove(
                        styles.moreImageHover
                      );
                    });
                    allRefs.forEach((elementRef) => {
                      elementRef.current.classList.remove(
                        styles.moreImageHover
                      );
                    });
                    allRefsColors[index].current.classList.add(
                      styles.moreImageHover
                    );
                  }}
                >
                  <Image
                    id={index}
                    src={src}
                    className={styles.image}
                    width={50}
                    height={50}
                    draggable={false}
                  />
                </button>
              );
            })}
          </div>
        </div>
        {/* sizes */}
        {/* <div className={cn(styles.colors, styles.sizeDiv)}>
          <p>
            Size:<span className={styles.colorName}>{size}</span>
          </p>
          <div className={styles.colorsDiv}>
            {sizes.map((element, index) => {
              const src = element;
              const ref = createRef();
              allRefsSizes.push(ref);
              const classnames = cn(styles.moreImage, styles.sizeButton);
              return (
                <button
                  key={index}
                  id={index}
                  ref={ref}
                  className={classnames}
                  // onMouseOver={(e) => {
                  //   const id = e.target.id;
                  //   setSize(sizes[id * 1]);
                  //   allRefsSizes.forEach((elementRef) => {
                  //     elementRef.current.classList.remove(
                  //       styles.moreImageHover
                  //     );
                  //   });
                  //   allRefsSizes[index].current.classList.add(
                  //     styles.moreImageHover
                  //   );
                  // }}
                  onClick={(e) => {
                    const id = e.target.id;
                    setSize(sizes[id * 1]);
                    allRefsSizes.forEach((elementRef) => {
                      elementRef.current.classList.remove(
                        styles.moreImageHover
                      );
                    });
                    allRefsSizes[index].current.classList.add(
                      styles.moreImageHover
                    );
                  }}
                >
                  {element}
                </button>
              );
            })}
          </div>
        </div> */}

        {/* Quantity */}
        <div className={cn(styles.colors, styles.quantityDiv)}>
          <div className={styles.quantityTitle}>
            Quantity:<span className={styles.colorName}>{quantity}</span>
          </div>
          <div className={styles.quantityCounter}>
            <button
              className={
                quantity <= 1
                  ? cn(styles.counterBtn, styles.disabledBtn)
                  : styles.counterBtn
              }
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
                  if (quantity === 0 || quantity === "0" || quantity < 0) {
                    setQuantity(1);
                  }
                }}
                onInput={(e) => {
                  const value = e.target.value * 1;
                  if (!isNaN(value)) {
                    setQuantity(value);
                  }
                }}
                className={
                  quantity <= 9
                    ? styles.quantityText0To9
                    : cn(styles.quantityText0To9, styles.quantityText10To99)
                }
              />
            </div>
            <button
              className={styles.counterBtn}
              onClick={() => {
                quantityInput.current.focus();
                setQuantity((prev) => prev + 1);
              }}
            >
              <AiFillPlusCircle />
            </button>
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
                  <span className={styles.tooltip}>
                    Currently we only ship to
                  </span>
                  <span
                    className={cn(
                      styles.shippingCountryName,
                      styles.shippingCountryNameTooltip
                    )}
                  >
                    United States
                  </span>
                </Tooltip>
              }
            >
              <button className={styles.shippingCountryName}>
                United States
              </button>
            </Tippy>
          </div>
        </div>

        {/* Shipping Charges */}
        <div className={styles.colors}>
          <div className={styles.quantityTitle}>
            Shipping Fee:
            <span className={styles.shippingFee}>
              $<span>73</span>
            </span>
            {/* <span className={styles.shippingFee}>
              <span>Free</span>
            </span> */}
          </div>
        </div>
        {/* Estimated delivery */}
        <div className={styles.colors}>
          <div className={styles.quantityTitle}>
            Estimated delivery:
            <span className={styles.shippingFee}>
              <span>7-10 days</span>
            </span>
            {/* <span className={styles.shippingFee}>
              <span>Free</span>
            </span> */}
          </div>
        </div>

        {/* Add to cart */}
        <div className={styles.buyDiv}>
          <button className={cn(styles.buyButton, styles.buyNow)}>
            Buy Now
          </button>
          <button
            onClick={() => setAddToCart((prev) => !prev)}
            className={cn(
              styles.buyButton,
              addToCart === false ? styles.addToCart : styles.success
            )}
          >
            {addToCart === false ? "Add to Cart" : "Added to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductLayout;
