import styles from "./Tabs.module.css";
import cn from "classnames";
import { createRef, useState } from "react";
import Description from "./Tabs_Helper/Description";
import Reviews from "./Tabs_Helper/Reviews";
import Specifications from "./Tabs_Helper/Specifications";

function Tabs({ Specifications_Array, Description_content }) {
  const [currentTab, setCurrentTab] = useState(0);
  const allRefs = [];
  const descriptionRef = createRef();
  const reviewsRef = createRef();
  const specificationsRef = createRef();
  allRefs.push(descriptionRef, reviewsRef, specificationsRef);
  return (
    <div>
      <div className={styles.tabsNames}>
        <button
          ref={descriptionRef}
          className={cn(styles.tabBtn, styles.tabBtnActive)}
          onClick={() => {
            setCurrentTab(0);
            allRefs.forEach((element) => {
              element.current.classList.remove(styles.tabBtnActive);
            });
            descriptionRef.current.classList.add(styles.tabBtnActive);
          }}
        >
          Description
        </button>
        <button
          onClick={() => {
            setCurrentTab(1);
            allRefs.forEach((element) => {
              element.current.classList.remove(styles.tabBtnActive);
            });
            reviewsRef.current.classList.add(styles.tabBtnActive);
          }}
          ref={reviewsRef}
          className={styles.tabBtn}
        >
          Customer Reviews
        </button>
        <button
          onClick={() => {
            setCurrentTab(2);
            allRefs.forEach((element) => {
              element.current.classList.remove(styles.tabBtnActive);
            });
            specificationsRef.current.classList.add(styles.tabBtnActive);
          }}
          ref={specificationsRef}
          className={styles.tabBtn}
        >
          Specifications
        </button>
      </div>

      {/* tabs data */}
      <div className={styles.tabsData}>
        <div className={currentTab === 0 ? styles.show : ""}>
          <Description Description_content={Description_content} />
        </div>

        <div className={currentTab === 1 ? styles.show : ""}>
          <Reviews />
        </div>

        <div className={currentTab === 2 ? styles.show : ""}>
          <Specifications Specifications_Array={Specifications_Array} />
        </div>
      </div>
    </div>
  );
}

export default Tabs;
