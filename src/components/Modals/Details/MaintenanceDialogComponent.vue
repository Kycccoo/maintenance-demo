<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import {
  LucidePenTool,
  LucideUsers,
  LucideAlertTriangle,
  ArrowBigUp,
  ArrowBigDown,
  LucidePackage,
  Search,
  Pickaxe,
  LucideHammer,
  LucideCalendar,
  LucidePaperclip,
  LucideX,
  LucideDownload,
  LucideClock,
  LucideFactory,
  LucideWrench,
  LucideUserRound,
  LucideFileText,
  LucideImage
} from 'lucide-vue-next';

import type { MachineComponentSlotMaintenance } from '@/types/MachineComponentSlotMaintenance';
import type { Attachment } from '@/types/Attachment';

import {
  downloadAttachmentImage,
  downloadAttachmentFile
} from '@/api/services/machineComponentSlotMaintenance';

const props = defineProps<{
  dialogVisible: boolean;
  dialogData: MachineComponentSlotMaintenance;
  isDialogLoading: boolean;
  formatDate: (dateStr: string | number | Date) => string;
}>();

const emits = defineEmits<{
  (event: 'close'): void;
}>();

const hoveredImage = ref<string | null>(null);
const hoveredAttachment = ref<Attachment | null>(null);

const closeDialog = () => emits('close');

const hasAttachments = computed(() => {
  return Boolean(
    props.dialogData?.attachments?.length ||
      props.dialogData?.supplements?.some((item) => item.attachments?.length)
  );
});

const hasComponentRecords = computed(() => {
  return Boolean(
    props.dialogData?.fixedComponents?.length ||
      props.dialogData?.installedComponents?.length ||
      props.dialogData?.removedComponents?.length
  );
});

const failureReasonText = computed(() => {
  if (props.dialogData?.isHumanError == null) return '-';
  return props.dialogData.isHumanError ? '人為' : '非人為';
});

const previewResolution = (): '1x' | '2x' | '3x' => {
  const dpr = window.devicePixelRatio || 1;

  if (dpr >= 3) return '3x';
  if (dpr >= 2) return '2x';

  return '1x';
};

const previewUrl = computed(() => {
  if (!hoveredAttachment.value?.fileKey) return '';

  return downloadAttachmentImage(
    hoveredAttachment.value.id,
    hoveredAttachment.value.fileKey,
    previewResolution()
  );
});

const openAttachmentModal = (id: string, fileKey: string, fallback = false): void => {
  try {
    const dpr = window.devicePixelRatio || 1;

    let resolution: '1x' | '2x' | '3x' | 'original' = '1x';

    if (dpr >= 3) resolution = '3x';
    else if (dpr >= 2) resolution = '2x';

    if (fallback) resolution = 'original';

    const url = downloadAttachmentImage(id, fileKey, resolution, fallback);

    window.open(url, '_blank');
  } catch (error) {
    console.error('Error opening attachment:', error);
  }
};

const openAttachmentFile = (id: string, fileKey: string): void => {
  try {
    const url = downloadAttachmentFile(id, fileKey);

    window.open(url, '_blank');
  } catch (error) {
    console.error('Error downloading attachment file:', error);
  }
};

watch(
  () => props.dialogVisible,
  (val) => {
    if (!val) {
      hoveredImage.value = null;
      hoveredAttachment.value = null;
      return;
    }

    setTimeout(() => {
      (document.querySelector('[data-maintenance-dialog]') as HTMLElement)?.focus();
    }, 10);
  }
);
</script>

