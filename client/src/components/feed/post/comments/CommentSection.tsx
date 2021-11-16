import "./CommentSection.css";
import Comment from "./Comment";

export interface CommentSectionProps {
    data : CommentData[];
}

export interface CommentData {
    author : string;
    body : string;
    date : string;
    depth : number;
}

function CommentSection(props : CommentSectionProps) {
    return (
      <div className="CommentSection">
          <Comment author={props.data[0].author} body={props.data[0].body} date="May 12" depth={0}/>
          <Comment author={props.data[0].author} body={props.data[0].body} date="May 12" depth={1}/>
          <Comment author={props.data[0].author} body={props.data[0].body} date="May 12" depth={2}/>
          <Comment author={props.data[0].author} body={props.data[0].body} date="May 12" depth={3}/>
          <Comment author={props.data[0].author} body={props.data[0].body} date="May 12" depth={4}/>
          <Comment author={props.data[0].author} body={props.data[0].body} date="May 12" depth={5}/>
          <Comment author={props.data[0].author} body={props.data[0].body} date="May 12" depth={6}/>
          <Comment author={props.data[0].author} body={props.data[0].body} date="May 12" depth={7}/>
          <Comment author={props.data[0].author} body={props.data[0].body} date="May 12" depth={8}/>
          <Comment author={props.data[0].author} body={props.data[0].body} date="May 12" depth={9}/>
          <Comment author={props.data[0].author} body={props.data[0].body} date="May 12" depth={10}/>
      </div>
    );
  }
  
  export default CommentSection;