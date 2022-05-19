import "styles/globals.scss";
import type { AppProps } from "next/app";
import Sidebar from "components/page/sidebar/Sidebar";
import axiosInit from "config/axios";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";

axiosInit();
const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <div className="App">
        <QueryClientProvider client={queryClient}>
          <div className="ColumnsContainer">
            <Sidebar />
            <Component {...pageProps} />
          </div>
        </QueryClientProvider>
      </div>
    </>
  );
}

export default MyApp;
