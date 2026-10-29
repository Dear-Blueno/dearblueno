import "styles/globals.scss";
import { useEffect } from "react";
import type { AppProps } from "next/app";
import MainNavigation from "components/mainsidebar/MainNavigation";
import axiosInit from "config/axios";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { IsMobileProvider } from "hooks/is-mobile";
import LoginFooter from "components/login/LoginFooter";
import { LoginPopupProvider } from "hooks/login-popup";
import ToasterProvider from "components/toast/ToasterProvider";

axiosInit();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      void navigator.serviceWorker.register("/sw.js").catch(console.error);
    }
  }, []);
  return (
    <div className="App">
      <IsMobileProvider>
        <QueryClientProvider client={queryClient}>
          <LoginPopupProvider>
            <ToasterProvider>
              <div className="ColumnsContainer">
                <MainNavigation />
                <Component {...pageProps} />
              </div>
              <LoginFooter></LoginFooter>
            </ToasterProvider>
            {/* <ReactQueryDevtools initialIsOpen={false} /> */}
          </LoginPopupProvider>
        </QueryClientProvider>
      </IsMobileProvider>
    </div>
  );
}

export default MyApp;
