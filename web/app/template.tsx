// 페이지가 바뀔 때마다 새 화면이 180ms 동안 옅게 떠오른다
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="view-in">{children}</div>;
}
