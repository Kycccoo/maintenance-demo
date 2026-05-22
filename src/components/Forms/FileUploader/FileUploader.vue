<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { Attachment } from '@/types/Attachment';
import { AttachmentAPI } from '@/api';
import { useToast } from 'vue-toast-notification';
import { GlobalToastProps } from '@/types/Toast';

const $toast = useToast(GlobalToastProps);

const props = defineProps<{
  modelValue: Attachment[];
  uploading?: boolean;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', attachments: Attachment[]): void;
  (event: 'update:uploading', uploading: boolean): void;
}>();

const files = ref<File[]>([]);
const uploadingFiles = ref<File[]>([]);
const uploadedAttachments = ref<Attachment[]>([]);
const responses = ref<string[]>([]);
const fileInput = ref<HTMLInputElement | null>(null);
const isUploading = ref(false);

const uploadingState = computed(() => {
  return isUploading.value || uploadingFiles.value.length > 0;
});

function fileIdentity(file: File) {
  return `${file.name}__${file.size}__${file.lastModified}`;
}

function isSameFile(a: File, b: File) {
  return fileIdentity(a) === fileIdentity(b);
}

const openFilePicker = () => {
  if (!fileInput.value) return;
  clearNativeFileInput();
  fileInput.value.click();
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files?.length) return;

  const newFiles = Array.from(target.files);

  const uniqueNewFiles = newFiles.filter((newFile) => {
    const existsInQueue = files.value.some((existingFile) => isSameFile(existingFile, newFile));
    const existsInUploading = uploadingFiles.value.some((existingFile) =>
      isSameFile(existingFile, newFile)
    );
    const existsInUploaded = uploadedAttachments.value.some((attachment) => {
      return attachment.file ? isSameFile(attachment.file, newFile) : false;
    });

    return !existsInQueue && !existsInUploading && !existsInUploaded;
  });

  if (!uniqueNewFiles.length) {
    clearNativeFileInput();
    return;
  }

  files.value = [...files.value, ...uniqueNewFiles];
  uploadFiles();
};

const clearNativeFileInput = () => {
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const removeQueuedFile = (file: File) => {
  files.value = files.value.filter((f) => !isSameFile(f, file));
};

const removeUploadedAttachment = (attachment: Attachment) => {
  uploadedAttachments.value = uploadedAttachments.value.filter((a) => {
    if (a.id !== attachment.id) return true;

    const aFileId = a.file ? fileIdentity(a.file) : '';
    const targetFileId = attachment.file ? fileIdentity(attachment.file) : '';

    if (aFileId && targetFileId) {
      return aFileId !== targetFileId;
    }

    return false;
  });
};

const uploadFiles = async () => {
  if (isUploading.value || files.value.length === 0) return;

  isUploading.value = true;

  try {
    while (files.value.length > 0) {
      const file = files.value[0];

      try {
        if (isLargeFile(file)) {
          responses.value.push(`${file.name} - 檔案過大無法上傳`);
          $toast.error(file.name + ': 檔案過大無法上傳');
          continue;
        }

        uploadingFiles.value.push(file);

        const response = await AttachmentAPI.uploadFile(file, 1228, 922);

        uploadedAttachments.value.push({
          id: response.data.id,
          type: response.data.type,
          file
        } as Attachment);

        $toast.success(file.name + ': 上傳成功');
      } catch (error: unknown) {
        console.error(error);
        $toast.error(file.name + ': 上傳失敗');

        if (error instanceof Error) {
          responses.value.push(`${file.name} - ${error.message}`);
        } else {
          responses.value.push(file.name + ' - 檔案上傳失敗');
        }
      } finally {
        files.value = files.value.filter((f) => !isSameFile(f, file));
        uploadingFiles.value = uploadingFiles.value.filter((f) => !isSameFile(f, file));
      }
    }
  } finally {
    isUploading.value = false;
    clearNativeFileInput();
  }
};

const formatFileSize = (size: number): string => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
};

const isLargeFile = (file: File): boolean => {
  return file.size > 25 * 1024 * 1024;
};

const isImage = (file: File): boolean => {
  return file.type.startsWith('image/');
};

const attachmentPreview = (attachment: Attachment): string | undefined => {
  if (attachment.file) return filePreview(attachment.file);
  if (attachment.url) return attachment.url;
  return undefined;
};

const filePreview = (file: File): string => {
  return URL.createObjectURL(file);
};

watch(
  uploadingState,
  (value) => {
    emit('update:uploading', value);
  },
  { immediate: true }
);

watch(
  uploadedAttachments,
  (newAttachments) => {
    emit('update:modelValue', newAttachments);
  },
  { deep: true }
);

watch(
  () => props.modelValue,
  (newValue) => {
    uploadedAttachments.value = newValue ?? [];
  },
  { deep: true, immediate: true }
);
</script>

