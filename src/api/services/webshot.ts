import http from '../http';
import type { RepairRequest } from '@/types/RepairRequest';

export const addExportRepairRequest = async (request: RepairRequest): Promise<void> => {
  const accessToken = localStorage.getItem('accessToken');

  const response = await http.post(
    `/webshot-form/form/maintenance-repair-request?pdf=true&download=true`,
    request,
    {
      headers: {
        Authorization: `${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );

  const fileID = response.data?.fileID;
  const fileKey = response.data?.fileKey;
  if (!fileID || !fileKey) throw new Error('後端未回傳 fileID / fileKey');

  const url = await exportWebshot(fileID, fileKey); // ✅ 這次回傳 objectURL
  window.open(url, '_blank'); // ✅ 開新分頁預覽 PDF
};

const exportWebshot = async (id: number, fileKey: string): Promise<string> => {
  const accessToken = localStorage.getItem('accessToken');

  const res = await http.get(`/webshot-form/file/${id}?fileKey=${encodeURIComponent(fileKey)}`, {
    headers: { Authorization: `${accessToken}` },
    responseType: 'blob'
  });

  const blob = new Blob([res.data], { type: 'application/pdf' });
  return URL.createObjectURL(blob); // ✅ 回傳可開啟的 URL
};
