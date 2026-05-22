// src/types/Attachment.ts

export interface Attachment {
  id: string;
  type: number;
  file?: File;
  fileKey?: string;
  url?: string;
  extension?: string;
  name?: string;
}
