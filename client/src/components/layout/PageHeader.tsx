import { useEffect, useState } from "react";
import { IoOptions } from "react-icons/io5";
import styles from "./PageHeader.module.scss";

type PageHeaderProps = {
  title?: string;
  children?: React.ReactNode;
  sidebar?: React.ReactNode;
  collapseHeader?: boolean;
};

export default function PageHeader(props: PageHeaderProps) {
  const [collapseSidebar, setCollapseSidebar] = useState<boolean | undefined>(
    undefined
  );
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setCollapseSidebar(window.innerWidth <= 1392);
      };
      window.addEventListener("resize", handleResize);
      handleResize();
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  return (
    <header className={styles.pageheader}>
      {props.title && <h1 className={styles.title}>{props.title}</h1>}
      {collapseSidebar !== undefined &&
        (collapseSidebar ? (
          <div className={styles.HeaderAndOptionsButton}>
            {!props.collapseHeader && props.children}
            {(props.sidebar || props.collapseHeader) && (
              <span className={styles.OptionsButton}>
                <IoOptions size="1.6em" />
              </span>
            )}
          </div>
        ) : (
          props.children
        ))}
    </header>
  );
}
