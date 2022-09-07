// import styles from "./MainFeedSidebar.module.scss";
// import Collapsible from "react-collapsible";
// import CheckboxListItem from "components/sidebar/CheckboxListItem";
// import { useCallback, useState } from "react";

// const tagNames = [
//   "Academics",
//   "Extracurriculars",
//   "Funny",
//   "Rant",
//   "Self-promo",
//   "Social",
//   "Politics",
//   "Random",
// ];

export default function MainFeedSidebar() {
  // const [tags, setTags] = useState<boolean[]>(
  //   new Array(tagNames.length).fill(true)
  // );

  // const tagChange = useCallback(
  //   (index: number) => {
  //     return (checked: boolean) => {
  //       // POST request to server
  //       // updateTags(index, checked);
  //       setTags((prev) => {
  //         const newTags = [...prev];
  //         newTags[index] = checked;
  //         return newTags;
  //       });
  //     };
  //   },
  //   [setTags]
  // );

  return (
    <div className="MainFeedSidebar">
      {/* <Collapsible
        trigger="Tags"
        triggerTagName="h3"
        triggerClassName={styles.DropdownTitle}
        triggerOpenedClassName={styles["is-open"] + " " + styles.DropdownTitle}
        transitionTime={100}
        open
      >
        <div className={styles.DropdownContent}>
          {tags.map((tag, index) => (
            <CheckboxListItem
              key={tagNames[index]}
              label={tagNames[index]}
              checked={tag}
              onChange={tagChange(index)}
            />
          ))}
        </div>
      </Collapsible> */}
    </div>
  );
}
