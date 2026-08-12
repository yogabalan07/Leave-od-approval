import { ReactNode } from "react";
export default function StatCard({ label, value, icon }: { label: string; value: string|number; icon: ReactNode }) {
  return <div className="stat-card"><div><small>{label}</small><strong>{value}</strong></div><div className="stat-icon">{icon}</div></div>;
}
