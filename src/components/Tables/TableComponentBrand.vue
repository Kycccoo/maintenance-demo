<script setup lang="ts">
import { ref, shallowRef, onMounted } from 'vue';
import { useComponentBrandStore } from '@/stores/componentBrand';
import type { ComponentBrand } from '@/types/ComponentBrand';
import { useUserStore } from '@/stores/user';
import TableSorter from '@/components/Tables/TableSorter.vue';
import PaginationComponent from '@/components/Pagination/PaginationComponent.vue';
import {
  addComponentBrandPostErrorMessageMap,
  editComponentBrandPatchErrorMessageMap,
  setComponentBrandOrderPutErrorMessageMap
} from '@/api/errors/componentBrand';
import {
  AddComponentBrandPostError,
  SetComponentBrandOrderPutError,
  EditComponentBrandPatchError
} from '@occ-web/error-code';
import { useErrorStore } from '@/stores/error';
import { fetchUserErrorMessageMap } from '@/api/errors/login';
import ComponentBrandDetailModal from '@/components/Modals/Details/ComponentBrandDetailModal.vue';
import KeywordFilter from '@/components/Forms/SearchBar/KeywordFilter.vue';
import { InitComponentBrandError } from '@/types/errors/ComponentBrandError';
import { AxiosError } from 'axios';
import RequiredSpan from '../Labels/RequiredSpan.vue';

const userStore = useUserStore();
const store = useComponentBrandStore();

const updateComponentBrand = ref<ComponentBrand>();
const createComponentBrand = ref<ComponentBrand>();
const detailComponentBrand = ref<ComponentBrand>();

const updateError = ref(structuredClone(InitComponentBrandError));
const createError = ref(structuredClone(InitComponentBrandError));
const deleteConfirmText = ref('');
const modalCreateOpen = shallowRef<boolean>(false);
const modalDetailOpen = shallowRef<boolean>(false);
const modalUpdateOpen = shallowRef<boolean>(false);
const modalDeleteConfirmOpen = shallowRef<boolean>(false);

const props = defineProps({
  showOperation: Boolean
});
onMounted(() => {
  store.searchColumns.keyword = '';
  store.fetch();
});

const handelDelete = async () => {
  try {
    await store.deleteAll();
  } catch (error) {
    console.error('Error deleting factories:', error);
  }
  closeDeleteConfirmModal();
};

const openCreateModal = () => {
  resetCreateModal();
  modalCreateOpen.value = true;
};
const openDetailModal = async (componentBrand: ComponentBrand) => {
  modalDetailOpen.value = true;
  detailComponentBrand.value = componentBrand;
  detailComponentBrand.value.order = (await store.getOrder(componentBrand.id)) ?? 0;
};
const closeDetailModal = () => {
  modalDetailOpen.value = false;
};
const openUpdateModal = async (componentBrand: ComponentBrand) => {
  modalUpdateOpen.value = true; // Open the modal
  updateError.value = JSON.parse(JSON.stringify(InitComponentBrandError));
  updateComponentBrand.value = JSON.parse(JSON.stringify(componentBrand));
  if (!updateComponentBrand.value) return;
  updateComponentBrand.value.order = (await store.getOrder(updateComponentBrand.value.id)) ?? 0;
};
const openDeleteConfirmModal = () => {
  deleteConfirmText.value = '';
  deleteConfirmText.value = '';
  modalDeleteConfirmOpen.value = true; // Open the modal
};
const closeDeleteConfirmModal = () => {
  modalDeleteConfirmOpen.value = false; // Close the modal
};
const closeCreateModal = () => {
  modalCreateOpen.value = false; // Close the modal
};
const closeUpdateModal = () => {
  modalUpdateOpen.value = false;
};
const resetCreateModal = () => {
  createComponentBrand.value = {
    id: 0,
    name: '',
    order: 0,
    description: ''
  };
  createError.value = {
    name: '',
    order: '',
    description: '',
    general: ''
  };
};

const handleUpdate = async () => {
  resetError();
  if (!updateComponentBrand.value) return;

  try {
    await store.update(updateComponentBrand.value);
    const result = await handleComponentBrandOrderUpdate(
      updateComponentBrand.value.id,
      updateComponentBrand.value.order
    );
    store.lastOperationId = updateComponentBrand.value.id;
    if (!result) {
      updateComponentBrand.value.order = (await store.getOrder(updateComponentBrand.value.id)) ?? 0;
      store.sync(updateComponentBrand.value);
      return;
    }
    store.sync(updateComponentBrand.value);
    closeUpdateModal();
  } catch (error) {
    handleUpdateError(error);
    console.error('Unexpected error', error);
  }
};

