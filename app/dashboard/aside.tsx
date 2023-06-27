import { DesktopMenu } from "@/components/responsiveMenu";

export const Aside = ({ className }: { className?: string }) => {
  return (
    <aside className={`px-8 ${className}`}>
      <DesktopMenu />
    </aside>
  );
};
