<div ref={modalRef} className={styles.imageModal}>
{/* button */}
<div>
  <Tippy
    className="customTippy"
    duration={200}
    animation="scale"
    theme="light-border"
    allowHTML={true}
    placement="left"
    content={
      <span>
        Press <span style={{ color: "red" }}>ESC</span> To Close
      </span>
    }
  >
    <button className={cn(styles.escBtn)} onClick={hideImageModal}>
      <IoCloseSharp className={styles.closeIcon} />
    </button>
  </Tippy>
</div>
{/* button end */}
<div className={styles.left} onClick={hideImageModal}>
  <div className={styles.mainImageModalDiv}>
    <Image
      id="image"
      src={mainImage}
      unoptimized={true}
      className={styles.modalImage}
      // width={550}
      // height={550}
      draggable={false}
      objectFit="contain"
      layout="fill"
    />
  </div>
  <div className={cn(styles.smallImages, styles.smallImagesModal)} onClick={(event) => event.stopPropagation()}>
    {productData["images"].map((element, index) => {
      let classnames;
      if (index === 0) {
        classnames = cn(styles.smallImagesBtn, styles.smallImagesOutline);
      } else {
        classnames = styles.smallImagesBtn;
      }
      return (
        <button
          className={classnames}
          key={index}
          ref={(element) => {
            allImagesModalRefs.current[index] = element;
          }}
          id={index}
          onMouseOver={(e) => {
            smallImageModalFunctionality(e);
          }}
          onClick={(e) => {
            smallImageModalFunctionality(e);
          }}
          onFocus={(e) => {
            smallImageModalFunctionality(e);
          }}
        >
          <Image key={index} id={index} src={element} className={styles.smallImage} width={50} height={50} draggable={false} />
        </button>
      );
    })}
  </div>
</div>
</div>