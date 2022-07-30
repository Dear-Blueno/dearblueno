import Head from "next/head";
import MainLayout from "components/layout/MainLayout";
import NotificationsFeed from "components/feeds/notifications/NotificationsFeed";
import { NextPage } from "next";
import NotificationsPageHeader from "components/header/notifications/NotificationsPageHeader";

const NotificationsPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Notifications - Dear Blueno</title>
      </Head>
      <MainLayout
        title="Notifications"
        page={<NotificationsFeed />}
        header={<NotificationsPageHeader />}
      ></MainLayout>
    </>
  );
};

export default NotificationsPage;
