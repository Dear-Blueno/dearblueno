import "./Header.css";
import HeaderButton from "./HeaderButton";
import SearchIcon from "../../images/search.svg";
import FilterIcon from "../../images/filter.svg";
import PostIcon from "../../images/post.svg";
import LogoIcon from "../../images/logo128.png";
import { Link } from "react-router-dom";
import IUser from "../../types/IUser";
import { loginBrown, logout } from "../../gateways/AuthGateway";

interface HeaderProps {
  user: IUser | undefined;
  loading: boolean;
}

function Header(props: HeaderProps) {
  const { user, loading } = props;

  // TODO: Make this look better :)
  const HeaderUser = () => {
    if (loading) {
      return <div className="HeaderUser">Loading...</div>;
    }

    return (
      <div className="HeaderUser">
        {user ? (
          <>
            <img
              className="HeaderUserPicture"
              src={user.profilePicture}
              alt="Profile"
            />
            <p>{user.name}</p>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <button onClick={loginBrown}>Login</button>
        )}
      </div>
    );
  };

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
      <HeaderUser />
    </div>
  );
}

export default Header;