const handleCreate = async () => {
  resetError();
  if (!createComponentBrand.value) return;

  try {
    const id = await store.create(createComponentBrand.value);
    if (id) {
      createComponentBrand.value.id = id;
      store.lastOperationId = id;
      const componentBrand: ComponentBrand = createComponentBrand.value;
      store.addItem(componentBrand);
      const result = await handleComponentBrandOrderUpdate(id, createComponentBrand.value.order);
      if (!result) {
        await openUpdateModal(componentBrand);
      }
      resetCreateModal();
      closeCreateModal();
    }
  } catch (error) {
    handleCreateError(error);
  }
};

const resetError = () => {
  createError.value.name = '';
  createError.value.order = '';
  createError.value.description = '';
  updateError.value.name = '';
  updateError.value.order = '';
  updateError.value.description = '';
};

const handleComponentBrandOrderUpdate = async (id: number, order: number) => {
  try {
    await store.updateOrder(id, order);
    return true;
  } catch (error) {
    handleOrderError(error);
  }
  return false;
};

const handleOrderError = (error: unknown) => {
  if (!(error instanceof AxiosError)) {
    useErrorStore().setUnknownError();
    return;
  }
  const errorCodes = error?.response?.data?.errors;
  if (!Array.isArray(errorCodes)) {
    useErrorStore().setUnknownError();
    return;
  }

  errorCodes.forEach((code) => {
    if (
      [
        SetComponentBrandOrderPutError.ParamsIdType,
        SetComponentBrandOrderPutError.ParamsIdMinimum,
        SetComponentBrandOrderPutError.BodyType
      ].includes(code)
    ) {
      updateError.value.order = setComponentBrandOrderPutErrorMessageMap[code];
    } else {
      updateError.value.general =
        setComponentBrandOrderPutErrorMessageMap[code] ||
        fetchUserErrorMessageMap[code] ||
        `未知錯誤: ${code}`;
    }
  });
};

const handleCreateError = (error: unknown) => {
  if (!(error instanceof AxiosError)) {
    useErrorStore().setUnknownError();
    return;
  }
  const errorCodes = error?.response?.data?.errors;
  if (!Array.isArray(errorCodes)) {
    useErrorStore().setUnknownError();
    return;
  }

  errorCodes.forEach((code) => {
    if (
      [
        AddComponentBrandPostError.BodyNameRequired,
        AddComponentBrandPostError.BodyNameType,
        AddComponentBrandPostError.BodyNameMaxLength,
        AddComponentBrandPostError.BodyNamePattern,
        AddComponentBrandPostError.NameDuplicated
      ].includes(code)
    ) {
      createError.value.name = addComponentBrandPostErrorMessageMap[code];
    } else if (
      [
        AddComponentBrandPostError.BodyDescriptionType,
        AddComponentBrandPostError.BodyDescriptionMaxLength
      ].includes(code)
    ) {
      createError.value.description = addComponentBrandPostErrorMessageMap[code];
    } else if ([AddComponentBrandPostError.BodyType].includes(code)) {
      createError.value.general = addComponentBrandPostErrorMessageMap[code];
    } else {
      createError.value.general =
        addComponentBrandPostErrorMessageMap[code] ||
        fetchUserErrorMessageMap[code] ||
        `未知錯誤: ${code}`;
    }
  });
};
const handleUpdateError = (error: unknown) => {
  if (!(error instanceof AxiosError)) {
    useErrorStore().setUnknownError();
    return;
  }
  const errorCodes = error?.response?.data?.errors;
  if (!Array.isArray(errorCodes)) {
    useErrorStore().setUnknownError();
    return;
  }

  errorCodes.forEach((code) => {
    if (
      [
        EditComponentBrandPatchError.ParamsIdType,
        EditComponentBrandPatchError.ParamsIdMinimum
      ].includes(code)
    ) {
      updateError.value.general = editComponentBrandPatchErrorMessageMap[code];
    } else if (
      [
        EditComponentBrandPatchError.BodyNameType,
        EditComponentBrandPatchError.BodyNameMaxLength,
        EditComponentBrandPatchError.BodyNamePattern,
        EditComponentBrandPatchError.NameDuplicated
      ].includes(code)
    ) {
      updateError.value.name = editComponentBrandPatchErrorMessageMap[code];
    } else if (
      [
        EditComponentBrandPatchError.BodyDescriptionType,
        EditComponentBrandPatchError.BodyDescriptionMaxLength
      ].includes(code)
    ) {
      updateError.value.description = editComponentBrandPatchErrorMessageMap[code];
    } else if ([EditComponentBrandPatchError.BodyType].includes(code)) {
      updateError.value.general = editComponentBrandPatchErrorMessageMap[code];
    } else {
      updateError.value.general =
        editComponentBrandPatchErrorMessageMap[code] ||
        fetchUserErrorMessageMap[code] ||
        `未知錯誤: ${code}`;
    }
  });
};
const doSearch = async (queryString: string) => {
  store.searchColumns.keyword = queryString;
  await store.fetch();
};

