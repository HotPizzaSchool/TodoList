export function FilterBar({ current, onChange }) {
  const filters = [
    { id: 'all',     label: '전체' },
    { id: 'active',  label: '진행중' },
    { id: 'done',    label: '완료' },
    { id: 'high',    label: '🔴 높음' },
    { id: 'private', label: '🔒 비공개' },
  ];

  return (
    <div className="filters" role="group" aria-label="필터">
      {filters.map((f) => (
        <button
          key={f.id}
          className={`filter-btn ${current === f.id ? 'active' : ''}`}
          onClick={() => onChange(f.id)}
          aria-pressed={current === f.id}
          aria-label={`${f.label} 필터`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}

export function StatsBar({ stats }) {
  return (
    <div className="header-stats" aria-label="통계">
      <div className="stat-chip">전체 <strong>{stats.total}</strong></div>
      <div className="stat-chip">완료 <strong>{stats.done}</strong></div>
      <div className="stat-chip">비공개 <strong>{stats.private}</strong></div>
      {stats.urgent > 0 && (
        <div className="stat-chip" style={{ color: 'var(--danger)' }}>
          긴급 <strong>{stats.urgent}</strong>
        </div>
      )}
    </div>
  );
}

export function ToastContainer({ toasts, onDismiss }) {
  const icons = { 만들어졌다: '✅', 에러남:  '❌', 경고다: '⚠️', 정보: 'ℹ️' };

  return (
    <div
      aria-live="polite"
      aria-label="알림"
      style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 200,
               display: 'flex', flexDirection: 'column', gap: '8px' }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="toast"
          role="status"
          onClick={() => onDismiss(t.id)}
          style={{ cursor: 'pointer' }}
        >
          <span aria-hidden="true">{icons[t.type] || '✅'}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
