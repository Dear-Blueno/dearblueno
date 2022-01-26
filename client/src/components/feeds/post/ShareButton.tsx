import "./ShareButton.css";
import ReactTooltip from "react-tooltip";

type ShareButtonProps = {
  postNumber?: number;
};

function ShareButton(props: ShareButtonProps) {
  return (
    <div className="ShareButton">
      <p
        className="ShareButton"
        data-tip
        data-for={"share" + props.postNumber}
        data-event="click"
      >
        share
      </p>

      <ReactTooltip
        id={"share" + props.postNumber}
        place="top"
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
          Link copied to clipboard!
        </div>
      </ReactTooltip>
    </div>
  );
}

export default ShareButton;
