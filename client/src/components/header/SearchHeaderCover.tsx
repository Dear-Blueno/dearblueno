import "./SearchHeaderCover.css";
import HeaderButton from "./HeaderButton";
import { GrFormClose } from "react-icons/gr";
import { useDebouncedCallback } from "use-debounce";
import { Link } from "react-router-dom";

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
    <div className="SearchHeaderCover">
      <input
        className="InputBox"
        autoFocus={true}
        type="text"
        placeholder="Search here..."
        onChange={(e) => {
          if (e.target.value.length > 0) {
            setDebouncedSearchQuery(e.target.value);
          }
        }}
      />
      <div className="CloseButton">
        <Link to="/">
          <HeaderButton
            icon={GrFormClose}
            alt="Close Search"
            action={() => {}}
          />
        </Link>
      </div>
    </div>
  );
}

export default SearchHeaderCover;
