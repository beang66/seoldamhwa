import Admin from '@/components/admin/Admin';

export const metadata = { title: '관리자', robots: { index: false, follow: false } };

export default function Page() {
  return <div id="admin-view"><Admin /></div>;
}
