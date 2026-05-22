<script setup lang="ts">
import { ref, watch, computed, nextTick } from 'vue';
import {
  LucidePenTool,
  LucideX,
  LucideAlertTriangle,
  LucidePackage,
  // LucidePaperclip,
  LucideDownload,
  Film,
  ArrowBigUp,
  ArrowBigDown,
  LucideHammer,
  Pickaxe,
  ZoomIn,
  RotateCw,
  Eraser
} from 'lucide-vue-next';

import type { MachineComponentSlotMaintenance } from '@/types/MachineComponentSlotMaintenance';
import type { Attachment } from '@/types/Attachment';
import {
  downloadAttachmentImage,
  downloadAttachmentFile,
  getAttachmentContentType,
  getMaintenance
} from '@/api/services/machineComponentSlotMaintenance';

const props = defineProps<{
  dialogVisible: boolean;
  dialogData: MachineComponentSlotMaintenance;
  isDialogLoading: boolean;
  formatDate: (dateStr: string | number | Date) => string;
}>();

const openAttachmentFile = (id: string, fileKey: string): void => {
  try {
    const url = downloadAttachmentFile(id, fileKey);

    window.open(url, '_blank');
  } catch (error) {
    console.error('Error downloading attachment file:', error);
  }
};

const hoveredAttachment = ref<Attachment | null>(null);
const selectedAttachment = ref<Attachment | null>(null);

const attachmentContentType = ref<Record<string, string>>({});

const isVideoContentType = (ct?: string | null) => !!ct && ct.startsWith('video/');

async function hydrateAttachmentContentTypes() {
  const list = allAttachments.value;

  // 只抓檔案附件（type==0）且有 fileKey
  const targets = list.filter((a) => a.type === 0 && !!a.fileKey);

  // 避免重複打：已經有就略過
  const need = targets.filter((a) => !attachmentContentType.value[a.id]);

  // 並發抓（量大可改成限流，先給你簡潔版）
  await Promise.all(
    need.map(async (a) => {
      const ct = await getAttachmentContentType(a.id, a.fileKey!);
      if (ct) attachmentContentType.value[a.id] = ct;
    })
  );
}

// Dialog 打開就抓一次
watch(
  () => props.dialogVisible,
  async (val) => {
    if (!val) return;
    await hydrateAttachmentContentTypes();
  }
);

const previewResolution = () => {
  const dpr = window.devicePixelRatio || 1;
  if (dpr >= 3) return '3x';
  if (dpr >= 2) return '2x';
  return '1x';
};

/** 補件附件也一起放到右側附件欄 */
const allAttachments = computed<Attachment[]>(() => {
  const base = Array.isArray(props.dialogData?.attachments) ? props.dialogData.attachments : [];
  const sups = Array.isArray(props.dialogData?.supplements) ? props.dialogData.supplements : [];
  const supAtts = sups.flatMap((s) => (Array.isArray(s.attachments) ? s.attachments : []));
  return [...base, ...supAtts];
});

const hasAnyAttachment = computed(() => allAttachments.value.length > 0);

const isImageAtt = (att: Attachment) => att.type === 1 && !!att.fileKey;

const preMaintenanceFinishAt = ref<string | null>(null);
const nextMaintenanceFinishAt = ref<string | null>(null);

watch(
  () => props.dialogData.neighbors?.previousID,
  async (id) => {
    if (!id) {
      preMaintenanceFinishAt.value = null;
      return;
    }

    const preMaintenance = await getMaintenance(id);
    preMaintenanceFinishAt.value = preMaintenance?.finishAt ?? null;
    console.log('preMaintenanceFinishAt:', preMaintenanceFinishAt.value);
  },
  { immediate: true }
);
watch(
  () => props.dialogData.neighbors?.nextID,
  async (id) => {
    if (!id) {
      nextMaintenanceFinishAt.value = null;
      return;
    }

    const nextMaintenance = await getMaintenance(id);
    nextMaintenanceFinishAt.value = nextMaintenance?.finishAt ?? null;
    console.log('nextMaintenanceFinishAt:', nextMaintenanceFinishAt.value);
  },
  { immediate: true }
);

const emits = defineEmits<{
  (event: 'close'): void;
  (event: 'navigate', id: number): void; // ✅ 新增
  (event: 'backToList'): void;
}>();

const closeDialog = () => emits('close');

const navigateTo = (id?: number | null) => {
  if (!id) return;
  emits('navigate', id);
};

/**
 * 預設選取第一張圖片附件
 * - 右側永遠顯示「選取中」的預覽，不依賴 hover
 */
const ensureContentType = async (att: Attachment) => {
  if (att.type !== 0 || !att.fileKey) return;
  if (attachmentContentType.value[att.id]) return;

  const ct = await getAttachmentContentType(att.id, att.fileKey);
  if (ct) attachmentContentType.value[att.id] = ct;
};

watch(
  [() => props.dialogVisible, () => allAttachments.value],
  async ([visible, list]) => {
    if (!visible) return;
    if (!Array.isArray(list) || list.length === 0) return;

    // 1) 先 hydrate 所有 file 類附件的 content-type（讓縮圖按鈕能判斷 video）
    const fileAtts = list.filter((a) => a.type === 0 && !!a.fileKey);
    await Promise.all(fileAtts.map(ensureContentType));

    // 2) 預設選取：優先圖片，沒有圖片就選第一個 video
    if (!selectedAttachment.value) {
      const firstImage = list.find(isImageAtt) ?? null;

      const firstVideo =
        fileAtts.find((a) => isVideoContentType(attachmentContentType.value[a.id])) ?? null;

      selectedAttachment.value = firstImage ?? firstVideo ?? null;
      return;
    }

    // 3) 若原本選到的附件已不存在：重選（同上策略）
    const stillExists = list.some((a) => a.id === selectedAttachment.value?.id);
    if (!stillExists) {
      const firstImage = list.find(isImageAtt) ?? null;
      const firstVideo =
        fileAtts.find((a) => isVideoContentType(attachmentContentType.value[a.id])) ?? null;

      selectedAttachment.value = firstImage ?? firstVideo ?? null;
    }
  },
  { immediate: true }
);

