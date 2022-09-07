import styles from "./ImageUpload.module.scss";
import { useState } from "react";
import { IoImageOutline } from "react-icons/io5";

interface ImageUploadProps {
  imageURL?: string;
  setImageURL: (url: string) => void;
  type: "post" | "event";
}

export default function ImageUpload(props: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);
    fetch("https://api.imgur.com/3/image", {
      method: "POST",
      headers: {
        Authorization: `Client-ID ${
          process.env.NEXT_PUBLIC_IMGUR_CLIENT_ID ?? ""
        }`,
      },
      body: formData,
    })
      .then((res) => {
        res
          .json()
          .then((data) => {
            props.setImageURL((data as { data: { link: string } }).data.link);
            setUploading(false);
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((err) => console.log(err));
  };

  if (uploading) {
    return (
      <div className={styles.ImageUpload}>
        <div className={styles.ImageUploadBox}>
          <IoImageOutline size="4em" />
          Uploading image...
        </div>
      </div>
    );
  }

  if (props.imageURL) {
    return (
      <div
        className={
          props.type === "post"
            ? styles.PostImageContainer
            : styles.EventImageContainer
        }
      >
        <img
          className={styles.UploadedImage}
          src={props.imageURL}
          alt="Upload preview"
        />
      </div>
    );
  }

  return (
    <div className={styles.ImageUpload}>
      <label className={styles.ImageUploadLabel}>
        <input
          className={styles.ImageInput}
          type="file"
          accept="image/*"
          onChange={onFileChange}
        />
        <div className={styles.UploadButton}>
          <IoImageOutline className={styles.UploadImageIcon} size="6em" />
          <span className={styles.UploadButtonText}>Upload Image</span>
        </div>
      </label>
    </div>
  );
}
