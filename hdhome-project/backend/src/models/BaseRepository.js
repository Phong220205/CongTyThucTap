import { pool } from '../config/database.js';
import { paginationMeta } from '../utils/pagination.js';

function buildSort(sortValue, allowedFields, fallback) {
  const raw = String(sortValue || '').trim();
  const direction = raw.startsWith('-') || raw.toLowerCase().endsWith(':desc') ? 'DESC' : 'ASC';
  const field = raw.replace(/^-/, '').split(':')[0];
  return allowedFields.includes(field) ? `${field} ${direction}` : fallback;
}

export class BaseRepository {
  constructor(config) {
    this.config = config;
  }

  async list({ page, limit, offset, search = '', status = '', sort = '', scopeSql = '', scopeParams = [] }) {
    const { select, from, searchFields, statusField, sortFields, defaultSort } = this.config;
    const where = ['1 = 1'];
    const params = [];

    if (search && searchFields.length) {
      where.push(`(${searchFields.map((field) => `${field} LIKE ?`).join(' OR ')})`);
      params.push(...searchFields.map(() => `%${search}%`));
    }
    if (status && statusField) {
      where.push(`${statusField} = ?`);
      params.push(status);
    }
    if (scopeSql) {
      where.push(`(${scopeSql})`);
      params.push(...scopeParams);
    }

    const whereSql = where.join(' AND ');
    const orderSql = buildSort(sort, sortFields, defaultSort);
    const [countRows] = await pool.execute(`SELECT COUNT(*) total FROM ${from} WHERE ${whereSql}`, params);
    const [rows] = await pool.execute(
      `SELECT ${select} FROM ${from} WHERE ${whereSql} ORDER BY ${orderSql} LIMIT ? OFFSET ?`,
      [...params, Number(limit), Number(offset)],
    );
    return { data: rows, pagination: paginationMeta(page, limit, countRows[0].total) };
  }

  async findById(id) {
    const [rows] = await pool.execute(
      `SELECT ${this.config.select} FROM ${this.config.from} WHERE ${this.config.queryIdColumn || this.config.idColumn} = ? LIMIT 1`,
      [id],
    );
    return rows[0] || null;
  }

  async create(payload, connection = pool) {
    const data = this.pick(payload);
    const fields = Object.keys(data);
    const [result] = await connection.execute(
      `INSERT INTO ${this.config.table} (${fields.join(', ')}) VALUES (${fields.map(() => '?').join(', ')})`,
      fields.map((field) => data[field]),
    );
    return result.insertId;
  }

  async update(id, payload, connection = pool) {
    const data = this.pick(payload);
    const fields = Object.keys(data);
    if (!fields.length) return false;
    const [result] = await connection.execute(
      `UPDATE ${this.config.table} SET ${fields.map((field) => `${field} = ?`).join(', ')} WHERE ${this.config.idColumn} = ?`,
      [...fields.map((field) => data[field]), id],
    );
    return result.affectedRows > 0;
  }

  async remove(id) {
    const [result] = await pool.execute(
      `DELETE FROM ${this.config.table} WHERE ${this.config.idColumn} = ?`,
      [id],
    );
    return result.affectedRows > 0;
  }

  pick(payload) {
    return Object.fromEntries(
      this.config.writableFields
        .filter((field) => Object.prototype.hasOwnProperty.call(payload, field))
        .map((field) => [field, payload[field] === '' ? null : payload[field]]),
    );
  }
}