const preventNotNumber = (event: KeyboardEvent) => {
  if (event.key === 'e' || event.key === 'E' || event.key === '+' || event.key === '-') {
    event.preventDefault();
  }
};
</script>

<template>
  <div
    class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
  >
    <KeywordFilter @do-search="doSearch" />
    <div class="flex items-center justify-end">
      <div
        v-if="props.showOperation && userStore.canCreate('manage_component_brand')"
        class="flex flex-row-reverse gap-2"
      >
        <button
          :disabled="store.selectedItems.length === 0"
          class="disabled:opacity-60 inline-flex items-center justify-center gap-3 py-3 px-8 text-center font-medium hover:bg-opacity-90 lg:px-8 xl:px-10 bg-red-500 text-white rounded-md"
          @click="openDeleteConfirmModal"
        >
          刪除
        </button>
        <button
          class="inline-flex items-center justify-center gap-3 py-3 px-8 text-center font-medium hover:bg-opacity-90 lg:px-8 xl:px-10 bg-primary text-white rounded-md"
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
      @page-changed="store.goPage"
      @items-per-page-changed="store.goItemsPerPage"
    />
    <div class="flex flex-col">
      <div class="grid grid-cols-[min-content,1fr,min-content] rounded-sm bg-gray-2 dark:bg-meta-4">
        <div
          v-if="props.showOperation && userStore.canCreate('manage_component_brand')"
          class="flex p-3 w-fit max-w-[150px]"
        >
          <div class="inline-flex items-center">
            <label class="flex items-center cursor-pointer relative">
              <input
                type="checkbox"
                :checked="store.allSelected"
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
            title="ID"
            :value="store.orderColumns.orderByID"
            column="orderByID"
            class-name="w-[100px]"
            @orderUpdate="store.handleOrderUpdate"
          />
        </div>
        <div v-else />
        <div class="grid grid-cols-4 p-2">
          <TableSorter
            title="名稱"
            :value="store.orderColumns.orderByName"
            column="orderByName"
            @orderUpdate="store.handleOrderUpdate"
          />
          <div class="p-3 text-center xl:p-3 flex gap-1 items-center justify-center col-span-3">
            <h5 class="text-sm font-medium uppercase xsm:text-base">描述</h5>
          </div>
        </div>
        <div
          v-if="props.showOperation"
          class="p-3 text-center xl:p-3 flex gap-1 items-center justify-center w-[100px]"
        >
          <h5 class="text-sm font-medium uppercase xsm:text-base">操作</h5>
        </div>
        <div v-else />
      </div>

      <div
        v-for="(componentBrand, key) in store.items"
        :key="key"
        :class="`grid grid-cols-[min-content,1fr,min-content] hover:bg-green-50
           ${store.lastOperationId === componentBrand.id ? 'bg-amber-50' : ''}
           ${
             key === store.items.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'
           }`"
      >
        <div
          v-if="props.showOperation && userStore.canCreate('manage_component_brand')"
          class="flex items-center p-3 w-fit max-w-[150px]"
        >
          <div class="inline-flex items-center">
            <label class="flex items-center cursor-pointer relative">
              <input
                type="checkbox"
                :checked="store.selectedIDs.includes(componentBrand.id)"
                class="peer h-6 w-6 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-primary checked:border-primary"
                @change="store.toggleSelection(componentBrand)"
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
            <p class="text-black dark:text-white truncate">{{ componentBrand.id }}</p>
          </div>
        </div>
        <div v-else />
        <div class="grid grid-cols-4 p-3" @click="openDetailModal(componentBrand)">
          <div class="flex items-center justify-center p-3">
            <p class="text-black dark:text-white truncate">{{ componentBrand.name }}</p>
          </div>
          <div class="items-center justify-start p-3 sm:flex xl:p-3 col-span-3">
            <p class="text-black dark:text-white truncate" :title="componentBrand.description">
              {{ componentBrand.description }}
            </p>
          </div>
        </div>
        <div
          v-if="props.showOperation"
          class="items-center justify-center p-3 sm:flex xl:p-3 w-[120px]"
        >
          <button
            :disabled="!userStore.can('manage_component_brand', componentBrand.id)"
            class="disabled:opacity-50 inline-flex items-center justify-center text-center hover:bg-opacity-90 px-3 py-2 bg-primary text-white rounded-md"
            @click="openUpdateModal(componentBrand)"
          >
            編輯
          </button>
        </div>
        <div v-else />
      </div>
    </div>
    <PaginationComponent
      v-if="store.pagination"
      v-model="store.itemsPerPage"
      :pagination="store.pagination"
      @items-per-page-changed="store.goItemsPerPage"
      @page-changed="store.goPage"
    />
    <transition name="fade">
      <div
        v-if="modalCreateOpen && createComponentBrand"
        class="fixed left-0 top-0 z-[1000] flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5"
      >
        <div
          class="relative w-full max-w-[570px] rounded-lg bg-white px-8 py-12 text-center dark:bg-gray-800 md:px-[70px] md:py-[60px]"
        >
          <button class="absolute text-black top-6 right-8" @click="closeCreateModal">
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
          <div class="flex justify-center items-center gap-2 pb-2">
            <svg class="w-[25px]" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <path
                d="m12.5 16.5h-1c-.55 0-1 .45-1 1s.45 1 1 1h1c.55 0 1-.45 1-1s-.45-1-1-1z"
              ></path>
              <path
                d="m18.5 16.5h-1c-.55 0-1 .45-1 1s.45 1 1 1h1c.55 0 1-.45 1-1s-.45-1-1-1z"
              ></path>
              <path
                d="m23.5 18.5h1c.55 0 1-.45 1-1s-.45-1-1-1h-1c-.55 0-1 .45-1 1s.45 1 1 1z"
              ></path>
              <path
                d="m12.5 20.5h-1c-.55 0-1 .45-1 1s.45 1 1 1h1c.55 0 1-.45 1-1s-.45-1-1-1z"
              ></path>
              <path
                d="m18.5 20.5h-1c-.55 0-1 .45-1 1s.45 1 1 1h1c.55 0 1-.45 1-1s-.45-1-1-1z"
              ></path>
              <path d="m24.5 22.5c.55 0 1-.45 1-1s-.45-1-1-1h-1c-.55 0-1 .45-1 1s.45 1 1 1z"></path>
              <path
                d="m30 29h-1v-13.57c0-1.19-.87-2.18-2-2.39v-9.54c0-1.38-1.12-2.5-2.5-2.5h-1c-1.38 0-2.5 1.12-2.5 2.5v9.5h-2v-4.05c0-.78-.36-1.51-.98-1.98-.62-.48-1.41-.64-2.19-.43l-10.98 3.19c-1.09.29-1.86 1.28-1.86 2.42v16.85h-1c-.55 0-1 .45-1 1s.45 1 1 1h28c.55 0 1-.45 1-1s-.45-1-1-1zm-11-3h2v3h-2zm-2 3h-2v-3h2zm5-5h-8c-.55 0-1 .45-1 1v4h-4v-13.57c0-.24.19-.43.43-.43h17.14c.24 0 .43.19.43.43v13.57h-4v-4c0-.55-.45-1-1-1zm1-20.5c0-.28.22-.5.5-.5h1c.28 0 .5.22.5.5v9.5h-2zm-18 8.65c0-.23.15-.42.39-.49l10.98-3.19c.21-.06.36.03.43.09s.2.18.2.4v4.05h-7.57c-1.34 0-2.43 1.09-2.43 2.43v13.57h-2z"
              ></path>
            </svg>
            <h3 class="text-xl font-bold text-black dark:text-white sm:text-2xl">新增零件廠商</h3>
          </div>
          <span class="mx-auto mb-6 inline-block h-1 w-[140px] rounded bg-primary"></span>
          <form class="text-left">
            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white"
                ><RequiredSpan />零件廠商名稱</label
              >
              <div class="relative">
                <input
                  v-model="createComponentBrand.name"
                  required
                  type="text"
                  placeholder="請輸入零件廠商名稱"
                  :class="`border ${
                    createError.name ? 'border-red' : 'border-stroke'
                  }  w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                />
              </div>
              <p v-if="createError.name" class="text-sm text-red-500 mt-1">
                *{{ createError.name }}
              </p>
            </div>
            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white"
                >零件廠商排序</label
              >
              <div class="relative">
                <input
                  v-model="createComponentBrand.order"
                  required
                  type="number"
                  placeholder="請輸入零件廠商排序"
                  :class="`border ${
                    createError.order ? 'border-red' : 'border-stroke'
                  }  w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                  @keypress="preventNotNumber"
                />
              </div>
              <p v-if="createError.order" class="text-sm text-red-500 mt-1">
                *{{ createError.order }}
              </p>
            </div>
            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white">描述</label>
              <div class="relative">
                <textarea
                  v-model="createComponentBrand.description"
                  rows="4"
                  placeholder="請輸入描述"
                  :class="`border ${
                    createError.description ? 'border-red' : 'border-stroke'
                  } w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                ></textarea>
              </div>
              <p v-if="createError.description" class="text-sm text-red-500 mt-1">
                *{{ createError.description }}
              </p>
            </div>
          </form>
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
          <div v-if="createError.general" class="p-1 text-left">
            <p class="text-sm text-red">*{{ createError.general }}</p>
          </div>
        </div>
      </div>
    </transition>
    <ComponentBrandDetailModal
      v-if="modalDetailOpen && detailComponentBrand"
      :openModal="modalDetailOpen"
      :detailComponentBrand="detailComponentBrand"
      @do-close="closeDetailModal"
    />
    <transition name="fade">
      <div
        v-if="modalUpdateOpen && updateComponentBrand"
        class="fixed left-0 top-0 z-[1000] flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5"
      >
        <div
          class="relative w-full max-w-[570px] rounded-lg bg-white px-8 py-12 text-center dark:bg-gray-800 md:px-[70px] md:py-[60px]"
        >
          <button class="absolute text-black top-6 right-8" @click="closeUpdateModal">
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
          <h3 class="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl"></h3>
          <div class="flex justify-center items-center gap-2 pb-2">
            <svg class="w-[25px]" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <path
                d="m12.5 16.5h-1c-.55 0-1 .45-1 1s.45 1 1 1h1c.55 0 1-.45 1-1s-.45-1-1-1z"
              ></path>
              <path
                d="m18.5 16.5h-1c-.55 0-1 .45-1 1s.45 1 1 1h1c.55 0 1-.45 1-1s-.45-1-1-1z"
              ></path>
              <path
                d="m23.5 18.5h1c.55 0 1-.45 1-1s-.45-1-1-1h-1c-.55 0-1 .45-1 1s.45 1 1 1z"
              ></path>
              <path
                d="m12.5 20.5h-1c-.55 0-1 .45-1 1s.45 1 1 1h1c.55 0 1-.45 1-1s-.45-1-1-1z"
              ></path>
              <path
                d="m18.5 20.5h-1c-.55 0-1 .45-1 1s.45 1 1 1h1c.55 0 1-.45 1-1s-.45-1-1-1z"
              ></path>
              <path d="m24.5 22.5c.55 0 1-.45 1-1s-.45-1-1-1h-1c-.55 0-1 .45-1 1s.45 1 1 1z"></path>
              <path
                d="m30 29h-1v-13.57c0-1.19-.87-2.18-2-2.39v-9.54c0-1.38-1.12-2.5-2.5-2.5h-1c-1.38 0-2.5 1.12-2.5 2.5v9.5h-2v-4.05c0-.78-.36-1.51-.98-1.98-.62-.48-1.41-.64-2.19-.43l-10.98 3.19c-1.09.29-1.86 1.28-1.86 2.42v16.85h-1c-.55 0-1 .45-1 1s.45 1 1 1h28c.55 0 1-.45 1-1s-.45-1-1-1zm-11-3h2v3h-2zm-2 3h-2v-3h2zm5-5h-8c-.55 0-1 .45-1 1v4h-4v-13.57c0-.24.19-.43.43-.43h17.14c.24 0 .43.19.43.43v13.57h-4v-4c0-.55-.45-1-1-1zm1-20.5c0-.28.22-.5.5-.5h1c.28 0 .5.22.5.5v9.5h-2zm-18 8.65c0-.23.15-.42.39-.49l10.98-3.19c.21-.06.36.03.43.09s.2.18.2.4v4.05h-7.57c-1.34 0-2.43 1.09-2.43 2.43v13.57h-2z"
              ></path>
            </svg>
            <h3 class="text-xl font-bold text-black dark:text-white sm:text-2xl">
              修改零件廠商資訊 ID: {{ updateComponentBrand.id }}
            </h3>
          </div>
          <span class="mx-auto mb-6 inline-block h-1 w-[260px] rounded bg-primary"></span>
          <div class="text-left">
            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white"
                ><RequiredSpan />零件廠商名稱
              </label>
              <div class="relative">
                <input
                  v-model="updateComponentBrand.name"
                  required
                  type="text"
                  placeholder="請輸入零件廠商名稱"
                  :class="`border ${
                    updateError.name ? 'border-red' : 'border-stroke'
                  } w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                />
              </div>
              <p v-if="updateError.name" class="text-sm text-red-500 mt-1">
                *{{ updateError.name }}
              </p>
            </div>
            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white"
                >零件廠商排序</label
              >
              <div class="relative">
                <input
                  v-model="updateComponentBrand.order"
                  required
                  type="text"
                  placeholder="請輸入零件廠商排序"
                  :class="`border ${
                    updateError.order ? 'border-red' : 'border-stroke'
                  } w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                  @keypress="preventNotNumber"
                />
              </div>
              <p v-if="updateError.order" class="text-sm text-red-500 mt-1">
                *{{ updateError.order }}
              </p>
            </div>
            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white">描述</label>
              <div class="relative">
                <textarea
                  v-model="updateComponentBrand.description"
                  rows="4"
                  placeholder="請輸入描述"
                  :class="`border ${
                    updateError.description ? 'border-red' : 'border-stroke'
                  } w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                ></textarea>
              </div>
              <p v-if="updateError.description" class="text-sm text-red-500 mt-1">
                *{{ updateError.description }}
              </p>
            </div>
          </div>
          <div class="-mx-3 flex flex-wrap gap-y-4 flex-row-reverse">
            <div class="w-full px-3 flex">
              <button
                v-if="!store.loading"
                class="block w-full rounded border border-primary bg-primary p-3 text-center font-medium text-white hover:opacity-80"
                @click="handleUpdate"
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
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div
        v-if="modalDeleteConfirmOpen"
        class="fixed left-0 top-0 z-[1000] flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5"
        @click.self="closeDeleteConfirmModal"
      >
        <div
          class="relative w-full max-w-[570px] rounded-lg bg-white px-8 py-12 text-center dark:bg-gray-800 md:px-[70px] md:py-[60px]"
        >
          <button class="absolute text-black top-6 right-8" @click="closeDeleteConfirmModal">
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
          <span class="mx-auto inline-block">
            <svg
              width="60"
              height="60"
              viewBox="0 0 60 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect opacity="0.1" width="60" height="60" rx="30" fill="#DC2626"></rect>
              <path
                d="M30 27.2498V29.9998V27.2498ZM30 35.4999H30.0134H30ZM20.6914 41H39.3086C41.3778 41 42.6704 38.7078 41.6358 36.8749L32.3272 20.3747C31.2926 18.5418 28.7074 18.5418 27.6728 20.3747L18.3642 36.8749C17.3296 38.7078 18.6222 41 20.6914 41Z"
                stroke="#DC2626"
                stroke-width="2.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
          </span>
          <h3 class="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">
            刪除零件廠商確認
          </h3>
          <span class="mx-auto mb-6 inline-block h-1 w-[90px] rounded bg-red"></span>
          <p class="mb-5 font-medium">
            即將刪除選取的零件廠商 ( <span>總數: </span
            >{{ store.selectedItems.length }} )<br />請輸入確認文字「刪除」。
          </p>
          <input
            v-model="deleteConfirmText"
            type="text"
            placeholder="請輸入刪除二字"
            :class="`border border-stroke w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
          />
          <div class="mt-2 -mx-3 flex flex-wrap gap-y-4 flex-row-reverse">
            <div class="w-full px-3">
              <button
                v-if="!store.loading"
                :disabled="deleteConfirmText != '刪除'"
                class="disabled:opacity-70 mt-2 block w-full rounded border border-red bg-red-500 p-3 text-center font-medium text-white"
                @click="handelDelete"
              >
                確認刪除
              </button>
              <button
                v-else
                class="w-full rounded border border-red bg-red-500 px-3 py-3 flex justify-center text-white opacity-75"
              >
                <svg class="animate-spin h-5 w-5 mr-3 border-b-2 border-white rounded-full"></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
