<script setup lang="ts">
import { ref } from 'vue';
import type { MaintenanceForm } from '@/types/MaintenanceForm';
import type { Component } from '@/types/Component';
import TableComponentHistory from '@/components/Tables/TableComponentHistory.vue';
import * as maintenanceFormAPI from '@/api/services/maintenanceForm';
import AttachmentImageModal from '@/components/Modals/AttachmentImageModal.vue';
import moment from 'moment';
import { onMounted } from 'vue';
import ComponentDetailModal from '@/components/Modals/Details/ComponentDetailModal.vue';
import type { Attachment } from '@/types/Attachment';
import { useToast } from 'vue-toast-notification';
import { GlobalToastProps } from '@/types/Toast';
import { componentAPI } from '@/api';

onMounted(async () => {
  await handleFixedComponent();
  await handleExchangeCompoent();
});

const handleFixedComponent = async () => {
  if (
    !props.detailMaintenanceForm?.fixedComponentIDs ||
    props.detailMaintenanceForm?.fixedComponentIDs.length === 0
  )
    return;
  let fixedIDs: number[] = props.detailMaintenanceForm.fixedComponentIDs.map((fixedComponentID) => {
    if (fixedComponentID.fixedComponentID) {
      return fixedComponentID.fixedComponentID;
    }
    return 0;
  });
  fixedIDs = Array.from(new Set(fixedIDs));
  fixedIDs = fixedIDs.filter((id) => {
    if (id > 0) {
      return id;
    }
    return false;
  });
  const fixedComponents = await componentAPI.search(fixedIDs);
  props.detailMaintenanceForm.fixedComponentIDs.forEach((fixedComponentID) => {
    const fixedComponent = fixedComponents.find(
      (component) => component.id === fixedComponentID.fixedComponentID
    );
    if (fixedComponent) {
      fixedComponentID.fixedComponent = fixedComponent;
    }
  });
};

const handleExchangeCompoent = async () => {
  if (
    !props.detailMaintenanceForm?.exchangedComponentIDs ||
    props.detailMaintenanceForm?.exchangedComponentIDs.length === 0
  )
    return;
  let replacingComponentIDs: number[] = props.detailMaintenanceForm.exchangedComponentIDs.map(
    (exchangedComponentID) => {
      if (exchangedComponentID.replacingComponentID) {
        return exchangedComponentID.replacingComponentID;
      }
      return 0;
    }
  );
  replacingComponentIDs = Array.from(new Set(replacingComponentIDs));
  replacingComponentIDs = replacingComponentIDs.filter((id) => {
    if (id > 0) {
      return id;
    }
    return false;
  });
  let exchangedIDs: number[] = props.detailMaintenanceForm.exchangedComponentIDs.map(
    (exchangedComponentID) => {
      if (exchangedComponentID.exchangedComponentID) {
        return exchangedComponentID.exchangedComponentID;
      }
      return 0;
    }
  );
  exchangedIDs = Array.from(new Set(exchangedIDs));
  exchangedIDs = exchangedIDs.filter((id) => {
    if (id > 0) {
      return id;
    }
    return false;
  });
  let exchangedComponents: Component[] = await componentAPI.search(exchangedIDs);
  let replacingComponents: Component[] = await componentAPI.search(replacingComponentIDs);
  exchangedComponents = await componentAPI.appendComponentType(exchangedComponents);
  replacingComponents = await componentAPI.appendComponentType(replacingComponents);
  props.detailMaintenanceForm.exchangedComponentIDs.forEach((exchangedComponentID) => {
    const replacingComponent = replacingComponents.find(
      (component) => component.id === exchangedComponentID.replacingComponentID
    );
    const exchangedComponent = exchangedComponents.find(
      (component) => component.id === exchangedComponentID.exchangedComponentID
    );
    if (exchangedComponent) {
      exchangedComponentID.exchangedComponent = exchangedComponent;
    }
    if (replacingComponent) {
      exchangedComponentID.replacingComponent = replacingComponent;
    }
  });
};

const $toast = useToast(GlobalToastProps);

const props = defineProps<{
  openModal: boolean;
  detailMaintenanceForm?: MaintenanceForm;
}>();

const attachmentImage = ref<Attachment>();
const detailComponent = ref<Component>();
const openAttachmentImage = ref(false);
const openComponentDetail = ref(false);
const openComponentDetailModal = (component?: Component): void => {
  if (component) {
    detailComponent.value = component;
    openComponentDetail.value = true;
  }
};

