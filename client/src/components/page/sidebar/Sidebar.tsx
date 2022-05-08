import "./Sidebar.css";

import LogoIcon from "images/logo512.png";
import { Link, useLocation } from "react-router-dom";
import { useMemo } from "react";

export default function Sidebar() {
  const location = useLocation();
  type SidebarItem = {
    path: string;
    label: string;
  };
  const sidebarItems: SidebarItem[] = useMemo(
    () => [
      {
        path: "/",
        label: "Home",
      },
      {
        path: "/notifications",
        label: "Notifications",
      },
      {
        path: "/bookmarks",
        label: "Bookmarks",
      },
      {
        path: "/search",
        label: "Search",
      },
      {
        path: "/profile",
        label: "Profile",
      },
      {
        path: "/about",
        label: "About",
      },
    ],
    []
  );

  return (
    <nav className="Sidebar">
      <Link to="/">
        <img className="SidebarLogo" src={LogoIcon} alt="Blueno" />
      </Link>
      <ul className="SidebarList">
        {sidebarItems.map((item) => (
          <li
            key={item.path}
            className={
              location.pathname === item.path
                ? "SidebarListItem SidebarListItemActive"
                : "SidebarListItem"
            }
          >
            <Link to={item.path} className="SidebarListItemLink">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
