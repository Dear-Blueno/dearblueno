import styles from "./GoogleFormOption.module.scss";
import IUser from "../../types/IUser";

interface GoogleFormOptionProps { user?: IUser }

function GoogleFormOption(props: GoogleFormOptionProps) {
  return (
    <div className={styles.GoogleFormOption}>
      <p className={styles.GoogleFormOptionText}>
        Alternatively, submit via the{" "}
        {props.user?.verifiedBrown ? (
          <a href="https://forms.gle/Cpa5XEYr3mCpcjBS7">Google Form</a>
        ) : (
          <>
            <a href="https://forms.gle/Cpa5XEYr3mCpcjBS7">verified Brown</a> or{" "}
            <a href="https://forms.gle/NE5Gnr4Y9BWBXs327">non-Brown</a> Google
            Form
          </>
        )}
        .
      </p>
    </div>
  );
}

export default GoogleFormOption;
