import WorksArchive from '@/components/WorksArchive';

export const metadata = { title: 'works' };

export default function Page() {
  return (
    <div id="works-view">
      <div className="page-hd">
        <span className="eyebrow">WORKS · 작업</span>
        <h1>계절마다 남긴 꽃</h1>
        <p>공간 연출, 프로젝트, 정기 구독, 모임에서 남긴 꽃의 기록입니다.</p>
      </div>
      <WorksArchive />
    </div>
  );
}
