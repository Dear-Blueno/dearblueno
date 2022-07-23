import styles from "./ReactionButton.module.scss";
import Image from "next/image";

interface ReactionButtonProps {
  type: "comment" | "post";
  image: string;
  count: number;
  handleClick: () => void;
  reacted: boolean;
}

function ReactionButton(props: ReactionButtonProps) {
  const className =
    props.type === "comment" ? "CommentReactionButton" : "PostReactionButton";
  const reactedClassName = props.reacted ? "Reacted" : "";
  const size = props.type === "comment" ? 14 : 18;

  return (
    <div className={styles.ReactionButton + " " + styles[className]}>
      <Image
        src={props.image}
        priority
        onClick={() => {
          props.handleClick();
        }}
        alt="reaction"
        draggable={false}
        width={size}
        height={size}
        style={{ cursor: "pointer" }}
      />
      <p
        className={styles[className + "Count"] + " " + styles[reactedClassName]}
      >
        {props.count}
      </p>
    </div>
  );
}

export default ReactionButton;
