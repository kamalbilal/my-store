import cn from "classnames";
import { useContext, useEffect } from "react";
import MyAxios from "../libs/MyAxios";
import { WishLishContext } from "../userContext";
import styles from "../styles/wishlist.module.css";

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
        if (response["success"] === true && response["data"].hasOwnProperty("wishListData")) {
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

        <div className={cn(styles.wishlistContent, "niceBox")}>
            <div className={styles.buttons}>
                <button className={styles.active}>All Lists</button>
                <button>Default</button>
            </div>
            <div className={styles.alllist}>
                <div className={styles.itemNameDiv}>
                    <h2>Name</h2>
                    <div>
                        <button>Rename</button>
                        <button>Delete</button>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* right */}
      <div></div>
    </div>
  );
}

export default Wishlist;
