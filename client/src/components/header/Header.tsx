import "./Header.css";
import HeaderButton from "./HeaderButton";
import LogoIcon from "../../images/logo128.png";
import { Link } from "react-router-dom";
import IUser from "../../types/IUser";
import { loginBrown } from "../../gateways/AuthGateway";
import Typist from "react-typist";
import { useState } from "react";
import { BiSearch } from "react-icons/bi";
import { AiOutlinePlus } from "react-icons/ai";
import { MdPersonOutline } from "react-icons/md";

interface HeaderProps {
  user: IUser | undefined;
  loading: boolean;
}

function Header(props: HeaderProps) {
  const { user, loading } = props;
  const [showLogo, setShowLogo] = useState(false);

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
        <HeaderButton action={() => {}} icon={BiSearch} alt="Search" />
        <Link to="/submit" draggable={false}>
          <HeaderButton action={() => {}} icon={AiOutlinePlus} alt="Post" />
        </Link>
        {user ? (
          <Link to="/profile" draggable={false}>
            <HeaderButton
              action={() => {}}
              icon={undefined}
              image={user.profilePicture}
              alt="Profile"
            />
          </Link>
        ) : (
          <HeaderButton
            action={loginBrown}
            icon={MdPersonOutline}
            alt="Login"
          />
        )}
      </div>
    </div>
  );
}

export default Header;
