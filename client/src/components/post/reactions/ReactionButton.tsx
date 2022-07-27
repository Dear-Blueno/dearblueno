import styles from "./ReactionButton.module.scss";
import Image from "next/image";
import toast from "react-hot-toast";
import { IResponse } from "gateways/GatewayResponses";

interface ReactionButtonProps {
  type: "comment" | "post";
  image: string;
  count: number;
  handleClick: VoidFunction | (() => Promise<IResponse<boolean>>);
  reacted: boolean;
  hidden: boolean;
}

function ReactionButton(props: ReactionButtonProps) {
  const className =
    props.type === "comment" ? "CommentReactionButton" : "PostReactionButton";
  const reactedClassName = props.reacted ? "Reacted" : "";
  const size = props.type === "comment" ? 14 : 18;

  return (
    <div
      className={styles.ReactionButton + " " + styles[className]}
      style={{ display: props.hidden ? "none" : "flex" }}
    >
      <Image
        src={props.image}
        priority
        onClick={() => {
          const result = props.handleClick();
          if (result) {
            result
              .then((response) => {
                if (!response.success) {
                  toast.error(
                    (response.message as unknown as { message: string }).message
                  );
                }
              })
              .catch(() => toast.error("Uh oh, something went wrong"));
          }
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
