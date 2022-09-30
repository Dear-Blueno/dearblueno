import styles from "./ImageSubmit.module.scss";
import { createImagePost } from "../../gateways/PostGateway";
import toast from "react-hot-toast";
import { Dispatch, SetStateAction, useState } from "react";
import ImageUpload from "./ImageUpload";
import useUser from "hooks/useUser";
import { loginBrown } from "gateways/AuthGateway";

interface ImageSubmitProps {
  setSubmitted: Dispatch<SetStateAction<boolean>>;
}

function ImageSubmit(props: ImageSubmitProps) {
  const [imageURL, setImageURL] = useState<string | undefined>();
  const { user } = useUser();
  const submitPost = (text: string) => {
    if (text.length > 100) {
      toast.error(`Caption is ${text.length - 100} characters too long`);
      return;
    }
    if (!imageURL) {
      return;
    }
    createImagePost(text, imageURL)
      .then((response) => {
        if (response.success) {
          props.setSubmitted(true);
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

  if (!user) {
    return (
      <div className={styles.NotLoggedIn}>
        <strong>You are not logged in</strong>
        <p>
          Since images have greater potential to contain graphic, illegal, or
          traumatic content, we require you to be logged in to submit an image
          post.
        </p>
        <p>
          Dear Blueno does not store any personal information about the creators
          of image posts. Logging in is only required so that we can verify that
          you are a Brown student or community member, thereby preventing
          external bad actors from submitting content that violates our
          community guidelines.
        </p>
        <button onClick={loginBrown} className={styles.LoginButton}>
          Log in here
        </button>
      </div>
    );
  }

  return (
    <div className={styles.SubmitBox}>
      <div className={styles.SubmitBoxContent}>
        <textarea
          placeholder="Caption your image"
          id="TextBox"
          className={styles.TextBox}
          name="TextBox"
        ></textarea>
        <div className={styles.ImageUploadContainer}>
          <ImageUpload
            type="post"
            imageURL={imageURL}
            setImageURL={setImageURL}
          />
        </div>
        <div className={styles.ImageSubmitBoxFooter}>
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
    </div>
  );
}

export default ImageSubmit;