<template>
  <div
    v-if="dialogVisible"
    data-maintenance-dialog
    class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-3 py-4 backdrop-blur-sm sm:px-5"
    tabindex="0"
    role="dialog"
    aria-modal="true"
    aria-label="維護單資訊"
    @keydown.esc="closeDialog"
  >
    <div
      v-if="!isDialogLoading"
      class="flex max-h-[94vh] w-full max-w-[1280px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200"
    >
      <!-- Header -->
      <header class="shrink-0 bg-slate-900 px-4 py-4 text-white sm:px-6">
        <div class="flex items-center justify-between gap-4">
          <div class="min-w-0">
            <p class="mb-1 text-xs font-bold uppercase tracking-[0.32em] text-slate-300">
              Maintenance Record
            </p>

            <div class="flex flex-wrap items-center gap-3">
              <h2 class="flex items-center gap-2 text-2xl font-bold tracking-wide sm:text-3xl">
                <LucidePenTool class="h-6 w-6 text-sky-300" />
                維護單資訊
              </h2>

              <span
                class="rounded-full bg-slate-800 px-3 py-1 text-sm font-semibold text-slate-200 ring-1 ring-slate-700"
              >
                ID #{{ dialogData?.id || '-' }}
              </span>
            </div>
          </div>

          <button
            type="button"
            class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-600 bg-slate-800 text-slate-100 transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-300"
            aria-label="關閉彈窗"
            @click="closeDialog"
          >
            <LucideX class="h-6 w-6" />
          </button>
        </div>
      </header>

      <!-- Body -->
      <main class="min-h-0 flex-1 overflow-y-auto bg-slate-50 px-4 py-3 sm:px-6">
        <div class="space-y-4">
          <!-- Summary -->
          <section
            class="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm md:grid-cols-2 xl:grid-cols-4"
          >
            <div class="info-tile">
              <div class="info-icon">
                <LucideFactory class="h-5 w-5" />
              </div>

              <div class="min-w-0">
                <p class="info-label">主設備</p>
                <p class="info-value link-like">
                  {{ dialogData.machineName || '-' }}
                </p>
              </div>
            </div>

            <div class="info-tile">
              <div class="info-icon">
                <LucideWrench class="h-5 w-5" />
              </div>

              <div class="min-w-0">
                <p class="info-label">維護零件</p>
                <p class="info-value">
                  {{ dialogData.componentName || '-' }}
                </p>
              </div>
            </div>

            <div class="info-tile">
              <div class="info-icon">
                <LucideUserRound class="h-5 w-5" />
              </div>

              <div class="min-w-0 flex-1">
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <p class="info-label">負責人</p>
                    <p class="info-value">
                      {{ dialogData.staffName || '-' }}
                    </p>
                  </div>

                  <div class="hidden shrink-0 text-right sm:block">
                    <p class="info-label">填單</p>
                    <p class="info-sub-value">
                      {{ dialogData.staffSubmitName || '-' }}
                    </p>
                  </div>
                </div>

                <p class="info-mobile-sub-value sm:hidden">
                  填單：{{ dialogData.staffSubmitName || '-' }}
                </p>
              </div>
            </div>

            <div class="info-tile">
              <div class="info-icon">
                <LucideClock class="h-5 w-5" />
              </div>

              <div class="min-w-0">
                <p class="info-label">總工時 / 人數</p>
                <p class="info-value">
                  {{ dialogData.maintenanceHour || '-' }} 小時 /
                  {{ dialogData.workerCount || '-' }} 人
                </p>
              </div>
            </div>
          </section>

          <!-- Main Info Grid -->
          <section class="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <!-- Time Info -->
            <div class="content-card">
              <div class="card-title">
                <LucideCalendar class="card-title-icon" />
                <h3>時間資訊</h3>
              </div>

              <div class="detail-list">
                <div class="detail-row">
                  <span class="detail-label">建立時間</span>
                  <span class="detail-value">{{ formatDate(dialogData.createAt) }}</span>
                </div>

                <div class="detail-row">
                  <span class="detail-label">故障時間</span>
                  <span class="detail-value">{{ formatDate(dialogData.malfunctionAt) }}</span>
                </div>

                <div class="detail-row">
                  <span class="detail-label">完成時間</span>
                  <span class="detail-value">{{ formatDate(dialogData.finishAt) }}</span>
                </div>
              </div>
            </div>

            <!-- Process -->
            <div class="content-card">
              <div class="card-title">
                <LucideUsers class="card-title-icon" />
                <h3>維護過程</h3>
              </div>

              <div class="detail-list">
                <div class="detail-row">
                  <span class="detail-label">施工單位</span>
                  <span class="detail-value">{{ dialogData.maintainer || '-' }}</span>
                </div>

                <div class="detail-row">
                  <span class="detail-label">故障分類</span>
                  <span class="detail-value emphasize">
                    {{ dialogData.failureCategory || '未分類' }}
                  </span>
                </div>

                <div class="detail-row">
                  <span class="detail-label">是否人為</span>
                  <span class="detail-value">
                    {{ failureReasonText }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Failure Detail -->
            <div class="content-card">
              <div class="card-title">
                <LucideAlertTriangle class="card-title-icon text-orange-500" />
                <h3>故障詳情</h3>
              </div>
              <div
                class="prose-content min-h-[160px] rounded-xl border border-slate-200 bg-slate-50 p-4 text-2xl text-slate-800 font-extrabold"
                v-html="dialogData.failureCause || '無故障詳情'"
              />
            </div>

            <!-- Maintenance Note -->
            <div class="content-card">
              <div class="card-title">
                <LucideFileText class="card-title-icon text-emerald-600" />
                <h3>維護內容</h3>
              </div>

              <div
                class="prose-content min-h-[160px] rounded-xl border border-slate-200 bg-slate-50 p-4 text-2xl text-slate-800 font-extrabold"
                v-html="dialogData.note || '無維護內容'"
              />
            </div>
          </section>

          <!-- Component Replacement -->
          <section class="content-card">
            <div class="card-title">
              <LucidePackage class="card-title-icon" />
              <h3>零件更換</h3>
            </div>

            <div v-if="hasComponentRecords" class="space-y-5">
              <div v-if="dialogData.fixedComponents?.length">
                <div class="sub-title">
                  <LucideHammer class="h-5 w-5 text-amber-600" />
                  <span>維修 / 保養零件</span>
                </div>

                <div class="component-grid">
                  <article
                    v-for="(item, index) in dialogData.fixedComponents"
                    :key="'fixed-' + index"
                    class="component-card component-card-amber"
                  >
                    <p class="component-name">
                      {{ item.name || '母零件' }}
                    </p>

                    <p class="component-meta">數量：{{ item.componentCount || '-' }}</p>
                  </article>
                </div>
              </div>

              <div v-if="dialogData.installedComponents?.length">
                <div class="sub-title">
                  <ArrowBigUp class="h-5 w-5 text-emerald-600" />
                  <span>裝上零件</span>
                </div>

                <div class="component-grid">
                  <article
                    v-for="(item, index) in dialogData.installedComponents"
                    :key="'installed-' + index"
                    class="component-card component-card-emerald"
                  >
                    <p class="component-name">
                      {{ item.name || '母零件' }}
                    </p>

                    <p class="component-meta">數量：{{ item.componentCount || '-' }}</p>

                    <p class="component-meta">
                      型號：{{ item.componentDetails?.brandModel || '-' }}
                    </p>

                    <p class="component-meta">
                      規格：{{ item.componentDetails?.brandSpec || '-' }}
                    </p>
                  </article>
                </div>
              </div>

              <div v-if="dialogData.removedComponents?.length">
                <div class="sub-title">
                  <ArrowBigDown class="h-5 w-5 text-rose-600" />
                  <span>換下零件</span>
                </div>

                <div class="component-grid">
                  <article
                    v-for="(item, index) in dialogData.removedComponents"
                    :key="'removed-' + index"
                    class="component-card component-card-rose"
                  >
                    <p class="component-name">
                      {{ item.name || '母零件' }}
                    </p>

                    <p class="component-meta">數量：{{ item.componentCount || '-' }}</p>

                    <p class="component-meta">
                      型號：{{ item.componentDetails?.brandModel || '-' }}
                    </p>

                    <p class="component-meta">
                      規格：{{ item.componentDetails?.brandSpec || '-' }}
                    </p>
                  </article>
                </div>
              </div>
            </div>

            <div v-else class="empty-state">無零件更換紀錄</div>
          </section>

          <!-- Equipment -->
          <section class="content-card">
            <div class="card-title">
              <Pickaxe class="card-title-icon" />
              <h3>特殊機具</h3>
            </div>

            <p class="rounded-xl border border-slate-200 bg-slate-50 p-4 text-2xl text-slate-800">
              {{ dialogData.equipment || '無特殊機具' }}
            </p>
          </section>

          <!-- Supplements -->
          <section v-if="dialogData?.supplements?.length" class="content-card">
            <div class="card-title">
              <LucidePaperclip class="card-title-icon" />
              <h3>補件紀錄</h3>
            </div>

            <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <article
                v-for="(supplement, index) in dialogData.supplements"
                :key="'supplement-card-' + index"
                class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div class="mb-3 flex items-center justify-between gap-3">
                  <h4 class="text-lg font-bold text-slate-900">補件 #{{ index + 1 }}</h4>

                  <span class="badge badge-slate">
                    {{ formatDate(supplement.createAt) }}
                  </span>
                </div>

                <div class="detail-list">
                  <div class="detail-row">
                    <span class="detail-label">故障分類</span>
                    <span class="detail-value link-like">
                      {{ supplement.failureCategory || '無' }}
                    </span>
                  </div>

                  <div class="detail-row items-start">
                    <span class="detail-label">故障詳情</span>
                    <span class="detail-value whitespace-pre-wrap break-words">
                      {{ supplement.failureCause || '無' }}
                    </span>
                  </div>

                  <div class="detail-row items-start">
                    <span class="detail-label">特殊機具</span>
                    <span class="detail-value whitespace-pre-wrap break-words">
                      {{ supplement.equipment || '無' }}
                    </span>
                  </div>

                  <div class="detail-row items-start">
                    <span class="detail-label">維護內容</span>
                    <span class="detail-value whitespace-pre-wrap break-words">
                      {{ supplement.note || '無' }}
                    </span>
                  </div>
                </div>
              </article>
            </div>
          </section>
        </div>
      </main>

      <!-- Attachment Footer -->
      <section
        v-if="hasAttachments"
        class="shrink-0 border-t border-slate-200 bg-white px-4 py-4 sm:px-6"
      >
        <div class="mb-3 flex items-center gap-2">
          <LucidePaperclip class="h-5 w-5 text-slate-600" />
          <h3 class="text-lg font-bold text-slate-900 sm:text-xl">附件</h3>
        </div>

        <div class="flex gap-4 overflow-x-auto pb-2">
          <!-- Main Attachments -->
          <template v-for="attachment in dialogData.attachments" :key="'att-' + attachment.id">
            <button
              v-if="attachment.type === 1 && attachment.url"
              type="button"
              class="attachment-image-card"
              @mouseenter="hoveredAttachment = attachment"
              @mouseleave="hoveredAttachment = null"
              @click="openAttachmentModal(attachment.id, attachment.fileKey || '', true)"
            >
              <img
                :src="downloadAttachmentImage(attachment.id, attachment.fileKey || '', '1x')"
                class="h-full w-full object-cover transition-transform duration-200 hover:scale-105"
                alt="附件預覽圖片"
              />

              <span class="attachment-overlay">
                <Search class="h-6 w-6" />
              </span>
            </button>

            <button
              v-else-if="attachment.type === 0"
              type="button"
              class="attachment-file-card"
              @click.stop="openAttachmentFile(attachment.id, attachment.fileKey!)"
            >
              <LucideDownload class="h-5 w-5" />
              <span>下載附件</span>
            </button>
          </template>

          <!-- Supplement Attachments -->
          <template v-for="(supplement, sIndex) in dialogData.supplements" :key="'supp-' + sIndex">
            <div
              v-if="supplement.attachments?.length"
              class="flex min-w-max items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
            >
              <span class="whitespace-nowrap text-base font-bold text-slate-700">
                補件 #{{ sIndex + 1 }}
              </span>

              <template
                v-for="attachment in supplement.attachments"
                :key="'supp-att-' + attachment.id"
              >
                <button
                  v-if="attachment.type === 1 && attachment.url"
                  type="button"
                  class="attachment-image-card"
                  @mouseenter="hoveredAttachment = attachment"
                  @mouseleave="hoveredAttachment = null"
                  @click="openAttachmentModal(attachment.id, attachment.fileKey || '', true)"
                >
                  <img
                    :src="downloadAttachmentImage(attachment.id, attachment.fileKey || '', '1x')"
                    class="h-full w-full object-cover transition-transform duration-200 hover:scale-105"
                    alt="補件附件預覽圖片"
                  />

                  <span class="attachment-overlay">
                    <LucideImage class="h-6 w-6" />
                  </span>
                </button>

                <button
                  v-else-if="attachment.type === 0"
                  type="button"
                  class="attachment-file-card"
                  @click.stop="openAttachmentFile(attachment.id, attachment.fileKey!)"
                >
                  <LucideDownload class="h-5 w-5" />
                  <span>下載</span>
                </button>
              </template>
            </div>
          </template>
        </div>
      </section>
    </div>

    <!-- Loading -->
    <div v-else class="flex items-center gap-3 rounded-2xl bg-white px-6 py-5 shadow-xl">
      <svg class="h-7 w-7 animate-spin text-slate-700" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>

      <span class="text-lg font-semibold text-slate-700"> 載入中... </span>
    </div>

    <!-- Hover Image Preview -->
    <div
      v-if="hoveredAttachment && previewUrl"
      class="pointer-events-none fixed inset-0 z-[9999] hidden items-start justify-center pt-5 xl:flex"
    >
      <img
        :src="previewUrl"
        class="max-h-[82vh] max-w-[82vw] rounded-2xl bg-white object-contain shadow-2xl ring-1 ring-slate-200"
        alt="圖片放大預覽"
      />
    </div>
  </div>
</template>

<style scoped>
.info-tile {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  background-color: #f8fafc;
  padding: 0.75rem 1rem;
}

.info-icon {
  display: flex;
  width: 2.5rem;
  height: 2.5rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  background-color: #0f172a;
  color: #ffffff;
}

.info-label {
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.25rem;
  color: #64748b;
}

.info-value {
  margin-top: 0.125rem;
  overflow-wrap: break-word;
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.5rem;
  color: #020617;
}

.info-sub-value {
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.5rem;
  color: #334155;
}

.info-mobile-sub-value {
  margin-top: 0.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25rem;
  color: #64748b;
}

.link-like {
  color: #1d4ed8;
  text-underline-offset: 4px;
}

.link-like:hover {
  text-decoration: underline;
}

.content-card {
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  background-color: #ffffff;
  padding: 1rem;
  box-shadow: 0 1px 2px rgb(15 23 42 / 0.05);
}

.card-title {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
}

.card-title-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #334155;
}

