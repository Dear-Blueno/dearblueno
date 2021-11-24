import SubmitBox from "../../components/submit_post/SubmitBox";
import LogoIcon from "../../images/logo128.png";
import { Link } from "react-router-dom";
import "./SubmitPage.css";

function SubmitPage() {
  return (
    <div className="SubmitPage">
      {window.innerWidth >= 768 && (
        <Link to="/">
          <img
            className="BluenoHomeButton"
            src={LogoIcon}
            alt="Blueno Home Button"
          />
        </Link>
      )}
      <SubmitBox />
    </div>
  );
}

export default SubmitPage;
