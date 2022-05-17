import "./CheckboxListItem.css";

type CheckboxListItemProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export default function CheckboxListItem(props: CheckboxListItemProps) {
  return (
    <label className="CheckboxListItem">
      <input
        className="CheckboxListItemInput"
        type="checkbox"
        checked={props.checked}
        onChange={(e) => {
          props.onChange(!props.checked);
        }}
      />
      {props.label}
    </label>
  );
}
