import styles from "./SearchHeaderCover.module.scss";
import HeaderButton from "./HeaderButton";
import { GrFormClose } from "react-icons/gr";
import { useDebouncedCallback } from "use-debounce";

type SearchHeaderCoverProps = {
  setSearchQuery: (searchQuery: string) => void;
};

function SearchHeaderCover(props: SearchHeaderCoverProps) {
  const setDebouncedSearchQuery = useDebouncedCallback(
    (searchQuery: string) => {
      props.setSearchQuery(searchQuery);
    },
    500
  );

  return (
    <div className={styles.SearchHeaderCover}>
      <input
        className={styles.InputBox}
        type="text"
        placeholder="Search here..."
        onChange={(e) => {
          if (e.target.value.length > 0) {
            setDebouncedSearchQuery(e.target.value);
          }
        }}
        autoFocus={true}
      />
      <div className={styles.CloseButton}>
        <a href="/">
          <HeaderButton
            icon={GrFormClose}
            alt="Close Search"
            action={() => {}}
          />
        </a>
      </div>
    </div>
  );
}

export default SearchHeaderCover;
