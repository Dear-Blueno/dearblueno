type HeaderAndPageProps = {
  children?: React.ReactNode | React.ReactNode[];
};

export default function HeaderAndPage(props: HeaderAndPageProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {props.children}
    </div>
  );
}
