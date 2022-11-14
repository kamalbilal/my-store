import Image from "next/image";
import styles from "./Images.module.css";
import { useRef, useEffect, useState } from "react";
import cn from "classnames";

function Images({ index, src, width, height, quality, name }) {
  if (!src) {
    src = "/banner.jpg";
  }
  if (!width) {
    width = 6.5;
  }
  if (!height) {
    height = 2.37;
  }
  if (!quality) {
    quality = 100;
  }
  if (!name) {
    name = "image";
  }

  return (
    <span className={styles.image}>
      <Image
        src={src}
        width={width}
        height={height}
        layout="responsive"
        objectFit="contain"
        quality={quality}
        alt={name}
        draggable={false}
      />
    </span>
  );
}

export default Images;
