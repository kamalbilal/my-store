import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import styles from "./Banner.module.css";
import Images from "./helpers/Images";
import cn from "classnames";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";

function Banner() {
  const ImagesData = [
    {
      src: "/banner.jpg",
      width: 6.5,
      height: 2.37,
      quality: 100,
      name: "image",
    },
    {
      src: "/banner.jpg",
      width: 6.5,
      height: 2.37,
      quality: 100,
      name: "image",
    },
    {
      src: "/banner.jpg",
      width: 6.5,
      height: 2.37,
      quality: 100,
      name: "image",
    },
    {
      src: "/banner.jpg",
      width: 6.5,
      height: 2.37,
      quality: 100,
      name: "image",
    },
    {
      src: "/banner.jpg",
      width: 6.5,
      height: 2.37,
      quality: 100,
      name: "image",
    },
  ];

  const slider_ref = useRef(null);
  const [slider_state, setSlider_state] = useState(0);

  function goLeft() {
    setSlider_state((prev) => prev - 1);
  }
  function goRight() {
    setSlider_state((prev) => prev + 1);
  }

  useEffect(() => {
    if (slider_state < 0) {
      setSlider_state(ImagesData.length - 1);
    }
    if (slider_state > ImagesData.length - 1) {
      setSlider_state(0);
    }
    if (slider_state <= ImagesData.length - 1) {
      slider_ref.current.style.transform = `translateX(-${
        slider_state * 100
      }%)`;
    }
  }, [slider_state]);

  return (
    <div className={styles.bannerWrapper}>
      <div className={styles.imagesWrapper}>
        <button
          onClick={() => goLeft()}
          className={cn(styles.arrowBtn, styles.leftBtn)}
        >
          <BsChevronCompactLeft className={styles.leftIcon} />
        </button>
        <button
          onClick={() => goRight()}
          className={cn(styles.arrowBtn, styles.rightBtn)}
        >
          <BsChevronCompactRight className={styles.leftIcon} />
        </button>
        <div ref={slider_ref} className={styles.slider}>
          {ImagesData.map((element, index) => (
            <Images
              index={index}
              key={index}
              src={element.src}
              width={element.width}
              height={element.height}
              quality={element.quality}
              name={element.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Banner;
