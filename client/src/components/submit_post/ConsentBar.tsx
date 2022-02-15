import IUser from "../../types/IUser";
import "./ConsentBar.css";

type ConsentBarProps = { user: IUser | undefined };

function ConsentBar(props: ConsentBarProps) {
  return (
    <div className="ConsentBar">
      <p className="ConsentText">
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

export default ConsentBar;
