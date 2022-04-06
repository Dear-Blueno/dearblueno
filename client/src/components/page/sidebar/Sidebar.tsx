import "./Sidebar.css";

import LogoIcon from "images/logo512.png";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <nav className="Sidebar">
      <Link to="/">
        <img className="SidebarLogo" src={LogoIcon} alt="Blueno" />
      </Link>
      <ul className="SidebarList">
        <li className="SidebarListItem">
          <Link to="/" className="SidebarListItemLink">
            Home
          </Link>
        </li>
        <li className="SidebarListItem">
          <Link to="/notifications" className="SidebarListItemLink">
            Notifications
          </Link>
        </li>
        <li className="SidebarListItem">
          <Link to="/bookmarks" className="SidebarListItemLink">
            Bookmarks
          </Link>
        </li>
        <li className="SidebarListItem">
          <Link to="/search" className="SidebarListItemLink">
            Search
          </Link>
        </li>
        <li className="SidebarListItem">
          <Link to="/profile" className="SidebarListItemLink">
            Profile
          </Link>
        </li>
        <li className="SidebarListItem">
          <Link to="/about" className="SidebarListItemLink">
            About
          </Link>
        </li>
      </ul>
    </nav>
  );
}
