<script setup lang="ts">
import { ref, watch, reactive, defineAsyncComponent } from 'vue';
import {
  LucideCheckCircle,
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
  LucideArrowDown,
  LucideDownload
} from 'lucide-vue-next';
import type {
  MachineComponentSlotMaintenance,
  Supplements,
  Attachment
} from '@/types/MachineComponentSlotMaintenance';
import { useToast } from 'vue-toast-notification';
import { useMachineComponentSlotMaintenanceStore } from '@/stores/machineComponentSlotMaintenance';
const FileUploader = defineAsyncComponent(
  () => import('@/components/Forms/FileUploader/FileUploader.vue')
);
const $toast = useToast();
const store = useMachineComponentSlotMaintenanceStore();

const props = defineProps<{
  dialogVisibleUpdate: boolean;
  dialogData: MachineComponentSlotMaintenance;
  isDialogLoading: boolean;
  formatDate: (dateStr: string | number | Date) => string;
}>();

const supplementsData = reactive<Supplements>({
  createAt: new Date(),
  failureCause: '',
  note: '',
  equipment: '',
  attachments: [] as Attachment[]
});

const emits = defineEmits<{
  (event: 'close'): void;
}>();

const hoveredImage = ref<string | null>(null);

const closeDialog = () => emits('close');

const openAttachmentModal = (index: number): void => {
  const attachment = props.dialogData.attachments?.[index];
  if (attachment?.url) {
    window.open(attachment.url, '_blank');
  }
};

const handleCreate = async () => {
  // if (!store.maintenance.staffID) {
  //   createError.value.staff = '負責人是必填欄位';
  // }

  // if (createError.value.staff) {
  //   $toast.error('請選擇負責人');
  //   return;
  // }

  // createError.value.failureCause = '';
  // createError.value.maintainer = '';
  // createError.value.equipment = '';
  // createError.value.note = '';
  // createError.value.malfunctionAt = '';
  // createError.value.finishAt = '';
  // createError.value.number = '';
  // createError.value.staff = '';
  // createError.value.createAt = '';
  // createError.value.general = '';

  const formsId = props.dialogData.id;
  if (
    supplementsData.failureCause == '' &&
    supplementsData.note == '' &&
    supplementsData.equipment == '' &&
    supplementsData.attachments.length === 0
  ) {
    $toast.error('請填寫故障說明、維護內容、特殊機具');
    return;
  }

  await store.createSupplements(supplementsData, formsId);
  store.resetMaintenance();
  $toast.success('新增維護單成功');
  closeDialog();
  // try {
  //   createError.value = structuredClone(initCreateError);
  //   router.push('/maintenance-form/thanks');
  // } catch (error: unknown) {
  //   $toast.error('新增維護單失敗');
  //   if (!(error instanceof AxiosError)) {
  //     useErrorStore().setUnknownError();
  //     return;
  //   }
  //   if (error.response?.data?.errors) {
  //     const errorCodes = error.response.data.errors;
  //     if (!Array.isArray(errorCodes)) {
  //       useErrorStore().setUnknownError();
  //       return;
  //     }

  //     errorCodes.forEach((code) => {
  //       if (
  //         [
  //           AddMachineComponentSlotMaintenanceFormPostError.BodyFailureCauseType,
  //           AddMachineComponentSlotMaintenanceFormPostError.BodyFailureCauseMaxLength
  //         ].includes(code)
  //       ) {
  //         createError.value.failureCause =
  //           addMachineComponentSlotMaintenanceFormPostErrorMessageMap[code];
  //       } else if (
  //         [
  //           AddMachineComponentSlotMaintenanceFormPostError.BodyMaintainerType,
  //           AddMachineComponentSlotMaintenanceFormPostError.BodyMaintainerMaxLength
  //         ].includes(code)
  //       ) {
  //         createError.value.maintainer =
  //           addMachineComponentSlotMaintenanceFormPostErrorMessageMap[code];
  //       } else if (
  //         [
  //           AddMachineComponentSlotMaintenanceFormPostError.BodyEquipmentType,
  //           AddMachineComponentSlotMaintenanceFormPostError.BodyEquipmentMaxLength
  //         ].includes(code)
  //       ) {
  //         createError.value.equipment =
  //           addMachineComponentSlotMaintenanceFormPostErrorMessageMap[code];
  //       } else if (
  //         [
  //           AddMachineComponentSlotMaintenanceFormPostError.BodyNoteRequired,
  //           AddMachineComponentSlotMaintenanceFormPostError.BodyNoteType,
  //           AddMachineComponentSlotMaintenanceFormPostError.BodyNoteMaxLength
  //         ].includes(code)
  //       ) {
  //         createError.value.note = addMachineComponentSlotMaintenanceFormPostErrorMessageMap[code];
  //       } else if (
  //         [
  //           AddMachineComponentSlotMaintenanceFormPostError.BodyMalfunctionAtType,
  //           AddMachineComponentSlotMaintenanceFormPostError.BodyMalfunctionAtFormat
  //         ].includes(code)
  //       ) {
  //         createError.value.malfunctionAt =
  //           addMachineComponentSlotMaintenanceFormPostErrorMessageMap[code];
  //       } else if (
  //         [
  //           AddMachineComponentSlotMaintenanceFormPostError.BodyFinishAtRequired,
  //           AddMachineComponentSlotMaintenanceFormPostError.BodyFinishAtType,
  //           AddMachineComponentSlotMaintenanceFormPostError.BodyFinishAtFormat
  //         ].includes(code)
  //       ) {
  //         createError.value.finishAt =
  //           addMachineComponentSlotMaintenanceFormPostErrorMessageMap[code];
  //       } else if (
  //         [
  //           AddMachineComponentSlotMaintenanceFormPostError.BodyStaffIDRequired,
  //           AddMachineComponentSlotMaintenanceFormPostError.BodyStaffIDType,
  //           AddMachineComponentSlotMaintenanceFormPostError.BodyStaffIDMinimum
  //         ].includes(code)
  //       ) {
  //         createError.value.staff = addMachineComponentSlotMaintenanceFormPostErrorMessageMap[code];
  //       } else {
  //         createError.value.general =
  //           addMachineComponentSlotMaintenanceFormPostErrorMessageMap[code] || `未知錯誤: ${code}`;
  //       }
  //     });
  //   } else {
  //     createError.value.general = '新增維護單失敗';
  //   }
  // }
};

