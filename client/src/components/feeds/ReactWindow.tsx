import { useCallback, useRef, Children } from "react";
import ReactWindowDynamicRow from "./ReactWindowDynamicRow";
import { VariableSizeList } from "react-window";
import { useWindowResize } from "hooks/useWindowResize";
import AutoSizer from "react-virtualized-auto-sizer";

type ReactWindowProps = {
  children: React.ReactNode;
};

export default function ReactWindow(props: ReactWindowProps) {
  const listRef = useRef<VariableSizeList>(null);
  const sizeMap = useRef<{ [index: number]: number }>({});
  const setSize = useCallback((index: number) => {
    return (size: number) => {
      sizeMap.current = { ...sizeMap.current, [index]: size };
      listRef.current?.resetAfterIndex(index);
    };
  }, []);
  const getSize = (index: number) => sizeMap.current[index] || 50;
  const [windowWidth] = useWindowResize();
  const children = Children.toArray(props.children);
  return (
    <AutoSizer>
      {({ height, width }) => (
        <VariableSizeList
          ref={listRef}
          height={height}
          width={width}
          itemCount={Children.count(props.children)}
          itemSize={getSize}
        >
          {({ index, style }) => (
            <div style={style}>
              <ReactWindowDynamicRow
                index={index}
                setSize={setSize(index)}
                windowWidth={windowWidth}
              >
                {children[index]}
              </ReactWindowDynamicRow>
            </div>
          )}
        </VariableSizeList>
      )}
    </AutoSizer>
  );
}