.detail-list {
  border-top: 0 solid transparent;
}

.detail-list > * + * {
  border-top: 1px solid #f1f5f9;
}

.detail-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.25rem;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

.detail-label {
  font-size: 0.875rem;
  font-weight: 700;
  color: #64748b;
}

.detail-value {
  min-width: 0;
  overflow-wrap: break-word;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.75rem;
  color: #0f172a;
}

.emphasize {
  font-size: 1.25rem;
  font-weight: 500;
  color: #020617;
}

.badge {
  display: inline-flex;
  align-items: center;
  border-radius: 9999px;
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 700;
  box-shadow: inset 0 0 0 1px currentColor;
}

.badge-orange {
  background-color: #fff7ed;
  color: #c2410c;
  box-shadow: inset 0 0 0 1px #fed7aa;
}

.badge-red {
  background-color: #fff1f2;
  color: #be123c;
  box-shadow: inset 0 0 0 1px #fecdd3;
}

.badge-green {
  background-color: #ecfdf5;
  color: #047857;
  box-shadow: inset 0 0 0 1px #a7f3d0;
}

.badge-slate {
  background-color: #f1f5f9;
  color: #334155;
  box-shadow: inset 0 0 0 1px #e2e8f0;
}

.sub-title {
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
}

.component-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

