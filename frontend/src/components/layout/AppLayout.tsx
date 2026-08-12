import { ReactNode } from "react";
import Sidebar from "./Sidebar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return <div className="app-shell"><Sidebar/><main className="main">{children}</main></div>;
}
