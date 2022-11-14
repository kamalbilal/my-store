import styles from "./SearchGrid.module.css";
import { useEffect, useState, useRef, useContext, createRef, memo } from "react";
import axios from "axios";
import Image from "next/image";
import { FaHeart } from "react-icons/fa";
import cn from "classnames";
import { useRouter } from "next/router";

function SearchGrid({ data, displayInGrid, titlePageSort, page, title, showNextPageAfter, sortby }) {
  const router = useRouter();

  const { searchedData, setSearchedData } = data;
  const { pageNumber, setPageNumber } = page;
  const [getMoreProducts, setGetMoreProducts] = useState(true);

  const mainDivRef = useRef();
  const showMoreBtnDivRef = useRef();
  const showMoreBtnRef = useRef();
  const noMoreProductsRef = useRef();
  const loaderRef = useRef();

  async function getSearchedProducts(pagenumber) {
    let options = {
      url: "http://localhost:8000/getsearchedproducts",
      method: "POST",
      credentials: "include",
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: {
        title: title,
        pageNumber: pagenumber,
        sort: sortby,
        pwd: "Kamal",
      },
    };

    // setTimeout(async () => {
    showLoader();
    const response = await axios(options).catch((error) => console.log(error));
    setPageNumber((prev) => prev + 1);
    hideLoader();
    if (!response) return console.log("response error");
    if (response.data.success === true) {
      console.log(response.data);
      if (response.data.products.length > 0) {
        setSearchedData((prev) => ({ ...prev, [titlePageSort]: [...prev[titlePageSort], ...response.data.products] }));
      }
    }
    // }, 5000);
  }

  function showLoader() {
    hide_ShowMoreBtn();
    hide_noMoreProducts();
    loaderRef.current.style.display = "flex";
  }
  function hideLoader() {
    loaderRef.current.style.display = "none";
  }

  function hide_ShowMoreBtn() {
    showMoreBtnDivRef.current.classList.remove(styles.show);
  }
  function show_ShowMoreBtn() {
    hideLoader();
    hide_noMoreProducts();
    showMoreBtnDivRef.current.classList.add(styles.show);
  }
  function hide_noMoreProducts() {
    noMoreProductsRef.current.classList.remove(styles.show);
  }
  function show_noMoreProducts() {
    hide_ShowMoreBtn();
    hideLoader();
    noMoreProductsRef.current.classList.add(styles.show);
  }

  function onClick_showMore() {
    window.scrollTo(0, 0);
    router.push(`/search/glasses/${pageNumber + 1}/bestMatch`);
  }

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);
          if (getMoreProducts === true) {
            console.log("entry");
            getSearchedProducts(pageNumber + 1);
          }
        }
      });
    });

    const lastDiv = document.querySelector(".allSearchedProducts:last-child");

    observer.observe(lastDiv);

    return () => {
      observer.disconnect();
    };
  }, [searchedData, getMoreProducts]);

  useEffect(() => {
    if (searchedData[titlePageSort].length > showNextPageAfter) {
      setGetMoreProducts(false);
      show_ShowMoreBtn();
      console.log("greater");
    } else {
      setGetMoreProducts(true);
    }
  }, [searchedData]);

  return (
    <div ref={mainDivRef} className={displayInGrid === true ? styles.grid : styles.list}>
      <div className={styles.productData}>
        {searchedData[titlePageSort].map((element, index) => {
          return (
            <div id={index} key={index} className={cn(styles.product, "allSearchedProducts")}>
              <div className={styles.image}>
                <Image src={element.images[0]} width={230} height={230} objectFit="contain" />
                <button
                  onClick={() => {
                    const heart = document.querySelector(`#heart-${index}`);

                    if (heart.classList.contains(styles.heart_gray)) {
                      // add to heart
                      heart.classList.remove(styles.heart_gray);
                      heart.classList.add(styles.heart_red);
                    } else {
                      // remove from heart
                      heart.classList.remove(styles.heart_red);
                      heart.classList.add(styles.heart_gray);
                    }
                  }}
                  className={styles.heartBtn}
                >
                  <FaHeart id={`heart-${index}`} className={cn(styles.heart, styles.heart_gray)} />
                </button>
              </div>
              <div className={styles.details}>
                <div className={styles.title} title={element.title}>
                  {element.title}
                </div>
                <div className={styles.price}>US ${element.maxPrice}</div>
                <div className={styles.sold}>20 Sold</div>
                <div className={styles.shipping}>Free Shipping</div>
              </div>
            </div>
          );
        })}
      </div>

      <div ref={showMoreBtnDivRef} className={styles.showMore}>
        <button ref={showMoreBtnRef} onClick={onClick_showMore}>
          Show More
        </button>
      </div>
      <div ref={loaderRef} className={styles.loader}>
        <div className="lds-dual-ring"></div>
      </div>

      <div ref={noMoreProductsRef} className={styles.showMore}>
        <button disabled={true}>No More Products</button>
      </div>
    </div>
  );
}

export default memo(SearchGrid);
