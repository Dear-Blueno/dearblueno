import "styles/globals.scss";
import type { AppProps } from "next/app";
import MainNavigation from "components/mainsidebar/MainNavigation";
import axiosInit from "config/axios";
import { QueryClient, QueryClientProvider } from "react-query";
// import { ReactQueryDevtools } from "react-query/devtools";
import { IsMobileProvider } from "hooks/is-mobile";
import LoginFooter from "components/login/LoginFooter";
import { LoginPopupProvider } from "hooks/login-popup";

axiosInit();
const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <div className="App">
        <IsMobileProvider>
          <QueryClientProvider client={queryClient}>
            <LoginPopupProvider>
              <div className="ColumnsContainer">
                <MainNavigation />
                <Component {...pageProps} />
              </div>
              <LoginFooter></LoginFooter>
              {/* <ReactQueryDevtools initialIsOpen={false} /> */}
            </LoginPopupProvider>
          </QueryClientProvider>
        </IsMobileProvider>
      </div>
    </>
  );
}

export default MyApp;