<template>
  <div class="w-full min-w-0 max-w-full overflow-hidden">
    <label class="mb-2.5 block text-base font-semibold text-slate-900"> 檔案上傳 </label>

    <!-- picker -->
    <div class="flex min-w-0 max-w-full flex-col gap-2 sm:flex-row">
      <input
        :placeholder="`請選擇複數照片或檔案 ${files.length ? '(' + files.length + ')' : ''}`"
        class="block w-full min-w-0 max-w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
        readonly
        @click="openFilePicker"
      />

      <input ref="fileInput" type="file" multiple class="hidden" @change="handleFileChange" />

      <button
        type="button"
        class="w-full shrink-0 rounded-xl border border-primary bg-primary px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-opacity-90 sm:w-auto"
        @click="openFilePicker"
      >
        選擇檔案
      </button>
    </div>

    <div v-if="uploadingState" class="mt-2 text-sm font-medium text-amber-600">
      檔案上傳中，請等待全部完成後再送出
    </div>

    <!-- queue list -->
    <div class="mt-3 flex min-w-0 flex-col gap-2">
      <div
        v-for="(file, index) in files"
        :key="`${file.name}-${file.size}-${file.lastModified}-${index}`"
        class="w-full min-w-0 max-w-full rounded-xl border border-slate-200 p-3 opacity-70"
      >
        <div class="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex min-w-0 items-center gap-3">
            <img
              v-if="isImage(file)"
              :src="filePreview(file)"
              alt="Preview"
              class="h-12 w-12 shrink-0 rounded object-cover"
            />

            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="h-12 w-12 shrink-0 text-gray-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M8 16a1 1 0 001 1h6a1 1 0 001-1V9a1 1 0 00-.293-.707l-6-6A1 1 0 008 2H4a1 1 0 00-1 1v12a1 1 0 001 1h4zm2-12.414L14.414 8H10V3.586z"
              />
            </svg>

            <div class="min-w-0 flex-1">
              <div class="truncate text-sm font-medium text-slate-800" :title="file.name">
                {{ file.name }}
              </div>
              <div class="mt-0.5 text-xs text-gray-500">
                {{ formatFileSize(file.size) }}
              </div>

              <div class="mt-1 text-xs">
                <span v-if="isLargeFile(file)" class="text-rose-600">檔案過大無法上傳</span>
                <span
                  v-else-if="uploadingFiles.find((f) => isSameFile(f, file))"
                  class="text-green-600"
                >
                  上傳中
                </span>
                <span v-else class="text-rose-600">未上傳</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            class="w-full shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 sm:w-auto"
            @click="removeQueuedFile(file)"
          >
            清除 ✕
          </button>
        </div>
      </div>
    </div>

    <!-- uploaded list -->
    <div class="mt-3 flex min-w-0 flex-col gap-2">
      <div
        v-for="(attachment, index) in uploadedAttachments"
        :key="`${attachment.id}-${index}`"
        class="w-full min-w-0 max-w-full"
      >
        <div class="flex min-w-0 max-w-full flex-col gap-2 sm:flex-row">
          <div
            class="flex min-w-0 flex-1 items-center gap-3 rounded-xl border-2 border-green-600 bg-[#EFFDF4] p-3"
          >
            <img
              v-if="
                (attachment.file && isImage(attachment.file)) ||
                (attachment.url && attachment.type == 1)
              "
              :src="attachmentPreview(attachment)"
              alt="Preview"
              class="h-12 w-12 shrink-0 rounded object-cover"
            />

            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="h-12 w-12 shrink-0 text-gray-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M8 16a1 1 0 001 1h6a1 1 0 001-1V9a1 1 0 00-.293-.707l-6-6A1 1 0 008 2H4a1 1 0 00-1 1v12a1 1 0 001 1h4zm2-12.414L14.414 8H10V3.586z"
              />
            </svg>

            <div class="min-w-0 flex-1">
              <div
                class="truncate font-medium text-slate-800"
                :title="attachment.file?.name ?? attachment.name ?? '附件 #' + attachment.id"
              >
                {{ attachment.file?.name ?? attachment.name ?? '附件 #' + attachment.id }}
              </div>

              <div v-if="attachment.file?.size" class="mt-0.5 text-sm text-gray-500">
                {{ formatFileSize(attachment.file.size) }}
              </div>

              <div class="mt-1 text-sm text-green-700">已上傳</div>
            </div>
          </div>

          <button
            type="button"
            class="w-full shrink-0 rounded-xl border border-primary bg-primary px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-opacity-90 sm:w-auto"
            @click="removeUploadedAttachment(attachment)"
          >
            清除 ✕
          </button>
        </div>
      </div>
    </div>

    <!-- response -->
    <div v-if="responses.length" class="mt-4 min-w-0">
      <ul class="list-inside list-disc space-y-1 break-all text-sm text-slate-600">
        <li v-for="(response, index) in responses" :key="index">
          {{ response }}
        </li>
      </ul>
    </div>
  </div>
</template>
