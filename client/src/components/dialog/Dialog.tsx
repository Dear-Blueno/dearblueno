import * as Dialog from "@radix-ui/react-dialog";
import type { CSSProperties, ReactNode } from "react";

export function DialogOverlay({
  isOpen,
  onDismiss,
  style,
  children,
}: {
  isOpen: boolean;
  onDismiss?: () => void;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onDismiss?.();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay data-dialog-overlay="" style={style}>
          {children}
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
export function DialogContent({
  children,
  ...props
}: {
  children: ReactNode;
  className?: string;
  "aria-label": string;
}) {
  return (
    <Dialog.Content
      data-dialog-content=""
      aria-describedby={undefined}
      {...props}
    >
      <Dialog.Title
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          overflow: "hidden",
          clipPath: "inset(50%)",
        }}
      >
        {props["aria-label"]}
      </Dialog.Title>
      {children}
    </Dialog.Content>
  );
}
