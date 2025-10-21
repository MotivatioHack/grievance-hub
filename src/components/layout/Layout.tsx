import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface LayoutProps {
  children: ReactNode;
  showHeaderFooter?: boolean;
}

export const Layout = ({ children, showHeaderFooter = true }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      {showHeaderFooter && <Header />}
      {children}
      {showHeaderFooter && <Footer />}
    </div>
  );
};
