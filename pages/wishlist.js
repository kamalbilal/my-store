import cn from "classnames";
import { useContext, useEffect, useRef, useState } from "react";
import MyAxios from "../libs/MyAxios";
import { WishLishContext } from "../userContext";
import styles from "../styles/wishlist.module.css";
import { HiOutlineTrash } from "react-icons/hi";
import { FiEdit3 } from "react-icons/fi";
import { IoEyeOutline } from "react-icons/io5";
import { IoIosArrowDropupCircle } from "react-icons/io";
import Image from "next/image";

function Wishlist() {
  const { wishListData, setWishListData } = useContext(WishLishContext);
  const [nextTabData, setNextTabData] = useState({});

  const allListsRef = useRef([]);
  const defaultListRef = useRef()

  const allListBtn = useRef();
  const nextListBtn = useRef();

  const allListDiv = useRef();
  const nextListDiv = useRef();

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

  useEffect(() => {
    if (wishListData && wishListData.hasOwnProperty("wishListData")) {
      setNextTabData({ wishListName: "Default", data: wishListData["wishListData"].hasOwnProperty("Default") ? wishListData["wishListData"]["Default"] : [] });
    }
  }, [wishListData]);

  useEffect(() => {
    console.log(nextTabData);
  }, [nextTabData]);

  function toggleAllListTab() {
    nextListBtn.current.classList.remove(styles.active);
    allListBtn.current.classList.add(styles.active);

    allListDiv.current.classList.remove(styles.hide);
    nextListDiv.current.classList.add(styles.hide);

    defaultListRef.current.classList.add(styles.noAnimation)
  }
  function toggleDefaultTab() {
    allListBtn.current.classList.remove(styles.active);
    nextListBtn.current.classList.add(styles.active);

    nextListDiv.current.classList.remove(styles.hide);
    allListDiv.current.classList.add(styles.hide);

    allListsRef.current.map((el) => el.classList.add(styles.noAnimation))
  }

  console.log(wishListData);

  return (
    <div className={styles.main}>
      {/* left */}
      <div className={styles.left}>
        <div className={cn("niceBox", styles.title)}>
          <h1>My Wishlist</h1>
        </div>

        <div className={cn(styles.wishlistContent, "niceBox")}>
          <div className={styles.buttons}>
            <button onClick={toggleAllListTab} ref={allListBtn} className={styles.active}>
              All Lists
            </button>
            <button onClick={toggleDefaultTab} ref={nextListBtn} className={styles.nextListBtn}>
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
                              toggleDefaultTab();
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
                            .reverse()
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
            {nextTabData.hasOwnProperty("data")
              ? nextTabData["data"].map((el, index) => {
                  return (
                    <div ref={defaultListRef} key={index} className={cn(styles.alllist, "niceBox", styles.noAnimation)}>
                      <div className={styles.itemNameDiv}>
                        <p className={styles.itemName}>{nextTabData["wishListName"]}</p>
                        <div className={styles.itemButtons}>
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
                        {nextTabData["data"].length > 0 ? (
                          Object.values(nextTabData["data"])
                            .reverse()
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
