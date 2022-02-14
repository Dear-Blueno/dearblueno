import SubmitBox from "../../components/submit_post/SubmitBox";
// import LogoIcon from "../../images/logo128.png";
import { Link } from "react-router-dom";
import { useState } from "react";
import "./SubmitPage.css";
import IUser from "../../types/IUser";

type SubmitPageProps = {
  user: IUser | undefined;
};

function SubmitPage(props: SubmitPageProps) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="SubmitPage">
      {window.innerWidth >= 768 && !submitted && (
        <Link to="/" draggable={false}>
          <img
            className="BluenoHomeButton"
            src="https://i.imgur.com/UTJlo8t.png"
            alt="Blueno Home Button"
            draggable={false}
          />
        </Link>
      )}
      <SubmitBox
        user={props.user}
        submitted={submitted}
        submittedSetter={setSubmitted}
      />
    </div>
  );
}

export default SubmitPage;
