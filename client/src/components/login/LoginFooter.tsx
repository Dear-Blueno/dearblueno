import { loginBrown } from "gateways/AuthGateway";
import useUser from "hooks/useUser";
import styles from "./LoginFooter.module.scss";

export default function LoginFooter() {
  const { user, isLoading } = useUser();
  if (isLoading || user) return null;
  return (
    <footer className={styles.LoginFooter}>
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
