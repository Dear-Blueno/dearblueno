import styles from "./ImageSubmit.module.scss";
import { createImagePost } from "../../gateways/PostGateway";
import toast from "react-hot-toast";
import { Dispatch, SetStateAction, useState } from "react";
import ImageUpload from "./ImageUpload";

interface ImageSubmitProps {
  setSubmitted: Dispatch<SetStateAction<boolean>>;
}

function ImageSubmit(props: ImageSubmitProps) {
  const [imageURL, setImageURL] = useState<string | undefined>();
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

  return (
    <div className={styles.SubmitBox}>
      <div className={styles.SubmitBoxContent}>
        <textarea
          placeholder="Caption your image"
          id="TextBox"
          className={styles.TextBox}
          name="TextBox"
          autoFocus={true}
        ></textarea>
        <div className={styles.ImageUploadContainer}>
          <ImageUpload imageURL={imageURL} setImageURL={setImageURL} />
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
