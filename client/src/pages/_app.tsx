import "styles/globals.scss";
import type { AppProps } from "next/app";
import Sidebar from "components/page/sidebar/Sidebar";
import axiosInit from "config/axios";

axiosInit();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <div className="App">
        <div className="ColumnsContainer">
          <Sidebar />
          <Component {...pageProps} />
        </div>
      </div>
    </>
  );
}

export default MyApp;
