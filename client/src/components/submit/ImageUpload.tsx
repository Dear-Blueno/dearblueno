import styles from "./ImageUpload.module.scss";
import { useRef, useState } from "react";
import { IoImageOutline } from "react-icons/io5";

export default function ImageUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [imageURL, setImageURL] = useState<string | undefined>(undefined);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
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
            setImageURL((data as { data: { link: string } }).data.link);
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((err) => console.log(err));
  };

  if (imageURL) {
    return (
      <div className={styles.UploadedImageContainer}>
        <img
          className={styles.UploadedImage}
          src={imageURL}
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
      <button
        className={styles.UploadButton}
        onClick={() => inputRef.current?.click()}
      >
        <IoImageOutline className={styles.UploadImageIcon} size="6em" />
        <span className={styles.UploadButtonText}>Upload Image</span>
      </button>
    </div>
  );
}
