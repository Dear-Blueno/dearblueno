import styles from "./SubmitPageHeader.module.scss";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

enum SubmitType {
  Text,
  Image,
  Event,
}

const options = ["Text", "Image", "Event"];

export default function SubmitPageHeader() {
  const textRef = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLHeadingElement>(null);
  const eventRef = useRef<HTMLHeadingElement>(null);
  const underlineRef = useRef<HTMLSpanElement>(null);
  const router = useRouter();
  const [active, setActive] = useState<SubmitType>(
    router.query.type === "image"
      ? SubmitType.Image
      : router.query.type === "event"
      ? SubmitType.Event
      : SubmitType.Text
  );

  const handleSwitch = useCallback(() => {
    const refs = [textRef, imageRef, eventRef];
    const selectedRef = refs[active];
    const leftAdjust = active === SubmitType.Text ? -1.5 : -2;
    if (underlineRef.current && selectedRef.current) {
      underlineRef.current.style.left = `${
        selectedRef.current.offsetLeft + leftAdjust
      }px`;
      underlineRef.current.style.width = `${
        selectedRef.current.offsetWidth + 4
      }px`;
    }
  }, [active]);

  useEffect(() => {
    const type = router.query.type as string;
    if (!type) {
      setActive(SubmitType.Text);
    } else {
      const index = options.map((option) => option.toLowerCase()).indexOf(type);
      if (index !== -1) {
        setActive(index);
      }
    }
  }, [router.query.type]);

  useEffect(handleSwitch, [handleSwitch]);

  useEffect(() => {
    window.addEventListener("resize", handleSwitch);
    return () => {
      window.removeEventListener("resize", handleSwitch);
    };
  }, [handleSwitch]);

  return (
    <div className={styles.FeedHeader}>
      <div
        className={styles.FeedHeaderOption}
        onClick={() => {
          setActive(SubmitType.Text);
          void router.push("/submit");
        }}
      >
        <h3 className={styles.FeedHeaderOptionText} ref={textRef}>
          Text
        </h3>
      </div>
      <div
        className={styles.FeedHeaderOption}
        onClick={() => {
          setActive(SubmitType.Image);
          void router.push("/submit?type=image");
        }}
      >
        <h3 className={styles.FeedHeaderOptionText} ref={imageRef}>
          Image
        </h3>
      </div>
      <div
        className={styles.FeedHeaderOption}
        onClick={() => {
          setActive(SubmitType.Event);
          void router.push("/submit?type=event");
        }}
      >
        <h3 className={styles.FeedHeaderOptionText} ref={eventRef}>
          Event
        </h3>
      </div>
      <span className={styles.FeedSelectionUnderline} ref={underlineRef} />
    </div>
  );
}
