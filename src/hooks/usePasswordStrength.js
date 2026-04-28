import { useMemo } from 'react';

const RULES = [
  { test: (pw) => pw.length >= 6,           label: '6자 이상' },
  { test: (pw) => pw.length >= 10,          label: '10자 이상' },
  { test: (pw) => /[A-Z]/.test(pw),         label: '대문자 포함' },
  { test: (pw) => /[0-9]/.test(pw),         label: '숫자 포함' },
  { test: (pw) => /[^A-Za-z0-9]/.test(pw), label: '특수문자 포함' },
];

export function usePasswordStrength(password) {
  return useMemo(() => {
    if (!password) return { score: 0, label: '', color: '', percentage: 0, passedRules: [] };

    const passedRules = RULES.filter((r) => r.test(password));
    const score = passedRules.length;
    const percentage = Math.round((score / RULES.length) * 100);

    let label, color;
    if (score <= 1) { label = '취약'; color = 'var(--danger)'; }
    else if (score <= 2) { label = '보통'; color = 'var(--warn)'; }
    else if (score <= 3) { label = '양호'; color = '#60a5fa'; }
    else { label = '강함'; color = 'var(--success)'; }

    return { score, label, color, percentage, passedRules };
  }, [password]);
}
