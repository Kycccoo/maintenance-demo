<script setup lang="ts">
import { ref, shallowRef, onMounted, defineAsyncComponent, watch } from 'vue';
import { useFactoryStore } from '@/stores/factory';
import { type Factory, InitFactory } from '@/types/Factory';
import { useUserStore } from '@/stores/user';
import TableSorter from '@/components/Tables/TableSorter.vue';
import PaginationComponent from '@/components/Pagination/PaginationComponent.vue';

import KeywordFilter from '@/components/Forms/SearchBar/KeywordFilter.vue';

const props = defineProps<{
  showOperation: boolean;
}>();

const FactoryDetailModal = defineAsyncComponent(
  () => import('@/components/Modals/Details/FactoryDetailModal.vue')
);
const FactoryUpdateModal = defineAsyncComponent(
  () => import('@/components/Modals/Update/FactoryUpdateModal.vue')
);
const FactoryCreateModal = defineAsyncComponent(
  () => import('@/components/Modals/Create/FactoryCreateModal.vue')
);
const FactoryDeleteModal = defineAsyncComponent(
  () => import('@/components/Modals/Delete/FactoryDeleteModal.vue')
);
const FactoryInformConfigsModal = defineAsyncComponent(
  () => import('@/components/Modals/Update/FactoryInformConfigsModal.vue')
);

const userStore = useUserStore();
const store = useFactoryStore();

const updateFactory = ref<Factory>(structuredClone(InitFactory));
const detailFactory = ref<Factory>(structuredClone(InitFactory));

const modalCreateOpen = shallowRef<boolean>(false);
const modalDetailOpen = shallowRef<boolean>(false);
const modalUpdateOpen = shallowRef<boolean>(false);
const modalDeleteConfirmOpen = shallowRef<boolean>(false);
const modalInformConfigsOpen = shallowRef<boolean>(false);
const informTargetFactory = ref<Factory>(structuredClone(InitFactory));

onMounted(async () => {
  store.searchColumns.keyword = '';
  store.currentPage = 1;
  await store.fetch();
  await Promise.all(
    store.items.map(async (item) => {
      try {
        item.factoryGroupName = await store.getGroupName(item.id);
      } catch (error) {
        console.error(error);
        item.factoryGroupName = 'Unknown';
      }
    })
  );
});

