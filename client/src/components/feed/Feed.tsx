import Post from "./post/Post";
import "./Feed.css";
import { Comment } from "./post/comments/CommentSection";

function Feed() {
  // const [posts, setPosts] = useState([]);

  // let data; // result of fetch call to query db for posts

  // assemble comments from post data with empty children array

  // map over posts and return a Post component for each post

  // for testing
  const comments: Comment[] = [];
  const comment1: Comment = {
    id: 1,
    parentId: -1,
    author: "Dylan Hu",
    body: "This is a comment",
    date: "2020-01-01",
    children: [],
    reactions: [
      ["like", "1"],
      ["dislike", "2"],
    ],
  };
  const comment2: Comment = {
    id: 2,
    parentId: 1,
    author: "Nicholas Vadasz",
    body: "This is another comment",
    date: "2020-01-01",
    children: [],
    reactions: [["hi"], [], [], ["tee", "hee", "LOL"], ["like", "1"]],
  };
  const comment3: Comment = {
    id: 3,
    parentId: 2,
    author: "Dylan Hu",
    body: "That's cool yo",
    date: "2020-01-01",
    children: [],
    reactions: [[]],
  };

  const comment5: Comment = {
    id: 5,
    parentId: 2,
    author: "Nick Bottone",
    body: "This is a comment",
    date: "2020-01-01",
    children: [],
    reactions: [[], []],
  };
  const comment6: Comment = {
    id: 6,
    parentId: 1,
    author: "Nick Bottone",
    body: "SHEEEESH",
    date: "2020-01-01",
    children: [],
    reactions: [[], [], [], [], [], ["FIZZ", "BUZZ", "TEE", "HEE", "LOL"]],
  };
  comments.push(comment1, comment2, comment3, comment5, comment6);
  console.log(comments);

  return (
    <div className="Feed">
      {/* for testing */}
      <Post
        postNumber={1}
        postDate="May 12"
        postBody="Hello this is Dylan"
        comments={comments}
        reactions={[[], [], [], [], [], []]}
      />
    </div>
  );
}

export default Feed;
