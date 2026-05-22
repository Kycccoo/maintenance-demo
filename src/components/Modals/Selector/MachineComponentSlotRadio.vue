<script setup lang="ts">
import { useMachineComponentSlotStore } from '@/stores/machineComponentSlot';
import { onMounted, ref, shallowRef, watch } from 'vue';
import KeywordFilter from '@/components/Forms/SearchBar/KeywordFilter.vue';
import PaginationComponent from '@/components/Pagination/PaginationComponent.vue';
import type { MachineComponentSlot } from '@/types/MachineComponentSlot';
import MachineComponentSlotDetailModal from '@/components/Modals/Details/MachineComponentSlotDetailModal.vue';
import ComponentGeneralTypeCheckbox from '@/components/Modals/Selector/ComponentGeneralTypeCheckbox.vue';
import type { Factory } from '@/types/Factory';
import MachineCheckbox from '@/components/Modals/Selector/MachineCheckbox.vue';
import type { Machine } from '@/types/Machine';
import type { ComponentGeneralType } from '@/types/ComponentGeneralType';
// 使用 Error Store
const store = useMachineComponentSlotStore();

const props = defineProps<{
  openModal: boolean;
  factory?: Factory;
  item?: MachineComponentSlot;
}>();

watch(
  () => props.item,
  (newValue) => {
    if (!newValue) return;
    selectedItem.value = newValue;
    selectedID.value = newValue.id;
    fetch(1);
  }
);

// const keyword = shallowRef<string>('');
const itemsPerPage = shallowRef<number>(10);
const selectedID = shallowRef<number | null>();
const selectedItem = ref<MachineComponentSlot | null>();
const currentPage = shallowRef<number>(1);
const searchMachineIDs = ref<number[]>([]);
const searchComponentGeneralTypeIDs = ref<number[]>([]);
const modalComponentGeneralTypeCheckboxOpen = shallowRef<boolean>(false);
const modalSearchMachineOpen = shallowRef<boolean>(false);
const searchComponentGeneralTypes = ref<ComponentGeneralType[]>([]);
const searchMachines = ref<Machine[]>([]);
const emit = defineEmits(['do-submit', 'do-close']);

const doSubmit = (): void => {
  emit('do-submit', selectedItem.value);
};

const doClose = (): void => {
  emit('do-close');
};

onMounted(() => {
  store.searchColumns.keyword = '';
  fetch(1);
});

const fetch = async (page: number) => {
  store.currentPage = page;
  await store.fetchAll();
};

const toggleSelection = async (id: number) => {
  if (selectedID.value === id) {
    selectedID.value = null;
    selectedItem.value = null;
  } else {
    selectedID.value = id;
    const items: MachineComponentSlot[] = store.items.filter((item) => item.id === id);
    if (items.length > 0) {
      selectedItem.value = items.pop() || null;
    }
  }
};

const handleSearch = (searchQuery: string) => {
  store.searchColumns.keyword = searchQuery;
  currentPage.value = 1;
  fetch(1);
};

