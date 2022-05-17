import "./MainFeedSidebar.css";
import IUser from "types/IUser";
import Collapsible from "react-collapsible";
import CheckboxListItem from "components/sidebar/CheckboxListItem";
import { useState } from "react";

type MainFeedSidebarProps = {
  user?: IUser;
};

const tagNames = [
  "Academics",
  "Extracurriculars",
  "Funny",
  "Rant",
  "Self-promo",
  "Social",
  "Politics",
  "Random",
];

export default function MainFeedSidebar(props: MainFeedSidebarProps) {
  const [tags, setTags] = useState<boolean[]>(
    new Array(tagNames.length).fill(true)
  );

  const tagChange = (index: number) => {
    return (checked: boolean) => {
      // POST request to server
      // updateTags(index, checked);
      const newTags = [...tags];
      newTags[index] = checked;
      setTags(newTags);
    };
  };

  return (
    <div className="MainFeedSidebar">
      <div className="Accordion">
        <Collapsible
          trigger="Tags"
          triggerTagName="h3"
          triggerClassName="DropdownTitle"
          triggerOpenedClassName="DropdownTitle"
          transitionTime={100}
        >
          <div className="DropdownContent">
            {tags.map((tag, index) => (
              <CheckboxListItem
                key={tagNames[index]}
                label={tagNames[index]}
                checked={tag}
                onChange={tagChange(index)}
              />
            ))}
          </div>
        </Collapsible>
      </div>
    </div>
  );
}
