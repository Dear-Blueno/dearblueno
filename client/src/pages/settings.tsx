import styles from "styles/SettingsPage.module.scss";
import MainLayout from "components/layout/MainLayout";
import { NextPage } from "next";
import Head from "next/head";
import useUser from "hooks/useUser";
import { useEffect, useMemo, useState } from "react";
import GenericProfileButton from "components/profile/buttons/GenericProfileButton";
import { updateSettings } from "gateways/UserGateway";
import toast from "react-hot-toast";
import { FeedPicker } from "components/header/mainfeed/MainFeedHeader";
import { getUser } from "gateways/UserGateway";
import { IoClose } from "react-icons/io5";
import { unblockUser } from "gateways/UserGateway";

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
  const [homeFeedSortInput, setHomeFeedSortInput] = useState(
    user?.settings.homeFeedSort ?? "hot"
  );
  const blockedUsers = useMemo(() => {
    return user?.blockedUsers ?? [];
  }, [user]);
  const [blockedUsersNames, setBlockedUsersNames] = useState<string[]>([]);

  useEffect(() => {
    if (blockedUsers.length > 0) {
      const promises = blockedUsers.map((id) => getUser(id));
      Promise.all(promises)
        .then((users) => {
          setBlockedUsersNames(users.map((user) => user.payload?.name ?? ""));
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [blockedUsers]);

  const unblockUserAction = (index: number, name: string) => {
    if (user) {
      unblockUser(blockedUsers[index])
        .then((response) => {
          if (response.success) {
            toast.success(`Unblocked ${name}!`);
          } else {
            console.log(response.message);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleSettingsEdit = () => {
    if (user) {
      updateSettings({
        autoSubscribe: autoSubInput,
        homeFeedSort: homeFeedSortInput,
      })
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
          <div className={styles.SettingsContainer}>
            <h3 className={styles.SettingsHeader}>Notifications</h3>
            <label className={styles.AutoSubBox}>
              <input
                type="checkbox"
                checked={autoSubInput}
                onChange={() => setAutoSubInput(!autoSubInput)}
                className={styles.AutoSubInput}
                style={{ marginLeft: "0.6rem" }}
              />
              <p>Auto-Sub On Public Comment</p>
            </label>
          </div>
          <div
            className={styles.SettingsContainer}
            style={{ flexDirection: "column" }}
          >
            <h3 className={styles.SettingsHeader}>Default Home Feed</h3>
            <div style={{ maxWidth: "fit-content" }}>
              <FeedPicker
                sort={homeFeedSortInput}
                setSort={setHomeFeedSortInput}
              />
            </div>
          </div>
          <div
            className={styles.SettingsContainer}
            style={{ flexDirection: "column" }}
          >
            <h3 className={styles.SettingsHeader}>Blocked Users</h3>
            {blockedUsersNames.length > 0 ? (
              <div className={styles.BlockedUsersList}>
                {blockedUsersNames.map((name, index) => (
                  <div className={styles.BlockedUser} key={index}>
                    <IoClose
                      className={styles.CloseIcon}
                      onClick={() => unblockUserAction(index, name)}
                    />
                    <a
                      href={`/profile/${blockedUsers[index]}`}
                      className={styles.BlockedName}
                    >
                      {name}
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.NoBlockedUsers}>No blocked users!</p>
            )}
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
