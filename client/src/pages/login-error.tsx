import { NextPage } from "next";
import Head from "next/head";
import MainLayout from "components/layout/MainLayout";

const LoginErrorPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Login Error - Dear Blueno</title>
      </Head>
      <MainLayout title="Whoops" page={<LoginErrorMain />} />
    </>
  );
};

function LoginErrorMain() {
  return (
    <div>
      <h1>Login Error</h1>
      <p>
        You must be a Brown University community member to login to this site.
        Try again with your @brown.edu or @alumni.brown.edu email address.
      </p>
    </div>
  );
}

export default LoginErrorPage;
