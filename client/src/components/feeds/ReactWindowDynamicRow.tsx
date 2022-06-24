import { useEffect, useRef } from "react";

type ReactWindowDynamicRowProps = {
  index: number;
  setSize: (height: number) => void;
  children: React.ReactNode;
  windowWidth: number;
};

function ReactWindowDynamicRow(props: ReactWindowDynamicRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    props.setSize(rowRef.current?.getBoundingClientRect().height ?? 100);
  }, [props]);
  return <div ref={rowRef}>{props.children}</div>;
}

export default ReactWindowDynamicRow;
