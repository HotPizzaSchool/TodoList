/**
 * 공통 타입 정의 (JSDoc)
 * TypeScript 대신 JSDoc으로 타입 안전성 확보
 */

/**
 * @typedef {'high'|'medium'|'low'} Priority
 * @typedef {'all'|'active'|'done'|'high'|'private'} Filter
 *
 * @typedef {Object} Todo
 * @property {string} id
 * @property {string|null} title  비공개이고 잠긴 경우 null
 * @property {boolean} done
 * @property {Priority} priority
 * @property {boolean} is_private
 * @property {boolean} [locked]
 * @property {number} created_at
 * @property {number} updated_at
 *
 * @typedef {Object} Stats
 * @property {number} total
 * @property {number} done
 * @property {number} private
 * @property {number} urgent
 */

export {};
