import { useState, useRef } from 'react';

function timeAgo(ts) {
  const diff = Date.now() - ts;
  if (diff < 60_000)     return '방금 전';
  if (diff < 3_600_000)  return `${Math.floor(diff / 60_000)}분 전`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}시간 전`;
  return `${Math.floor(diff / 86_400_000)}일 전`;
}

const PRIORITY_LABEL = { high: '높음', medium: '보통', low: '낮음' };

function LockedCard({ todo, onUnlock, onDelete }) {
  const [pw, setPw]                   = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError]             = useState('');
  const inputRef                      = useRef(null);

  const handleUnlock = async () => {
    if (!pw) { inputRef.current?.focus(); return; }
    setIsVerifying(true);
    setError('');
    try {
      await onUnlock(todo.id, pw);
    } catch {
      setError('비밀번호가 틀렸습니다');
      setPw('');
      inputRef.current?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleChange = (e) => {
    const val = e.target.value.replace(/[^A-Za-z0-9!@#$%^&*()_+\-=]/g, '');
    setPw(val);
    setError('');
  };

  return (
    <div className="locked-card" role="listitem"
      style={{ borderColor: error ? 'rgba(255,77,109,0.3)' : undefined }}>
      <span className="lock-icon" aria-hidden="true">🔒</span>
      <span className="todo-title">비공개 할일</span>

      <div className="unlock-form" role="group" aria-label="잠금 해제">
        <input
          ref={inputRef}
          type="password"
          value={pw}
          onChange={handleChange}
          onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
          placeholder="Password"
          maxLength={32}
          lang="en"
          inputMode="latin"
          autoComplete="current-password"
          aria-label="비밀번호 입력"
          aria-invalid={!!error}
          style={{
            fontFamily: 'var(--mono)',
            letterSpacing: '0.12em',
            borderColor: error ? 'var(--danger)' : undefined,
            transition: 'border-color 0.2s',
          }}
        />
        <button className="btn btn-sm btn-ghost" onClick={handleUnlock} disabled={isVerifying}>
          {isVerifying
            ? <span className="loading-spinner" style={{ width: 10, height: 10, borderWidth: 1.5 }} />
            : '해제'}
        </button>
      </div>

      {error && (
        <span role="alert" style={{ fontSize: '0.72rem', color: 'var(--danger)', flexShrink: 0 }}>❌</span>
      )}

      <button className="action-btn del" onClick={() => onDelete(todo.id)} title="삭제">✕</button>
    </div>
  );
}

function OpenCard({ todo, onToggle, onDelete, onLock }) {
  return (
    <article className={`todo-card p-${todo.priority} ${todo.done ? 'done' : ''}`} role="listitem">
      <button
        className={`check-btn ${todo.done ? 'checked' : ''}`}
        onClick={() => onToggle(todo.id)}
        aria-pressed={todo.done}
      />
      <div className="todo-body">
        <p className="todo-title">{todo.title}</p>
        <div className="todo-meta">
          {todo.is_private && <span className="tag tag-private">🔒 비공개</span>}
          <span className={`tag tag-${todo.priority}`}>{PRIORITY_LABEL[todo.priority]}</span>
          <time className="tag-time" dateTime={new Date(todo.created_at).toISOString()}>
            {timeAgo(todo.created_at)}
          </time>
        </div>
      </div>
      <div className="todo-actions">
        {todo.is_private && (
          <button className="action-btn" onClick={() => onLock(todo.id)} title="잠금">🔒</button>
        )}
        <button className="action-btn del" onClick={() => onDelete(todo.id)} title="삭제">✕</button>
      </div>
    </article>
  );
}

export function TodoCard({ todo, onToggle, onDelete, onUnlock, onLock }) {
  if (todo.locked) {
    return <LockedCard todo={todo} onUnlock={onUnlock} onDelete={onDelete} />;
  }
  return <OpenCard todo={todo} onToggle={onToggle} onDelete={onDelete} onLock={onLock} />;
}