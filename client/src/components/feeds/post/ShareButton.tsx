import "./ShareButton.css";
import ReactTooltip from "react-tooltip";

type ShareButtonProps = {
  postNumber?: number;
};

function ShareButton(props: ShareButtonProps) {
  return (
    <div className="ShareButton">
      <p className="ShareButton" data-tip data-for="share" data-event="click">
        share
      </p>
      <ReactTooltip
        id="share"
        place="bottom"
        effect="solid"
        className="ShareTooltip"
        type="light"
        border={true}
        borderColor="black"
        afterShow={() => {
          navigator.clipboard.writeText(
            "https://dearblueno.net/post/" + props.postNumber
          );
          setTimeout(ReactTooltip.hide, 1000);
        }}
      >
        <div className="ShareButtonTextContainer">
          <p>Copied to Clipboard!</p>
        </div>
      </ReactTooltip>
    </div>
  );
}

export default ShareButton;
