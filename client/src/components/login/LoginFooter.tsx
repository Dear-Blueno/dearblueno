import { loginBrown } from "gateways/AuthGateway";
import useUser from "hooks/useUser";
import { useState } from "react";
import styles from "./LoginFooter.module.scss";
import { IoClose } from "react-icons/io5";

export default function LoginFooter() {
  const { user, isLoadingUser: isLoading } = useUser();
  const [open, setOpen] = useState(true);
  if (isLoading || user || !open) return null;
  return (
    <footer className={styles.LoginFooter}>
      <div className={styles.LoginFooterClose}>
        <button
          className={styles.LoginFooterCloseButton}
          onClick={() => setOpen(false)}
        >
          <IoClose />
        </button>
      </div>
      <div className={styles.LoginFooterBody}>
        <h4 className={styles.LoginFooterText}>
          Log in to interact with Dear Blueno
        </h4>
        <button className={styles.LoginButton} onClick={loginBrown}>
          Log in
        </button>
      </div>
    </footer>
  );
}
