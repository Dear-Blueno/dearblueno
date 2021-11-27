import SubmitBox from "../../components/submit_post/SubmitBox";
import LogoIcon from "../../images/logo128.png";
import { Link } from "react-router-dom";
import { useState } from "react";
import "./SubmitPage.css";

function SubmitPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="SubmitPage">
      {window.innerWidth >= 768 && !submitted && (
        <Link to="/">
          <img
            className="BluenoHomeButton"
            src={LogoIcon}
            alt="Blueno Home Button"
          />
        </Link>
      )}
      <SubmitBox submitted={submitted} submittedSetter={setSubmitted} />
    </div>
  );
}

export default SubmitPage;
