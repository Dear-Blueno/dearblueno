import { useIsMobile } from "hooks/is-mobile";
import { useEffect, useState } from "react";
import Logo from "./Logo";
// import { IoOptionsOutline } from "react-icons/io5";
// import { usePopper } from "react-popper";
import styles from "./PageHeader.module.scss";

interface PageHeaderProps {
  title?: React.ReactNode;
  children?: React.ReactNode;
  sidebar?: React.ReactNode;
  collapseHeader?: boolean;
  forceTitle?: boolean;
}

export default function PageHeader(props: PageHeaderProps) {
  const isMobile = useIsMobile();
  const [collapseSidebar, setCollapseSidebar] = useState<boolean | undefined>(
    undefined
  );
  // const [showOptions, setShowOptions] = useState<boolean>(false);
  // const [referenceElement, setReferenceElement] =
  //   useState<HTMLButtonElement | null>();
  // const [popperElement, setPopperElement] = useState<HTMLDivElement | null>();
  // const { styles: popperStyles, attributes } = usePopper(
  //   referenceElement,
  //   popperElement,
  //   {
  //     placement: "bottom-end",
  //     modifiers: [
  //       {
  //         name: "offset",
  //         options: { offset: [2, 8] },
  //       },
  //     ],
  //   }
  // );

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
      {(!isMobile || props.title) && (
        <h1 className={styles.title}>
          {isMobile || props.forceTitle ? (
            props.title
          ) : (
            <span
              style={{ display: "flex", alignItems: "center", gap: "0.25em" }}
            >
              <Logo />
              Dear Blueno
            </span>
          )}
        </h1>
      )}
      {collapseSidebar !== undefined &&
        (collapseSidebar ? (
          <div className={styles.HeaderAndOptionsButton}>
            {!props.collapseHeader && props.children}
            {/* {(props.sidebar || props.collapseHeader) && (
              <button
                className={styles.OptionsButton}
                ref={setReferenceElement}
                onClick={() => setShowOptions(!showOptions)}
              >
                <IoOptionsOutline size="2.4em" />
              </button>
            )} */}
          </div>
        ) : (
          props.children
        ))}
      {/* {collapseSidebar !== undefined && collapseSidebar && (
        <div
          className={styles.Options}
          style={{
            ...popperStyles.popper,
            visibility: showOptions ? "visible" : "hidden",
          }}
          ref={setPopperElement}
          {...attributes.popper}
        >
          {props.sidebar}
        </div>
      )} */}
    </header>
  );
}
