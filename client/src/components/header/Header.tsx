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
      <img className="LogoImage" src={LogoIcon} alt="8-bit Blueno" />
      <div className="HeaderButtons">
        <HeaderButton action={() => {}} image={PostIcon} alt="Post" />
        <HeaderButton action={() => {}} image={FilterIcon} alt="Filter" />
        <HeaderButton action={() => {}} image={SearchIcon} alt="Search" />
      </div>
    </div>
  );
}

export default Header;
