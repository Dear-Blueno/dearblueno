import styles from "./CheckboxListItem.module.scss";

type CheckboxListItemProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export default function CheckboxListItem(props: CheckboxListItemProps) {
  return (
    <label className={styles.CheckboxListItem}>
      <input
        className={styles.CheckboxListItemInput}
        type="checkbox"
        checked={props.checked}
        onChange={() => {
          props.onChange(!props.checked);
        }}
      />
      {props.label}
    </label>
  );
}