const modalDetailOpen = shallowRef<boolean>(false);
const detailMachineComponentSlot = ref<MachineComponentSlot | null>(null);
const openDetailModal = (machineComponentSlot: MachineComponentSlot) => {
  detailMachineComponentSlot.value = machineComponentSlot;
  modalDetailOpen.value = true;
};
const closeDetailModal = () => {
  modalDetailOpen.value = false;
};
const openComponentGeneralTypeCheckboxModal = () => {
  modalComponentGeneralTypeCheckboxOpen.value = true;
};
const closeComponentGeneralTypeCheckboxModal = () => {
  modalComponentGeneralTypeCheckboxOpen.value = false;
};
const handleComponentGeneralTypeCheckboxSubmit = (items: ComponentGeneralType[]) => {
  searchComponentGeneralTypes.value = items;
  searchComponentGeneralTypeIDs.value = items.map((item) => item.id);
  closeComponentGeneralTypeCheckboxModal();
  fetch(currentPage.value);
};
const handleSearchMachine = (items: Machine[]) => {
  searchMachineIDs.value = items.map((item) => item.id);
  searchMachines.value = items;
  closeSearchMachineModal();
  fetch(currentPage.value);
};
const closeSearchMachineModal = () => {
  modalSearchMachineOpen.value = false;
};
const cancelSearchMachineID = (machineID: number) => {
  searchMachineIDs.value = searchMachineIDs.value.filter((id) => id != machineID);
  if (!searchMachines.value) return;
  searchMachines.value = searchMachines.value.filter((item: Machine) => item.id !== machineID);
  fetch(currentPage.value);
};
const cancelSearchComponentGeneralTypesID = (componentGeneralTypeID: number) => {
  searchComponentGeneralTypeIDs.value = searchComponentGeneralTypeIDs.value.filter(
    (id) => id != componentGeneralTypeID
  );
  if (!searchComponentGeneralTypes.value) return;
  searchComponentGeneralTypes.value = searchComponentGeneralTypes.value.filter(
    (item: ComponentGeneralType) => item.id !== componentGeneralTypeID
  );
  fetch(currentPage.value);
};
</script>

