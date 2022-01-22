import "./ProfileHoverCard.css";
import React, { useState, useEffect } from "react";
import { IBasicUser } from "../../../../../types/IUser";
import { Link } from "react-router-dom";
import {
  RiFacebookCircleLine,
  RiTwitterLine,
  RiInstagramLine,
  RiLinkedinBoxLine,
} from "react-icons/ri";

type ProfileHoverCardProps = {
  hoverUser: IBasicUser;
  leaveAction: () => void;
  enterAction: () => void;
};

function ProfileHoverCard(props: ProfileHoverCardProps) {
  const [attribute, setAttribute] = useState<string>("");

  useEffect(() => {
    props.hoverUser?.concentration
      ? setAttribute(props.hoverUser.concentration)
      : setAttribute(attribute);
    props.hoverUser?.hometown
      ? setAttribute(props.hoverUser.hometown)
      : setAttribute(attribute);
    props.hoverUser?.classYear
      ? setAttribute("Class of " + props.hoverUser.classYear)
      : setAttribute(attribute);
  }, [attribute, props.hoverUser]);

  return (
    <div
      className="ProfileHoverCard"
      onMouseEnter={props.enterAction}
      onMouseLeave={props.leaveAction}
    >
      <img
        src={props.hoverUser?.profilePicture}
        alt={props.hoverUser?.name}
        className="HoverCardImage"
      />
      <div className="HoverCardSideCol">
        <Link to={`/profile/${props.hoverUser?._id}`} className="HoverCardName">
          <p>{props.hoverUser?.name}</p>
        </Link>
        <div className="SocialBar">
          {props.hoverUser?.instagram && (
            <a
              href={props.hoverUser?.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="SocialLink"
            >
              <RiInstagramLine className="SocialIcon" />
            </a>
          )}
          {props.hoverUser?.twitter && (
            <a
              href={props.hoverUser?.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="SocialLink"
            >
              <RiTwitterLine className="SocialIcon" />
            </a>
          )}
          {props.hoverUser?.facebook && (
            <a
              href={props.hoverUser?.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="SocialLink"
            >
              <RiFacebookCircleLine className="SocialIcon" />
            </a>
          )}
          {props.hoverUser?.linkedin && (
            <a
              href={props.hoverUser?.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="SocialLink"
            >
              <RiLinkedinBoxLine className="SocialIcon" />
            </a>
          )}
        </div>
        <p>{attribute}</p>
      </div>
    </div>
  );
}

export default ProfileHoverCard;
