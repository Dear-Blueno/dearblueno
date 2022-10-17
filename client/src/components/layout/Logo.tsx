import Image from "next/image";
import styles from "./Logo.module.scss";
import LogoIcon from "images/logo512.png";

export default function Logo() {
  return (
    <span className={styles.Logo}>
      <Image src={LogoIcon} alt="Blueno" priority />
    </span>
  );
}
