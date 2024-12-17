import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full h-full flex-1 overflow-auto">{children}</div>
    </div>
  );
}
