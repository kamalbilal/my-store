import SearchGrid from "./SearchGrid/SearchGrid";
import styles from "./SearchMain.module.css";
import { HiOutlineViewGrid } from "react-icons/hi";
import { ImList2 } from "react-icons/im";
import { IoMdArrowDropdown } from "react-icons/io";
import cn from "classnames";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

function SearchMain({ data, totalProductsCount, displayIn, titlePageSort, page, title, showNextPageAfter, sort }) {
  const router = useRouter();
  const { displayInGrid, setDisplayInGrid } = displayIn;
  const { sortby, setSortby } = sort;
  const [clicked, setClicked] = useState(false);
  const [selectedSortOption, setSelectedSortOption] = useState(formatSortOption(sortby));

  const sortByMatchBtn = useRef();
  const sortByPriceBtn = useRef();
  const sortByDropdown = useRef();

  function formatSortOption(value) {
    if (value === "bestMatch") {
      return "Best Match";
    } else if (value === "priceLow") {
      return "Price (Low to High)";
    } else if (value === "priceHigh") {
      return "Price (High to Low)";
    }
  }

  useEffect(() => {
    function handler(e) {
      if (e.ctrlKey && e.key === "l") {
        e.preventDefault();
        e.stopPropagation();
        setDisplayInGrid((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, []);

  function sortByMatch() {
    // if (sortByDropdown.current.classList.contains(styles.dropdownShow)) {
    //   sortByDropdown.current.classList.remove(styles.dropdownShow);
    // }
    setSelectedSortOption("Best Match");

    router.push("/search/glasses/1/bestMatch");
  }
  function sortByPriceLow() {
    // if (sortByDropdown.current.classList.contains(styles.dropdownShow)) {
    //   sortByDropdown.current.classList.remove(styles.dropdownShow);
    // }
    setSelectedSortOption("Price (Low to High)");

    router.push("/search/glasses/1/priceLow");
  }
  function sortByPriceHigh() {
    // if (sortByDropdown.current.classList.contains(styles.dropdownShow)) {
    //   sortByDropdown.current.classList.remove(styles.dropdownShow);
    // }
    setSelectedSortOption("Price (High to Low)");

    router.push("/search/glasses/1/priceHigh");
  }

  function dropdownCloseEventListner() {
    if (sortByDropdown.current) {
      if (sortByDropdown.current.classList.contains(styles.dropdownShow)) {
        return;
      } else {
        sortByDropdown.current.classList.add(styles.dropdownShow);
      }
    }

    let click = 0;

    function onClick() {
      if (click === 0) {
        click = 1;
      } else {
        if (sortByDropdown.current) {
          sortByDropdown.current.classList.remove(styles.dropdownShow);
        }
        document.removeEventListener("click", onClick);
      }
    }

    document.addEventListener("click", onClick);
  }

  return (
    <div>
      <div className={styles.viewDiv}>
        <div className={styles.foundTitle}>
          Found <span>"{totalProductsCount}"</span> products
        </div>
        <div className={styles.right}>
          <div className={styles.sortBy}>
            <p>Sort By:</p>
            <button onClick={dropdownCloseEventListner}>
              <div>
                {selectedSortOption}
                <span>
                  <IoMdArrowDropdown />
                </span>
              </div>
            </button>
            <div ref={sortByDropdown} className={styles.dropdown}>
              <button onClick={sortByMatch} className={styles.dropdownButton}>
                Best Match
              </button>
              <button onClick={sortByPriceLow} className={styles.dropdownButton}>
                Price (Low to High)
              </button>
              <button onClick={sortByPriceHigh} className={styles.dropdownButton}>
                Price (High to Low)
              </button>
            </div>
            {/* <button onClick={sortByMatch} ref={sortByMatchBtn} className={sortby === "bestMatch" ? styles.sortBySelectedMatch : ""}>
              Best Match
            </button>
            <button onClick={sortByPrice} ref={sortByPriceBtn} className={sortby !== "bestMatch" ? styles.sortBySelectedPrice : ""}>
              Price
            </button> */}
          </div>

          {/*  */}
          <div className={styles.view}>
            <p>View:</p>
            <div onClick={() => setDisplayInGrid(true)} className={cn(styles.grid, displayInGrid === true ? styles.blueColor : "")}>
              <HiOutlineViewGrid />
            </div>
            <div onClick={() => setDisplayInGrid(false)} className={cn(styles.list, displayInGrid === false ? styles.blueColor : "")}>
              <ImList2 />
            </div>
          </div>
        </div>
      </div>

      <SearchGrid
        data={data}
        displayInGrid={displayInGrid}
        titlePageSort={titlePageSort}
        page={page}
        title={title}
        showNextPageAfter={showNextPageAfter}
        sortby={sortby}
      />
    </div>
  );
}

export default SearchMain;
