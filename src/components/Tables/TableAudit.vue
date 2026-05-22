<script setup lang="ts">
import { onMounted, ref, watch, shallowRef } from 'vue';
import { useAuditStore } from '@/stores/audit';
import PaginationComponent from '@/components/Pagination/PaginationComponent.vue';
import { useUserStore } from '@/stores/user';
import type { User } from '@/types/User';
import type { AuditEvent } from '@/types/AuditEvent';
import RangeDatetimePicker from '@/components/Forms/DatePicker/RangeDatetimePicker.vue';
// import KeywordFilter from '@/components/Forms/SearchBar/KeywordFilter.vue';
import UserCheckbox from '@/components/Modals/Selector/UserCheckbox.vue';
import AuditCheckbox from '@/components/Modals/Selector/AuditCheckbox.vue';
import dayjs from 'dayjs';

const showDialog = ref(false);
const currentDetail = ref('');
const rangeDatetime = ref<[string, string]>(['', '']);
const modalUserCheckboxOpen = shallowRef<boolean>(false);
const modalAuditCheckboxOpen = shallowRef<boolean>(false);

const props = defineProps<{
  showOperation: boolean;
}>();

const store = useAuditStore();
const userStore = useUserStore();

onMounted(() => {
  store.searchColumns.keyword = '';
  fetchData();
});

const fetchData = async () => {
  await store.fetch();
};

// const doSearch = async (queryString: string) => {
//   store.searchColumns.keyword = queryString;
//   await store.fetch();
// };

function openDetail(detail: string) {
  currentDetail.value = detail || '-';
  showDialog.value = true;
}
function closeDialog() {
  showDialog.value = false;
}

const openUserCheckboxModal = () => {
  modalUserCheckboxOpen.value = true;
};

const openAuditCheckboxModal = () => {
  modalAuditCheckboxOpen.value = true;
};

const cancelSearchStaffID = (staffID: number) => {
  store.searchColumns.staffIDs = (store.searchColumns.staffIDs ?? []).filter(
    (id) => id !== staffID
  );
  if (!store.searchColumns.staffs) return;
  store.searchColumns.staffs = store.searchColumns.staffs.filter(
    (item: User) => item.id !== staffID
  );
  store.fetch();
};

const handleUserCheckboxSubmit = (users: User[]) => {
  store.searchColumns.staffIDs = users.map((user) => user.id);

  store.searchColumns.staffs = users;
  modalUserCheckboxOpen.value = false;

  store.fetch();
};

const cancelSearchAuditEvent = (staffID: number) => {
  store.searchColumns.auditEventIDs = (store.searchColumns.auditEventIDs ?? []).filter(
    (id) => id !== staffID
  );
  if (!store.searchColumns.AuditEvents) return;
  store.searchColumns.AuditEvents = store.searchColumns.AuditEvents.filter(
    (item: AuditEvent) => item.id !== staffID
  );
  store.fetch();
};

const handleAuditEventCheckboxSubmit = (users: AuditEvent[]) => {
  store.searchColumns.auditEventIDs = users.map((user) => user.id);

  store.searchColumns.AuditEvents = users;
  modalAuditCheckboxOpen.value = false;

  store.fetch();
};

watch(rangeDatetime, () => {
  if (!rangeDatetime.value[0]) rangeDatetime.value[0] = '';
  store.searchColumns.createAtStart = rangeDatetime.value[0];
  if (rangeDatetime.value[0] && !rangeDatetime.value[1]) {
    const endDate = new Date(rangeDatetime.value[0]);
    endDate.setHours(23, 59, 59, 999);
    rangeDatetime.value[1] = endDate.toString();
  }
  store.searchColumns.createAtEnd = rangeDatetime.value[1];
  store.fetch();
});
</script>

