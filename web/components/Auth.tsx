'use client';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

// 로그인 상태. 관리자 여부는 DB의 is_admin()으로만 판단한다(화면에서 숨기는 것과 별개로 DB 정책이 막는다).
type AuthCtx = { ready: boolean; user: User | null; isAdmin: boolean; signOut: () => Promise<void> };
const Ctx = createContext<AuthCtx>({ ready: false, user: null, isAdmin: false, signOut: async () => {} });
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(!supabase);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    const check = async (u: User | null) => {
      setUser(u);
      if (!u) { setIsAdmin(false); setReady(true); return; }
      const { data } = await supabase!.rpc('is_admin');
      setIsAdmin(data === true); setReady(true);
    };
    supabase.auth.getSession().then(({ data }) => check(data.session?.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      // 콜백 안에서 바로 DB를 부르면 잠금이 걸릴 수 있어 다음 틱으로 미룬다
      setTimeout(() => check(s?.user ?? null), 0);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const signOut = useCallback(async () => { await supabase?.auth.signOut(); }, []);
  return <Ctx.Provider value={{ ready, user, isAdmin, signOut }}>{children}</Ctx.Provider>;
}
