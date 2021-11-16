import "./Header.css";
import HeaderButton from "./HeaderButton";
import SearchIcon from "../../images/search.svg";
import FilterIcon from "../../images/filter.svg";
import PostIcon from "../../images/post.svg";
import LogoIcon from "../../images/logo128.png";

interface HeaderProps {}

function Header(props: HeaderProps) {
  return (
    <div className="Header">
      <h1 id="HeaderText">Dear Blueno</h1>
      <img className="LogoImage" src={LogoIcon} />
      <HeaderButton
        action={function (): void {
          throw new Error("Function not implemented.");
        }}
        image={PostIcon}
      ></HeaderButton>
      <HeaderButton
        action={function (): void {
          throw new Error("Function not implemented.");
        }}
        image={FilterIcon}
      ></HeaderButton>
      <HeaderButton
        action={function (): void {
          throw new Error("Function not implemented.");
        }}
        image={SearchIcon}
      ></HeaderButton>
    </div>
  );
}

export default Header;
