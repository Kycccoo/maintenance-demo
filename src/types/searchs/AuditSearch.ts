import type { User } from '@/types/User';
import type { AuditEvent } from '../AuditEvent';

export interface AuditSearch {
  keyword: string;
  createAtStart?: string;
  createAtEnd?: string;
  staffIDs?: number[];
  auditEventIDs?: number[];
  isRead?: boolean;
  staffs?: User[];
  AuditEvents?: AuditEvent[];
}

export const InitAuditSearch: AuditSearch = {
  keyword: ''
};
