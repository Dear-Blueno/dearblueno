import "./LoginPopup.css";
import { DialogOverlay, DialogContent } from "@reach/dialog";
import { loginBrown } from "../../../gateways/AuthGateway";

interface LoginPopupProps {
  showPopup: boolean;
  closePopup: () => void;
}

function LoginPopup(props: LoginPopupProps) {
  return (
    <div className="LoginPopup">
      <DialogOverlay
        style={{ background: "hsla(0, 0%, 0%, 0.2)" }}
        isOpen={props.showPopup}
        onDismiss={props.closePopup}
      >
        <DialogContent aria-label="Login Popup">
          <div className="LoginPopupContent">
            <strong>
              You won't be able to interact with the site until you log in.
            </strong>
            <br />
            <div className="LoginPopupButtons">
              <p className="PopupAction" onClick={props.closePopup}>
                No Thanks
              </p>
              <p className="PopupAction" onClick={loginBrown}>
                Login
              </p>
            </div>
          </div>
        </DialogContent>
      </DialogOverlay>
    </div>
  );
}

export default LoginPopup;
