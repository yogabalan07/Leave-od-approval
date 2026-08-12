export default function StatusBadge({ status }: { status: string }) {
  const cls = status.includes("APPROVED") || status === "VERIFIED" ? "status green"
    : status === "REJECTED" ? "status red"
    : "status amber";
  return <span className={cls}>{status.replaceAll("_", " ")}</span>;
}