const onFileThumbClick = async (att: Attachment) => {
  if (!att.fileKey) return;

  await ensureContentType(att);
  const ct = attachmentContentType.value[att.id] ?? '';

  if (isVideoContentType(ct)) {
    selectedAttachment.value = att;
  } else {
    openAttachmentFile(att.id, att.fileKey);
  }
};

const selectedContentType = computed(() => {
  const att = selectedAttachment.value;
  if (!att) return '';
  return attachmentContentType.value[att.id] ?? '';
});

const selectedIsVideo = computed(() => {
  // 只針對 file 類附件判斷
  const att = selectedAttachment.value;

  if (!att || att.type !== 0) return false;

  return isVideoContentType(selectedContentType.value);
});

const selectedPreviewUrl = computed(() => {
  const att = selectedAttachment.value;
  if (!att || !att.fileKey) return '';

  // ✅ 圖片預覽：維持你原邏輯
  if (att.type === 1) {
    return downloadAttachmentImage(att.id, att.fileKey, previewResolution(), true);
  }

  // ✅ 檔案預覽：只在 video 才拿來餵 <video>，其它檔案仍然點擊開新頁
  if (att.type === 0 && selectedIsVideo.value) {
    return downloadAttachmentFile(att.id, att.fileKey);
  }

  return '';
});

const rotationDeg = ref(0);

const selectedIsImage = computed(() => {
  const att = selectedAttachment.value;

  return !!att && att.type === 1 && !!selectedPreviewUrl.value && !selectedIsVideo.value;
});

const rotateImage = () => {
  if (!selectedIsImage.value) return;

  // 旋轉會讓放大鏡與記號筆座標錯位，所以旋轉前先關閉 / 清除
  isMagnifierEnabled.value = false;
  isMagnifierVisible.value = false;
  isMarkerEnabled.value = false;
  clearMarker();

  rotationDeg.value = (rotationDeg.value + 90) % 360;
};

const imagePreviewStyle = computed(() => ({
  transform: `rotate(${rotationDeg.value}deg)`,
  transformOrigin: 'center center'
}));

const previewStageRef = ref<HTMLElement | null>(null);
const previewImageRef = ref<HTMLImageElement | null>(null);

const isMagnifierEnabled = ref(false);
const isMagnifierVisible = ref(false);

const MAGNIFIER_SIZE = 180;
const MAGNIFIER_ZOOM = 2.5;

const magnifierMeta = ref({
  xPct: 50,
  yPct: 50,
  lensLeft: 0,
  lensTop: 0,
  renderWidth: 0,
  renderHeight: 0
});

const canUseMagnifier = computed(() => {
  const att = selectedAttachment.value;

  return !!att && att.type === 1 && !!selectedPreviewUrl.value && !selectedIsVideo.value;
});

const markerCanvasRef = ref<HTMLCanvasElement | null>(null);

const isMarkerEnabled = ref(false);
const isMarkerDrawing = ref(false);
const markerLastPoint = ref<{ x: number; y: number } | null>(null);

const MARKER_COLOR = 'rgba(220, 38, 38, 0.95)';
const MARKER_LINE_WIDTH = 7;

const markerCanvasStyle = ref<Record<string, string>>({
  left: '0px',
  top: '0px',
  width: '0px',
  height: '0px'
});

const markerButtonTitle = computed(() =>
  isMarkerEnabled.value ? '關閉紅色記號筆' : '啟用紅色記號筆'
);

const setupMarkerContext = () => {
  const canvas = markerCanvasRef.value;
  if (!canvas) return null;

  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const dpr = window.devicePixelRatio || 1;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = MARKER_COLOR;
  ctx.fillStyle = MARKER_COLOR;
  ctx.lineWidth = MARKER_LINE_WIDTH;

  return ctx;
};

const clearMarkerCanvas = () => {
  const canvas = markerCanvasRef.value;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  setupMarkerContext();
};

const clearMarker = () => {
  isMarkerDrawing.value = false;
  markerLastPoint.value = null;
  clearMarkerCanvas();
};

const syncMarkerCanvasToImage = async () => {
  await nextTick();

  const canvas = markerCanvasRef.value;
  const img = previewImageRef.value;
  const stage = previewStageRef.value;

  if (!canvas || !img || !stage || !selectedIsImage.value) return;

  const imageRect = getContainedImageRect(img);
  const stageRect = stage.getBoundingClientRect();

  if (!imageRect) return;

  const dpr = window.devicePixelRatio || 1;

  const cssWidth = Math.max(1, imageRect.width);
  const cssHeight = Math.max(1, imageRect.height);

  const nextCanvasWidth = Math.round(cssWidth * dpr);
  const nextCanvasHeight = Math.round(cssHeight * dpr);

  markerCanvasStyle.value = {
    left: `${imageRect.left - stageRect.left}px`,
    top: `${imageRect.top - stageRect.top}px`,
    width: `${cssWidth}px`,
    height: `${cssHeight}px`
  };

  // 尺寸變更會清空 canvas；同尺寸則保留目前畫線
  if (canvas.width !== nextCanvasWidth || canvas.height !== nextCanvasHeight) {
    canvas.width = nextCanvasWidth;
    canvas.height = nextCanvasHeight;
  }

  setupMarkerContext();
};

const toggleMarker = async () => {
  if (!selectedIsImage.value) return;

  const willEnable = !isMarkerEnabled.value;

  if (willEnable) {
    // 記號筆、放大鏡、旋轉互斥，避免座標錯位
    isMagnifierEnabled.value = false;
    isMagnifierVisible.value = false;

    if (rotationDeg.value !== 0) {
      rotationDeg.value = 0;
    }

    await syncMarkerCanvasToImage();
  }

  isMarkerEnabled.value = willEnable;
  isMarkerDrawing.value = false;
  markerLastPoint.value = null;
};