.component-card {
  border-left-width: 4px;
  border-radius: 1rem;
  background-color: #f8fafc;
  padding: 1rem;
  box-shadow:
    0 1px 2px rgb(15 23 42 / 0.05),
    inset 0 0 0 1px #e2e8f0;
}

.component-card-amber {
  border-left-color: #fbbf24;
}

.component-card-emerald {
  border-left-color: #34d399;
}

.component-card-rose {
  border-left-color: #fb7185;
}

.component-name {
  margin-bottom: 0.5rem;
  overflow-wrap: break-word;
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.75rem;
  color: #020617;
}

.component-meta {
  overflow-wrap: break-word;
  font-size: 1rem;
  line-height: 1.75rem;
  color: #334155;
}

.empty-state {
  border: 1px dashed #cbd5e1;
  border-radius: 1rem;
  background-color: #f8fafc;
  padding: 2rem 1rem;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  color: #64748b;
}

.prose-content :deep(p) {
  margin-bottom: 0.5rem;
}

.prose-content :deep(br) {
  line-height: 1.8;
}

.attachment-image-card {
  position: relative;
  height: 5rem;
  width: 5rem;
  flex-shrink: 0;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  background-color: #f1f5f9;
  box-shadow: 0 1px 2px rgb(15 23 42 / 0.05);
  transition: box-shadow 0.2s ease;
}

