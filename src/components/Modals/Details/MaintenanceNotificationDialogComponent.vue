<script setup lang="ts">
import { computed } from 'vue';
import {
  LucideX,
  LucideMessageSquare,
  LucideAlertTriangle,
  LucideClipboardList,
  LucideImage,
  LucideFile,
  LucideExternalLink
} from 'lucide-vue-next';
import type { MachineComponentSlotMaintenance } from '@/types/MachineComponentSlotMaintenance';
import { downloadAttachmentImage, downloadAttachmentFile } from '@/api/services/attachment';

type RelatedNotificationComment = {
  id?: number;
  message?: string;
  createAt?: string;

  authorStaffID?: number;
  submittedStaffID?: number;
  staffID?: number;
  creatorStaffID?: number;
  createdStaffID?: number;
  userID?: number;

  authorName?: string;
};

type AttachmentLike = {
  id: string | number;
  type: number;
  fileKey?: string;
  url?: string;
  name?: string;
  filename?: string;
  contentType?: string;
  mimeType?: string;
};

type RelatedNotification = {
  id: number;
  number: string;
  createAt?: string;
  status?: number;
  summary?: string;
  commentCount?: number;
  attachments?: AttachmentLike[];
  details?: {
    anomaly?: {
      malfunctionAt?: string;
      failureCategory?: string;
      failureCause?: string;
      urgencyLevel?: number;
      shutdown?: boolean;
    };
    upkeep?: {
      scheduledAt?: string;
      upkeepCategory?: string;
      upkeepExplain?: string;
    };
  };
  comments?: RelatedNotificationComment[];
};

const props = defineProps<{
  dialogVisible: boolean;
  isDialogLoading: boolean;
  maintenanceData: (MachineComponentSlotMaintenance & Record<string, any>) | null;
  relatedNotifications: RelatedNotification[];
  formatDate: (dateStr: string | number | Date) => string;
}>();

const emit = defineEmits<{
  (event: 'close'): void;
}>();

const maintenanceNumber = computed(() => {
  return props.maintenanceData?.number || `#${props.maintenanceData?.id ?? '-'}`;
});

const hasNotifications = computed(() => props.relatedNotifications.length > 0);

function closeDialog() {
  emit('close');
}

function notificationCategory(notification: RelatedNotification) {
  return (
    notification.details?.anomaly?.failureCategory ||
    notification.details?.upkeep?.upkeepCategory ||
    '-'
  );
}

function notificationTime(notification: RelatedNotification) {
  return (
    notification.details?.anomaly?.malfunctionAt || notification.details?.upkeep?.scheduledAt || ''
  );
}

function notificationCause(notification: RelatedNotification) {
  return (
    notification.details?.anomaly?.failureCause ||
    notification.details?.upkeep?.upkeepExplain ||
    '未填寫'
  );
}

function notificationAttachments(notification: RelatedNotification) {
  return Array.isArray(notification.attachments) ? notification.attachments : [];
}

function isImageAttachment(attachment: AttachmentLike) {
  const type = Number(attachment.type);
  const contentType = String(attachment.contentType ?? attachment.mimeType ?? '');
  const filename = String(attachment.name ?? attachment.filename ?? '');

  return (
    type === 1 ||
    contentType.startsWith('image/') ||
    /\.(png|jpg|jpeg|webp|gif|bmp|svg)$/i.test(filename)
  );
}

function attachmentLabel(attachment: AttachmentLike) {
  return attachment.name || attachment.filename || `附件 ${attachment.id}`;
}

function attachmentUrl(
  attachment: AttachmentLike,
  imageResolution: '1x' | '2x' | '3x' | 'original' = '2x'
) {
  if (attachment.url) return attachment.url;

  if (attachment.fileKey && isImageAttachment(attachment)) {
    return downloadAttachmentImage(String(attachment.id), attachment.fileKey, imageResolution);
  }

  if (attachment.fileKey) {
    return downloadAttachmentFile(String(attachment.id), attachment.fileKey);
  }

  return '';
}
</script>