const getMarkerPoint = (event: PointerEvent) => {
  const canvas = markerCanvasRef.value;
  if (!canvas) return null;

  const rect = canvas.getBoundingClientRect();

  const x = Math.min(Math.max(event.clientX - rect.left, 0), rect.width);
  const y = Math.min(Math.max(event.clientY - rect.top, 0), rect.height);

  return { x, y };
};

const drawMarkerDot = (point: { x: number; y: number }) => {
  const ctx = setupMarkerContext();
  if (!ctx) return;

  ctx.beginPath();
  ctx.arc(point.x, point.y, MARKER_LINE_WIDTH / 2, 0, Math.PI * 2);
  ctx.fill();
};

const drawMarkerLine = (from: { x: number; y: number }, to: { x: number; y: number }) => {
  const ctx = setupMarkerContext();
  if (!ctx) return;

  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
};

const onMarkerPointerDown = async (event: PointerEvent) => {
  if (!isMarkerEnabled.value || !selectedIsImage.value) return;

  event.preventDefault();
  event.stopPropagation();

  const canvas = markerCanvasRef.value;
  if (!canvas) return;

  if (!canvas.width || !canvas.height) {
    await syncMarkerCanvasToImage();
  }

  const point = getMarkerPoint(event);
  if (!point) return;

  canvas.setPointerCapture?.(event.pointerId);

  isMarkerDrawing.value = true;
  markerLastPoint.value = point;

  drawMarkerDot(point);
};

const onMarkerPointerMove = (event: PointerEvent) => {
  if (!isMarkerEnabled.value || !isMarkerDrawing.value) return;

  event.preventDefault();
  event.stopPropagation();

  const point = getMarkerPoint(event);
  const lastPoint = markerLastPoint.value;

  if (!point || !lastPoint) return;

  drawMarkerLine(lastPoint, point);
  markerLastPoint.value = point;
};

const stopMarkerDrawing = (event?: PointerEvent) => {
  if (event) {
    markerCanvasRef.value?.releasePointerCapture?.(event.pointerId);
  }

  isMarkerDrawing.value = false;
  markerLastPoint.value = null;
};

const onPreviewImageLoad = () => {
  resetMagnifier();
  clearMarker();

  if (isMarkerEnabled.value) {
    syncMarkerCanvasToImage();
  }
};

const magnifierButtonTitle = computed(() => {
  if (isMagnifierEnabled.value) return '關閉放大鏡';

  return rotationDeg.value !== 0 ? '啟用放大鏡（會取消旋轉）' : '啟用放大鏡';
});

const resetMagnifier = () => {
  isMagnifierVisible.value = false;
};

const toggleMagnifier = () => {
  if (!canUseMagnifier.value) return;

  const willEnable = !isMagnifierEnabled.value;

  // 啟用放大鏡時，必須關閉記號筆。
  // 否則 canvas 會保持 pointer-events-auto，擋住圖片的 pointermove，
  // 導致放大鏡無法跟著滑鼠出現。
  if (willEnable) {
    isMarkerEnabled.value = false;
    isMarkerDrawing.value = false;
    markerLastPoint.value = null;
    clearMarker();

    // 放大鏡是用未旋轉原圖當 background-image。
    // 若圖片目前有旋轉，啟用放大鏡時先回正，避免座標不同步。
    if (rotationDeg.value !== 0) {
      rotationDeg.value = 0;
    }
  }

  isMagnifierEnabled.value = willEnable;
  resetMagnifier();
};

/**
 * 因為圖片是 object-contain：
 * img 元素本身會吃滿容器，但實際圖片可能上下或左右有留白。
 * 這裡計算「真實圖片顯示區域」，避免放大鏡位置對不到。
 */
const getContainedImageRect = (img: HTMLImageElement) => {
  const box = img.getBoundingClientRect();
  const naturalWidth = img.naturalWidth || box.width;
  const naturalHeight = img.naturalHeight || box.height;

  if (!box.width || !box.height || !naturalWidth || !naturalHeight) return null;

  const boxRatio = box.width / box.height;
  const imageRatio = naturalWidth / naturalHeight;

  let width = box.width;
  let height = box.height;
  let offsetX = 0;
  let offsetY = 0;

  if (imageRatio > boxRatio) {
    height = box.width / imageRatio;
    offsetY = (box.height - height) / 2;
  } else {
    width = box.height * imageRatio;
    offsetX = (box.width - width) / 2;
  }

  return {
    left: box.left + offsetX,
    top: box.top + offsetY,
    width,
    height
  };
};

const onPreviewImagePointerMove = (event: PointerEvent) => {
  if (!isMagnifierEnabled.value || !canUseMagnifier.value) return;

  const img = previewImageRef.value;
  const stage = previewStageRef.value;

  if (!img || !stage) return;

  const imageRect = getContainedImageRect(img);
  const stageRect = stage.getBoundingClientRect();

  if (!imageRect) return;

  const relX = event.clientX - imageRect.left;
  const relY = event.clientY - imageRect.top;

  // 滑到 object-contain 的留白區，不顯示放大鏡
  if (relX < 0 || relY < 0 || relX > imageRect.width || relY > imageRect.height) {
    isMagnifierVisible.value = false;
    return;
  }

  magnifierMeta.value = {
    xPct: (relX / imageRect.width) * 100,
    yPct: (relY / imageRect.height) * 100,
    lensLeft: event.clientX - stageRect.left,
    lensTop: event.clientY - stageRect.top,
    renderWidth: imageRect.width,
    renderHeight: imageRect.height
  };

  isMagnifierVisible.value = true;
};

