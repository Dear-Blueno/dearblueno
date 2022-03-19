import "./Sidebar.css";

import LogoIcon from "../../images/logo512.png";

export default function Sidebar() {
  return (
    <nav className="Sidebar">
      <img className="SidebarLogo" src={LogoIcon} alt="Blueno" />
    </nav>
  );
}
