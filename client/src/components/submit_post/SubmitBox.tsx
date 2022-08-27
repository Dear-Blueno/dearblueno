import styles from "./SubmitBox.module.scss";
import GoogleFormOption from "./GoogleFormOption";
import LogoIcon from "../../images/logo128.png";
import { createPost } from "../../gateways/PostGateway";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

interface SubmitBoxProps {
  submitted: boolean;
  submittedSetter: (arg: boolean) => void;
}

function SubmitBox(props: SubmitBoxProps) {
  const submitPost = (text: string) => {
    createPost(text)
      .then((response) => {
        if (response.success) {
          props.submittedSetter(true);
          toast.success("Post submitted for approval!");
        } else {
          toast.error(
            (response.message as unknown as { message: string }).message
          );
        }
      })
      .catch((error) => {
        console.error(error);
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
            <Link href="/">
              <div className={styles.ReturnButton}>
                <Image
                  className={styles.ReturnButtonImage}
                  src={LogoIcon}
                  alt="Blueno Home Button"
                />
                Return to Main Feed
              </div>
            </Link>
          </div>
        ) : (
          <div className={styles.PreSubmitContent}>
            {/* <h2 className={styles.SubmitBoxHeaderText}>post anonymously</h2> */}
            <textarea
              placeholder="What's on your mind?"
              id="TextBox"
              className={styles.TextBox}
              name="TextBox"
              autoFocus={true}
            ></textarea>
            <div className={styles.SubmitBoxFooter}>
              <GoogleFormOption />
              <p
                className={styles.Submit}
                onClick={() => {
                  const element = document.getElementById(
                    "TextBox"
                  ) as HTMLTextAreaElement;
                  submitPost(element.value);
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
