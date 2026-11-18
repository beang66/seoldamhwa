'use client';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// 공개(publishable) 키는 브라우저에 실려도 되는 키다. 데이터 보호는 DB의 RLS 정책이 맡는다.
// 빌드할 때 환경 변수로 넣는다. 값이 없으면 DB 없이 코드 안의 시안 데이터로만 보인다.
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? '';

export const supabase: SupabaseClient | null = URL && KEY
  ? createClient(URL, KEY, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } })
  : null;

export const hasDb = supabase !== null;

// 오류 문구를 사람이 읽을 말로 바꾼다
export function errText(e: unknown): string {
  const m = e && typeof e === 'object' && 'message' in e ? String((e as { message: unknown }).message) : String(e ?? '');
  if (/Invalid login credentials/i.test(m)) return '이메일이나 비밀번호가 맞지 않아요.';
  if (/Email not confirmed/i.test(m)) return '메일함에서 가입 확인 링크를 먼저 눌러 주세요.';
  if (/User already registered/i.test(m)) return '이미 가입한 이메일이에요. 로그인해 주세요.';
  if (/Password should be at least/i.test(m)) return '비밀번호는 8자 이상으로 정해 주세요.';
  if (/rate limit/i.test(m)) return '잠시 뒤에 다시 시도해 주세요.';
  if (/row-level security|permission denied/i.test(m)) return '권한이 없어요. 관리자 계정으로 로그인했는지 확인해 주세요.';
  if (/Failed to fetch|NetworkError/i.test(m)) return '연결이 원활하지 않아요. 잠시 뒤에 다시 시도해 주세요.';
  return m || '문제가 생겼어요. 잠시 뒤에 다시 시도해 주세요.';
}
