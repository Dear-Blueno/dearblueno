import "./Header.css";
import HeaderButton from "./HeaderButton";
import SearchIcon from "../../images/search.svg";
// import FilterIcon from "../../images/filter.svg";
import PostIcon from "../../images/post.svg";
import LogoIcon from "../../images/logo128.png";
import { Link } from "react-router-dom";
import IUser from "../../types/IUser";
import { loginBrown } from "../../gateways/AuthGateway";
import Typist from "react-typist";
import { useState } from "react";

interface HeaderProps {
  user: IUser | undefined;
  loading: boolean;
}

function Header(props: HeaderProps) {
  const { user, loading } = props;
  const [showLogo, setShowLogo] = useState(false);

  // TODO: Make this look better :)
  const HeaderUser = () => {
    if (loading) {
      return <div className="HeaderUser">Loading...</div>;
    }

    return (
      <div className="HeaderUser">
        {user ? (
          <Link
            to="/profile"
            className="HeaderUser HeaderButton"
            draggable={false}
          >
            <img
              className="HeaderUserPicture"
              src={user.profilePicture}
              alt="Profile"
              draggable={false}
            />
          </Link>
        ) : (
          <button onClick={loginBrown}>Login</button>
        )}
      </div>
    );
  };

  return (
    <div className="Header">
      <Typist
        cursor={{ show: false }}
        avgTypingDelay={120}
        onTypingDone={() => setShowLogo(true)}
      >
        <h1 id="HeaderText">Dear Blueno</h1>
      </Typist>
      {showLogo && (
        <img className="LogoImage" src={LogoIcon} alt="8-bit Blueno" />
      )}
      <div className="HeaderButtons">
        <Link to="/submit" draggable={false}>
          <HeaderButton action={() => {}} image={PostIcon} alt="Post" />
        </Link>
        <HeaderButton action={() => {}} image={SearchIcon} alt="Search" />
      </div>
      <HeaderUser />
    </div>
  );
}

export default Header;
