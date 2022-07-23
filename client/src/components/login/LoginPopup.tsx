import styles from "./LoginPopup.module.scss";
import { DialogOverlay, DialogContent } from "@reach/dialog";
import { loginBrown } from "gateways/AuthGateway";
import { useLoginPopup } from "hooks/login-popup";

interface LoginPopupProps {
  isOpen: boolean;
}

function LoginPopup(props: LoginPopupProps) {
  const { setLoginPopupIsOpen } = useLoginPopup();
  const close = () => setLoginPopupIsOpen(false);
  return (
    <div className={styles.LoginPopup}>
      <DialogOverlay
        style={{ background: "hsla(0, 0%, 0%, 0.2)" }}
        isOpen={props.isOpen}
        onDismiss={close}
      >
        <DialogContent aria-label="Login Popup">
          <div className={styles.LoginPopupContent}>
            <strong>
              {
                "You'll only be able to submit posts on Dear Blueno until you log in."
              }
            </strong>
            <br />
            <div className={styles.PopupButtons}>
              <button
                className={styles.PopupAction}
                onClick={close}
                tabIndex={-1}
              >
                No Thanks
              </button>
              <button
                className={styles.PopupAction}
                onClick={loginBrown}
                tabIndex={-1}
              >
                Log in
              </button>
            </div>
          </div>
        </DialogContent>
      </DialogOverlay>
    </div>
  );
}

export default LoginPopup;
