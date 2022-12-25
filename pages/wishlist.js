import cn from "classnames";
import { useContext, useEffect, useRef, useState } from "react";
import MyAxios from "../libs/MyAxios";
import { WishLishContext } from "../userContext";
import styles from "../styles/wishlist.module.css";
import { HiOutlineTrash } from "react-icons/hi";
import { FiEdit3 } from "react-icons/fi";
import { IoEyeOutline } from "react-icons/io5";
import { IoIosArrowDropupCircle } from "react-icons/io";
import { BsFillArrowUpCircleFill } from "react-icons/bs";
import Image from "next/image";
import { useRouter } from "next/router";

function Wishlist() {
  const router = useRouter();

  const { wishListData, setWishListData } = useContext(WishLishContext);
  const [nextTabData, setNextTabData] = useState("Default");
  const [scrollToAllListTab, setScrollToAllListTab] = useState(0);
  const [scrollToAllDefaultTab, setScrollToAllDefaultTab] = useState(0);
  const [changeTabs, setChangeTabs] = useState({ allList: true, default: false });

  const allListsRef = useRef([]);
  const defaultListRef = useRef();
  const dummyheightRef = useRef();

  const allListBtn = useRef();
  const nextListBtn = useRef();

  const allListDiv = useRef();
  const nextListDiv = useRef();
  const stickyDivRef = useRef();
  const scrollTopArrowRef = useRef();

  useEffect(() => {
    if (wishListData && !wishListData.hasOwnProperty("wishListData")) {
      //
      async function getWishListData() {
        const options = {
          url: "http://localhost:8000/getwishlist",
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
        };
        const response = await MyAxios(options);
        console.log(response);
        if (response["success"] === true && response["data"].hasOwnProperty("wishListData")) {
          console.log({ ...wishListData });
          setWishListData((prev) => {
            const temp = { ...prev };
            temp["wishListData"] = response["data"]["wishListData"];
            return temp;
          });
        }
      }
      getWishListData();
    }
  }, []);

  function toggleAllListTab() {
    if (changeTabs["allList"] === true) return;
    setChangeTabs((prev) => ({ allList: true, default: false }));

    nextListBtn.current.classList.remove(styles.active);
    allListBtn.current.classList.add(styles.active);

    allListDiv.current.classList.remove(styles.hide);
    nextListDiv.current.classList.add(styles.hide);

    defaultListRef.current.classList.add(styles.noAnimation);

    setScrollToAllDefaultTab(document.body.scrollTop || document.documentElement.scrollTop);
    console.log({ scrollToAllListTab });
    window.scrollTo({
      top: scrollToAllListTab,
    });
  }

  function toggleDefaultTab(scrollToTop = false) {
    if (changeTabs["default"] === true) return;
    setChangeTabs((prev) => ({ allList: false, default: true }));

    setScrollToAllListTab(document.body.scrollTop || document.documentElement.scrollTop);
    window.scrollTo({
      top: scrollToTop != false ? 0 : scrollToAllDefaultTab,
    });

    allListBtn.current.classList.remove(styles.active);
    nextListBtn.current.classList.add(styles.active);

    nextListDiv.current.classList.remove(styles.hide);
    allListDiv.current.classList.add(styles.hide);

    allListsRef.current.map((el) => el.classList.add(styles.noAnimation));
  }

  console.log(wishListData);

  function handleScroll() {
    const rect = stickyDivRef.current.getBoundingClientRect();

    if (rect.top > 0 && rect.top != 0) {
      stickyDivRef.current.classList.remove(styles.sticky);
      dummyheightRef.current.style.height = "0px"
      const searchBar = document.querySelector(".searchBar");
      if (searchBar) {
        searchBar.style.visibility = "visible";
      }
    } else if (rect.top < -25) {
      dummyheightRef.current.style.height = "25px"
      stickyDivRef.current.classList.add(styles.sticky);
      const searchBar = document.querySelector(".searchBar");
      if (searchBar) {
        searchBar.style.visibility = "hidden";
      }
    }

    //
    const windowScrollXPosition = document.body.scrollTop || document.documentElement.scrollTop;
    if (windowScrollXPosition > 200) {
      scrollTopArrowRef.current.classList.remove(styles.hide);
    } else {
      scrollTopArrowRef.current.classList.add(styles.hide);
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleRouteChange = (url) => {
      const searchBar = document.querySelector(".searchBar");
      if (searchBar) {
        searchBar.style.visibility = "visible";
      }
    };

    router.events.on("routeChangeStart", handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, []);

  return (
    <div className={styles.main}>
      <div
        onClick={() => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }}
        ref={scrollTopArrowRef}
        className={cn(styles.scrollToTop, styles.hide)}
      >
        <BsFillArrowUpCircleFill />
      </div>
      {/* left */}
      <div className={styles.left}>
        <div className={cn("niceBox", styles.title)}>
          <h1>My Wishlist</h1>
        </div>

        <div className={cn(styles.wishlistContent, "niceBox")}>
          <div ref={dummyheightRef}></div>
          <div ref={stickyDivRef} className={styles.buttons}>
            <button onClick={toggleAllListTab} ref={allListBtn} className={styles.active}>
              All Lists
            </button>
            <button onClick={() => toggleDefaultTab()} ref={nextListBtn} className={styles.nextListBtn}>
              Default
            </button>
          </div>

          <div ref={allListDiv}>
            {wishListData.hasOwnProperty("wishListData") && wishListData.hasOwnProperty("wishListNames")
              ? wishListData["wishListNames"].map((el, index) => {
                  return (
                    <div
                      ref={(element) => {
                        allListsRef.current[index] = element;
                      }}
                      key={index}
                      className={cn(styles.alllist, "niceBox")}
                    >
                      <div className={styles.itemNameDiv}>
                        <p className={styles.itemName}>{el}</p>
                        <div className={styles.itemButtons}>
                          <button
                            onClick={() => {
                              nextListBtn.current.innerHTML = el;
                              defaultListRef.current.classList.remove(styles.collapse);
                              setNextTabData(el);
                              // setScrollToAllListTab(0);
                              // setScrollToAllDefaultTab(0)
                              toggleDefaultTab(true);
                            }}
                          >
                            <IoEyeOutline className={styles.eyeIcon} /> <span>Show</span>
                          </button>
                          <button>
                            <FiEdit3 /> <span>Rename</span>
                          </button>
                          <button>
                            <HiOutlineTrash />
                            <span>Delete</span>
                          </button>
                          <button
                            onClick={(event) => {
                              const parentDiv = event.target.parentNode.parentNode.parentNode;
                              parentDiv.classList.remove(styles.noAnimation);
                              if (parentDiv.classList.contains(styles.collapse)) {
                                parentDiv.classList.add(styles.expand);
                                parentDiv.classList.remove(styles.collapse);
                              } else {
                                parentDiv.classList.add(styles.collapse);
                                parentDiv.classList.remove(styles.expand);
                              }
                            }}
                            className={styles.arrowIconBtn}
                          >
                            <IoIosArrowDropupCircle className={styles.arrowIcon} />
                          </button>
                        </div>
                      </div>
                      <div className={styles.imagesDiv}>
                        {wishListData["wishListData"].hasOwnProperty(el) && wishListData["wishListData"][el].length > 0 ? (
                          Object.values(wishListData["wishListData"][el])
                            .slice(0, 5)
                            .map((item, index2) => {
                              return <Image key={index2} className={styles.image} src={item["selectedImageUrl"]} width={150} height={150} draggable={false} />;
                            })
                        ) : (
                          <EmptyList />
                        )}
                      </div>
                    </div>
                  );
                })
              : "loading"}
          </div>

          <div ref={nextListDiv} className={styles.hide}>
            {nextTabData ? (
              <div ref={defaultListRef} className={cn(styles.alllist, "niceBox", styles.noAnimation)}>
                <div className={styles.itemNameDiv}>
                  <p className={styles.itemName}>{nextTabData}</p>
                  <div className={styles.itemButtons}>
                    <button>
                      <FiEdit3 /> <span>Rename</span>
                    </button>
                    <button>
                      <HiOutlineTrash />
                      <span>Delete</span>
                    </button>
                    {/* <button
                      onClick={(event) => {
                        const parentDiv = event.target.parentNode.parentNode.parentNode;
                        parentDiv.classList.remove(styles.noAnimation);
                        if (parentDiv.classList.contains(styles.collapse)) {
                          parentDiv.classList.add(styles.expand);
                          parentDiv.classList.remove(styles.collapse);
                        } else {
                          parentDiv.classList.add(styles.collapse);
                          parentDiv.classList.remove(styles.expand);
                        }
                      }}
                      className={styles.arrowIconBtn}
                    >
                      <IoIosArrowDropupCircle className={styles.arrowIcon} />
                    </button> */}
                  </div>
                </div>
                <div className={styles.imagesDiv} style={{ flexDirection: "column", alignItems: "flex-start" }}>
                  {wishListData && wishListData.hasOwnProperty("wishListData") && wishListData["wishListData"].hasOwnProperty(nextTabData) && wishListData["wishListData"][nextTabData].length > 0 ? (
                    wishListData["wishListData"][nextTabData].map((item, index2) => {
                      return (
                        <div key={index2} style={{ width: "100%" }}>
                          <div className={styles.nextTabProducts}>
                            <div className={styles.nextTabProductsImage}>
                              <Image className={styles.image} src={item["selectedImageUrl"]} width={150} height={150} draggable={false} />
                            </div>
                            <div className={styles.nextTabProducts_right}>
                              <div className={styles.nextTabProductsTitle}>{item["title"]}</div>
                              <div className={styles.nextTabProductsPrice}>$1500</div>
                            </div>
                            <div>fhhfh</div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <EmptyList />
                  )}
                </div>
              </div>
            ) : (
              "loading"
            )}
          </div>
        </div>
      </div>

      {/* right */}
      <div></div>
    </div>
  );
}

function EmptyList() {
  return (
    <div className={styles.emptyList}>
      <img src="/wishlist.svg" alt="" draggable="false" />
      <h3>This list is empty</h3>
      <p>To add items tap the heart icon and pick a list</p>
    </div>
  );
}

export default Wishlist;
