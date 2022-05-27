import styles from "./SubmitBox.module.scss";
import GoogleFormOption from "./GoogleFormOption";
import LogoIcon from "../../images/logo128.png";
import IUser from "../../types/IUser";
import { createPost } from "../../gateways/PostGateway";
import Image from "next/image";

type SubmitBoxProps = {
  user: IUser | undefined;
  submitted: boolean;
  submittedSetter: (arg: boolean) => void;
};

function SubmitBox(props: SubmitBoxProps) {
  const post = (text: string) => {
    props.submittedSetter(true);
    createPost(text)
      .then((response) => {
        if (response.success && response.payload) {
          console.log(response.payload);
        }
      })
      .catch(() => {
        console.log("post failed");
      });
  };

  return (
    <>
      <div className={styles.SubmitBox}>
        {props.submitted ? (
          <div className={styles.PostSubmitContent}>
            <h2 className={styles.ReturnText}>
              Your post has been submitted and will be reviewed by moderators
              shortly. Thank you.
            </h2>
            <a href="/">
              <div className={styles.ReturnButton}>
                <Image
                  className={styles.ReturnButtonImage}
                  src={LogoIcon}
                  alt="Blueno Home Button"
                />
                Return to Main Feed
              </div>
            </a>
          </div>
        ) : (
          <div className={styles.PreSubmitContent}>
            {/* <h2 className={styles.SubmitBoxHeaderText}>post anonymously</h2> */}
            <textarea
              placeholder="What's on your mind?"
              id={styles.TextBox}
              name="TextBox"
              autoFocus={true}
            ></textarea>
            <div className={styles.SubmitBoxFooter}>
              <GoogleFormOption user={props.user} />
              <p
                className={styles.Submit}
                onClick={() => {
                  let element = document.getElementById(
                    "TextBox"
                  ) as HTMLTextAreaElement;
                  post(element.value);
                }}
              >
                submit
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default SubmitBox;
