import LoginPopup from "components/login/LoginPopup";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import useUser from "./useUser";

interface LoginPopupContextType {
  setLoginPopupIsOpen: Dispatch<SetStateAction<boolean>>;
  openLoginPopup: () => void;
  userOnlyAction: (action: () => void) => () => void;
}

const LoginPopupContext = createContext<LoginPopupContextType>({
  setLoginPopupIsOpen: () => undefined,
  openLoginPopup: () => undefined,
  userOnlyAction: () => () => undefined,
});

export const useLoginPopup = () => useContext(LoginPopupContext);

export function LoginPopupProvider(props: { children: React.ReactNode }) {
  const { user } = useUser();
  const [isOpen, setLoginPopupIsOpen] = useState(false);
  const openLoginPopup = () => setLoginPopupIsOpen(true);
  const userOnlyAction = (action: () => void) =>
    user ? action : openLoginPopup;
  return (
    <LoginPopupContext.Provider
      value={{ setLoginPopupIsOpen, openLoginPopup, userOnlyAction }}
    >
      <LoginPopup isOpen={isOpen} />
      {props.children}
    </LoginPopupContext.Provider>
  );
}