watch(
  () => props.dialogVisibleUpdate,
  (val) => {
    if (val) {
      setTimeout(() => {
        (document.querySelector('[tabindex="0"]') as HTMLElement)?.focus();
      }, 10);
    }
  }
);
</script>

<template>
  <div
    v-if="dialogVisibleUpdate"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 p-4 backdrop-blur-md z-50"
    tabindex="0"
    @keydown.esc="closeDialog"
  >
    <div
      v-if="!isDialogLoading"
      class="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden transform transition duration-300 flex flex-col"
    >
      <header
        class="bg-orange-500 text-white flex justify-between items-center px-6 py-4 sticky top-0 z-10"
      >
        <h2 class="text-2xl font-semibold flex items-center gap-2">
          <LucidePenTool class="w-5 h-5" />
          維護單資訊 ＿ 補件
        </h2>
        <button
          class="p-2 rounded-full hover:bg-gray-700 transition"
          aria-label="關閉彈窗"
          @click="closeDialog"
        >
          <LucideX class="w-5 h-5" />
        </button>
      </header>

      <div class="p-6 overflow-y-auto flex-1 space-y-8 scrollbar-thin scrollbar-thumb-gray-300">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section
            class="md:col-span-2 bg-yellow-100 p-5 rounded-xl shadow hover:shadow-lg transition-all"
          >
            <div class="flex items-center mb-4">
              <LucidePackage class="w-5 h-5 mr-2 text-gray-600" />
              <h3 class="text-xl font-bold text-gray-800">補件資料</h3>
            </div>
            <p class="text-base text-gray-700 mb-4">
              <span class="font-semibold">故障詳情 - 說明：</span>
              <input
                v-model="supplementsData.failureCause"
                type="text"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="請輸入故障說明"
              />
            </p>
            <p class="text-base text-gray-700 mb-4">
              <span class="font-semibold">特殊機具：</span>
              <input
                v-model="supplementsData.equipment"
                type="text"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="請輸入特殊機具"
              />
            </p>
            <p class="text-base text-gray-700 mb-4">
              <span class="font-semibold">維護內容：</span>
              <input
                v-model="supplementsData.note"
                type="text"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="可填寫補件備註"
              />
            </p>
            <div class="mt-4">
              <FileUploader v-model="supplementsData.attachments" />
            </div>
            <div class="-mx-3 flex flex-wrap gap-y-4 flex-row-reverse">
              <div class="w-full px-3">
                <button
                  v-if="!store.loading"
                  class="block w-full rounded border border-primary bg-primary p-3 text-center font-medium text-white"
                  @click="handleCreate"
                >
                  送出
                </button>
                <button
                  v-else
                  class="w-full rounded border border-primary bg-primary px-3 py-3 flex justify-center text-white opacity-75"
                >
                  <svg class="animate-spin h-5 w-5 mr-3 border-b-2 border-white rounded-full"></svg>
                </button>
              </div>
            </div>
          </section>
          <section class="md:col-span-2">
            <div class="flex justify-center">
              <LucideArrowDown class="w-12 h-12 text-gray-600" />
            </div>
          </section>
          <section class="bg-gray-50 p-5 rounded-xl shadow hover:shadow-lg transition-all">
            <div class="flex items-center mb-4">
              <LucideCalendar class="w-5 h-5 mr-2 text-gray-600" />
              <h3 class="text-xl font-bold text-gray-800">建立時間</h3>
            </div>
            <p class="text-base text-gray-700 mb-1">
              <span class="font-semibold">建立時間：</span>{{ formatDate(dialogData.createAt) }}
            </p>
            <p class="text-base text-gray-700 mb-1">
              <span class="font-semibold">主設備：</span>{{ dialogData.machineName || '-' }}
            </p>
            <p class="text-base text-gray-700">
              <span class="font-semibold">維護零件：</span>{{ dialogData.componentName || '-' }}
            </p>
          </section>

          <section class="bg-gray-50 p-5 rounded-xl shadow hover:shadow-lg transition-all">
            <div class="flex items-center mb-4">
              <LucideUsers class="w-5 h-5 mr-2 text-gray-600" />
              <h3 class="text-xl font-bold text-gray-800">維護過程</h3>
            </div>
            <p class="text-base text-gray-700 mb-1">
              <span class="font-semibold">施工單位：</span>{{ dialogData.maintainer || '-' }}
            </p>
            <p class="text-base text-gray-700 mb-1">
              <span class="font-semibold">總工時：</span
              >{{ dialogData.maintenanceHour || '-' }} 小時
            </p>
            <p class="text-base text-gray-700 mb-1">
              <span class="font-semibold">操作人數：</span>
              {{ dialogData.workerCount || '-' }} 人
            </p>
          </section>
          <section class="bg-gray-50 p-5 rounded-xl shadow hover:shadow-lg transition-all">
            <div class="flex items-center mb-4">
              <LucideAlertTriangle class="w-5 h-5 mr-2 text-gray-600" />
              <h3 class="text-xl font-bold text-gray-800">故障詳情</h3>
            </div>
            <p class="text-base text-gray-700 mb-1">
              <span class="font-semibold">故障時間：</span
              >{{ formatDate(dialogData.malfunctionAt) }}
            </p>
            <div class="grid grid-cols-2 gap-4">
              <p class="text-base text-gray-700">
                <span class="font-semibold">負責人：</span>{{ dialogData.staffName || '-' }}
              </p>
              <p class="text-base text-gray-700">
                <span class="font-semibold">原因：</span>
                {{
                  dialogData.isHumanError == null
                    ? '-'
                    : dialogData.isHumanError
                      ? '人為'
                      : '非人為'
                }}
              </p>
            </div>
            <p class="text-base text-gray-700 mt-2">
              <span class="font-semibold">說明：</span>{{ dialogData.failureCause || '無說明' }}
            </p>
          </section>

          <section class="bg-gray-50 p-5 rounded-xl shadow hover:shadow-lg transition-all">
            <div class="flex items-center mb-4">
              <LucideCheckCircle class="w-5 h-5 mr-2 text-gray-600" />
              <h3 class="text-xl font-bold text-gray-800">完成狀態</h3>
            </div>
            <p class="text-base text-gray-700 mb-1">
              <span class="font-semibold">完成時間：</span>
              {{ formatDate(dialogData.finishAt) }}
            </p>
            <p class="text-base text-gray-700 mb-1">
              <span class="font-semibold">填單人：</span>
              {{ dialogData.staffSubmitName || '-' }}
            </p>
            <p class="text-base text-gray-700">
              <span class="font-semibold">維護內容：</span><span v-html="dialogData.note" />
            </p>
          </section>
          <section
            class="md:col-span-2 bg-gray-50 p-5 rounded-xl shadow hover:shadow-lg transition-all"
          >
            <div class="flex items-center mb-4">
              <LucidePackage class="w-5 h-5 mr-2 text-gray-600" />
              <h3 class="text-xl font-bold text-gray-800">零件更換</h3>
            </div>

            <div v-if="dialogData.fixedComponents?.length" class="mb-6">
              <div class="flex items-center mb-2">
                <LucideHammer class="w-5 h-5 mr-2 text-gray-600" />
                <p class="text-base font-semibold text-gray-700">維修/保養零件</p>
              </div>
              <div class="grid md:grid-cols-2 gap-4">
                <div
                  v-for="(item, index) in dialogData.fixedComponents"
                  :key="index"
                  class="text-sm bg-white p-4 border rounded"
                >
                  <p>
                    <span class="font-semibold"><span v-if="item.name">子</span>零件名稱：</span
                    >{{ item.name || '母零件' }}
                  </p>
                  <p>
                    <span class="font-semibold">零件數量：</span>{{ item.componentCount || '-' }}
                  </p>
                </div>
              </div>
            </div>

            <div v-if="dialogData.installedComponents?.length" class="mb-6">
              <div class="flex items-center mb-2">
                <ArrowBigUp class="w-5 h-5 mr-2 text-gray-600" />
                <p class="text-base font-semibold text-gray-700">裝上零件</p>
              </div>
              <div class="grid md:grid-cols-2 gap-4">
                <div
                  v-for="(item, index) in dialogData.installedComponents"
                  :key="index"
                  class="text-sm bg-white p-4 border rounded"
                >
                  <p>
                    <span class="font-semibold"><span v-if="item.name">子</span>零件名稱：</span
                    >{{ item.name || '母零件' }}
                  </p>
                  <p><span class="font-semibold">零件數量：</span>{{ item.componentCount }}</p>
                  <p>
                    <span class="font-semibold">型號：</span
                    >{{ item.componentDetails?.brandModel || '-' }}
                  </p>
                  <p>
                    <span class="font-semibold">規格：</span
                    >{{ item.componentDetails?.brandSpec || '-' }}
                  </p>
                </div>
              </div>
            </div>

            <div v-if="dialogData.removedComponents?.length">
              <div class="flex items-center mb-2">
                <ArrowBigDown class="w-5 h-5 mr-2 text-gray-600" />
                <p class="text-base font-semibold text-gray-700">換下零件</p>
              </div>
              <div class="grid md:grid-cols-2 gap-4">
                <div
                  v-for="(item, index) in dialogData.removedComponents"
                  :key="index"
                  class="text-sm bg-white p-4 border rounded"
                >
                  <p>
                    <span class="font-semibold"><span v-if="item.name">子</span>零件名稱：</span
                    >{{ item.name || '母零件' }}
                  </p>
                  <p>
                    <span class="font-semibold">型號：</span
                    >{{ item.componentDetails?.brandModel || '-' }}
                  </p>
                  <p>
                    <span class="font-semibold">規格：</span
                    >{{ item.componentDetails?.brandSpec || '-' }}
                  </p>
                </div>
              </div>
            </div>
          </section>
          <section
            v-if="dialogData?.attachments?.length"
            class="md:col-span-2 bg-gray-50 p-5 rounded-xl shadow hover:shadow-lg transition-all"
          >
            <div class="flex items-center mb-3">
              <LucidePaperclip class="w-5 h-5 mr-2 text-gray-600" />
              <h3 class="text-xl font-bold text-gray-800">附件</h3>
            </div>
            <div class="flex overflow-x-auto gap-4">
              <template v-for="(attachment, index) in dialogData.attachments" :key="attachment.id">
                <div
                  v-if="attachment.type === 1 && attachment.url"
                  class="flex flex-col items-center gap-2 cursor-pointer"
                  @mouseenter="hoveredImage = attachment.url"
                  @mouseleave="hoveredImage = null"
                >
                  <div
                    class="relative w-20 h-20 rounded-md overflow-hidden shadow"
                    @click="openAttachmentModal(index)"
                  >
                    <img
                      :src="attachment.url"
                      class="w-full h-full object-cover transition-transform hover:scale-110"
                      alt="附件預覽圖片"
                    />
                  </div>

                  <div
                    class="flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition rounded-full p-3 cursor-pointer"
                    @click.stop="hoveredImage = attachment.url"
                  >
                    <Search class="w-7 h-7 text-gray-600" />
                  </div>
                </div>

                <div
                  v-else-if="attachment.type === 0"
                  class="flex items-center bg-gray-700 text-white px-3 py-1 rounded shadow hover:bg-gray-800 text-sm cursor-pointer"
                  @click="openAttachmentModal(index)"
                >
                  <LucideDownload class="w-4 h-4 mr-1" />
                  下載
                </div>
              </template>
            </div>
          </section>
          <section
            class="md:col-span-2 bg-gray-50 p-5 rounded-xl shadow hover:shadow-lg transition-all"
          >
            <div class="flex items-center mb-4">
              <Pickaxe class="w-5 h-5 mr-2 text-gray-600" />
              <h3 class="text-xl font-bold text-gray-800">特殊機具</h3>
            </div>
            <p class="text-base text-gray-700">
              {{ dialogData.equipment || '無特殊機具' }}
            </p>
          </section>
        </div>
      </div>
    </div>

    <div v-else class="flex justify-center items-center space-x-2">
      <svg class="animate-spin h-6 w-6 text-gray-600" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      <span class="text-gray-600 text-base animate-pulse">載入中...</span>
    </div>

    <div
      v-if="hoveredImage"
      class="fixed hover-zoom-in inset-0 z-[9999] pointer-events-none flex items-center justify-center"
    >
      <img
        :src="hoveredImage"
        class="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl transition-transform duration-300 scale-100"
        alt="圖片放大預覽"
      />
    </div>
  </div>
</template>
<style scoped>
/* 優化滾動條 */
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 4px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: #f1f1f1;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.hover-zoom-in {
  animation: fadeIn 0.2s ease-out forwards;
}
</style>
