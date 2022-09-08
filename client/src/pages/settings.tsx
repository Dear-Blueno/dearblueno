import styles from "styles/SettingsPage.module.scss";
import MainLayout from "components/layout/MainLayout";
import { NextPage } from "next";
import Head from "next/head";
import useUser from "hooks/useUser";
import { useState } from "react";
import GenericProfileButton from "components/profile/buttons/GenericProfileButton";
import { updateSettings } from "gateways/UserGateway";
import toast from "react-hot-toast";

const SettingsPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Settings - Dear Blueno</title>
      </Head>
      <MainLayout title="Settings" page={<SettingsPageMain />} />
    </>
  );
};

function SettingsPageMain() {
  const { user } = useUser();
  const [autoSubInput, setAutoSubInput] = useState(
    user?.settings.autoSubscribe ?? false
  );

  const handleSettingsEdit = () => {
    if (user && autoSubInput !== user.settings.autoSubscribe) {
      updateSettings(autoSubInput)
        .then((response) => {
          if (response.success) {
            toast.success("Settings updated successfully!");
          } else {
            toast.error(response.message);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <div className={styles.SettingsPage}>
      {user ? (
        <>
          <p className={styles.SettingsHeader}>Settings</p>
          <div
            className={styles.AutoSubBox}
            onClick={() => setAutoSubInput(!autoSubInput)}
          >
            <input
              type="checkbox"
              checked={autoSubInput}
              onChange={() => setAutoSubInput(!autoSubInput)}
              className={styles.AutoSubInput}
            />
            <p>Auto-Sub On Public Comment</p>
          </div>
          <div className={styles.SaveAndCancelButtons}>
            <div className={styles.ContainerOne}>
              <GenericProfileButton click={handleSettingsEdit} text={"Save"} />
            </div>
            <div className={styles.ContainerOne}>
              <GenericProfileButton text={"Cancel"} />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default SettingsPage;
