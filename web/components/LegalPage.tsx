import { BUSINESS, show } from '@/lib/business';

// 약관·개인정보처리방침·환불 정책의 공통 틀. 본문은 초안이며 시행 전에 전문가 검토를 받는다.
export default function LegalPage({ eyebrow, title, lead, children }: { eyebrow: string; title: string; lead: string; children: React.ReactNode }) {
  return (
    <div id="legal-view">
      <div className="page-hd">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{lead}</p>
      </div>
      <div className="pg">
        <article className="legal">
          <p className="legal-draft" role="note">이 문서는 초안이에요. 사업자 정보와 세부 기준이 확정되고 검토를 마치면 시행일을 적어 공개합니다.</p>
          {children}
          <p className="legal-date">시행일 · {show(BUSINESS.effectiveDate)}</p>
        </article>
      </div>
    </div>
  );
}

// 확정 전인 값을 눈에 띄게 표시한다
export const Blank = ({ children }: { children: React.ReactNode }) => <mark className="blank-mark">{children}</mark>;
