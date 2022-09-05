import useUser from "hooks/useUser";
import styles from "./GoogleFormOption.module.scss";

function GoogleFormOption() {
  const { user, isLoadingUser } = useUser();
  return (
    <div className={styles.GoogleFormOption}>
      {!isLoadingUser && (
        <p className={styles.GoogleFormOptionText}>
          Alternatively, submit via the{" "}
          {user?.verifiedBrown ? (
            <a href="https://forms.gle/Cpa5XEYr3mCpcjBS7">Google Form</a>
          ) : (
            <>
              <a href="https://forms.gle/Cpa5XEYr3mCpcjBS7">verified Brown</a>{" "}
              or <a href="https://forms.gle/NE5Gnr4Y9BWBXs327">non-Brown</a>{" "}
              Google Form
            </>
          )}
          .
        </p>
      )}
    </div>
  );
}

export default GoogleFormOption;
