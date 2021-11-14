import Post from "./post/Post";
import "./Feed.css";

function Feed() {
    return (
      <div className="Feed">
          <Post postNumber={3} postBody="Lorem ipsum dolor sit amet, consectetur adipiscing elit. In scelerisque ex
vel eros tempor, non gravida eros sagittis. Donec a leo eu arcu suscipit
posuere sed ut massa. Maecenas pellentesque leo nec ipsum ullamcorper
condimentum. Nullam tempus quis lacus id tristique. Aenean vestibulum
euismod dui a fringilla. Nam eget lorem et augue volutpat viverra a non
libero. Present malesuada, tellus vestibulum faucibus fermentum, nisl
metus tincidunt ipsum, in interdum diam massa vitae eros."></Post>
          <Post postNumber={2} postBody="hello"></Post>
          <Post postNumber={1} postBody="hello"></Post>
      </div>
    );
  }
  
  export default Feed;