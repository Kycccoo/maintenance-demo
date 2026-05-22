import type { PermissionItems } from '../PermissionItems';

export interface Permission {
  [x: string]: unknown;
  staffType: number;
  permissionItems: PermissionItems;
  data: {
    permissionID: number;
    factoryIDs: number[];
  };
}