const magnifierStyle = computed(() => {
  const meta = magnifierMeta.value;

  const backgroundX = MAGNIFIER_SIZE / 2 - (meta.xPct / 100) * meta.renderWidth * MAGNIFIER_ZOOM;

  const backgroundY = MAGNIFIER_SIZE / 2 - (meta.yPct / 100) * meta.renderHeight * MAGNIFIER_ZOOM;

  return {
    width: `${MAGNIFIER_SIZE}px`,
    height: `${MAGNIFIER_SIZE}px`,
    left: `${meta.lensLeft - MAGNIFIER_SIZE / 2}px`,
    top: `${meta.lensTop - MAGNIFIER_SIZE / 2}px`,
    backgroundImage: `url(${JSON.stringify(selectedPreviewUrl.value)})`,
    backgroundSize: `${meta.renderWidth * MAGNIFIER_ZOOM}px ${
      meta.renderHeight * MAGNIFIER_ZOOM
    }px`,
    backgroundPosition: `${backgroundX}px ${backgroundY}px`
  };
});

watch([selectedAttachment, selectedPreviewUrl, selectedIsVideo], () => {
  rotationDeg.value = 0;
  resetMagnifier();
  clearMarker();

  if (!canUseMagnifier.value) {
    isMagnifierEnabled.value = false;
    isMarkerEnabled.value = false;
  }

  if (isMarkerEnabled.value) {
    syncMarkerCanvasToImage();
  }
});

const isHumanText = computed(() => {
  const v = props.dialogData?.isHumanError;
  if (v == null) return '-';
  return v ? '人為' : '非人為';
});

const headerTagsFailureCategory = computed(() => {
  const tags: { label: string; tone: 'rose' | 'emerald' | 'slate' }[] = [];
  if (props.dialogData?.failureCategory)
    tags.push({ label: props.dialogData.failureCategory, tone: 'rose' });
  // const attCount = allAttachments.value.length;
  // if (attCount) tags.push({ label: `附件 ${attCount}`, tone: 'emerald' });
  return tags;
});
const headerTagsAttCount = computed(() => {
  const tags: { label: string; tone: 'rose' | 'emerald' | 'slate' }[] = [];
  // if (props.dialogData?.failureCategory)
  //   tags.push({ label: props.dialogData.failureCategory, tone: 'rose' });
  const attCount = allAttachments.value.length;
  if (attCount) tags.push({ label: `附件 ${attCount}`, tone: 'emerald' });
  return tags;
});

watch(
  () => props.dialogVisible,
  (val) => {
    if (!val) return;
    setTimeout(() => {
      (document.querySelector('[data-dialog-root]') as HTMLElement | null)?.focus();
    }, 10);
  }
);

/** 只取圖片附件清單（用於上一張/下一張） */
const imageAttachments = computed(() => allAttachments.value.filter(isImageAtt));

/** 目前選到的圖片 index（不存在則 -1） */
const selectedImageIndex = computed(() => {
  const list = imageAttachments.value;
  const id = selectedAttachment.value?.id;
  if (!id) return -1;
  return list.findIndex((a) => a.id === id);
});

const attStripRef = ref<HTMLElement | null>(null);

const scrollSelectedAttachmentIntoView = async () => {
  await nextTick();

  const container = attStripRef.value;
  const selectedId = selectedAttachment.value?.id;

  if (!container || !selectedId) return;

  const target = Array.from(
    container.querySelectorAll<HTMLElement>('[data-attachment-thumb-id]')
  ).find((el) => el.dataset.attachmentThumbId === String(selectedId));

  if (!target) return;

  target.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
    inline: 'center'
  });
};

watch(
  [
    () => selectedAttachment.value?.id,
    () => allAttachments.value.length,
    () => props.dialogVisible
  ],
  () => {
    if (!props.dialogVisible) return;
    scrollSelectedAttachmentIntoView();
  },
  { flush: 'post' }
);

const hasPrev = computed(() => selectedImageIndex.value > 0);
const hasNext = computed(
  () =>
    selectedImageIndex.value >= 0 && selectedImageIndex.value < imageAttachments.value.length - 1
);

const goPrev = () => {
  if (!hasPrev.value) return;
  const idx = selectedImageIndex.value - 1;
  selectedAttachment.value = imageAttachments.value[idx] ?? selectedAttachment.value;
};

const goNext = () => {
  if (!hasNext.value) return;
  const idx = selectedImageIndex.value + 1;
  selectedAttachment.value = imageAttachments.value[idx] ?? selectedAttachment.value;
};
</script>

