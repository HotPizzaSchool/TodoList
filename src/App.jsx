import { useState } from 'react';
import { useTodos } from './hooks/useTodos.js';
import { useToast } from './hooks/useToast.js';
import { TodoForm } from './components/TodoForm.jsx';
import { TodoCard } from './components/TodoCard.jsx';
import { FilterBar, StatsBar, ToastContainer } from './components/ui.jsx';

export default function App() {
  const [filter, setFilter] = useState('all');

  const {
    todos,
    stats,
    isLoading,
    error,
    createTodo,
    unlockTodo,
    toggleDone,
    deleteTodo,
  } = useTodos(filter);

  const { toasts, showToast, dismissToast } = useToast();

  const handleAdd = async (input) => {
    await createTodo(input);
    showToast(input.is_private ? '비공개 할일이 추가되었습니다' : '할일이 추가되었습니다', 'success');
  };

  const handleUnlock = async (id, password) => {
    if (password === null) {
      await unlockTodo(id, '__LOCK__').catch(() => {});
      return;
    }
    await unlockTodo(id, password);
    showToast('잠금이 해제되었습니다', 'success');
  };

  const handleToggle = async (id) => {
    try {
      await toggleDone(id);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      showToast('삭제되었습니다', 'info');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <>
      {/* 배경 효과 */}
      <div className="noise" aria-hidden="true" />
      <div className="grid-bg" aria-hidden="true" />
      <div className="glow-orb orb1" aria-hidden="true" />
      <div className="glow-orb orb2" aria-hidden="true" />

      <main id="app">
        {/* 헤더 */}
        <header>
          <div className="logo">
            <div className="logo-icon" aria-hidden="true">S</div>
            <div>
              <h1>SecureTodo</h1>
              <span>암호화 · DB 기반 할일 관리</span>
            </div>
          </div>
          <StatsBar stats={stats} />
        </header>

        {/* 추가 폼 */}
        <TodoForm onAdd={handleAdd} />

        {/* 필터 */}
        <FilterBar current={filter} onChange={setFilter} />

        {/* 목록 */}
        <div className="todo-list" role="list" aria-label="할일 목록" aria-busy={isLoading}>
          {isLoading ? (
            <div className="empty-state">
              <div className="loading-spinner" style={{ width: 28, height: 28, borderWidth: 3, margin: '0 auto 1rem' }} />
              <p>불러오는 중...</p>
            </div>
          ) : error ? (
            <div className="empty-state">
              <div className="icon" aria-hidden="true">⚠️</div>
              <h3>연결 오류</h3>
              <p>{error}</p>
            </div>
          ) : todos.length === 0 ? (
            <div className="empty-state">
              <div className="icon" aria-hidden="true">✦</div>
              <h3>{filter === 'all' ? '할일이 없습니다' : '해당 항목이 없습니다'}</h3>
              <p>{filter === 'all' ? '위에서 새 할일을 추가해보세요' : '다른 필터를 선택해보세요'}</p>
            </div>
          ) : (
            todos.map((todo) => (
              <TodoCard
                key={todo.id}
                todo={todo}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onLock={handleUnlock}
              />
            ))
          )}
        </div>
      </main>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}
