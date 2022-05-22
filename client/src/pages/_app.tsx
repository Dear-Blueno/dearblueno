import "styles/globals.scss";
import type { AppProps } from "next/app";
import MainSidebar from "components/mainsidebar/MainSidebar";
import axiosInit from "config/axios";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { IsMobileProvider } from "hooks/is-mobile";

axiosInit();
const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <div className="App">
        <IsMobileProvider>
          <QueryClientProvider client={queryClient}>
            <div className="ColumnsContainer">
              <MainSidebar />
              <Component {...pageProps} />
            </div>
          </QueryClientProvider>
        </IsMobileProvider>
      </div>
    </>
  );
}

export default MyApp;
