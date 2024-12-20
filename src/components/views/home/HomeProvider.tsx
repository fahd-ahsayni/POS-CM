import React from "react";
import { RightViewProvider } from "./right-section/contexts/rightViewContext";
import { LeftViewProvider } from "./left-section/contexts/leftViewContext";

export default function HomeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LeftViewProvider>
      <RightViewProvider>{children}</RightViewProvider>
    </LeftViewProvider>
  );
}
