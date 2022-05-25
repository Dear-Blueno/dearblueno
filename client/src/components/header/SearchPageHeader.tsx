import styles from "./SearchPageHeader.module.scss";
import { useDebouncedCallback } from "use-debounce";
import { useRef, useEffect } from "react";

type SearchPageHeaderProps = {
  setSearchQuery: (searchQuery: string) => void;
};

export default function SearchPageHeader(props: SearchPageHeaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const setDebouncedSearchQuery = useDebouncedCallback(
    (searchQuery: string) => {
      props.setSearchQuery(searchQuery);
    },
    500
  );

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className={styles.SearchPageHeader}>
      <input
        className={styles.InputBox}
        type="text"
        onChange={(e) => {
          setDebouncedSearchQuery(e.target.value);
        }}
        autoFocus={true}
        ref={inputRef}
      />
    </div>
  );
}
