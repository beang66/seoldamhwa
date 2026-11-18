'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { errText, supabase } from '@/lib/supabase';
import { useAuth } from './Auth';

type Mode = 'in' | 'up' | 'find' | 'reset';
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

// 로그인한 뒤 돌아갈 곳. 같은 사이트 안의 경로만 받는다
function nextPath(): string | null {
  if (typeof window === 'undefined') return null;
  const n = new URLSearchParams(location.search).get('next');
  return n && n.startsWith('/') && !n.startsWith('//') ? n : null;
}

export default function LoginForm() {
  const router = useRouter();
  const { ready, user, isAdmin } = useAuth();
  const [mode, setMode] = useState<Mode>('in');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // 비밀번호 재설정 메일의 링크로 들어오면 새 비밀번호 칸을 연다
  useEffect(() => {
    if (!supabase) return;
    const { data } = supabase.auth.onAuthStateChange(e => { if (e === 'PASSWORD_RECOVERY') { setMode('reset'); setMsg(null); } });
    return () => data.subscription.unsubscribe();
  }, []);

  // 이미 로그인했으면 관리자는 관리자 페이지로, 회원은 마이페이지로
  useEffect(() => {
    if (ready && user && mode !== 'reset') router.replace(nextPath() ?? (isAdmin ? '/admin' : '/mypage'));
  }, [ready, user, isAdmin, mode, router]);

  if (!supabase) {
    return <div className="auth"><p className="auth-msg">로그인은 준비 중이에요.</p><Link className="pill" href="/">메인으로</Link></div>;
  }

  const run = async (f: () => Promise<string | void>) => {
    setBusy(true); setMsg(null);
    try { const ok = await f(); if (ok) setMsg({ ok: true, text: ok }); }
    catch (e) { setMsg({ ok: false, text: errText(e) }); }
    finally { setBusy(false); }
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get('email') ?? '').trim().toLowerCase();
    const pw = String(f.get('password') ?? '');
    if (mode === 'in') return run(async () => {
      const { error } = await supabase!.auth.signInWithPassword({ email, password: pw });
      if (error) throw error;
      // 이동은 위의 useEffect가 로그인 상태를 받아서 한다
    });
    if (mode === 'up') return run(async () => {
      if (pw.length < 8) throw new Error('Password should be at least 8');
      if (pw !== f.get('password2')) throw new Error('비밀번호 두 칸이 서로 달라요.');
      if (!f.get('agree')) throw new Error('개인정보 수집에 동의해 주세요.');
      const { data, error } = await supabase!.auth.signUp({
        email, password: pw,
        options: { data: { name: String(f.get('name') ?? '').trim() }, emailRedirectTo: location.origin + BASE + '/login/' },
      });
      if (error) throw error;
      if (data.session) return; // 메일 확인을 끈 프로젝트면 바로 로그인된다
      setMode('in');
      return `${email}로 확인 메일을 보냈어요. 메일의 링크를 누른 뒤 로그인해 주세요.`;
    });
    if (mode === 'find') return run(async () => {
      const { error } = await supabase!.auth.resetPasswordForEmail(email, { redirectTo: location.origin + BASE + '/login/' });
      if (error) throw error;
      return '비밀번호를 다시 정하는 메일을 보냈어요.';
    });
    return run(async () => {
      if (pw.length < 8) throw new Error('Password should be at least 8');
      if (pw !== f.get('password2')) throw new Error('비밀번호 두 칸이 서로 달라요.');
      const { error } = await supabase!.auth.updateUser({ password: pw });
      if (error) throw error;
      setMode('in');
      return '새 비밀번호로 바꿨어요.';
    });
  };

  const title = { in: '로그인', up: '회원가입', find: '비밀번호 찾기', reset: '새 비밀번호' }[mode];
  return (
    <div className="auth">
      {(mode === 'in' || mode === 'up') && (
        <div className="cats auth-tabs" role="group" aria-label="로그인 또는 회원가입">
          <button type="button" aria-pressed={mode === 'in'} onClick={() => { setMode('in'); setMsg(null); }}>로그인</button>
          <button type="button" aria-pressed={mode === 'up'} onClick={() => { setMode('up'); setMsg(null); }}>회원가입</button>
        </div>
      )}
      <form className="form" onSubmit={submit} aria-label={title} key={mode}>
        {mode === 'find' && <p className="form-lead">가입한 이메일을 적어 주시면 비밀번호를 다시 정하는 링크를 보내 드려요.</p>}
        {mode === 'up' && <label className="field"><span>이름</span><input name="name" autoComplete="name" required maxLength={40} /></label>}
        {mode !== 'reset' && <label className="field"><span>이메일</span><input name="email" type="email" autoComplete="email" required /></label>}
        {mode !== 'find' && (
          <label className="field"><span>{mode === 'reset' ? '새 비밀번호' : '비밀번호'}</span>
            <input name="password" type="password" required minLength={mode === 'in' ? 1 : 8} autoComplete={mode === 'in' ? 'current-password' : 'new-password'} />
            {mode !== 'in' && <small>8자 이상</small>}
          </label>
        )}
        {(mode === 'up' || mode === 'reset') && <label className="field"><span>비밀번호 확인</span><input name="password2" type="password" required autoComplete="new-password" /></label>}
        {mode === 'up' && (
          <label className="check"><input type="checkbox" name="agree" required />
            <span>주문과 모임 안내를 위해 이름, 이메일, 연락처를 모으는 데 동의해요. 탈퇴하면 바로 지워요.</span></label>
        )}
        <p className={'form-msg' + (msg && !msg.ok ? ' err' : '')} role={msg && !msg.ok ? 'alert' : 'status'}>{msg?.text}</p>
        <button className="pill dark wide" type="submit" disabled={busy}>{busy ? '잠시만요…' : { in: '로그인', up: '가입하기', find: '메일 보내기', reset: '비밀번호 바꾸기' }[mode]}</button>
      </form>
      <p className="auth-alt">
        {mode === 'in' && <button type="button" className="link" onClick={() => { setMode('find'); setMsg(null); }}>비밀번호를 잊으셨나요?</button>}
        {(mode === 'find' || mode === 'reset') && <button type="button" className="link" onClick={() => { setMode('in'); setMsg(null); }}>로그인으로 돌아가기</button>}
      </p>
    </div>
  );
}
