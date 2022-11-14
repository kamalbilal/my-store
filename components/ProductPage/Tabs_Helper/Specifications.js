import styles from "./Specifications.module.css";
import { includesInArray } from "../../../libs/includes";
import { memo } from "react";

function Specifications({ Specifications_Array }) {
  const forbiddenWords = [
    "payment",
    "buy",
    "discount",
    "shipping",
    "feedback",
    "star",
    "stars",
    "delivery",
    "refund",
    "return",
    "worldwide",
    "store",
    "aliexpress",
    "drop",
    "dropship",
    "drop ship",
    "drop shipping",
    "dropshipping",
    "shipping",
    "wholesale",
    "whole sale",
    "order",
    "shipment",
    "china",
    "express",
  ];
  return (
    <div className={styles.specifications}>
      <div class="product-specs">
        <ul class="product-specs-list util-clearfix">
          {Specifications_Array.map((element, index) => {
            if (
              includesInArray(forbiddenWords, element["attrName"]) === true ||
              includesInArray(forbiddenWords, element["attrValue"]) === true
            ) {
              return;
            }
            return (
              <li key={index} class="product-prop line-limit-length">
                <span>{element["attrName"]}:&nbsp;</span>
                <span title={element["attrValue"]}>{element["attrValue"]}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default memo(Specifications);
