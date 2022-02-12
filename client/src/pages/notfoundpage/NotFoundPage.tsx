import "./NotFoundPage.css";
import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="NotFoundPage">
      <h1 className="NotFoundText">
        Sorry, Blueno couldn't find what you were looking for
      </h1>
      <Link to="/" className="NotFoundLink">
        <img
          src="https://i.imgur.com/3wjWxiQ.gif"
          alt="404"
          className="BluenoGif"
        />
        Back to Main Feed
      </Link>
    </div>
  );
}

export default NotFoundPage;
