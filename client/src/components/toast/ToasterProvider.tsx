import { useIsMobile } from "hooks/is-mobile";
import { Toaster } from "react-hot-toast";

const ToasterProvider = (props: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();
  return (
    <>
      <Toaster
        toastOptions={{
          position: isMobile ? "top-center" : "bottom-right",
          style: {
            borderRadius: "0.3rem",
            boxShadow: "none",
            border: "0.1rem solid black",
            fontFamily: "Poppins, sans-serif",
          },
        }}
      />
      {props.children}
    </>
  );
};

export default ToasterProvider;
