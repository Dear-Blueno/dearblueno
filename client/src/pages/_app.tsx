import "styles/globals.scss";
import type { AppProps } from "next/app";
import Head from "next/head";
import Sidebar from "components/page/sidebar/Sidebar";
import axiosInit from "config/axios";

axiosInit();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      {/* <div className="ColumnsContainer">
        <Sidebar />
      </div> */}
    </>
  );
}

export default MyApp;