<template>
  <div
    class="rounded border border-stroke bg-white px-6 pt-6 pb-4 shadow-md dark:border-strokedark dark:bg-boxdark sm:px-8"
  >
    <!-- <KeywordFilter @do-search="doSearch" /> -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-1">
      <RangeDatetimePicker v-model="rangeDatetime" placeholder="產生時間區間" class="w-full" />
      <div>
        <div class="relative">
          <button
            class="w-full bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 focus:ring-2 focus:ring-orange-300 transition-all duration-200"
            @click="openUserCheckboxModal()"
          >
            人員
          </button>
          <div class="flex flex-wrap mt-2 gap-2 overflow-x-auto">
            <div
              v-for="item in store.searchColumns.staffs"
              :key="item.id"
              class="flex items-center bg-orange-100 text-orange-800 text-sm px-2 py-1 rounded-full hover:bg-orange-200 transition-all duration-200 cursor-pointer"
              @click="cancelSearchStaffID(item.id)"
            >
              <span class="truncate max-w-[100px]">{{ item.name || '-' }}</span>
              <span class="ml-1 text-xs font-bold">×</span>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="relative">
          <button
            class="w-full bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 focus:ring-2 focus:ring-orange-300 transition-all duration-200"
            @click="openAuditCheckboxModal()"
          >
            事件類型
          </button>
          <div class="flex flex-wrap mt-2 gap-2 overflow-x-auto">
            <div
              v-for="item in store.searchColumns.AuditEvents"
              :key="item.id"
              class="flex items-center bg-orange-100 text-orange-800 text-sm px-2 py-1 rounded-full hover:bg-orange-200 transition-all duration-200 cursor-pointer"
              @click="cancelSearchAuditEvent(item.id)"
            >
              <span class="truncate max-w-[100px]">{{ item.name || '-' }}</span>
              <span class="ml-1 text-xs font-bold">×</span>
            </div>
          </div>
        </div>
      </div>
      <!-- <button
            v-if="
              (store.searchColumns.factories?.length ?? 0) ||
              (store.searchColumns.MachineSystems?.length ?? 0) ||
              (store.searchColumns.machines?.length ?? 0) ||
              (store.searchColumns.machineComponentSlot?.length ?? 0) ||
              (store.searchColumns.machineTypes?.length ?? 0) ||
              (store.searchColumns.componentGeneralTypes?.length ?? 0) ||
              (store.searchColumns.staffs?.length ?? 0) ||
              maintenanceDatetime[0] !== '' ||
              createDatetime[0] !== ''
            "
            class="px-4 py-2 bg-orange-800 text-white rounded-lg hover:bg-orange-600 focus:ring-2 focus:ring-red-300 focus:outline-none transition-all duration-200 font-medium text-sm flex items-center justify-center"
            :disabled="isLoading"
            @click="clearAllFilters"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            清除全部篩選條件
          </button> -->
    </div>
    <PaginationComponent
      v-if="store.pagination"
      v-model="store.itemsPerPage"
      :pagination="store.pagination"
      @items-per-page-changed="store.goItemsPerPage"
      @page-changed="store.goPage"
    />

    <div class="flex flex-col mt-4">
      <div class="grid grid-cols-[min-content,1fr,min-content] bg-gray-100 dark:bg-meta-4 rounded">
        <div :class="props.showOperation ? 'flex w-fit max-w-[150px] p-2' : 'w-fit max-w-[150px]'">
          <div v-if="props.showOperation" class="flex items-center"></div>
          <div class="text-center font-semibold w-[50px]">ID</div>
        </div>

        <div class="grid grid-cols-6 p-3">
          <div class="text-center truncate">事件描述</div>
          <div class="text-center truncate">讀取方式</div>
          <div class="text-center truncate">發生時間</div>
          <div class="text-center truncate">操作人</div>
          <div class="text-center truncate">IP</div>
          <div class="col-span-1 text-left truncate pl-3">操作</div>
        </div>
      </div>

      <div
        v-for="(item, key) in store.items"
        :key="key"
        :class="[
          'grid grid-cols-[min-content,1fr,min-content] transition hover:bg-green-50',
          store.lastOperationId === item.id ? 'bg-amber-50' : '',
          key < store.items.length - 1 ? 'border-b border-stroke dark:border-strokedark' : ''
        ]"
      >
        <div v-if="props.showOperation" class="flex items-center p-3">
          <div v-if="userStore.isAdmin" class="text-center text-black truncate w-[50px]">
            {{ item.id }}
          </div>
        </div>
        <div class="grid grid-cols-6 p-3">
          <div class="text-center text-black truncate">
            {{ item.eventName }}
          </div>
          <div class="text-center text-black truncate">
            {{ item.eventIsRead ? '純讀取' : '非純讀取' }}
          </div>
          <div class="text-center text-meta-3 truncate">
            {{ dayjs(item.createAt).format('YYYY-MM-DD HH:mm:ss') }}
          </div>
          <div class="text-center text-meta-3 truncate">
            {{ item.staffName }}
          </div>
          <div class="text-center text-meta-3 truncate">
            {{ item.ipv4 }}
          </div>
          <div class="col-span-1 text-left">
            <button
              class="text-blue-500 underline hover:text-blue-700"
              type="button"
              @click="openDetail(item.detail)"
            >
              查看內容
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showDialog" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl relative">
        <h3 class="text-lg font-semibold mb-4">詳細內容</h3>
        <p class="text-gray-800 whitespace-pre-wrap break-words">{{ currentDetail }}</p>
        <div class="mt-6 text-right">
          <button
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            @click="closeDialog"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
    <PaginationComponent
      v-if="store.pagination"
      v-model="store.itemsPerPage"
      :pagination="store.pagination"
      class="mt-4"
      @items-per-page-changed="store.goItemsPerPage"
      @page-changed="store.goPage"
    />
  </div>
  <UserCheckbox
    v-if="modalUserCheckboxOpen || (store.searchColumns.staffIDs?.length ?? 0)"
    :openModal="modalUserCheckboxOpen"
    :ids="store.searchColumns.staffIDs || []"
    @do-close="modalUserCheckboxOpen = false"
    @do-submit="handleUserCheckboxSubmit"
  />
  <AuditCheckbox
    v-if="modalAuditCheckboxOpen"
    :openModal="modalAuditCheckboxOpen"
    :ids="store.searchColumns.auditEventIDs || []"
    @do-close="modalAuditCheckboxOpen = false"
    @do-submit="handleAuditEventCheckboxSubmit"
  />
</template>
