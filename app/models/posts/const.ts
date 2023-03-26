export const INTENT = {
  create: 'create',
  update: 'update',
  delete: 'delete',
} as const

export const DUPLICATE_ERROR_CODE = '23505'

export const ERROR_MSG = {
  empty: 'Title is required',
  duplicate: 'Title already have been used. Must be unique',
  database: 'Database error',
} as const
