import "./Header.css";
import HeaderButton from "./HeaderButton";
import LogoIcon from "../../images/logo128.png";
import { Link } from "react-router-dom";
import IUser from "../../types/IUser";
import { loginBrown, logout } from "../../gateways/AuthGateway";
import Typist from "react-typist";
import { BiSearch } from "react-icons/bi";
import { AiOutlinePlus } from "react-icons/ai";
import { MdPersonOutline } from "react-icons/md";
import { useState, useEffect, useRef } from "react";
import { usePopper } from "react-popper";

type HeaderProps = {
  user?: IUser;
  moderatorView: boolean;
};

function Header(props: HeaderProps) {
  const { user } = props;
  const [showLogo, setShowLogo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showPlus, setShowPlus] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [profileReferenceElement, setProfileReferenceElement] =
    useState<any>(null);
  const [profilePopperElement, setProfilePopperElement] = useState<any>(null);
  const [profileArrowElement, setProfileArrowElement] = useState<any>(null);
  const profilePopper = usePopper<any>(
    profileReferenceElement,
    profilePopperElement,
    {
      placement: "bottom-end",
      modifiers: [
        {
          name: "arrow",
          options: { element: profileArrowElement },
        },
        {
          name: "offset",
          options: { offset: [0, 12] },
        },
        {
          name: "flip",
          options: {
            allowedAutoPlacements: ["top", "bottom"], // by default, all the placements are allowed
            flipVariations: false,
          },
        },
      ],
    }
  );
  const [profileClicked, setProfileClicked] = useState(false);

  const profileRefDropdown = useRef<HTMLDivElement>(null);

  const handleProfileClickOutside = (event: any) => {
    if (
      profileRefDropdown.current &&
      !profileRefDropdown.current.contains(event.target)
    ) {
      setProfileClicked(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleProfileClickOutside, true);
    return () => {
      document.removeEventListener("click", handleProfileClickOutside, true);
    };
  });

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="Header">
      <Link to="/" className="RefreshHeaderLink" draggable={false}>
        <Typist
          cursor={{ show: false }}
          avgTypingDelay={120}
          onTypingDone={() => setShowLogo(true)}
        >
          <h1 id="HeaderText">Dear Blueno</h1>
        </Typist>
        {showLogo && (
          <img
            className="LogoImage"
            src="https://i.imgur.com/UTJlo8t.png"
            alt="8-bit Blueno"
            draggable={false}
          />
        )}
      </Link>
      <div className="HeaderButtons">
        <Link to="/search">
          <HeaderButton
            action={() => {}}
            icon={BiSearch}
            alt="Search"
            opacity={showSearch ? 1 : 0}
            delay="1500ms"
          />
        </Link>
        <Link to="/submit">
          <HeaderButton
            action={() => {}}
            icon={AiOutlinePlus}
            alt="Post"
            opacity={showPlus ? 1 : 0}
            delay="1650ms"
          />
        </Link>
        {/* TODO: Remove all this */}
        {/* <div className="SubmitButtonAndDropdown" ref={postRefDropdown}>
          <HeaderButton
            action={() => setSubmitClicked(!submitClicked)}
            icon={AiOutlinePlus}
            alt="Post"
            opacity={showPlus ? 1 : 0}
            delay="1650ms"
            buttonRef={setPostReferenceElement}
          />
          {submitClicked && (
            <div
              className="PopperContainer"
              ref={setPostPopperElement}
              style={postPopper.styles.popper}
              role="tooltip"
              {...postPopper.attributes.popper}
            >
              <div
                className="DropdownArrow"
                ref={setPostArrowElement}
                style={postPopper.styles.arrow}
              />
              <div className="SubmitDropdownActions">
                <Link to="/submit" className="DropdownAction">
                  <p>Post with built-in form</p>
                </Link>
              </div>
            </div>
          )}
        </div> */}
        <div className="ProfileButtonAndDropdown" ref={profileRefDropdown}>
          <HeaderButton
            action={() => setProfileClicked(!profileClicked)}
            icon={user ? undefined : MdPersonOutline}
            image={user ? user.profilePicture : undefined}
            alt="Profile"
            opacity={showProfile ? 1 : 0}
            delay="1800ms"
            buttonRef={setProfileReferenceElement}
          />
          {profileClicked && (
            <div
              className="PopperContainer"
              ref={setProfilePopperElement}
              style={profilePopper.styles.popper}
              role="tooltip"
              {...profilePopper.attributes.popper}
            >
              <div
                className="DropdownArrow"
                ref={setProfileArrowElement}
                style={profilePopper.styles.arrow}
              />
              <div className="ProfileDropdownActions">
                {user && (
                  <Link
                    to={"/profile/" + props.user?._id}
                    className="DropdownAction"
                  >
                    <p>Profile</p>
                  </Link>
                )}
                {user && user.moderator && (
                  <Link
                    to={props.moderatorView ? "/" : "/moderator"}
                    className="DropdownAction"
                    onClick={() => {
                      setProfileClicked(false);
                    }}
                  >
                    <p>
                      {props.moderatorView ? "Back to feed" : "Moderator view"}
                    </p>
                  </Link>
                )}
                <Link to="/about" className="DropdownAction">
                  <p>About</p>
                </Link>
                {user && (
                  <p onClick={logout} className="DropdownAction">
                    Logout
                  </p>
                )}
                {!user && (
                  <p onClick={loginBrown} className="DropdownAction">
                    Login
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
