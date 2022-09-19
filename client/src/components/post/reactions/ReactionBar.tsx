import styles from "./ReactionBar.module.scss";
import ReactionButton from "./ReactionButton";
import AngryIcon from "images/angry.svg";
import AngryBWIcon from "images/angryBW.svg";
import CryIcon from "images/cry.svg";
import CryBWIcon from "images/cryBW.svg";
import HeartIcon from "images/heart.svg";
import HeartBWIcon from "images/heartBW.svg";
import LaughIcon from "images/laugh.svg";
import LaughBWIcon from "images/laughBW.svg";
import LikeIcon from "images/like.svg";
import LikeBWIcon from "images/likeBW.svg";
import SurpriseIcon from "images/surprise.svg";
import SurpriseBWIcon from "images/surpriseBW.svg";
import { useState, useMemo } from "react";
import { reactToComment, reactToPost } from "gateways/PostGateway";
import useUser from "hooks/useUser";
import { useLoginPopup } from "hooks/login-popup";
import { MdOutlineAddReaction } from "react-icons/md";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/router";
import { parseSortQueryParams } from "components/header/mainfeed/MainFeedHeader";
import IPost from "types/IPost";

interface ReactionBarProps {
  type: "comment" | "post";
  reactions: string[][];
  postNumber: number;
  commentNumber?: number;
}

enum ReactionType {
  LIKE,
  HEART,
  LAUGH,
  CRY,
  ANGRY,
  SURPRISE,
}

interface Reaction {
  type: ReactionType;
  reactors: string[];
}
interface ReactionRequest {
  postNumber: number;
  commentNumber?: number;
  reaction: ReactionType;
  newValue: boolean;
}

const reactionCompare = (a: Reaction, b: Reaction) => {
  if (a.reactors.length === 0 || b.reactors.length === 0) {
    return b.reactors.length - a.reactors.length || a.type - b.type;
  }
  return a.type - b.type;
};

function ReactionBar(props: ReactionBarProps) {
  const { user } = useUser();
  const { userOnlyAction } = useLoginPopup();
  const [order, setOrder] = useState<number[]>();
  const queryClient = useQueryClient();
  const router = useRouter();
  const sort = parseSortQueryParams(router.query.sort, router.query.of);

  const unsortedReactions = props.reactions.map((list, index) => ({
    type: index,
    reactors: list,
  }));
  const sortedReactions = [...unsortedReactions].sort(reactionCompare);

  const updateOrder = () =>
    setOrder(sortedReactions.map((reaction) => reaction.type));

  if (!order) {
    updateOrder();
  }

  const reactions = unsortedReactions.sort((a, b) => {
    if (order) {
      return order.indexOf(a.type) - order.indexOf(b.type);
    }
    return 0;
  });

  const icons = useMemo(
    () => [
      [LikeIcon, LikeBWIcon],
      [HeartIcon, HeartBWIcon],
      [LaughIcon, LaughBWIcon],
      [CryIcon, CryBWIcon],
      [AngryIcon, AngryBWIcon],
      [SurpriseIcon, SurpriseBWIcon],
    ],
    []
  );

  const [showReactText, setShowReactText] = useState(
    reactions.every((reaction) => reaction.reactors.length === 0)
  );
  const [showZeroIcons, setShowZeroIcons] = useState(false);
  const [hideButtonsTimeout, setHideButtonsTimeout] =
    useState<NodeJS.Timeout>();

  const reactionMutation = (requestData: ReactionRequest) => {
    if (props.type === "post") {
      return reactToPost(
        requestData.postNumber,
        requestData.reaction + 1,
        requestData.newValue
      );
    }
    const commentRequestData = requestData;
    return reactToComment(
      commentRequestData.postNumber,
      commentRequestData.commentNumber ?? -1,
      commentRequestData.reaction + 1,
      commentRequestData.newValue
    );
  };
  const { mutate: mutateReaction } = useMutation(reactionMutation, {
    // When mutate is called:
    onMutate: async (data) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries(["posts", sort]);

      // Snapshot the previous value
      const previousPosts = queryClient.getQueryData(["posts", sort]);

      // Optimistically update to the new value
      queryClient.setQueryData(
        ["posts", sort],
        (old: InfiniteData<IPost[]> | undefined) => {
          if (!user) return old;
          old?.pages.forEach((page) => {
            page.forEach((post) => {
              if (post.postNumber === data.postNumber) {
                if (props.type === "post") {
                  if (data.newValue) {
                    post.reactions[data.reaction].push(user._id);
                  } else {
                    post.reactions[data.reaction] = post.reactions[
                      data.reaction
                    ].filter((username) => username !== user._id);
                  }
                } else {
                  post.comments.forEach((comment) => {
                    if (comment.commentNumber === data.commentNumber) {
                      if (data.newValue) {
                        comment.reactions[data.reaction].push(user._id);
                      } else {
                        comment.reactions[data.reaction] = comment.reactions[
                          data.reaction
                        ].filter((username) => username !== user._id);
                      }
                    }
                  });
                }
              }
            });
          });
          return old;
        }
      );
      // Return a context object with the snapshotted value
      return { previousPosts };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, variables, context) => {
      queryClient.setQueryData(["posts", sort], context?.previousPosts);
    },
    onSuccess: () => {
      queryClient.refetchQueries(["posts"]).catch((err) => {
        console.error(err);
      });
    },
  });

  const className =
    props.type === "comment" ? "CommentReactionBar" : "PostReactionBar";

  return (
    <div
      className={styles.ReactionBar + " " + styles[className]}
      onMouseEnter={() => {
        if (!showReactText) {
          setShowZeroIcons(true);
        }
        if (hideButtonsTimeout) clearTimeout(hideButtonsTimeout);
      }}
      onMouseLeave={() => {
        setHideButtonsTimeout(
          setTimeout(() => {
            setShowZeroIcons(false);
            if (reactions.every((reaction) => reaction.reactors.length === 0)) {
              setShowReactText(true);
            }
            updateOrder();
          }, 250)
        );
      }}
    >
      {showReactText && (
        <button
          className={styles.AddReactionFooterButton}
          onClick={userOnlyAction(() => {
            setShowReactText(false);
            setShowZeroIcons(true);
          })}
          title="Add a reaction"
        >
          <MdOutlineAddReaction
            size={props.type === "post" ? "1.6em" : "1.2em"}
            color="#789"
          />
        </button>
      )}
      {reactions.map(
        (reaction) =>
          (showZeroIcons || reaction.reactors.length > 0) && (
            <ReactionButton
              hidden={showReactText}
              type={props.type}
              key={reaction.type}
              image={
                icons[reaction.type][
                  reaction.reactors.length > 0 ? 0 : 1
                ] as string
              }
              count={reaction.reactors.length}
              handleClick={userOnlyAction(
                () =>
                  user &&
                  mutateReaction({
                    postNumber: props.postNumber,
                    commentNumber: props.commentNumber,
                    reaction: reaction.type,
                    newValue: !reaction.reactors.includes(user._id),
                  })
              )}
              reacted={(user && reaction.reactors.includes(user._id)) ?? false}
            ></ReactionButton>
          )
      )}
    </div>
  );
}

export default ReactionBar;
