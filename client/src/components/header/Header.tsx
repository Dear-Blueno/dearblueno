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
  user: IUser | undefined;
  setLoading: (loading: boolean) => void;
};

function Header(props: HeaderProps) {
  const { user } = props;
  const [showLogo, setShowLogo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showPlus, setShowPlus] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const [referenceElement, setReferenceElement] = useState<any>(null);
  const [profileReferenceElement, setProfileReferenceElement] =
    useState<any>(null);
  const [popperElement, setPopperElement] = useState<any>(null);
  const [arrowElement, setArrowElement] = useState<any>(null);
  const postPopper = usePopper<any>(referenceElement, popperElement, {
    placement: "bottom-end",
    modifiers: [
      {
        name: "arrow",
        options: { element: arrowElement },
      },
      {
        name: "offset",
        options: { offset: [8, 8] },
      },
      {
        name: "flip",
        options: {
          allowedAutoPlacements: ["top", "bottom"], // by default, all the placements are allowed
          flipVariations: false,
        },
      },
    ],
  });
  const profilePopper = usePopper<any>(profileReferenceElement, popperElement, {
    placement: "bottom-end",
    modifiers: [
      {
        name: "arrow",
        options: { element: arrowElement },
      },
      {
        name: "offset",
        options: { offset: [8, 8] },
      },
      {
        name: "flip",
        options: {
          allowedAutoPlacements: ["top", "bottom"], // by default, all the placements are allowed
          flipVariations: false,
        },
      },
    ],
  });
  const [submitClicked, setSubmitClicked] = useState(false);
  const [profileClicked, setProfileClicked] = useState(false);

  let refDropdown = useRef<HTMLDivElement>(null);
  let profileRefDropdown = useRef<HTMLDivElement>(null);

  const handleSubmitClickOutside = (event: any) => {
    if (refDropdown.current && !refDropdown.current.contains(event.target)) {
      setSubmitClicked(false);
    }
  };

  const handleProfileClickOutside = (event: any) => {
    if (
      profileRefDropdown.current &&
      !profileRefDropdown.current.contains(event.target)
    ) {
      setProfileClicked(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleSubmitClickOutside, true);
    document.addEventListener("click", handleProfileClickOutside, true);
    return () => {
      document.removeEventListener("click", handleSubmitClickOutside, true);
      document.removeEventListener("click", handleProfileClickOutside, true);
    };
  });

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
    setTimeout(() => {
      props.setLoading(false);
    }, 2000);
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

        <div className="SubmitButtonAndDropdown" ref={refDropdown}>
          <HeaderButton
            action={() => setSubmitClicked(!submitClicked)}
            icon={AiOutlinePlus}
            alt="Post"
            opacity={showPlus ? 1 : 0}
            delay="1650ms"
            buttonRef={setReferenceElement}
          />
          {submitClicked && (
            <div
              className="PopperContainer"
              ref={setPopperElement}
              style={postPopper.styles.popper}
              role="tooltip"
              {...postPopper.attributes.popper}
            >
              <div
                className="DropdownArrow"
                ref={setArrowElement}
                style={postPopper.styles.arrow}
              />
              <div className="SubmitDropdownActions">
                <Link to="/submit">
                  <p>Post</p>
                </Link>
              </div>
            </div>
          )}
        </div>

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
              ref={setPopperElement}
              style={profilePopper.styles.popper}
              role="tooltip"
              {...profilePopper.attributes.popper}
            >
              <div
                className="DropdownArrow"
                ref={setArrowElement}
                style={profilePopper.styles.arrow}
              />
              <div className="ProfileDropdownActions">
                <Link to="/about" className="ProfileDropdownAction">
                  <p>About</p>
                </Link>

                {user ? (
                  <div>
                    <Link to="/profile" className="ProfileDropdownAction">
                      <p>Profile</p>
                    </Link>
                    <p onClick={logout} className="ProfileDropdownAction">
                      Logout
                    </p>
                  </div>
                ) : (
                  <div>
                    <p onClick={loginBrown} className="ProfileDropdownAction">
                      Login
                    </p>
                  </div>
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
