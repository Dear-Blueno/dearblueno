import styles from "./GenericProfileButton.module.scss";

interface GenericProfileButtonProps {
  click: () => void;
  text: string;
}

function GenericProfileButton(props: GenericProfileButtonProps) {
  return (
    <div className={styles.GenericProfileButtonContainer}>
      <button className={styles.GenericProfileButton} onClick={props.click}>
        {props.text}
      </button>
    </div>
  );
}

export default GenericProfileButton;
