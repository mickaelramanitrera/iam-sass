import { FC, PropsWithChildren } from "react";

export const Container: FC<
  PropsWithChildren<{ title?: string; className?: string }>
> = ({ children, title, className }) => (
  <div className="flex-col md:flex">
    <div
      className={`flex-1 space-y-4 p-2 pt-0 md:p-8 md:pt-0 ${className || ""}`}
    >
      {title && <h2 className="text-3xl font-bold tracking-tight">{title}</h2>}
      {children}
    </div>
  </div>
);
