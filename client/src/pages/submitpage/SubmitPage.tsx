import SubmitBox from "../../components/submit_post/SubmitBox";
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
      <SubmitBox
        user={props.user}
        submitted={submitted}
        submittedSetter={setSubmitted}
      />
    </div>
  );
}

export default SubmitPage;
