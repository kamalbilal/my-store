import cn from "classnames";
import { useContext, useEffect } from "react";
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

  console.log(wishListData);

  return (
    <div className={styles.main}>
      {/* left */}
      <div className={styles.left}>
        <div className={cn("niceBox", styles.title)}>
          <h1>My Wishlist</h1>
        </div>

        <div className={cn(styles.wishlistContent)}>
          <div className={styles.buttons}>
            <button className={cn(styles.active, "niceBox")}>All Lists</button>
            <button className={"niceBox"}>Default</button>
          </div>
        </div>

        {wishListData.hasOwnProperty("wishListData") && wishListData.hasOwnProperty("wishListNames")
          ? wishListData["wishListNames"].map((el, index) => {
              return (
                <div key={index} className={cn(styles.alllist, "niceBox")}>
                  <div className={styles.itemNameDiv}>
                    <p className={styles.itemName}>{el}</p>
                    <div className={styles.itemButtons}>
                      <button>
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
                      Object.values(wishListData["wishListData"][el]).reverse().map((item, index2) => {
                        return <Image key={index2} className={styles.image} src={item["selectedImageUrl"]} width={150} height={150} />;
                      })
                    ) : (
                      <EmptyList />
                    )}
                  </div>
                </div>
              );
            })
          : "loading"}

        {/* <div className={cn(styles.alllist, "niceBox")}>
          <div className={styles.itemNameDiv}>
            <p className={styles.itemName}>Default</p>
            <div className={styles.itemButtons}>
              <button>
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
            <EmptyList/>
            <Image className={styles.image} src="https://ae01.alicdn.com/kf/Hc7b15264d0fa4ccebf8b7ba9f27eaca7L/For-PS5-Controller-Charger-Dual-USB-Fast-Charging-Dock-Station-Stand-with-USB-A-Ouput-for.jpg" width={150} height={150} />
            <Image className={styles.image} src="https://ae01.alicdn.com/kf/Hc7b15264d0fa4ccebf8b7ba9f27eaca7L/For-PS5-Controller-Charger-Dual-USB-Fast-Charging-Dock-Station-Stand-with-USB-A-Ouput-for.jpg" width={150} height={150} />
          </div>
        </div> */}
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
