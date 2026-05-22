export interface NotificationComments {
  id: number;
  machineComponentSlotNotificationID: number;
  createAt: string;
  authorStaffID: number;
  staffID: number;
  message: string;
  attachments: Attachment[];
}

export interface Attachment {
  id: string;
  type: number;
  file?: File;
  fileKey?: string;
  url?: string;
  extension?: string;
}

export interface CreateNotificationComments {
  staffIDs?: number[];
  message: string;
  attachments: Attachment[];
}
