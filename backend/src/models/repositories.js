import { BaseRepository } from './BaseRepository.js';

const configs = {
  projects: {
    table: 'projects', idColumn: 'project_id', queryIdColumn: 'p.project_id',
    from: `projects p
      LEFT JOIN customers c ON c.customer_id = p.customer_id
      LEFT JOIN investors i ON i.investor_id = p.investor_id`,
    select: `p.*, c.full_name customer_name,
      COALESCE(i.organization, i.full_name) investor_name`,
    writableFields: ['project_code', 'project_name', 'customer_id', 'investor_id', 'description', 'location', 'start_date', 'expected_end_date', 'actual_end_date', 'status', 'progress', 'featured'],
    searchFields: ['p.project_code', 'p.project_name', 'p.location', 'c.full_name', 'i.organization'],
    statusField: 'p.status', sortFields: ['p.created_at', 'p.project_name', 'p.progress', 'p.start_date'], defaultSort: 'p.created_at DESC',
  },
  customers: {
    table: 'customers', idColumn: 'customer_id', from: 'customers', select: '*',
    writableFields: ['full_name', 'phone', 'email', 'address', 'note'],
    searchFields: ['full_name', 'phone', 'email', 'address'], statusField: null,
    sortFields: ['created_at', 'full_name'], defaultSort: 'created_at DESC',
  },
  investors: {
    table: 'investors', idColumn: 'investor_id', from: 'investors', select: '*',
    writableFields: ['full_name', 'organization', 'phone', 'email', 'address', 'note'],
    searchFields: ['full_name', 'organization', 'phone', 'email'], statusField: null,
    sortFields: ['created_at', 'full_name', 'organization'], defaultSort: 'created_at DESC',
  },
  employees: {
    table: 'employees', idColumn: 'employee_id', from: 'employees', select: '*',
    writableFields: ['employee_code', 'full_name', 'position', 'department', 'phone', 'email', 'status'],
    searchFields: ['employee_code', 'full_name', 'position', 'department', 'phone', 'email'], statusField: 'status',
    sortFields: ['created_at', 'full_name', 'employee_code'], defaultSort: 'created_at DESC',
  },
  materials: {
    table: 'materials', idColumn: 'material_id', from: 'materials', select: '*',
    writableFields: ['material_code', 'material_name', 'unit', 'description'],
    searchFields: ['material_code', 'material_name', 'unit'], statusField: null,
    sortFields: ['created_at', 'material_name', 'material_code'], defaultSort: 'created_at DESC',
  },
  contracts: {
    table: 'contracts', idColumn: 'contract_id', queryIdColumn: 'ct.contract_id',
    from: `contracts ct
      JOIN projects p ON p.project_id = ct.project_id
      LEFT JOIN customers c ON c.customer_id = ct.customer_id
      LEFT JOIN investors i ON i.investor_id = ct.investor_id`,
    select: `ct.*, p.project_name, c.full_name customer_name,
      COALESCE(i.organization, i.full_name) investor_name`,
    writableFields: ['contract_number', 'project_id', 'customer_id', 'investor_id', 'signed_date', 'start_date', 'end_date', 'contract_value', 'status', 'note'],
    searchFields: ['ct.contract_number', 'p.project_name', 'c.full_name', 'i.organization'], statusField: 'ct.status',
    sortFields: ['ct.created_at', 'ct.signed_date', 'ct.contract_value'], defaultSort: 'ct.created_at DESC',
  },
  contacts: {
    table: 'contact_requests', idColumn: 'contact_id', from: 'contact_requests', select: '*',
    writableFields: ['full_name', 'phone', 'email', 'subject', 'message', 'status'],
    searchFields: ['full_name', 'phone', 'email', 'subject'], statusField: 'status',
    sortFields: ['created_at', 'full_name'], defaultSort: 'created_at DESC',
  },
};

export const repositories = Object.fromEntries(
  Object.entries(configs).map(([name, config]) => [name, new BaseRepository(config)]),
);
