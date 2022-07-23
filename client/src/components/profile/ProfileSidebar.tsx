import styles from "./ProfileSidebar.module.scss";
import Collapsible from "react-collapsible";

const settingTitles = ["Change Display Name", "Change Notification Settings"];

export default function ProfileSidebar() {
  return (
    <div className="ProfileSidebar">
      <Collapsible
        trigger="Settings"
        triggerTagName="h3"
        triggerClassName={styles.DropdownTitle}
        triggerOpenedClassName={styles["is-open"] + " " + styles.DropdownTitle}
        transitionTime={100}
        open
      >
        <div className={styles.DropdownContent}>
          {settingTitles.map((title, index) => (
            <div key={index} className={styles.DropdownItem}>
              {title}
            </div>
          ))}
        </div>
      </Collapsible>
    </div>
  );
}
