import { useState, useRef } from 'react';
import { usePasswordStrength } from '../hooks/usePasswordStrength.js';

const PRIORITY_OPTIONS = [
  { value: 'medium', label: '⚡ 보통' },
  { value: 'high',   label: '🔴 높음' },
  { value: 'low',    label: '🟢 낮음' },
];

export function TodoForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldError, setFieldError] = useState('');

  const titleRef = useRef(null);
  const { score, label, color, percentage } = usePasswordStrength(password);

  const handleSubmit = async () => {
    setFieldError('');

    if (!title.trim()) {
      setFieldError('할일을 입력해주세요.');
      titleRef.current?.focus();
      return;
    }
    if (isPrivate && !password) {
      setFieldError('비밀번호를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onAdd({
        title: title.trim(),
        priority,
        is_private: isPrivate,
        password: isPrivate ? password : undefined,
      });
      setTitle('');
      setPassword('');
      setIsPrivate(false);
    } catch (err) {
      setFieldError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) handleSubmit();
  };

  // 비밀번호 입력 시 한국어 IME 방지
  const handlePasswordChange = (e) => {
    const val = e.target.value.replace(/[^A-Za-z0-9!@#$%^&*()_+\-=]/g, '');
    setPassword(val);
  };

  return (
    <div className="add-area">
      <div className="section-label">새 할일 추가</div>

      <div className="add-row">
        <input
          ref={titleRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="할일을 입력하세요..."
          maxLength={500}
          aria-label="할일 제목"
        />
        <select
          className="priority-select"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          aria-label="우선순위"
        >
          {PRIORITY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="pw-row">
        <label className="toggle-private">
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => {
              setIsPrivate(e.target.checked);
              if (!e.target.checked) setPassword('');
            }}
          />
          비공개 (비밀번호 보호)
        </label>

        {isPrivate && (
          <div style={{ flex: 1, display: 'flex', gap: '0.5rem' }}>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              onKeyDown={handleKeyDown}
              placeholder="Password (영문/숫자)"
              maxLength={32}
              lang="en"
              inputMode="latin"
              autoComplete="new-password"
              style={{ fontFamily: 'var(--mono)', letterSpacing: '0.15em' }}
              aria-label="비밀번호"
            />
          </div>
        )}

        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={isSubmitting}
          aria-label="할일 추가"
        >
          {isSubmitting
            ? <span className="loading-spinner" style={{ width: 14, height: 14 }} />
            : '추가'
          }
        </button>
      </div>

      {isPrivate && password && (
        <div className="pw-strength-area">
          <div className="strength-bar">
            <div
              className="strength-fill"
              style={{ width: `${percentage}%`, background: color }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <span style={{ fontSize: '0.65rem', fontFamily: 'var(--mono)', color }}>
              강도: {label}
            </span>
            <span style={{ fontSize: '0.65rem', fontFamily: 'var(--mono)', color: 'var(--muted)' }}>
              bcrypt 암호화 적용
            </span>
          </div>
        </div>
      )}

      {fieldError && (
        <p className="error-msg" role="alert">❌ {fieldError}</p>
      )}
    </div>
  );
}
