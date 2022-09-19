import { IComment } from "../models/Comment";
import { IPost } from "../models/Post";
import { IUser } from "../models/User";

// Cleans the sensitive data from the post object, including reactions and unapproved comments
export default function cleanSensitivePost(post: IPost, user?: IUser): IPost {
  const anonymizeReactionList = (reactionList: string[]) =>
    reactionList.map((reaction) =>
      String(reaction) == String(user?._id) ? reaction : "anon"
    );

  // anonymize reaction on post (replace reactor with "anon")
  const reactions = post.reactions.map(anonymizeReactionList);

  const comments = post.comments
    // don't include comments if they are not approved
    .filter((comment) => comment.approved)
    // anonymize reaction on comments (replace reactor with "anon")
    .map((comment: IComment) => {
      comment.reactions = comment.reactions.map(anonymizeReactionList);
      return comment;
    });

  return { ...post, reactions, comments };
}