<template>
  <div
    v-if="props.openModal"
    class="fixed left-0 top-0 z-[1000] flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5"
  >
    <div
      class="relative w-[90vw] rounded-lg bg-white px-8 py-4 text-center dark:bg-boxdark md:px-17.5 md:py-7"
    >
      <div>
        <button class="absolute text-black top-6 right-8" @click="doClose">
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
        <h3 class="pb-2 text-lg font-bold text-black dark:text-white sm:text-2xl">零件插槽選擇</h3>
        <KeywordFilter @do-search="handleSearch" />
        <label class="block font-medium text-black dark:text-white">可用進階篩選條件</label>
        <div class="grid grid-cols-2 gap-2 mb-1">
          <div class="mt-1">
            <div class="relative">
              <div>
                <button
                  class="bg-primary text-white px-4 py-2 rounded-md w-full font-medium"
                  @click="modalSearchMachineOpen = true"
                >
                  主設備
                </button>
              </div>
              <div class="flex flex-wrap mt-1">
                <div
                  v-for="item in searchMachines"
                  :key="item.id"
                  class="flex mr-1 mb-1 items-center justify-between bg-black text-white text-sm px-2 py-1 rounded"
                  @click="cancelSearchMachineID(item.id)"
                >
                  <span class="truncate">{{ item.name || '-' }}</span>
                  <span class="ml-1"><span class="text-xs">✕</span></span>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-1">
            <div class="relative">
              <div>
                <button
                  class="bg-primary text-white px-4 py-2 rounded-md w-full font-medium"
                  @click="openComponentGeneralTypeCheckboxModal"
                >
                  通用零件類型
                </button>
              </div>
              <div class="flex flex-wrap mt-1">
                <div
                  v-for="item in searchComponentGeneralTypes"
                  :key="item.id"
                  class="flex mr-1 mb-1 items-center justify-between bg-black text-white text-sm px-2 py-1 rounded"
                  @click="cancelSearchComponentGeneralTypesID(item.id)"
                >
                  <span class="truncate">{{ item?.name }}</span>
                  <span class="ml-1"><span class="text-xs">✕</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-8 p-4">
          <!-- Left Column -->
          <div>
            <!-- Header Row -->
            <div class="grid grid-cols-[min-content,1fr,min-content] gap-4 font-bold mb-2">
              <span class="w-[28px]"></span>
              <div class="grid grid-cols-2">
                <span>主設備</span>
                <span>通用零件類型</span>
              </div>
              <span class="w-[45px]"></span>
            </div>
            <!-- Item Rows -->
            <div class="space-y-2">
              <!-- Row -->
              <div
                v-for="item in store.firstPage"
                :key="item.id"
                class="grid grid-cols-[min-content,1fr,min-content] items-center gap-3 hover:bg-green-50 p-1"
              >
                <div class="inline-flex items-center" @click="toggleSelection(item.id)">
                  <label class="relative flex items-center cursor-pointer" for="html">
                    <input
                      :checked="selectedID === item.id"
                      type="radio"
                      class="peer h-6 w-6 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all shadow hover:shadow-md"
                      @click="toggleSelection(item.id)"
                    />
                    <span
                      class="absolute bg-primary w-4 h-4 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    ></span>
                  </label>
                </div>
                <div class="grid grid-cols-2">
                  <span class="truncate" @click="toggleSelection(item.id)">{{
                    item?.machine?.name || '-'
                  }}</span>
                  <span class="truncate" @click="toggleSelection(item.id)">{{
                    item?.componentGeneralType?.name || '-'
                  }}</span>
                </div>
                <button
                  class="text-sm w-[45px] rounded bg-primary text-center text-white px-2 py-1"
                  @click="openDetailModal(item)"
                >
                  詳情
                </button>
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div>
            <!-- Header Row -->
            <div class="grid grid-cols-[min-content,1fr,min-content] gap-4 font-bold mb-2">
              <span class="w-[28px]"></span>
              <div class="grid grid-cols-2">
                <span>主設備</span>
                <span>通用零件類型</span>
              </div>
              <span class="w-[45px]"></span>
            </div>
            <!-- Item Rows -->
            <div class="space-y-2">
              <div
                v-for="item in store.secondPage"
                :key="item.id"
                class="grid grid-cols-[min-content,1fr,min-content] items-center gap-3 hover:bg-green-50 p-1"
              >
                <div class="inline-flex items-center" @click="toggleSelection(item.id)">
                  <label class="relative flex items-center cursor-pointer" for="html">
                    <input
                      :checked="selectedID === item.id"
                      type="radio"
                      class="peer h-6 w-6 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all shadow hover:shadow-md"
                      @click="toggleSelection(item.id)"
                    />
                    <span
                      class="absolute bg-primary w-4 h-4 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    ></span>
                  </label>
                </div>
                <div class="grid grid-cols-2">
                  <span class="truncate" @click="toggleSelection(item.id)">{{
                    item?.machine?.name || '-'
                  }}</span>
                  <span class="truncate" @click="toggleSelection(item.id)">{{
                    item?.componentGeneralType?.name || '-'
                  }}</span>
                </div>
                <button
                  class="text-sm w-[45px] rounded bg-primary text-center text-white px-2 py-1"
                  @click="openDetailModal(item)"
                >
                  詳情
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="-mx-3 flex flex-wrap">
          <div class="w-full">
            <PaginationComponent
              v-if="store.pagination"
              v-model="itemsPerPage"
              :pagination="store.pagination"
              :centerMode="true"
              @items-per-page-changed="store.goItemsPerPage"
              @page-changed="store.goPage"
            />
          </div>
          <div class="w-full flex justify-center">
            <button
              :disabled="selectedID === null"
              class="disabled:opacity-70 px-30 block w-fit rounded border border-primary bg-primary p-3 text-center font-medium text-white transition hover:bg-opacity-90"
              @click="doSubmit"
            >
              選取完成
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <MachineCheckbox
    v-if="modalSearchMachineOpen"
    :open-modal="modalSearchMachineOpen"
    :ids="searchMachineIDs"
    :factories="props?.factory ? [props.factory] : []"
    @do-close="closeSearchMachineModal"
    @do-submit="handleSearchMachine"
  />
  <ComponentGeneralTypeCheckbox
    :open-modal="modalComponentGeneralTypeCheckboxOpen"
    :items="searchComponentGeneralTypes"
    @do-close="closeComponentGeneralTypeCheckboxModal"
    @do-submit="handleComponentGeneralTypeCheckboxSubmit"
  />
  <MachineComponentSlotDetailModal
    v-if="modalDetailOpen && detailMachineComponentSlot"
    :component-grenral-type-ids="searchComponentGeneralTypeIDs"
    :machine-ids="searchComponentGeneralTypeIDs"
    :open-modal="modalDetailOpen"
    :detail-machine-component-slot="detailMachineComponentSlot"
    @do-close="closeDetailModal"
  />
</template>
