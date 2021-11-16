import "./Header.css";
import HeaderButton from "./HeaderButton";
import searchIcon from "../../images/search.svg";
import filterIcon from "../../images/filter.svg";
import postIcon from "../../images/post.svg";

interface HeaderProps {}

function Header(props: HeaderProps) {
  return (
    <div className="Header">
      <h1 id="HeaderText">Dear Blueno</h1>
      <HeaderButton
        action={function (): void {
          throw new Error("Function not implemented.");
        }}
        image={postIcon}
      ></HeaderButton>
      <HeaderButton
        action={function (): void {
          throw new Error("Function not implemented.");
        }}
        image={filterIcon}
      ></HeaderButton>
      <HeaderButton
        action={function (): void {
          throw new Error("Function not implemented.");
        }}
        image={searchIcon}
      ></HeaderButton>
    </div>
  );
}

export default Header;
