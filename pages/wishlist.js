import cn from "classnames";
import { useContext, useEffect, memo, useRef, useState, useLayoutEffect } from "react";
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
import { Oval } from "react-loader-spinner";
import Tippy from "@tippyjs/react";
import { IoCloseSharp } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

function Wishlist() {
  const router = useRouter();

  const { wishListData, setWishListData } = useContext(WishLishContext);
  const [canRunAnimations, setCanRunAnimations] = useState(false);
  const [nextTabData, setNextTabData] = useState("Default");
  const [scrollToAllListTab, setScrollToAllListTab] = useState(0);
  const [scrollToAllDefaultTab, setScrollToAllDefaultTab] = useState(0);
  const [changeTabs, setChangeTabs] = useState({ allList: true, default: false });
  const [pagination, setPagination] = useState({});
  const [nextTabDataObject, setNextTabDataObject] = useState({});

  const allListsRef = useRef([]);
  const defaultListRef = useRef();
  const dummyheightRef = useRef();

  const allListBtn = useRef();
  const nextListBtn = useRef();

  const allListDiv = useRef();
  const nextListDiv = useRef();
  const stickyDivRef = useRef();
  const scrollTopArrowRef = useRef();

  const observer = useRef(null);
  const lastDivRef = useRef(null);
  const loaderRef = useRef();
  const imagesDivRef = useRef();
  const createListDialogRef = useRef();
  const createListInputRef = useRef();
  const createListButtonRef = useRef();
  const createListNoInputErrorRef = useRef();
  const createListDuplicateNameErrorRef = useRef();

  const renameListDialogRef = useRef();
  const renameListInputRef = useRef();
  const renameListButtonRef = useRef();
  const renameListNoInputErrorRef = useRef();
  const renameListDuplicateNameErrorRef = useRef();
  const selectedRenameInputNameRef = useRef();

  useEffect(() => {
    if (wishListData && !wishListData.hasOwnProperty("wishListData")) {
      //
      async function getWishListData() {
        const options = {
          url: process.env.NEXT_PUBLIC_DB_HOST + "/getwishlist",
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

        console.time("Getting wishlist data");
        const response = await MyAxios(options);
        console.timeEnd("Getting wishlist data");
        console.log(response);
        if (response["success"] === true && response["data"].hasOwnProperty("wishListData")) {
          // console.log({ ...wishListData });
          setWishListData((prev) => {
            const temp = { ...prev };
            temp["wishListData"] = response["data"]["wishListData"];
            return temp;
          });

          const indexOfDefaultList = response["data"]["wishListNames"].indexOf("Default");
          nextListDiv.current.id = "wishListId-" + response["data"]["wishListIds"][indexOfDefaultList];
        }
      }
      getWishListData();
    }
  }, []);

  useEffect(() => {
    if (pagination && pagination.hasOwnProperty("pagesByName")) {
      return;
    }
    if (wishListData && wishListData.hasOwnProperty("wishListNames") && wishListData.hasOwnProperty("wishListIds")) {
      setPagination((prev) => {
        const temp = { ...prev };
        temp["pagesByName"] = {};
        temp["pagesById"] = {};
        for (let index = 0; index < wishListData["wishListIds"].length; index++) {
          const wishListName = wishListData["wishListNames"][index];
          const wishListId = wishListData["wishListIds"][index];
          temp["pagesById"][wishListId] = { page: 1, isCompleted: false };
          temp["pagesByName"][wishListName] = { page: 1, isCompleted: false };
        }
        return temp;
      });
    }
  }, [wishListData]);

  useEffect(() => {
    console.log(pagination);
  }, [pagination]);

  function showLoader() {
    loaderRef.current.style.display = "flex";
  }

  function hideLoader() {
    loaderRef.current.style.display = "none";
  }

  async function getMoreWishListData() {
    showLoader();
    const wishlistId = lastDivRef.current.getAttribute("data-attribute-parentwishlistid");
    const wishlistName = lastDivRef.current.getAttribute("data-attribute-wishlistname");

    console.log({
      wishlistId: parseInt(wishlistId),
      wishlistName: wishlistName,
      pageNumber: pagination["pagesById"][wishlistId]["page"] + 1,
    });

    const options = {
      url: process.env.NEXT_PUBLIC_DB_HOST + "/getMoreWishlist",
      method: "POST",
      credentials: "include",
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: {
        wishlistId: parseInt(wishlistId),
        wishlistName: wishlistName,
        pageNumber: pagination["pagesById"][wishlistId]["page"] + 1,
      },
    };

    console.time("Getting more wishlist data");
    const response = await MyAxios(options);
    console.log(response);
    setWishListData((prev) => {
      const temp = { ...prev };
      console.log(temp["wishListData"][wishlistName]);
      temp["wishListData"][wishlistName] = [...temp["wishListData"][wishlistName], ...response.data.data];
      return temp;
    });
    setPagination((prev) => {
      const temp = { ...prev };
      temp["pagesById"] = { ...temp["pagesById"], [response.data.wishlistId]: { ...temp["pagesById"][response.data.wishListId], page: response.data.pageNumber, isCompleted: response.data.data.length > 0 ? false : true } };
      temp["pagesByName"] = { ...temp["pagesByName"], [response.data.wishlistName]: { ...temp["pagesByName"][response.data.wishlistName], page: response.data.pageNumber, isCompleted: response.data.data.length > 0 ? false : true } };
      return temp;
    });
    console.log(response);
    console.timeEnd("Getting more wishlist data");
    hideLoader();
  }

  useEffect(() => {
    function handleKeyPress(event) {
      if (event.key === "y") {
        console.log('You pressed the "y" key!');
        console.log(document.body.scrollTop || document.documentElement.scrollTop);
        // getMoreWishListData();
      }
    }

    window.addEventListener("keydown", handleKeyPress);

    // This is a clean-up function that runs when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  function toggleAllListTab() {
    if (changeTabs["allList"] === true) return;
    setScrollToAllDefaultTab(document.body.scrollTop || document.documentElement.scrollTop);
    setChangeTabs((prev) => ({ allList: true, default: false }));
    console.log({ scrollToAllListTab });

    nextListBtn.current.classList.remove(styles.active);
    allListBtn.current.classList.add(styles.active);

    allListDiv.current.classList.remove(styles.hide);
    nextListDiv.current.classList.add(styles.hide);

    defaultListRef.current.classList.add(styles.noAnimation);
    window.scrollTo({
      top: scrollToAllListTab,
    });
  }

  function toggleDefaultTab(scrollToTop = false) {
    if (changeTabs["default"] === true) return;
    setScrollToAllListTab(document.body.scrollTop || document.documentElement.scrollTop);
    setChangeTabs((prev) => ({ allList: false, default: true }));

    allListBtn.current.classList.remove(styles.active);
    nextListBtn.current.classList.add(styles.active);

    nextListDiv.current.classList.remove(styles.hide);
    allListDiv.current.classList.add(styles.hide);

    window.scrollTo({
      top: scrollToTop != false ? 0 : scrollToAllDefaultTab,
    });

    allListsRef.current.map((el) => el.classList.add(styles.noAnimation));
  }

  console.log(wishListData);

  function handleScroll() {
    const rect = stickyDivRef.current.getBoundingClientRect();

    if (rect.top > 0 && rect.top != 0) {
      stickyDivRef.current.classList.remove(styles.sticky);
      dummyheightRef.current.style.height = "0px";
      const searchBar = document.querySelector(".searchBar");
      if (searchBar) {
        searchBar.style.visibility = "visible";
      }
    } else if (rect.top < -25) {
      dummyheightRef.current.style.height = "25px";
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

  useEffect(() => {
    if (pagination && pagination.hasOwnProperty("pagesByName") && pagination["pagesByName"].hasOwnProperty(Object.keys(nextTabDataObject)[0]) && pagination["pagesByName"][Object.keys(nextTabDataObject)[0]]["isCompleted"] === true) {
      console.log("data completed");
      return;
    }
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        console.log("Getting more wishlistdata");
        getMoreWishListData();
        observer.current.disconnect();
      }
    });
    if (lastDivRef.current) observer.current.observe(lastDivRef.current);
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [nextTabDataObject, wishListData["wishListData"]]);

  useEffect(() => {
    if (wishListData["wishListData"] && wishListData["wishListData"].hasOwnProperty(nextTabData)) {
      setNextTabDataObject({ [nextTabData]: [...wishListData["wishListData"][nextTabData]] });
    }
  }, [nextTabData, wishListData]);

  useEffect(() => {
    if (imagesDivRef.current) {
      const height = imagesDivRef.current.clientHeight;
      console.log(height);
      const root = document.documentElement;
      // Set the value of the --my-variable CSS variable
      root.style.setProperty("--wishlist-expand-collapse-max-height", `${height + 70}px`);
    }
  }, [imagesDivRef.current]);

  function resetNewListDialog() {
    if (createListInputRef.current.classList.contains(styles.errorInput) || createListDuplicateNameErrorRef.current.style.display === "flex") {
      createListInputRef.current.classList.remove(styles.errorInput);
      createListNoInputErrorRef.current.style.display = "none";
      createListDuplicateNameErrorRef.current.style.display = "none";
    }
  }


  function onCreateNewList() {
    const value = createListInputRef.current.value;
    if (!value) {
      createListInputRef.current.classList.add(styles.errorInput);
      createListInputRef.current.focus();
      createListNoInputErrorRef.current.style.display = "flex";
      return;
    }

    // check for duplicate name
    const capitalizedValue = value.substring(0, 1).toUpperCase() + value.substring(1);
    if (wishListData["wishListNames"].indexOf(capitalizedValue) !== -1) {
      createListDuplicateNameErrorRef.current.style.display = "flex";
    } else {
      createListInputRef.current.value = "";
      createListDialogRef.current.close();
      setWishListData((prev) => ({ ...prev, wishListIds: [capitalizedValue, ...prev["wishListIds"]], wishListNames: [capitalizedValue, ...prev["wishListNames"]], collapsedDivs: { ...prev["collapsedDivs"], [capitalizedValue]: false } }));
      createNewWishlist(capitalizedValue);
    }
  }

  async function createNewWishlist(name) {
    const options = {
      url: process.env.NEXT_PUBLIC_DB_HOST + "/createNewList",
      method: "POST",
      credentials: "include",
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: {
        wishListName: name,
      },
    };

    const response = await MyAxios(options);
    if (response.success === true) {
      setWishListData((prev) => {
        const temp = { ...prev };
        const index = temp["wishListIds"].indexOf(name);
        if (index != -1) {
          temp["wishListIds"][index] = response.data.id;
        }
        return temp;
      });
    } else {
      setWishListData((prev) => {
        const temp = { ...prev };
        const index = temp["wishListIds"].indexOf(name);
        if (index != -1) {
          temp["wishListIds"].splice(index, 1);
        }

        const index2 = temp["wishListNames"];
        if (index2 != -1) {
          temp["wishListNames"].splice(index2, 1);
        }

        return temp;
      });
      toast("Could not create a new list!", {
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

  function resetRenameListDialog() {
    if (renameListInputRef.current.classList.contains(styles.errorInput) || renameListDuplicateNameErrorRef.current.style.display === "flex") {
      renameListInputRef.current.classList.remove(styles.errorInput);
      renameListNoInputErrorRef.current.style.display = "none";
      renameListDuplicateNameErrorRef.current.style.display = "none";
    }
  }

  function onRenameList() {
    const value = renameListInputRef.current.value;
    if (!value) {
      renameListInputRef.current.classList.add(styles.errorInput);
      renameListInputRef.current.focus();
      renameListNoInputErrorRef.current.style.display = "flex";
      return;
    }

    // check if name is same as before 
    if (value === selectedRenameInputNameRef.current) {
      renameListInputRef.current.value = "";
      renameListDialogRef.current.close();
      return
    }

    // check for duplicate name
    const capitalizedValue = value.substring(0, 1).toUpperCase() + value.substring(1);
    if (wishListData["wishListNames"].indexOf(capitalizedValue) !== -1) {
      renameListDuplicateNameErrorRef.current.style.display = "flex";
    } else {
      renameListInputRef.current.value = "";
      renameListDialogRef.current.close();
      setWishListData((prev) => {
        const temp = {...prev}
        const indexOf = temp["wishListNames"].indexOf(selectedRenameInputNameRef.current)
        if (indexOf !== -1) {
          temp["wishListNames"][indexOf] = value
        }
        return temp
      });
      // createNewWishlist(capitalizedValue);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCanRunAnimations(true);
    }, 600);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <ToastContainer limit={1} style={{ fontSize: "1.4rem" }} />
      <div className={styles.main}>
        <dialog
          onClick={(event) => {
            const rect = createListDialogRef.current.getBoundingClientRect();
            if (event.clientY < rect.top || event.clientY > rect.bottom || event.clientX < rect.left || event.clientX > rect.right) {
              createListDialogRef.current.close();
            }
          }}
          ref={createListDialogRef}
          className={styles.createListDialog}
        >
          <div>
            <h1>Create a list</h1>
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
                appendTo={createListDialogRef.current}
                zIndex={99999}
                content={
                  <span>
                    Press <span style={{ color: "red" }}>ESC</span> To Close
                  </span>
                }
              >
                <button
                  className={cn(styles.escBtn)}
                  onClick={() => {
                    resetNewListDialog();
                    createListDialogRef.current.close();
                  }}
                >
                  <IoCloseSharp className={styles.closeIcon} />
                </button>
              </Tippy>
            </div>
          </div>
          <div className={styles.listnameDiv}>
            <h4>Enter list name</h4>
            <input ref={createListInputRef} type="text" onKeyUp={(event) => (event.key === "Enter" ? onCreateNewList() : null)} onInput={resetNewListDialog} />
            <p ref={createListNoInputErrorRef} className={styles.noListError}>
              <RxCross2 /> Please enter a new list name.
            </p>
            <p ref={createListDuplicateNameErrorRef} className={styles.noListError}>
              <RxCross2 /> Duplicate list name is not allowed.
            </p>
          </div>
          <button ref={createListButtonRef} className={styles.createButton} onClick={onCreateNewList}>
            Create
          </button>
        </dialog>

        <dialog
          onClick={(event) => {
            const rect = renameListDialogRef.current.getBoundingClientRect();
            if (event.clientY < rect.top || event.clientY > rect.bottom || event.clientX < rect.left || event.clientX > rect.right) {
              renameListDialogRef.current.close();
            }
          }}
          ref={renameListDialogRef}
          className={styles.createListDialog}
        >
          <div>
            <h1>Rename a list</h1>
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
                appendTo={renameListDialogRef.current}
                zIndex={99999}
                content={
                  <span>
                    Press <span style={{ color: "red" }}>ESC</span> To Close
                  </span>
                }
              >
                <button
                  className={cn(styles.escBtn)}
                  onClick={() => {
                    resetRenameListDialog()
                    renameListDialogRef.current.close();
                  }}
                >
                  <IoCloseSharp className={styles.closeIcon} />
                </button>
              </Tippy>
            </div>
          </div>
          <div className={styles.listnameDiv}>
            <h4>Enter new list name</h4>
            <input ref={renameListInputRef} type="text" onKeyUp={(event) => (event.key === "Enter" ? onRenameList() : null)} onInput={resetRenameListDialog} />
            <p ref={renameListNoInputErrorRef} className={styles.noListError}>
              <RxCross2 /> Please enter a new list name.
            </p>
            <p ref={renameListDuplicateNameErrorRef} className={styles.noListError}>
              <RxCross2 /> Duplicate list name is not allowed.
            </p>
          </div>
          <button ref={renameListButtonRef} className={styles.createButton} onClick={onRenameList}>
            Rename
          </button>
        </dialog>

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
            <h1>My wishlist</h1>
            <button
              className={styles.newButton}
              onClick={() => {
                createListDialogRef.current.showModal();
                createListInputRef.current.focus();
              }}
            >
              Create a list
            </button>
          </div>

          <div className={cn(styles.wishlistContent, "niceBox")}>
            <div ref={dummyheightRef}></div>
            <div ref={stickyDivRef} className={styles.buttons}>
              <button onClick={toggleAllListTab} ref={allListBtn} className={styles.active}>
                All lists
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
                        className={cn(styles.alllist, canRunAnimations === true ? "" : styles.noAnimation, wishListData["collapsedDivs"][el] === true ? styles.collapse : styles.expand)}
                      >
                        <div className={styles.itemNameDiv}>
                          <p className={styles.itemName}>{el}</p>
                          <div className={styles.itemButtons}>
                            <button
                              id={"button-" + index + "-" + el}
                              onClick={() => {
                                nextListBtn.current.innerHTML = el;
                                defaultListRef.current.classList.remove(styles.collapse);
                                setNextTabData(el);
                                // setScrollToAllListTab(0);
                                // setScrollToAllDefaultTab(0)
                                toggleDefaultTab(true);
                                const id = wishListData["wishListIds"][wishListData["wishListNames"].indexOf(el)];
                                nextListDiv.current.id = "wishListId-" + id;
                              }}
                            >
                              <IoEyeOutline className={styles.eyeIcon} /> <span>Show</span>
                            </button>
                            <button
                              onClick={() => {
                                renameListInputRef.current.value = el
                                selectedRenameInputNameRef.current = el
                                renameListDialogRef.current.showModal();
                                renameListInputRef.current.focus()
                              }}
                            >
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
                                  setWishListData((prev) => ({ ...prev, collapsedDivs: { ...prev["collapsedDivs"], [el]: false } }));
                                } else {
                                  parentDiv.classList.add(styles.collapse);
                                  parentDiv.classList.remove(styles.expand);
                                  setWishListData((prev) => ({ ...prev, collapsedDivs: { ...prev["collapsedDivs"], [el]: true } }));
                                }
                              }}
                              className={styles.arrowIconBtn}
                            >
                              <IoIosArrowDropupCircle className={styles.arrowIcon} />
                            </button>
                          </div>
                        </div>
                        <div ref={imagesDivRef} id="images-div" className={styles.imagesDiv}>
                          {wishListData["wishListData"].hasOwnProperty(el) && wishListData["wishListData"][el].length > 0 ? (
                            [...Object.values(wishListData["wishListData"][el])].slice(0, 6).map((item, index2) => {
                              return (
                                <Image
                                  onClick={() => {
                                    const button = document.getElementById("button-" + index + "-" + el);
                                    if (button) {
                                      button.click();
                                    }
                                  }}
                                  key={index2}
                                  className={styles.image}
                                  src={item["selectedImageUrl"]}
                                  width={150}
                                  height={150}
                                  draggable={false}
                                />
                              );
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

            <div ref={nextListDiv} className={cn(styles.hide, "nextListDiv")}>
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
                    </div>
                  </div>
                  <div className={styles.imagesDiv} style={{ flexDirection: "column", alignItems: "flex-start" }}>
                    {nextTabDataObject && nextTabDataObject.hasOwnProperty(nextTabData) ? (
                      nextTabDataObject[nextTabData].map((item, index2) => {
                        const isLastDiv = index2 === nextTabDataObject[nextTabData].length - 1;
                        return (
                          <div
                            ref={index2 === nextTabDataObject[nextTabData].length - 1 ? lastDivRef : null}
                            data-attribute-parentwishlistid={item["parentWishListId"]}
                            data-attribute-wishlistname={item["wishListName"]}
                            className={styles.nextTabProductsDiv}
                            key={index2}
                            style={{ width: "100%" }}
                          >
                            <div className={styles.nextTabProducts}>
                              <div className={styles.nextTabProductsImage}>
                                <Image className={styles.image} src={item["selectedImageUrl"]} width={150} height={150} draggable={false} />
                              </div>
                              <div className={styles.nextTabProducts_right}>
                                <div style={{ width: "95%" }}>
                                  <div className={styles.nextTabProductsTitle}>{item["title"]}</div>
                                  <div className={styles.nextTabProductsPrice}>$1500</div>
                                </div>
                                <div className={styles.nextTabProductsButtons}>
                                  <button>Open</button>
                                  <button>Move</button>
                                  <button>Delete</button>
                                </div>
                              </div>
                            </div>
                            {isLastDiv === true ? (
                              <div ref={loaderRef} className={styles.loaderDiv}>
                                <Oval height={45} width={45} color="#3b82f6" wrapperStyle={{}} wrapperClass="" visible={true} ariaLabel="oval-loading" secondaryColor="3b83f67c" strokeWidth={6} strokeWidthSecondary={6} />
                              </div>
                            ) : (
                              ""
                            )}
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
    </>
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

export default memo(Wishlist);
