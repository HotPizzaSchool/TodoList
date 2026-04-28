const BASE_URL = 'http://localhost:4000/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    const err = new Error(data.error || '서버 오류가 발생했습니다.');
    err.status = res.status;
    throw err;
  }

  return data;
}

export const todoApi = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/todos${qs ? `?${qs}` : ''}`);
  },

  create: (body) => request('/todos', { method: 'POST', body }),

  unlock: (id, password) =>
    request(`/todos/${id}/unlock`, { method: 'POST', body: { password } }),

  toggleDone: (id) => request(`/todos/${id}/toggle`, { method: 'PATCH' }),

  update: (id, fields) => request(`/todos/${id}`, { method: 'PATCH', body: fields }),

  delete: (id) => request(`/todos/${id}`, { method: 'DELETE' }),
};
