import Head from "next/head";
import MainLayout from "components/layout/MainLayout";
import NotificationsFeed from "components/feeds/NotificationsFeed";

export default function NotificationsPage() {
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
}
