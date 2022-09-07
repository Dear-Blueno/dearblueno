import styles from "./ImageUpload.module.scss";
import { useRef, useState } from "react";
import { IoImageOutline } from "react-icons/io5";

interface ImageUploadProps {
  imageURL?: string;
  setImageURL: (url: string) => void;
}

export default function ImageUpload(props: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
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
      <div className={styles.UploadedImageContainer}>
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
      <input
        className={styles.ImageInput}
        type="file"
        accept="image/*"
        onChange={onFileChange}
        ref={inputRef}
      />
      {/* <button
        className={styles.UploadButton}
        onClick={() => inputRef.current?.click()}
      > */}
      <div className={styles.UploadButton}>
        <IoImageOutline className={styles.UploadImageIcon} size="6em" />
        <span className={styles.UploadButtonText}>Upload Image</span>
      </div>
      {/* </button> */}
    </div>
  );
}
