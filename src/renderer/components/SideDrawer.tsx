import React, { useEffect, useRef } from "react";
import { Drawer } from "@ledgerhq/react-ui";
import { DrawerProps } from "@ledgerhq/react-ui/components/layout/Drawer";
import { createFocusTrap, FocusTrap } from "focus-trap";

export interface Props extends DrawerProps {
  onRequestClose?: () => void;
  onRequestBack?: () => void;
  preventBackdropClick?: boolean;
}

const domNode = document.getElementById("modals");

export function SideDrawer({
  isOpen,
  onRequestClose,
  onRequestBack,
  preventBackdropClick,
  ...props
}: Props) {
  const focusTrap = useRef<FocusTrap | null>(null);

  const onRef = (ref: HTMLDivElement | null) => {
    if (!ref) return;
    if (focusTrap.current) {
      focusTrap.current.deactivate();
    }
    ref.setAttribute("tabindex", "-1");
    focusTrap.current = createFocusTrap(ref, {
      fallbackFocus: ref,
      escapeDeactivates: false,
      // Allows clicks inside portalled elements - i.e. selectors
      allowOutsideClick: true,
      preventScroll: true,
    });
  };

  useEffect(() => {
    if (!focusTrap.current) return;

    if (isOpen) {
      focusTrap.current.activate();
      return () => {
        focusTrap.current?.deactivate();
      };
    }
  }, [isOpen]);

  return (
    <Drawer
      isOpen={isOpen}
      // @ts-expect-error we want to make the props overridable…
      onClose={onRequestClose}
      onBack={onRequestBack}
      ignoreBackdropClick={preventBackdropClick}
      ref={onRef}
      {...props}
      menuPortalTarget={domNode}
    />
  );
}
