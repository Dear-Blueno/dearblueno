import LoginPopup from "components/login/LoginPopup";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import useUser from "./useUser";

// type that takes in a function, returns a function of the same type or void
type FunctionToFunction = <T extends unknown[], R>(
  f: (...args: T) => R
) => ((...args: T) => R) | VoidFunction;

interface LoginPopupContextType {
  setLoginPopupIsOpen: Dispatch<SetStateAction<boolean>>;
  openLoginPopup: () => void;
  userOnlyAction: FunctionToFunction;
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
  const openLoginPopup = () => {
    setLoginPopupIsOpen(true);
    return undefined;
  };
  // userOnlyAction takes in a function that returns a function.
  const userOnlyAction: FunctionToFunction = (action) =>
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
