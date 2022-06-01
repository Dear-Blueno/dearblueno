import styles from "./ReactionButton.module.scss";
import Image from "next/image";

interface ReactionButtonProps {
  type: "comment" | "post";
  images: string[];
  count: number;
  reactionArray: string[];
  handleClick: () => void;
}

function ReactionButton(props: ReactionButtonProps) {
  const className =
    props.type === "comment" ? "CommentReactionButton" : "PostReactionButton";

  return (
    <div className={className}>
      <div className={styles[className + "Image"]}>
        <Image
          src={props.count ? props.images[0] : props.images[1]}
          onClick={() => {
            props.handleClick();
          }}
          alt="reaction"
          draggable={false}
          width="100%"
          height="100%"
        />
      </div>
      <p className={styles[className + "Count"]}>{props.count}</p>
    </div>
  );
}

export default ReactionButton;
