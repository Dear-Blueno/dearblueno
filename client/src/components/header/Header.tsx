import "./Header.css";
import HeaderButton from "./HeaderButton";
import LogoIcon from "../../images/logo128.png";
import { Link } from "react-router-dom";
import IUser from "../../types/IUser";
import { loginBrown } from "../../gateways/AuthGateway";
import Typist from "react-typist";
import { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { AiOutlinePlus } from "react-icons/ai";
import { MdPersonOutline } from "react-icons/md";

type HeaderProps = {
  user: IUser | undefined;
};

function Header(props: HeaderProps) {
  const { user } = props;
  const [showLogo, setShowLogo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showPlus, setShowPlus] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    setTimeout(() => {
      setShowSearch(true);
    }, 1500);
    setTimeout(() => {
      setShowPlus(true);
    }, 1650);
    setTimeout(() => {
      setShowProfile(true);
    }, 1800);
  }, []);

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
        <HeaderButton
          action={() => {}}
          icon={BiSearch}
          alt="Search"
          opacity={showSearch ? 1 : 0}
          delay="1500ms"
        />

        <Link to="/submit" draggable={false}>
          <HeaderButton
            action={() => {}}
            icon={AiOutlinePlus}
            alt="Post"
            opacity={showPlus ? 1 : 0}
            delay="1650ms"
          />
        </Link>
        <Link to={user ? "/profile" : "/"} draggable={false}>
          <HeaderButton
            action={user ? () => {} : loginBrown}
            icon={user ? undefined : MdPersonOutline}
            image={user ? user.profilePicture : undefined}
            alt="Profile"
            opacity={showProfile ? 1 : 0}
            delay="1800ms"
          />
        </Link>
      </div>
    </div>
  );
}

export default Header;
