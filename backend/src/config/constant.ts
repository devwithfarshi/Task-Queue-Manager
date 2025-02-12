export const USER_ROLE = ['admin', 'user', 'moderator'] as const
export type T_USER_ROLE = 'admin' | 'user' | 'moderator'

export const TASK_STATUS = [
  'pending',
  'in-progress',
  'completed',
  'failed',
  'canceled'
] as const

export const TASK_PRIORITY = ['low', 'medium', 'high'] as const

export type T_TASK_STATUS =
  | 'pending'
  | 'in-progress'
  | 'completed'
  | 'failed'
  | 'canceled'

export type T_TASK_PRIORITY = 'low' | 'medium' | 'high'
