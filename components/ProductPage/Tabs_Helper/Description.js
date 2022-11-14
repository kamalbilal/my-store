import styles from "./Description.module.css";
import { useState, useEffect, useRef, memo } from "react";
import { removeLastOccurrence } from "../../../libs/remove";
import { replaceAll } from "../../../libs/replace";
const ReactDOMServer = require("react-dom/server");
const HtmlToReactParser = require("html-to-react").Parser;

function Description({ Description_content }) {
  const [description, setDescription] = useState(null);
  const runUseEffect = useRef(true);

  async function name() {
    if (Description_content) {
      const htmlToReactParser = new HtmlToReactParser();
      const reactElement = htmlToReactParser.parse(Description_content);
      setDescription(reactElement);
    } else {
      setDescription(<h1 style={{ whiteSpace: "nowrap" }}>No Description Avaliable</h1>);
    }
  }
  useEffect(() => {
    // if (runUseEffect.current === true) {
    // runUseEffect.current = false;
    name();
    // }
  }, []);

  return (
    <div className={styles.container}>
      <div className="product-overview">{description}</div>
    </div>
  );
}

export default memo(Description);
