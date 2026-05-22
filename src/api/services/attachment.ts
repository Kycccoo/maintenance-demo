import http from '../http';
import { type AxiosResponse } from 'axios';

export interface AttachmentFocus {
  id: number;
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

export const uploadFile = async (
  file: File,
  // centerCrop: string,
  maxWidth?: number,
  maxHeight?: number
): Promise<AxiosResponse> => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const formData = new FormData();
    formData.append('file', file);

    const params = new URLSearchParams();
    // if (centerCrop) params.append('centerCrop', centerCrop);
    if (maxWidth) params.append('maxWidth', maxWidth.toString());
    if (maxHeight) params.append('maxHeight', maxHeight.toString());

    const response = await http.post(`/machine/attachment?${params.toString()}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `${accessToken}`
      }
    });

    return response;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export const appendAttachmentFileKey = async (n: AttachmentFocus): Promise<AttachmentFocus> => {
  if (!n?.attachments || n.attachments.length === 0) {
    return n;
  }

  const attachmentIDs = n.attachments.map((attachment) => attachment.id);
  const accessToken = localStorage.getItem('accessToken');
  const params = new URLSearchParams();
  attachmentIDs.forEach((attachmentID) => params.append('ids', attachmentID.toString()));
  const response = await http.get(`/machine/attachment/file-keys?${params.toString()}`, {
    headers: {
      Authorization: `${accessToken}`
    }
  });
  n.attachments.forEach((attachment) => {
    attachment.fileKey = response.data[attachment.id];
  });
  return n;
};

export const appendAttachment = async (
  nForm: AttachmentFocus,
  resolution: string,
  fallback = false
): Promise<AttachmentFocus> => {
  if (!nForm?.attachments) return nForm;
  await appendAttachmentImage(nForm, resolution, fallback);
  await appendAttachmentFile(nForm);
  return nForm;
};

export const appendAttachmentFile = async (nForm: AttachmentFocus): Promise<AttachmentFocus> => {
  if (!nForm?.attachments) return nForm;
  nForm.attachments.forEach(async (attachment) => {
    if (attachment.fileKey && attachment.type == 0) {
      attachment.url = downloadAttachmentFile(attachment.id, attachment.fileKey);
    }
  });
  return nForm;
};

export const appendAttachmentImage = async (
  nForm: AttachmentFocus,
  resolution: string,
  fallback = false
): Promise<AttachmentFocus> => {
  if (!nForm?.attachments) return nForm;

  for (const attachment of nForm.attachments) {
    if (attachment.id && attachment.fileKey && attachment.type === 1) {
      attachment.url = downloadAttachmentImage(
        attachment.id,
        attachment.fileKey,
        resolution,
        fallback
      );
    }
  }

  return nForm;
};

export const downloadAttachmentImage = (
  id: string,
  fileKey: string,
  resolution: string,
  fallback = false
): string => {
  const baseURL = `${import.meta.env.VITE_API_URL}/machine/attachment/image/${id}`;
  const query = new URLSearchParams({
    fileKey,
    resolution
  });
  if (fallback) {
    query.append('fallback', 'true');
  }
  return `${baseURL}?${query.toString()}`;
};

export const downloadAttachmentFile = (id: string, fileKey: string): string => {
  return `${import.meta.env.VITE_API_URL}/machine/attachment/resource/${id}?fileKey=${fileKey}&download=false`;
};

// ✅ 取得 resource 的 Content-Type（HEAD -> fallback Range GET）
export async function getAttachmentContentType(
  id: string,
  fileKey: string
): Promise<string | null> {
  const url = downloadAttachmentFile(id, fileKey);
  const accessToken = localStorage.getItem('accessToken');

  // 1) HEAD 試試看
  try {
    const res = await http.head(url, {
      headers: {
        Authorization: `${accessToken}` // 若後端不吃 token，可刪；保留通常不會壞
      }
    });

    const ct = (res.headers['content-type'] as string | undefined)?.toLowerCase();
    return ct ?? null;
  } catch (e) {
    // 2) 若 405 或其他原因，改用 Range GET 取 header
    console.log(e);
    try {
      const res = await http.get(url, {
        headers: {
          Range: 'bytes=0-0',
          Authorization: `${accessToken}`
        },
        responseType: 'arraybuffer'
      });

      const ct = (res.headers['content-type'] as string | undefined)?.toLowerCase();
      return ct ?? null;
    } catch {
      return null;
    }
  }
}
