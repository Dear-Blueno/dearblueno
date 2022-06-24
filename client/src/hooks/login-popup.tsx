import LoginPopup from "components/login/LoginPopup";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

const LoginPopupContext = createContext<Dispatch<SetStateAction<boolean>>>(
  () => {}
);

export const useLoginPopup = () => useContext(LoginPopupContext);

export function LoginPopupProvider(props: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <LoginPopupContext.Provider value={setIsOpen}>
      <LoginPopup isOpen={isOpen} />
      {props.children}
    </LoginPopupContext.Provider>
  );
}