watch(
  () => store.pagination?.page,
  async () => {
    try {
      await Promise.all(
        store.items.map(async (item) => {
          try {
            item.factoryGroupName = await store.getGroupName(item.id);
          } catch (error) {
            console.error(error);
            item.factoryGroupName = 'Unknown';
          }
        })
      );
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  },
  { immediate: true }
);

const doSearch = async (queryString: string) => {
  store.searchColumns.keyword = queryString;
  await store.fetch();
};

const openDetailModal = async (factory: Factory) => {
  modalDetailOpen.value = true; // Open the modal
  detailFactory.value = factory;
  detailFactory.value.order = (await store.getOrder(factory.id)) ?? 0;
  detailFactory.value.groupName = (await store.getGroupName(factory.id)) ?? '';
};
const closeDetailModal = () => {
  modalDetailOpen.value = false; // Close the modal
  detailFactory.value = structuredClone(InitFactory);
};
const openUpdateModal = async (factory: Factory) => {
  modalUpdateOpen.value = true; // Open the modal
  updateFactory.value = JSON.parse(JSON.stringify(factory));
  updateFactory.value.order = (await store.getOrder(factory.id)) ?? 0;
  updateFactory.value.groupName = (await store.getGroupName(factory.id)) ?? '';
};
const openInformConfigs = (factory: Factory) => {
  informTargetFactory.value = JSON.parse(JSON.stringify(factory));
  modalInformConfigsOpen.value = true;
};

const closeInformConfigsModal = () => {
  modalInformConfigsOpen.value = false;
  informTargetFactory.value = structuredClone(InitFactory);
};
const openDeleteConfirmModal = () => {
  modalDeleteConfirmOpen.value = true; // Open the modal
};

const openCreateModal = () => {
  modalCreateOpen.value = true;
};

const closeDeleteConfirmModal = () => {
  modalDeleteConfirmOpen.value = false; // Close the modal
};
const closeCreateModal = () => {
  modalCreateOpen.value = false; // Close the modal
};
const closeUpdateModal = () => {
  updateFactory.value = structuredClone(InitFactory);
  modalUpdateOpen.value = false; // Close the modal
};
</script>

<template>
  <div
    class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
  >
    <KeywordFilter @do-search="doSearch" />
    <div
      v-if="props.showOperation && userStore.canCreate('manage_factory')"
      class="flex items-center justify-end"
    >
      <div class="flex flex-row-reverse gap-2">
        <button
          :disabled="store.selectedIDs.length === 0"
          class="disabled:opacity-60 inline-flex items-center justify-center gap-2.5 py-3 px-8 text-center font-medium hover:bg-opacity-90 lg:px-8 xl:px-10 bg-red-500 text-white rounded-md"
          @click="openDeleteConfirmModal"
        >
          刪除
        </button>
        <button
          class="inline-flex items-center justify-center gap-2.5 py-3 px-8 text-center font-medium hover:bg-opacity-90 lg:px-8 xl:px-10 bg-primary text-white rounded-md"
          @click="openCreateModal"
        >
          新增
        </button>
      </div>
    </div>

    <PaginationComponent
      v-if="store.pagination"
      v-model="store.itemsPerPage"
      :pagination="store.pagination"
      @items-per-page-changed="store.goItemsPerPage"
      @page-changed="store.goPage"
    />
    <div class="flex flex-col">
      <div class="grid grid-cols-[min-content,1fr,min-content] rounded-sm bg-gray-2 dark:bg-meta-4">
        <div
          :class="
            props.showOperation || userStore.canCreate('manage_factory')
              ? 'flex w-fit max-w-[150px] p-2'
              : 'w-fit max-w-[150px]'
          "
        >
          <div
            v-if="props.showOperation && userStore.canCreate('manage_factory')"
            class="inline-flex items-center"
          >
            <label class="flex items-center cursor-pointer relative">
              <input
                v-model="store.allSelected"
                type="checkbox"
                class="peer h-6 w-6 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-primary checked:border-primary"
                @change="store.toggleSelectAll"
              />
              <span
                class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  stroke="currentColor"
                  stroke-width="1"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </span>
            </label>
          </div>
          <TableSorter
            v-if="userStore.isAdmin"
            class-name="w-[100px]"
            title="ID"
            :value="store.orderColumns.orderByID"
            column="orderByID"
            @orderUpdate="store.handleOrderUpdate"
          />
        </div>
        <div class="grid grid-cols-6 p-2">
          <TableSorter
            title="名稱"
            :value="store.orderColumns.orderByName"
            column="orderByName"
            @orderUpdate="store.handleOrderUpdate"
          />
          <TableSorter
            title="代號"
            :value="store.orderColumns.orderByCode"
            column="orderByCode"
            @orderUpdate="store.handleOrderUpdate"
          />
          <div class="text-center p-3 flex gap-1 items-center justify-center">
            <h5 class="text-sm font-medium uppercase xsm:text-base">工廠位置</h5>
          </div>
          <div class="text-center p-3 flex gap-1 items-center justify-start col-span-3">
            <h5 class="text-sm font-medium uppercase xsm:text-base">描述</h5>
          </div>
        </div>
        <div
          v-if="props.showOperation"
          class="p-3 text-center flex gap-1 items-center justify-center w-[100px]"
        >
          <h5 class="text-sm font-medium uppercase xsm:text-base">操作</h5>
        </div>
        <div v-else />
      </div>
      <div
        v-for="(factory, key) in store.items"
        :key="key"
        :class="`grid grid-cols-[min-content,1fr,min-content] hover:bg-green-50
           ${store.lastOperationId === factory.id ? 'bg-amber-50' : ''}
           ${
             key === store.items.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'
           }`"
      >
        <div
          v-if="props.showOperation && userStore.canCreate('manage_factory')"
          class="flex items-center p-2 w-[150px]"
        >
          <div class="inline-flex items-center">
            <label class="flex items-center cursor-pointer relative">
              <input
                type="checkbox"
                :checked="store.selectedIDs.includes(factory.id)"
                class="peer h-6 w-6 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-primary checked:border-primary"
                @change="store.toggleSelection(factory.id)"
              />
              <span
                class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  stroke="currentColor"
                  stroke-width="1"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </span>
            </label>
          </div>
          <div v-if="userStore.isAdmin" class="flex items-center justify-center p-3 w-[100px]">
            <p class="text-black dark:text-white truncate">{{ factory.id }}</p>
          </div>
        </div>
        <div v-else />
        <div class="grid grid-cols-6 p-2" @click="openDetailModal(factory)">
          <div class="flex items-center justify-center p-3">
            <p class="text-black dark:text-white truncate">{{ factory.name }}</p>
          </div>
          <div class="flex items-center justify-center p-3">
            <p class="text-meta-3 truncate">{{ factory.code }}</p>
          </div>
          <div class="flex items-center justify-center p-3">
            <p class="text-meta-3 truncate">{{ factory.factoryGroupName }}</p>
          </div>
          <div class="flex items-center justify-start p-3 col-span-3">
            <p :title="factory.description" class="text-black truncate">
              {{ factory.description || '-' }}
            </p>
          </div>
        </div>
        <div
          v-if="props.showOperation"
          class="items-center justify-center p-2.5 sm:flex xl:p-5 w-[200px] gap-2"
        >
          <button
            :disabled="!userStore.can('manage_factory', factory.id)"
            class="disabled:opacity-50 inline-flex items-center justify-center text-center hover:bg-opacity-90 px-3 py-2 bg-primary text-white rounded-md"
            @click="openUpdateModal(factory)"
          >
            編輯
          </button>
          <button
            :disabled="!userStore.can('manage_factory', factory.id)"
            class="disabled:opacity-50 inline-flex items-center justify-center text-center hover:bg-opacity-90 px-3 py-2 bg-primary text-white rounded-md"
            @click="openInformConfigs(factory)"
          >
            通知
          </button>
        </div>
      </div>
    </div>
    <PaginationComponent
      v-if="store.pagination"
      v-model="store.itemsPerPage"
      :pagination="store.pagination"
      @items-per-page-changed="store.goItemsPerPage"
      @page-changed="store.goPage"
    />
    <FactoryCreateModal
      v-if="modalCreateOpen"
      :open-modal="modalCreateOpen"
      @do-close="closeCreateModal"
    />
    <FactoryUpdateModal
      v-if="modalUpdateOpen && updateFactory"
      :open-modal="modalUpdateOpen"
      :factory="updateFactory"
      @do-close="closeUpdateModal"
    />
    <FactoryDetailModal
      v-if="modalDetailOpen && detailFactory"
      :open-modal="modalDetailOpen"
      :detail-factory="detailFactory"
      @do-close="closeDetailModal"
    />
    <FactoryDeleteModal
      v-if="modalDeleteConfirmOpen && store.selectedIDs.length > 0"
      :open-modal="modalDeleteConfirmOpen"
      :ids="store.selectedIDs"
      @do-close="closeDeleteConfirmModal"
    />
    <FactoryInformConfigsModal
      v-if="modalInformConfigsOpen && informTargetFactory.id"
      :open-modal="modalInformConfigsOpen"
      :factory-id="informTargetFactory.id"
      :factory-name="informTargetFactory.name"
      @do-close="closeInformConfigsModal"
      @saved="store.fetch"
    />
  </div>
</template>