<template>
  <div
    v-if="dialogVisible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-3"
    tabindex="0"
    data-dialog-root
    @keydown.esc="closeDialog"
  >
    <!-- Loading -->
    <div
      v-if="isDialogLoading"
      class="flex items-center gap-3 rounded-2xl bg-white px-6 py-5 shadow-xl"
    >
      <span
        class="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-slate-700"
      />
      <span class="text-base sm:text-lg text-slate-700">載入中…</span>
    </div>

    <!-- Dialog -->
    <!-- ✅ 上下各 2vh；整體高度 96vh；不爆版 -->
    <div v-else class="w-full max-w-7xl mt-[6vh] mb-[1vh] h-[93vh]">
      <!-- ✅ card: flex-column + min-h-0，讓 body/scroll 正常工作 -->
      <div
        class="overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200 h-full flex flex-col min-h-0"
      >
        <!-- Header -->
        <header class="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div class="flex items-start justify-between gap-4 px-5 pt-4 pb-1">
            <div class="min-w-0">
              <div class="flex items-start gap-4">
                <LucidePenTool class="h-5 w-5 text-slate-700 mt-1" />

                <div class="min-w-0">
                  <div class="flex flex-wrap items-center gap-3">
                    <div class="text-lg sm:text-xl font-bold text-slate-900">
                      {{ dialogData.factoryName || '' }}｜維護單資訊
                    </div>

                    <div v-if="headerTagsAttCount.length" class="flex flex-wrap gap-2">
                      <span
                        v-for="(t, idx) in headerTagsAttCount"
                        :key="idx"
                        class="inline-flex items-center rounded-full px-3 py-1 text-[12px] sm:text-[13px] font-semibold ring-1"
                        :class="
                          t.tone === 'rose'
                            ? 'bg-rose-50 text-rose-700 ring-rose-200'
                            : t.tone === 'emerald'
                              ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                              : 'bg-slate-50 text-slate-700 ring-slate-200'
                        "
                      >
                        {{ t.label }}
                      </span>
                    </div>

                    <div
                      class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] sm:text-[15px] text-slate-600"
                    >
                      <div class="font-semibold text-slate-800">
                        單號：<span class="tabular-nums">{{ dialogData.number || '-' }}</span>
                      </div>
                      <div>
                        ID：<span class="tabular-nums">{{ dialogData.id }}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      class="shrink-0 h-11 px-4 rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:bg-slate-50 active:scale-[0.98]"
                      @click="emits('backToList')"
                    >
                      回列表
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button
              class="shrink-0 grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:bg-slate-50 active:scale-[0.98]"
              aria-label="關閉"
              @click="closeDialog"
            >
              <LucideX class="h-5 w-5 text-slate-600" />
            </button>
          </div>
        </header>

        <!-- ✅ Body：吃滿 header 以外高度；內部才分欄與滾動 -->
        <div class="px-2 flex-1 min-h-0">
          <!-- ✅ grid 撐滿 body 高度；items-stretch 讓左右欄都吃滿高度 -->
          <div class="grid grid-cols-1 lg:grid-cols-5 gap-4 pt-2 h-full min-h-0 items-stretch">
            <!-- ✅ 右欄：不再用 sticky（sticky 會用 viewport 當參照，容易爆版）
                 ✅ 右欄整欄吃滿 grid 高度，預覽區 flex-1 吃滿剩餘高度 -->
            <aside v-if="hasAnyAttachment" class="order-1 lg:order-2 lg:col-span-3 h-full min-h-0">
              <div
                class="rounded-2xl border border-slate-200 bg-white shadow-sm h-full flex flex-col min-h-0"
              >
                <!-- ✅ 預覽：吃滿（縮圖列以外）剩餘高度 -->
                <div class="px-3 flex-1 min-h-0">
                  <div
                    ref="previewStageRef"
                    :key="`${selectedAttachment?.id ?? 'none'}-${selectedIsVideo ? 'v' : 'i'}`"
                    class="relative h-full w-full overflow-hidden rounded-t-2xl border border-slate-200 bg-slate-50"
                  >
                    <video
                      v-if="selectedIsVideo && selectedPreviewUrl"
                      :src="selectedPreviewUrl"
                      class="h-full w-full object-contain"
                      controls
                      playsinline
                      preload="metadata"
                    />

                    <!-- ✅ 圖片預覽 -->
                    <img
                      v-else-if="selectedPreviewUrl"
                      ref="previewImageRef"
                      :src="selectedPreviewUrl"
                      class="h-full w-full object-contain transition-transform duration-200"
                      :class="isMagnifierEnabled && canUseMagnifier ? 'cursor-zoom-in' : ''"
                      :style="imagePreviewStyle"
                      alt="圖片預覽"
                      loading="eager"
                      decoding="async"
                      @pointermove="onPreviewImagePointerMove"
                      @pointerleave="resetMagnifier"
                      @load="onPreviewImageLoad"
                    />

                    <div
                      v-else
                      class="h-full w-full grid place-items-center text-sm text-slate-500 pb-14"
                    >
                      選取圖片附件後，會在此處顯示預覽。
                    </div>
                    <canvas
                      v-if="selectedIsImage"
                      ref="markerCanvasRef"
                      class="marker-canvas absolute z-20"
                      :class="
                        isMarkerEnabled
                          ? 'pointer-events-auto cursor-crosshair'
                          : 'pointer-events-none'
                      "
                      :style="markerCanvasStyle"
                      @pointerdown="onMarkerPointerDown"
                      @pointermove="onMarkerPointerMove"
                      @pointerup="stopMarkerDrawing"
                      @pointercancel="stopMarkerDrawing"
                      @pointerleave="stopMarkerDrawing"
                    />
                    <!-- 放大鏡切換按鈕 -->
                    <!-- 圖片工具列：放大檢視 / 旋轉 -->
                    <div
                      v-if="canUseMagnifier"
                      class="absolute right-3 top-3 z-40 flex flex-col items-end gap-2"
                    >
                      <button
                        type="button"
                        class="inline-flex h-11 items-center gap-2 rounded-2xl border px-3 text-sm font-semibold shadow-sm backdrop-blur transition active:scale-[0.98]"
                        :class="
                          isMagnifierEnabled
                            ? 'border-emerald-500 bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'border-slate-200 bg-white/90 text-slate-700 hover:bg-white'
                        "
                        :aria-pressed="isMagnifierEnabled"
                        :title="magnifierButtonTitle"
                        @click.stop="toggleMagnifier"
                      >
                        <ZoomIn class="h-5 w-5" />
                        <span class="hidden sm:inline">
                          {{ isMagnifierEnabled ? '關閉放大' : '放大檢視' }}
                        </span>
                      </button>

                      <button
                        type="button"
                        class="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-3 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:bg-white active:scale-[0.98]"
                        title="順時針旋轉 90 度"
                        @click.stop="rotateImage"
                      >
                        <RotateCw class="h-5 w-5" />
                        <span class="hidden sm:inline">旋轉</span>
                      </button>
                      <button
                        type="button"
                        class="inline-flex h-11 items-center gap-2 rounded-2xl border px-3 text-sm font-semibold shadow-sm backdrop-blur transition active:scale-[0.98]"
                        :class="
                          isMarkerEnabled
                            ? 'border-red-500 bg-red-600 text-white hover:bg-red-700'
                            : 'border-slate-200 bg-white/90 text-slate-700 hover:bg-white'
                        "
                        :aria-pressed="isMarkerEnabled"
                        :title="markerButtonTitle"
                        @click.stop="toggleMarker"
                      >
                        <LucidePenTool class="h-5 w-5" />
                        <span class="hidden sm:inline">
                          {{ isMarkerEnabled ? '關閉記號' : '記號筆' }}
                        </span>
                      </button>

                      <button
                        type="button"
                        class="inline-flex h-11 items-center gap-2 rounded-2xl border border-red-200 bg-white/90 px-3 text-sm font-semibold text-red-600 shadow-sm backdrop-blur transition hover:bg-red-50 active:scale-[0.98]"
                        title="清除圖片上的記號"
                        @click.stop="clearMarker"
                      >
                        <Eraser class="h-5 w-5" />
                        <span class="hidden sm:inline">清除</span>
                      </button>
                    </div>

                    <!-- 放大鏡本體 -->
                    <div
                      v-if="canUseMagnifier && isMagnifierEnabled && isMagnifierVisible"
                      class="magnifier-lens pointer-events-none absolute z-30 rounded-full border-2 border-white/90 shadow-2xl ring-1 ring-black/20"
                      :style="magnifierStyle"
                    />
                    <!-- ✅ Overlay controls：蓋在預覽圖上，不佔 layout 空間 -->
                    <div
                      v-if="!selectedIsVideo"
                      class="pointer-events-none absolute inset-x-0 bottom-0 z-30 px-3"
                    >
                      <div class="pointer-events-auto mx-auto w-full max-w-sm">
                        <div class="flex items-center justify-between gap-2 px-3 pb-1">
                          <button
                            type="button"
                            class="inline-flex items-center justify-center rounded-xl border px-3 py-2 text-sm font-semibold shadow-sm transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                            :class="
                              hasPrev
                                ? 'border-slate-200 bg-white hover:bg-slate-50'
                                : 'border-slate-200 bg-slate-100'
                            "
                            :disabled="!hasPrev"
                            @click="goPrev"
                          >
                            上一張
                          </button>

                          <div
                            class="text-xs text-slate-600 tabular-nums bg-slate-100 px-2 py-1 rounded-full relative bottom-0"
                          >
                            <span v-if="selectedImageIndex >= 0">
                              {{ selectedImageIndex + 1 }} / {{ imageAttachments.length }}
                            </span>
                            <span v-else>未選取圖片</span>
                          </div>

                          <button
                            type="button"
                            class="inline-flex items-center justify-center rounded-xl border px-3 py-2 text-sm font-semibold shadow-sm transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                            :class="
                              hasNext
                                ? 'border-slate-200 bg-white hover:bg-slate-50'
                                : 'border-slate-200 bg-slate-100'
                            "
                            :disabled="!hasNext"
                            @click="goNext"
                          >
                            下一張
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- ✅ 縮圖列：固定在下方（不影響預覽高度計算） -->

                <div class="border-t border-slate-200 p-1">
                  <div ref="attStripRef" class="att-strip overflow-x-auto">
                    <div class="flex items-start gap-3 min-w-max">
                      <div class="text-xs font-semibold text-slate-500 ml-2">附件清單</div>
                      <template
                        v-for="(att, idx) in allAttachments"
                        :key="`${att.id ?? 'noid'}-${idx}`"
                      >
                        <!-- Image thumb -->
                        <button
                          v-if="att.type === 1 && att.fileKey"
                          type="button"
                          :data-attachment-thumb-id="String(att.id)"
                          class="group w-[110px] shrink-0 rounded-2xl border p-1 shadow-sm transition text-left hover:shadow-md active:scale-[0.99]"
                          :class="
                            selectedAttachment?.id === att.id
                              ? 'border-emerald-300 bg-emerald-300'
                              : 'border-slate-200 bg-white hover:bg-slate-50'
                          "
                          @mouseenter="hoveredAttachment = att"
                          @mouseleave="hoveredAttachment = null"
                          @click="selectedAttachment = att"
                        >
                          <img
                            :src="downloadAttachmentImage(att.id, att.fileKey, '1x')"
                            class="h-[72px] w-full rounded-xl border border-slate-200 bg-white object-cover"
                            alt="附件縮圖"
                            loading="lazy"
                            decoding="async"
                          />
                        </button>

                        <!-- File thumb -->
                        <button
                          v-else-if="att.type === 0 && att.fileKey"
                          type="button"
                          :data-attachment-thumb-id="String(att.id)"
                          class="w-[110px] shrink-0 rounded-2xl border border-slate-200 bg-white p-1 shadow-sm transition hover:bg-slate-50 active:scale-[0.99] text-left"
                          :title="
                            isVideoContentType(attachmentContentType[att.id])
                              ? '預覽影片'
                              : '下載/開啟檔案'
                          "
                          @click="onFileThumbClick(att)"
                        >
                          <div
                            class="h-[72px] w-full rounded-xl border border-slate-200 bg-slate-50 grid place-items-center"
                          >
                            <LucideDownload
                              v-if="!isVideoContentType(attachmentContentType[att.id])"
                              class="h-6 w-6 text-slate-600"
                            />
                            <Film
                              v-else-if="isVideoContentType(attachmentContentType[att.id])"
                              class="h-6 w-6 text-slate-600"
                            />
                          </div>
                        </button>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
            <div
              v-else
              class="order-1 lg:order-2 lg:col-span-3 h-full min-h-0 flex items-center justify-center"
            >
              無說明附件
            </div>

            <!-- ✅ 左欄：整欄吃滿高度；內部滾動 -->
            <div class="order-2 lg:order-1 lg:col-span-2 min-w-0 h-full min-h-0">
              <div class="left-scroll min-w-0 overflow-y-auto pr-1 h-full min-h-0">
                <!-- Top KPI cards -->
                <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-2">
                  <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div class="text-[12px] sm:text-[13px] font-semibold text-slate-500">
                      主設備
                    </div>
                    <div
                      class="mt-2 text-2xl font-bold text-blue-700 leading-snug line-clamp-2 underline"
                    >
                      {{ dialogData.machineName || '-' }}
                    </div>
                    <div class="mt-2 text-[12px] text-slate-500">
                      維護零件：
                      <span class="font-semibold text-slate-700 text-xl">{{
                        dialogData.componentName || '-'
                      }}</span>
                    </div>
                  </div>

                  <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div class="text-[12px] sm:text-[13px] font-semibold text-slate-500">
                      施工單位
                    </div>
                    <div
                      class="mt-2 text-lg sm:text-xl font-bold text-slate-900 leading-snug line-clamp-2"
                    >
                      {{ dialogData.maintainer || '-' }}
                    </div>
                    <div class="mt-2 text-[12px] sm:text-[13px] text-slate-500">
                      負責人：
                      <span class="font-semibold text-slate-700">{{
                        dialogData.staffName || '-'
                      }}</span>
                    </div>

                    <div class="mt-2 text-[12px] sm:text-[13px] text-slate-500">
                      填單人：
                      <span class="font-semibold text-slate-700">
                        {{ dialogData.staffSubmitName || '-' }}
                      </span>
                    </div>
                  </div>

                  <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div class="mt-2 text-[12px] sm:text-[13px] text-slate-500">
                      總工時：
                      <span class="font-semibold text-slate-700 tabular-nums text-md">{{
                        dialogData.maintenanceHour ?? 0
                      }}</span>
                      人
                    </div>
                    <div class="mt-2 text-[12px] sm:text-[13px] text-slate-500">
                      操作人數：
                      <span class="font-semibold text-slate-700 tabular-nums text-md">{{
                        dialogData.workerCount ?? 0
                      }}</span>
                      人
                    </div>
                    <div class="mt-2 text-[12px] sm:text-[13px] text-slate-500">
                      上次維護：
                      <button
                        type="button"
                        class="font-semibold text-blue-600 hover:underline disabled:text-slate-400 disabled:no-underline"
                        :disabled="!props.dialogData.neighbors?.previousID"
                        @click="navigateTo(props.dialogData.neighbors?.previousID)"
                      >
                        {{
                          preMaintenanceFinishAt
                            ? formatDate(preMaintenanceFinishAt)
                            : '無前次維護時間'
                        }}
                      </button>
                    </div>

                    <div class="mt-2 text-[12px] sm:text-[13px] text-slate-500">
                      下次維護：
                      <button
                        type="button"
                        class="font-semibold text-blue-600 hover:underline disabled:text-slate-400 disabled:no-underline"
                        :disabled="!props.dialogData.neighbors?.nextID"
                        @click="navigateTo(props.dialogData.neighbors?.nextID)"
                      >
                        {{ nextMaintenanceFinishAt ? formatDate(nextMaintenanceFinishAt) : '-' }}
                      </button>
                    </div>
                  </div>

                  <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div class="text-[12px] sm:text-[13px] font-semibold text-slate-500">
                      故障原因｜{{ isHumanText }}
                    </div>
                    <div class="mt-2 text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                      <div v-if="headerTagsFailureCategory.length" class="flex flex-wrap gap-2">
                        <span
                          v-for="(t, idx) in headerTagsFailureCategory"
                          :key="idx"
                          class="inline-flex items-center rounded-full px-3 py-1 text-[12px] sm:text-[13px] font-semibold ring-1"
                          :class="
                            t.tone === 'rose'
                              ? 'bg-rose-50 text-rose-700 ring-rose-200'
                              : t.tone === 'emerald'
                                ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                                : 'bg-slate-50 text-slate-700 ring-slate-200'
                          "
                        >
                          {{ t.label }}
                        </span>
                      </div>
                    </div>
                    <div class="mt-2 text-[12px] sm:text-[13px] text-slate-500">
                      故障時間：
                      <span class="font-semibold text-slate-700">{{
                        formatDate(dialogData.malfunctionAt)
                      }}</span>
                    </div>
                    <div class="mt-2 text-[12px] sm:text-[13px] text-slate-500">
                      維護完成：<span class="font-semibold text-slate-700">{{
                        formatDate(dialogData.finishAt)
                      }}</span>
                    </div>
                  </div>
                </div>

                <!-- Details sections -->
                <div class="mt-4 space-y-3">
                  <!-- 上：故障/維護說明 -->
                  <section class="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
                    <div class="flex items-center gap-2">
                      <LucideAlertTriangle class="h-5 w-5 text-slate-700" />
                      <div class="text-base sm:text-lg font-bold text-slate-900">
                        故障與維護說明
                      </div>
                    </div>

                    <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div class="rounded-2xl border border-red-100 bg-red-50 p-2">
                        <div class="text-[12px] sm:text-[13px] font-semibold text-slate-500">
                          故障詳情
                        </div>
                        <div
                          class="mt-2 text-base sm:text-lg text-slate-900 leading-relaxed whitespace-pre-line"
                        >
                          <div v-if="dialogData.failureCause" v-html="dialogData.failureCause" />
                          <div v-else class="text-slate-500">未填寫</div>
                        </div>
                      </div>

                      <div class="rounded-2xl border border-green-100 bg-green-50 p-2">
                        <div class="flex items-start justify-between gap-3">
                          <div class="min-w-0">
                            <div class="text-[12px] sm:text-[13px] font-semibold text-slate-500">
                              維護內容
                            </div>
                            <div
                              class="mt-2 text-base sm:text-lg text-slate-900 leading-relaxed whitespace-pre-line"
                            >
                              <div v-if="dialogData.note" v-html="dialogData.note" />
                              <div v-else class="text-slate-500">未填寫</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        v-if="dialogData.equipment"
                        class="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2"
                      >
                        <div class="flex items-center gap-2">
                          <Pickaxe class="h-5 w-5 text-slate-700" />
                          <div class="text-base sm:text-lg font-bold text-slate-900">特殊機具</div>
                        </div>
                        <div class="mt-2 text-base sm:text-lg text-slate-900 leading-relaxed">
                          {{ dialogData.equipment }}
                        </div>
                      </div>
                    </div>
                  </section>

                  <!-- 下：零件更換 -->
                  <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div class="flex items-center gap-2">
                      <LucidePackage class="h-5 w-5 text-slate-700" />
                      <div class="text-base sm:text-lg font-bold text-slate-900">零件更換</div>
                    </div>

                    <div class="mt-4 space-y-4">
                      <!-- 維修/保養零件 -->
                      <div
                        v-if="dialogData.fixedComponents?.length"
                        class="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <div class="flex items-center gap-2">
                          <LucideHammer class="h-4 w-4 text-slate-600" />
                          <div class="text-sm sm:text-base font-bold text-slate-900">
                            維修/保養零件
                          </div>
                        </div>
                        <div class="mt-3 space-y-2">
                          <div
                            v-for="(item, idx) in dialogData.fixedComponents"
                            :key="idx"
                            class="rounded-xl border border-amber-200 bg-white p-3"
                          >
                            <div class="text-sm sm:text-base font-semibold text-slate-900">
                              {{ item.name || '母零件' }}
                            </div>
                            <div class="mt-1 text-[13px] sm:text-[15px] text-slate-600">
                              數量：
                              <span class="font-semibold text-slate-900 tabular-nums">{{
                                item.componentCount || 0
                              }}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- 裝上零件 -->
                      <div
                        v-if="dialogData.installedComponents?.length"
                        class="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <div class="flex items-center gap-2">
                          <ArrowBigUp class="h-4 w-4 text-slate-600" />
                          <div class="text-sm sm:text-base font-bold text-slate-900">裝上零件</div>
                        </div>
                        <div class="mt-3 space-y-2">
                          <div
                            v-for="(item, idx) in dialogData.installedComponents"
                            :key="idx"
                            class="rounded-xl border border-emerald-200 bg-white p-3"
                          >
                            <div class="text-sm sm:text-base font-semibold text-slate-900">
                              {{ item.name || '母零件' }}
                            </div>
                            <div class="mt-1 text-[13px] sm:text-[15px] text-slate-600">
                              數量：
                              <span class="font-semibold text-slate-900 tabular-nums">{{
                                item.componentCount || 0
                              }}</span>
                            </div>
                            <div class="mt-1 text-[13px] sm:text-[15px] text-slate-600">
                              型號：
                              <span class="font-semibold text-slate-900">{{
                                item.componentDetails?.brandModel || '-'
                              }}</span>
                            </div>
                            <div class="mt-1 text-[13px] sm:text-[15px] text-slate-600">
                              規格：
                              <span class="font-semibold text-slate-900">{{
                                item.componentDetails?.brandSpec || '-'
                              }}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- 換下零件 -->
                      <div
                        v-if="dialogData.removedComponents?.length"
                        class="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <div class="flex items-center gap-2">
                          <ArrowBigDown class="h-4 w-4 text-slate-600" />
                          <div class="text-sm sm:text-base font-bold text-slate-900">換下零件</div>
                        </div>
                        <div class="mt-3 space-y-2">
                          <div
                            v-for="(item, idx) in dialogData.removedComponents"
                            :key="idx"
                            class="rounded-xl border border-rose-200 bg-white p-3"
                          >
                            <div class="text-sm sm:text-base font-semibold text-slate-900">
                              {{ item.name || '母零件' }}
                            </div>
                            <div class="mt-1 text-[13px] sm:text-[15px] text-slate-600">
                              數量：
                              <span class="font-semibold text-slate-900 tabular-nums">{{
                                item.componentCount || 0
                              }}</span>
                            </div>
                            <div class="mt-1 text-[13px] sm:text-[15px] text-slate-600">
                              型號：
                              <span class="font-semibold text-slate-900">{{
                                item.componentDetails?.brandModel || '-'
                              }}</span>
                            </div>
                            <div class="mt-1 text-[13px] sm:text-[15px] text-slate-600">
                              規格：
                              <span class="font-semibold text-slate-900">{{
                                item.componentDetails?.brandSpec || '-'
                              }}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        v-if="
                          !dialogData.fixedComponents?.length &&
                          !dialogData.installedComponents?.length &&
                          !dialogData.removedComponents?.length
                        "
                        class="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-500 text-sm sm:text-base"
                      >
                        本單無零件更換資訊。
                      </div>
                    </div>
                  </section>

                  <div class="h-2" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- /Body -->
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ✅ 不再用 vh 硬算 max-height，避免超出 dialog 爆版 */
.left-scroll {
  max-height: none;
}

/* 滾動條（保留原本） */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-thumb {
  background-color: rgba(148, 163, 184, 0.55);
  border-radius: 999px;
}
::-webkit-scrollbar-track {
  background: rgba(241, 245, 249, 0.9);
}

/* ✅ 附件清單水平捲動條更好抓 */
.att-strip {
  scrollbar-gutter: stable;
  -webkit-overflow-scrolling: touch;
}
.att-strip::-webkit-scrollbar {
  height: 10px;
}
.att-strip::-webkit-scrollbar-thumb {
  background-color: rgba(148, 163, 184, 0.75);
  border-radius: 999px;
}
.att-strip::-webkit-scrollbar-track {
  background: rgba(241, 245, 249, 0.95);
  border-radius: 999px;
}
.att-strip {
  scrollbar-width: auto;
  scrollbar-color: rgba(148, 163, 184, 0.85) rgba(241, 245, 249, 0.95);
}
.magnifier-lens {
  background-repeat: no-repeat;
  background-color: white;
}
.marker-canvas {
  background: transparent;
  touch-action: none;
}
</style>
