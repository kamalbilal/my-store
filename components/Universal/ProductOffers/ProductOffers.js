import Product from "../Product";
import styles from "./ProductOffers.module.css";
import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa";
import cn from "classnames";
import { useRef, useState, useEffect, createRef } from "react";
import { useIsVisible } from "react-is-visible";
import useEffectOnce from "../useEffectOnce";
import Countdown from "react-countdown";

function ProductOffers({ Title, Time, ShowAll_Link_button, ProductsData }) {
  // const ProductsData = [
  //   {
  //     productLink: "",
  //     productName: "Soft Fluffy Makeup Brushes",
  //     imageLink: "",
  //     orignalPrice: 7.99,
  //     afterDiscountPrice: null,
  //   },
  //   {
  //     productLink: "",
  //     productName: "Soft Fluffy Makeup Brushes",
  //     imageLink: "",
  //     orignalPrice: 7.99,
  //     afterDiscountPrice: null,
  //   },
  // ];

  function createNewRef() {
    return createRef();
  }
  const productSlider = useRef();
  const temp = useRef();

  const [allProductsData, setAllProductsData] = useState(ProductsData);
  const [allProducts, setAllProducts] = useState();
  const [move, setMove] = useState(0);
  const [showTimer, setShowTimer] = useState(Time ? true : false);
  const [ref_state, setRef_state] = useState(temp);
  const isVisible = useIsVisible(ref_state);
  const [width_state, setWidth_state] = useState();
  const [height, setHeight] = useState();

  const updateDimensions = () => {
    setWidth_state(window.innerWidth);
    setHeight(window.innerHeight);
  };
  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);
  useEffect(() => {
    if (isVisible) {
      console.log("visible");
    } else if (!isVisible) {
      console.log("not visible");
    }
  }, [isVisible]);

  function moveLeft() {
    console.log({ move, zero: 0 });
    setMove((prev) => (prev <= 0 + 600 ? 0 : prev - 400));
  }
  function moveRight() {
    let widths = productSlider.current.scrollWidth;
    const finalWidth = widths - width_state + 30;
    setMove((prev) => (prev >= finalWidth - 600 ? finalWidth : prev + 400));
  }

  useEffect(() => {
    productSlider.current.style.transform = `translateX(-${move}px)`;
  }, [move]);

  function displayingAllProducts() {
    const ref = createNewRef();
    setRef_state(ref);
    setAllProducts(
      allProductsData.map((element, index) => {
        console.log(allProductsData["productName"]);
        return index !== allProductsData.length - 1 ? (
          <Product
            key={index}
            ProductLink={element["productLink"]}
            ImageLink={element["imageLink"]}
            ProductName={element["productName"]}
            OrignalPrice={element["orignalPrice"]}
            AfterDiscountPrice={element["afterDiscountPrice"]}
          />
        ) : (
          <span key={index} ref={ref}>
            <Product
              key={index}
              ProductLink={element["productLink"]}
              ImageLink={element["imageLink"]}
              ProductName={element["productName"]}
              OrignalPrice={element["orignalPrice"]}
              AfterDiscountPrice={element["afterDiscountPrice"]}
            />
          </span>
        );
      })
    );
  }

  useEffect(() => {
    console.log(allProductsData);
    displayingAllProducts();
  }, [allProductsData]);

  const TimerComplete = () => (
    <div className={styles.offerEnded}>Offer Ended!</div>
  );
  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return <TimerComplete />;
    } else {
      // Render a countdown
      return (
        <div className={cn(styles.title, styles.dateDiv)}>
          <div className={styles.timeTitle}>Time Left</div>
          <div className={styles.timeDiv}>
            <div className={styles.hours}>{hours}</div>
            <div className={styles.timeDot}>:</div>
            <div className={styles.minutes}>{minutes} </div>
            <div className={styles.timeDot}>:</div>
            <div className={styles.seconds}>
              {seconds < 10 ? `0${seconds}` : seconds}
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={cn(styles.title, styles.titleChange)}>{Title}</h1>
        {showTimer === true ? (
          <div>
            <Countdown date={Time} renderer={renderer} />
          </div>
        ) : (
          ""
        )}
        <button className={styles.showAll}>Show All</button>
      </div>
      <div className={styles.products}>
        <button onClick={() => moveLeft()} className={styles.leftIconDiv}>
          <FaArrowCircleLeft className={styles.leftIcon} />
        </button>
        <button onClick={() => moveRight()} className={styles.rightIconDiv}>
          <FaArrowCircleRight className={styles.leftIcon} />
        </button>
        <div ref={productSlider} className={styles.productsDiv}>
          {allProducts}
        </div>
      </div>
    </div>
  );
}

export default ProductOffers;
