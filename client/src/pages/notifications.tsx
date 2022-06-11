import Head from "next/head";
import MainLayout from "components/layout/MainLayout";
import NotificationsFeed from "components/feeds/NotificationsFeed";
import { NextPage } from "next";

const NotificationsPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Notifications</title>
      </Head>
      <MainLayout
        title="Notifications"
        page={<NotificationsFeed />}
      ></MainLayout>
    </>
  );
};

export default NotificationsPage;
