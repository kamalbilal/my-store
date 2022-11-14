import styles from "./AllCategories.module.css";
import AllCategories_links from "./AllCategories_links";
import { useRef } from "react";
import cn from "classnames";
import { IoCloseSharp } from "react-icons/io5";
import Tippy from "@tippyjs/react";
import Tooltip from "../../Tooltip/Tooltip";

function AllCategories({ HideOverlay_Func }) {
  const allCategoriesData = [
    {
      name: "Men's Fashion",
      link: "#",
    },
    {
      name: "Men's Fashion",
      link: "#",
    },
    {
      name: "Men's Fashion",
      link: "#",
    },
    {
      name: "Men's Fashion",
      link: "#",
    },
    {
      name: "Men's Fashion",
      link: "#",
    },
    {
      name: "Men's Fashion",
      link: "#",
    },
    {
      name: "Men's Fashion",
      link: "#",
    },
    {
      name: "Men's Fashion",
      link: "#",
    },
    {
      name: "Men's Fashion",
      link: "#",
    },
    {
      name: "Men's Fashion",
      link: "#",
    },
    {
      name: "Men's Fashion",
      link: "#",
    },
    {
      name: "Men's Fashion",
      link: "#",
    },
    {
      name: "Men's Fashion",
      link: "#",
    },
    {
      name: "Men's Fashion",
      link: "#",
    },
    {
      name: "Men's Fashion",
      link: "#",
    },
    {
      name: "Men's Fashion",
      link: "#",
    },
    {
      name: "Men's Fashion",
      link: "#",
    },
    {
      name: "Men's Fashion",
      link: "#",
    },
    {
      name: "Men's Fashion",
      link: "#",
    },
    {
      name: "Men's Fashion",
      link: "#",
    },
    {
      name: "Men's Fashion",
      link: "#",
    },
    {
      name: "Men's Fashion",
      link: "#",
    },
    {
      name: "Men's Fashion",
      link: "#",
    },
    {
      name: "Men's Fashion",
      link: "#",
    },
    {
      name: "Men's Fashion",
      link: "#",
    },
    {
      name: "Men's Fashion",
      link: "#",
    },
    {
      name: "Men's Fashion",
      link: "#",
    },
    {
      name: "Men's Fashion",
      link: "#",
    },
    {
      name: "Men's Fashion",
      link: "#",
    },
    {
      name: "Men's Fashion",
      link: "#",
    },
    {
      name: "Men's Fashion",
      link: "#",
    },
    {
      name: "Men's Fashion",
      link: "#",
    },
    {
      name: "Men's Fashion",
      link: "#",
    },
    {
      name: "Men's Fashion",
      link: "#",
    },
    {
      name: "Men's Fashion",
      link: "#",
    },
    {
      name: "Men's Fashion",
      link: "#",
    },
    {
      name: "Men's Fashion",
      link: "#",
    },
    {
      name: "Men's Fashion",
      link: "#",
    },
    {
      name: "Men's Fashion",
      link: "#",
    },
    {
      name: "Men's Fashion",
      link: "#",
    },
    {
      name: "Men's Fashion",
      link: "#",
    },
    {
      name: "Men's Fashion",
      link: "#",
    },
    {
      name: "Men's Fashion",
      link: "#",
    },
  ];

  const slider_ref = useRef();

  function showScrollBar() {
    slider_ref.current.classList.remove(styles.scrollerHide);
  }
  function hideScrollBar() {
    slider_ref.current.classList.add(styles.scrollerHide);
  }

  return (
    <div className={styles.mainDiv}>
      <div
        className={styles.categories}
        onMouseEnter={showScrollBar}
        onMouseLeave={hideScrollBar}
      >
        <div className={styles.title}>All Categories</div>
        <div
          ref={slider_ref}
          className={cn(styles.scroller, styles.scrollerHide)}
        >
          {allCategoriesData.map((element, index) => {
            return (
              <AllCategories_links
                key={index}
                Index={index}
                Name={element.name}
                Url={element.link}
              />
            );
          })}
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.header}>
          <h5 className={styles.title}>Products Preview</h5>
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
            <button className={cn(styles.escBtn)} onClick={HideOverlay_Func}>
              <IoCloseSharp className={styles.closeIcon} />
            </button>
          </Tippy>
        </div>
      </div>
    </div>
  );
  ESC;
}

export default AllCategories;