.attachment-image-card:hover {
  box-shadow: 0 4px 10px rgb(15 23 42 / 0.12);
}

.attachment-image-card:focus {
  outline: 2px solid #0ea5e9;
  outline-offset: 2px;
}

.attachment-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(2 6 23 / 0);
  color: #ffffff;
  opacity: 0;
  transition:
    opacity 0.2s ease,
    background-color 0.2s ease;
}

.attachment-overlay:hover {
  background-color: rgb(2 6 23 / 0.4);
  opacity: 1;
}

.attachment-file-card {
  display: flex;
  height: 5rem;
  min-width: 112px;
  flex-shrink: 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  background-color: #0f172a;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-weight: 700;
  color: #ffffff;
  box-shadow: 0 1px 2px rgb(15 23 42 / 0.05);
  transition: background-color 0.2s ease;
}

.attachment-file-card:hover {
  background-color: #1e293b;
}

.attachment-file-card:focus {
  outline: 2px solid #0ea5e9;
  outline-offset: 2px;
}

/* Scrollbar */
main::-webkit-scrollbar,
.overflow-x-auto::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

main::-webkit-scrollbar-thumb,
.overflow-x-auto::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background-color: #cbd5e1;
}

main::-webkit-scrollbar-track,
.overflow-x-auto::-webkit-scrollbar-track {
  background-color: #f8fafc;
}

@media (min-width: 640px) {
  .info-value {
    font-size: 1.25rem;
    line-height: 1.75rem;
  }

  .content-card {
    padding: 1.25rem;
  }

  .detail-row {
    grid-template-columns: 116px 1fr;
    gap: 1rem;
  }

  .detail-label {
    font-size: 1rem;
  }

  .detail-value {
    font-size: 1.125rem;
  }

  .emphasize {
    font-size: 1.5rem;
  }

  .sub-title {
    font-size: 1.125rem;
  }

  .attachment-image-card {
    height: 6rem;
    width: 6rem;
  }

  .attachment-file-card {
    height: 6rem;
  }
}

@media (min-width: 768px) {
  .component-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1280px) {
  .component-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .content-card {
    border-radius: 1rem;
  }

  .detail-row {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
  }
}
</style>
