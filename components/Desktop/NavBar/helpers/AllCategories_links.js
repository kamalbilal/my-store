import styles from "./AllCategories.module.css";
import Link from "next/link";

function AllCategories_links({ Index, Name, Url }) {
  return (
    <Link href={Url}>
      <a className={styles.category}>{Name}</a>
    </Link>
  );
}

export default AllCategories_links;
