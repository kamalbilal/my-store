import styles from "./SearchLeft.module.css";
function SearchLeft({ searchedData, title, pageCounter, pageNumber }) {
  return (
    <div>
      <button onClick={() => console.log({ searchedData, title, pageCounter, pageNumber })}>test</button>
    </div>
  );
}

export default SearchLeft;
