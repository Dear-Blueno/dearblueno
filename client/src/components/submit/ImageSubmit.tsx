import styles from "./ImageSubmit.module.scss";
import GoogleFormOption from "./GoogleFormOption";
import { createPost } from "../../gateways/PostGateway";
import toast from "react-hot-toast";
import { Dispatch, SetStateAction } from "react";
import ImageUpload from "./ImageUpload";

interface ImageSubmitProps {
  setSubmitted: Dispatch<SetStateAction<boolean>>;
}

function ImageSubmit(props: ImageSubmitProps) {
  const submitPost = (text: string) => {
    createPost(text)
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          gap: "1rem",
          width: "100%",
          maxWidth: "100%",
        }}
      >
        <textarea
          placeholder="Caption your image"
          id="TextBox"
          className={styles.TextBox}
          name="TextBox"
          autoFocus={true}
        ></textarea>
        <ImageUpload />
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
