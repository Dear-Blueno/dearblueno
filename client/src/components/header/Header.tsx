import "./Header.css";

interface HeaderProps {
}

function Header(props : HeaderProps) {
    return (
      <div className="Header">
        <h1 id="HeaderText">Dear Blueno</h1>
      </div>
    );
  }
  
  export default Header;