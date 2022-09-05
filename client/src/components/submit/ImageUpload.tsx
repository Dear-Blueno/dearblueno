import styles from "./ImageUpload.module.scss";
import { useState } from "react";

export default function ImageUpload() {
  const [imgSrc, setImgSrc] = useState("");

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => setImgSrc(reader.result as string));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className={styles.ImageUpload}>
      <input type="file" accept="image/*" onChange={onSelectFile} />
    </div>
  );
}