const openAttachmentModal = (attachment: Attachment): void => {
  if (attachment) {
    attachmentImage.value = attachment;
    openAttachmentImage.value = true;
  }
};

const downloadAttachment = (attachment: Attachment): void => {
  if (!attachment.url) {
    $toast.error('附件不存在');
    return;
  }
  window.open(attachment.url, '_blank');
};

onMounted(async () => {
  if (props.detailMaintenanceForm?.attachments) {
    await maintenanceFormAPI.appendAttachmentFileKey(props.detailMaintenanceForm);
    await maintenanceFormAPI.appendAttachment(props.detailMaintenanceForm);
  }
});

const emit = defineEmits(['do-close']);

const closeModal = (): void => {
  emit('do-close');
};
</script>

<template>
  <transition name="fade">
    <div
      v-if="props.openModal && props.detailMaintenanceForm"
      class="fixed left-0 top-0 z-[1000] flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5"
      @click.self="closeModal"
    >
      <div
        class="relative w-full max-w-[90vw] h-[90vh] overflow-x-scroll rounded-lg bg-white px-8 py-12 text-center dark:bg-gray-800 md:px-[50px] md:py-[40px]"
      >
        <button class="absolute text-black top-6 right-8" @click="closeModal">
          <svg
            class="h-8 w-8 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
        <h3 class="pb-2 text-2xl font-bold text-black">
          <span class="truncate"
            >保養/維修/保養紀錄單：{{ props.detailMaintenanceForm?.number }}</span
          >
        </h3>
        <span class="mx-auto mb-2 inline-block h-[2px] w-[300px] rounded bg-primary"></span>
        <div class="grid grid-cols-5 mb-2 items-center">
          <button
            class="inline-flex items-center py-3 justify-center gap-2.5 px-8 text-center font-medium hover:bg-opacity-90 bg-primary text-white rounded-md"
          >
            <svg
              id="XMLID_287_"
              fill="#ffffff"
              height="15px"
              width="15px"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 24 24"
              xml:space="preserve"
              transform="scale(-1, 1)"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <g id="next">
                  <g>
                    <polygon points="6.8,23.7 5.4,22.3 15.7,12 5.4,1.7 6.8,0.3 18.5,12"></polygon>
                  </g>
                </g>
              </g>
            </svg>
            前一筆 &nbsp;&nbsp;&nbsp;
          </button>
          <div
            class="col-span-3 cursor-pointer"
            @click="openComponentDetailModal(props.detailMaintenanceForm?.component)"
          >
            <h2 class="mt-1 pb-2 text-xl font-bold text-black">
              維修/保養零件： {{ props.detailMaintenanceForm?.component?.name ?? '-' }}
            </h2>
          </div>
          <button
            class="inline-flex items-center py-3 justify-center gap-2.5 px-8 text-center font-medium hover:bg-opacity-90 bg-primary text-white rounded-md"
          >
            &nbsp;&nbsp;&nbsp;後一筆
            <svg
              id="XMLID_287_"
              fill="#ffffff"
              height="15px"
              width="15px"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 24 24"
              xml:space="preserve"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <g id="next">
                  <g>
                    <polygon points="6.8,23.7 5.4,22.3 15.7,12 5.4,1.7 6.8,0.3 18.5,12 "></polygon>
                  </g>
                </g>
              </g>
            </svg>
          </button>
        </div>
        <span class="mx-auto mb-2 inline-block h-[1px] w-full rounded bg-primary"></span>
        <div class="flex flex-col bg-stroke p-3 mb-2">
          <div class="grid grid-cols-5 mb-2">
            <div class="flex justify-center items-center font-semibold">工廠</div>
            <div class="flex justify-center items-center font-semibold">主設備</div>
            <div class="flex justify-center items-center font-semibold">維修/保養時間</div>
            <div class="flex justify-center items-center font-semibold">填單時間</div>
            <div class="flex justify-center items-center font-semibold">維護人員</div>
          </div>
          <div class="grid grid-cols-5">
            <div class="flex justify-center items-center">
              <span class="truncate">{{ detailMaintenanceForm?.factory?.name || '-' }}</span>
            </div>
            <div class="flex justify-center items-center">
              <span class="truncate">{{ detailMaintenanceForm?.machine?.name || '-' }}</span>
            </div>
            <div class="flex justify-center items-center">
              <span class="truncate">{{
                moment(detailMaintenanceForm?.maintenanceAt).format('YYYY-MM-DD HH:mm:ss') || '-'
              }}</span>
            </div>
            <div class="flex justify-center items-center">
              <span class="truncate">{{
                moment(detailMaintenanceForm?.createAt).format('YYYY-MM-DD HH:mm:ss') || '-'
              }}</span>
            </div>
            <div class="flex justify-center items-center">
              <span class="truncate">{{ detailMaintenanceForm?.staff?.name || '-' }}</span>
            </div>
          </div>
        </div>
        <div class="flex justify-start items-center text-xl text-black mb-2 font-bold">
          維護內容
        </div>
        <div
          v-if="
            props.detailMaintenanceForm?.fixedComponentIDs?.length === 0 &&
            props.detailMaintenanceForm?.exchangedComponentIDs?.length === 0
          "
          class="flex justify-start bg-stroke p-3 mb-2"
        >
          保養
        </div>
        <div
          v-if="
            props.detailMaintenanceForm?.fixedComponentIDs &&
            props.detailMaintenanceForm?.fixedComponentIDs?.length !== 0
          "
        >
          <div class="flex justify-start bg-stroke p-3 mb-2">維修/保養</div>
          <div
            v-for="fixedComponent in props.detailMaintenanceForm?.fixedComponentIDs"
            :key="fixedComponent.fixedComponentID"
            class="flex justify-start p-3 mb-2"
          >
            維修/保養單位：{{ fixedComponent?.componentHistoryEventTypeFixedLabel }}
            <span v-if="fixedComponent?.replacedPartCount">
              更換子零件數量：{{ fixedComponent?.replacedPartCount }} 個
            </span>
          </div>
        </div>
        <div
          v-if="
            props.detailMaintenanceForm?.exchangedComponentIDs &&
            props.detailMaintenanceForm?.exchangedComponentIDs?.length !== 0
          "
        >
          <div class="flex justify-start bg-stroke p-3 mb-2">完全更換</div>
          <div
            v-for="exchangedComponent in props.detailMaintenanceForm?.exchangedComponentIDs"
            :key="exchangedComponent.exchangedComponentID"
            class="flex flex-col text-left gap-2 my-3"
          >
            <div>原零件：{{ exchangedComponent?.exchangedComponent?.name || '-' }}</div>
            <div v-if="exchangedComponent?.replacingComponent">
              更換零件：{{ exchangedComponent?.replacingComponent?.name || '-' }}
            </div>
          </div>
        </div>

        <div class="flex justify-start items-center text-xl text-black mb-2 font-bold">
          維護說明
        </div>
        <div class="text-left mb-3 whitespace-pre-line">
          {{ props.detailMaintenanceForm?.note || '無' }}
        </div>
        <div class="flex justify-start items-center text-xl text-black mb-2 font-bold">
          附加檔案
        </div>
        <div v-if="props.detailMaintenanceForm?.attachments" class="grid grid-cols-4">
          <template
            v-for="attachment in props.detailMaintenanceForm.attachments"
            :key="attachment.id"
          >
            <div
              v-if="attachment.type === 1 && attachment.url"
              class="mb-2 h-[150px] w-[20vw] rounded-md bg-stroke overflow-hidden"
              @click="openAttachmentModal(attachment)"
            >
              <img class="object-cover" :src="attachment.url" />
            </div>
          </template>
        </div>
        <div class="flex flex-col justify-start items-center gap-2 mb-2 w-fit">
          <template
            v-for="attachment in props.detailMaintenanceForm?.attachments"
            :key="attachment.id"
          >
            <div
              v-if="attachment.type === 0"
              class="w-fit bg-black text-white p-2 rounded-md cursor-pointer uppercase"
              @click="downloadAttachment(attachment)"
            >
              檔案下載
            </div>
          </template>
        </div>
        <div class="flex justify-start items-center text-xl text-black mb-2 font-bold">
          零件歷程
        </div>
        <TableComponentHistory
          v-if="props.detailMaintenanceForm?.component"
          :detail-component="props.detailMaintenanceForm?.component"
        />
        <div class="flex flex-wrap flex-row-reverse">
          <div class="w-full px-3">
            <button
              class="w-[33vw] rounded border border-stroke bg-stroke p-3 text-center font-medium"
              @click="closeModal"
            >
              確定
            </button>
          </div>
        </div>
      </div>
      <ComponentDetailModal
        v-if="openComponentDetail && detailComponent"
        :open-modal="openComponentDetail"
        :detail-component="detailComponent"
        @do-close="openComponentDetail = false"
      />
      <AttachmentImageModal
        v-if="openAttachmentImage"
        :open-modal="openAttachmentImage"
        :attachment="attachmentImage"
        @do-close="openAttachmentImage = false"
      />
    </div>
  </transition>
</template>
