import "./Header.css";
import HeaderButton from "./HeaderButton";
import SearchIcon from "../../images/search.svg";
import FilterIcon from "../../images/filter.svg";
import PostIcon from "../../images/post.svg";
import LogoIcon from "../../images/logo128.png";
import { Link } from "react-router-dom";

interface HeaderProps {}

function Header(props: HeaderProps) {
  return (
    <div className="Header">
      <h1 id="HeaderText">Dear Blueno</h1>
      <img className="LogoImage" src={LogoIcon} alt="8-bit Blueno" />
      <div className="HeaderButtons">
        <Link to="/submit">
          <HeaderButton action={() => {}} image={PostIcon} alt="Post" />
        </Link>
        <HeaderButton action={() => {}} image={FilterIcon} alt="Filter" />
        <HeaderButton action={() => {}} image={SearchIcon} alt="Search" />
      </div>
    </div>
  );
}

export default Header;
