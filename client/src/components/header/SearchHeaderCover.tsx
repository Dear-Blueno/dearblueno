import "./SearchHeaderCover.css";
import HeaderButton from "./HeaderButton";
import { GrFormClose } from "react-icons/gr";
import { useDebouncedCallback } from "use-debounce";

type SearchHeaderCoverProps = {
  setSearching: (searching: boolean) => void;
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
    <div className="SearchHeaderCover">
      <input
        className="InputBox"
        type="text"
        placeholder="Search here..."
        onChange={(e) => {
          if (e.target.value.length > 0) {
            setDebouncedSearchQuery(e.target.value);
          }
        }}
      />
      <div className="CloseButton">
        <HeaderButton
          action={() => props.setSearching(false)}
          icon={GrFormClose}
          alt="Close Search"
        />
      </div>
    </div>
  );
}

export default SearchHeaderCover;