<template>
  <div
    v-if="dialogVisible"
    class="fixed inset-0 z-[95] flex items-center justify-center bg-slate-950/75 p-4"
    @keydown.esc="closeDialog"
  >
    <div
      class="flex h-[88vh] w-full max-w-[1100px] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200"
    >
      <!-- Header -->
      <header class="shrink-0 border-b border-slate-200 bg-white px-5 py-4">
        <div class="flex items-start justify-between gap-4">
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <span
                class="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 ring-1 ring-indigo-200"
              >
                <LucideClipboardList class="h-3.5 w-3.5" />
                前身通報單
              </span>

              <h2 class="truncate text-xl font-bold text-slate-900">
                {{ maintenanceNumber }}
              </h2>
            </div>

            <div class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
              <span>維護單 ID：{{ maintenanceData?.id || '-' }}</span>
              <span>維護單號：{{ maintenanceData?.number || '-' }}</span>
              <span>關聯通報：{{ relatedNotifications.length }} 筆</span>
            </div>
          </div>

          <button
            type="button"
            class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:bg-slate-50 active:scale-[0.98]"
            @click="closeDialog"
          >
            <LucideX class="h-5 w-5 text-slate-600" />
          </button>
        </div>
      </header>

      <!-- Loading -->
      <div v-if="isDialogLoading" class="grid flex-1 place-items-center bg-slate-50">
        <div class="flex items-center gap-3 rounded-3xl bg-white px-6 py-5 shadow-sm">
          <span
            class="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-700"
          />
          <span class="text-base font-semibold text-slate-700">載入通報單中...</span>
        </div>
      </div>

      <!-- Body -->
      <main v-else class="min-h-0 flex-1 overflow-y-auto bg-slate-50 p-5">
        <div
          v-if="!hasNotifications"
          class="grid min-h-[360px] place-items-center rounded-3xl border border-dashed border-slate-300 bg-white text-center"
        >
          <div>
            <LucideMessageSquare class="mx-auto h-12 w-12 text-slate-400" />
            <div class="mt-3 text-base font-bold text-slate-700">此維護單沒有關聯前身通報單</div>
            <div class="mt-1 text-sm text-slate-500">
              machineComponentSlotNotificationIDs 為空或查無資料。
            </div>
          </div>
        </div>

        <div v-else class="space-y-3">
          <article
            v-for="notification in relatedNotifications"
            :key="notification.id"
            class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
          >
            <!-- 通報單標題區 -->
            <div class="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <div class="truncate text-base font-bold text-indigo-700">
                    {{ notification.number || `#${notification.id}` }}
                  </div>

                  <span
                    class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600"
                  >
                    ID {{ notification.id }}
                  </span>

                  <span
                    v-if="notification.commentCount != null"
                    class="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700"
                  >
                    留言 {{ notification.commentCount }}
                  </span>
                </div>

                <div class="mt-1 text-sm text-slate-500">
                  建立時間：{{ formatDate(notification.createAt || '') }}
                </div>
              </div>
            </div>

            <!-- 通報單內容：永遠展開 -->
            <div class="space-y-4 border-t border-slate-100 p-4">
              <!-- 故障說明 -->
              <section class="rounded-3xl border border-rose-100 bg-rose-50 p-4">
                <div class="flex items-center gap-2">
                  <LucideAlertTriangle class="h-5 w-5 text-rose-700" />
                  <div class="text-sm font-bold text-rose-800">故障說明</div>
                </div>

                <div class="mt-3 grid grid-cols-1 gap-2 text-sm text-slate-700 md:grid-cols-3">
                  <div>
                    分類：
                    <span class="font-bold text-slate-900">
                      {{ notificationCategory(notification) }}
                    </span>
                  </div>

                  <div>
                    發生時間：
                    <span class="font-bold text-slate-900">
                      {{ formatDate(notificationTime(notification)) }}
                    </span>
                  </div>

                  <div>
                    停機：
                    <span class="font-bold text-slate-900">
                      {{ notification.details?.anomaly?.shutdown ? 'Y' : 'N' }}
                    </span>
                  </div>
                </div>

                <div class="mt-3 whitespace-pre-line text-sm leading-7 text-slate-800">
                  {{ notificationCause(notification) }}
                </div>
              </section>

              <!-- 通報附件 -->
              <section class="rounded-3xl border border-slate-200 bg-white p-4">
                <div class="flex items-center justify-between gap-2">
                  <div class="flex items-center gap-2">
                    <LucideImage class="h-5 w-5 text-slate-700" />
                    <div class="text-sm font-bold text-slate-900">通報附件</div>
                  </div>

                  <div class="text-xs font-semibold text-slate-500">
                    {{ notificationAttachments(notification).length }} 個
                  </div>
                </div>

                <div
                  v-if="notificationAttachments(notification).length"
                  class="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3"
                >
                  <template
                    v-for="attachment in notificationAttachments(notification)"
                    :key="`${attachment.id}-${attachment.type}`"
                  >
                    <a
                      v-if="isImageAttachment(attachment) && attachmentUrl(attachment)"
                      :href="attachmentUrl(attachment, 'original')"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="group overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 transition hover:border-indigo-200 hover:bg-indigo-50"
                    >
                      <img
                        :src="attachmentUrl(attachment, '2x')"
                        class="h-40 w-full bg-white object-cover transition group-hover:scale-[1.02]"
                        alt="通報附件圖片"
                        loading="lazy"
                        decoding="async"
                      />

                      <div
                        class="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-slate-600"
                      >
                        <LucideExternalLink class="h-3.5 w-3.5 shrink-0" />
                        <span class="truncate">{{ attachmentLabel(attachment) }}</span>
                      </div>
                    </a>

                    <a
                      v-else-if="attachmentUrl(attachment)"
                      :href="attachmentUrl(attachment, 'original')"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="flex min-h-40 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center transition hover:border-indigo-200 hover:bg-indigo-50"
                    >
                      <LucideFile class="h-8 w-8 text-slate-500" />
                      <div class="mt-2 line-clamp-2 text-xs font-semibold text-slate-700">
                        {{ attachmentLabel(attachment) }}
                      </div>
                      <div class="mt-1 text-[11px] text-slate-400">點擊開啟</div>
                    </a>

                    <div
                      v-else
                      class="flex min-h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center"
                    >
                      <LucideFile class="h-8 w-8 text-slate-400" />
                      <div class="mt-2 text-xs font-semibold text-slate-500">附件無法預覽</div>
                      <div class="mt-1 max-w-full truncate text-[11px] text-slate-400">
                        {{ attachmentLabel(attachment) }}
                      </div>
                    </div>
                  </template>
                </div>

                <div
                  v-else
                  class="mt-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500"
                >
                  此通報單無附件
                </div>
              </section>

              <!-- 留言內容 -->
              <section class="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div class="flex items-center justify-between gap-2">
                  <div class="flex items-center gap-2">
                    <LucideMessageSquare class="h-5 w-5 text-slate-700" />
                    <div class="text-sm font-bold text-slate-900">留言內容</div>
                  </div>

                  <div class="text-xs font-semibold text-slate-500">
                    {{ notification.comments?.length || 0 }} 則
                  </div>
                </div>

                <div
                  v-if="notification.comments?.length"
                  class="mt-3 max-h-[260px] space-y-2 overflow-y-auto pr-1"
                >
                  <div
                    v-for="comment in notification.comments"
                    :key="comment.id"
                    class="rounded-2xl border border-slate-200 bg-white p-3"
                  >
                    <div class="text-xs text-slate-500">
                      {{ formatDate(comment.createAt || '') }}
                      <span> ｜留言人：{{ comment.authorName || '未知' }} </span>
                    </div>

                    <div class="mt-2 whitespace-pre-line text-sm leading-6 text-slate-800">
                      {{ comment.message || '-' }}
                    </div>
                  </div>
                </div>

                <div
                  v-else
                  class="mt-3 rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500"
                >
                  尚無留言內容
                </div>
              </section>

              <!-- 摘要 -->
              <section
                v-if="notification.summary"
                class="rounded-3xl border border-amber-100 bg-amber-50 p-4"
              >
                <div class="text-sm font-bold text-amber-800">摘要 / 結案說明</div>
                <div class="mt-3 whitespace-pre-line text-sm leading-7 text-slate-800">
                  {{ notification.summary }}
                </div>
              </section>
            </div>
          </article>
        </div>
      </main>
    </div>
  </div>
</template>
