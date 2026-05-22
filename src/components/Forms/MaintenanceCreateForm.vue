<script setup lang="ts">
import { computed, watchEffect, ref, watch, shallowRef } from 'vue';
import type { TreeNode } from '@/types/MachineTree';
import { useUserStore } from '@/stores/user';
import type { MachineComponentSlotOverview } from '@/types/MachineComponentSlot';
import { useMachineComponentSlotMaintenanceStore } from '@/stores/machineComponentSlotMaintenance';
import MaintenanceContentForm from '@/components/Forms/MaintenanceContentForm.vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

type Props = {
  node: TreeNode | null;
  nodeClick: TreeNode | null;
};
const userStore = useUserStore();
const rawParts = ref<MachineComponentSlotOverview | null>(null);
const isLoading = ref(true);
const props = defineProps<Props>();

const regions = ref<TreeNode[]>([]);
const store = useMachineComponentSlotMaintenanceStore();
const isDetailed = ref(false);
const modalContentOpen = shallowRef<boolean>(false);
// const emit = defineEmits<{
//   (e: 'click'): void;
// }>();

const currentSlot = computed(() => {
  return props.node;
});

let seq = 0; // 用序號防止競態覆蓋

watchEffect(async () => {
  // 僅在選到「component 節點」且有 componentID 時才打 API

  isLoading.value = true;
  const mySeq = ++seq;
  try {
    if (!props.node?.componentID) return;
    await store.initOverView(props.node?.componentID); // <─ 已有正確型別
    const data = store.overview;
    if (mySeq === seq && data) rawParts.value = data as MachineComponentSlotOverview;
    console.log(rawParts.value);
  } catch (e) {
    if (mySeq === seq) rawParts.value = null;
    console.log(e);
    // 可選：toast 錯誤
  } finally {
    if (mySeq === seq) isLoading.value = false;
  }
});

type PartLike = {
  name?: string;
  addedAt?: string | number | Date;
  componentGeneralType?: {
    isMultiUnit?: boolean;
    name?: string;
    // add other props used in template if needed
  } | null;
  totalCount?: number;
  componentMetaData?: Array<{
    componentType: any;
    componentCount?: number | string | null;
    installedAt?: string | number | Date;
    operationState?: { minutes?: number; lastCheckTime?: string | number | Date };
  }>;
};

const parts = computed(() => {
  const src = rawParts.value;
  console.log(src);
  if (!src) return null;

  const toHours = (mins?: number) => (mins == null ? '' : (mins / 60).toFixed(2));
  const fmt = (t?: string | number | Date) => {
    if (!t) return '';
    const d = new Date(t);
    return Number.isNaN(d.getTime()) ? '' : d.toLocaleString('zh-TW', { hour12: false });
  };
  const hoursSince = (t?: string | number | Date) => {
    if (!t) return '';
    const d = new Date(t);
    if (Number.isNaN(d.getTime())) return '';
    return ((Date.now() - d.getTime()) / 3600000).toFixed(2);
  };

  const enrich = (p?: PartLike | null) => {
    if (!p) return null;
    const op = p.componentMetaData?.[0]?.operationState;

    return {
      ...p,
      runTime: toHours(op?.minutes ? op.minutes : 0),
      lastCheckTime: fmt(op?.lastCheckTime),
      addedAtStr: fmt(p.addedAt), // 不覆蓋原始 addedAt
      installedTime: hoursSince(p.addedAt) // 小時
    };
  };

  return {
    ...src,
    top: enrich(src.top as PartLike),
    sub: (src.sub ?? []).map((s) => ({
      ...(enrich(s as PartLike) as PartLike),
      isExpanded: (s as any)?.isExpanded ?? false
    }))
  } as MachineComponentSlotOverview & {
    top:
      | (PartLike & {
          runTime?: string;
          lastCheckTime?: string;
          addedAtStr?: string;
          installedTime?: string;
        })
      | null;
    sub: Array<
      PartLike & {
        runTime?: string;
        lastCheckTime?: string;
        addedAtStr?: string;
        installedTime?: string;
        isExpanded: boolean;
      }
    >;
  };
});

const F = (v?: string | number | null) =>
  v === undefined || v === null || v === '' ? '無資料' : String(v);

// const pickPrimaryMeta = (slot: any) => {
//   const list = slot?.componentMetaData ?? [];
//   if (!Array.isArray(list) || !list.length) return null;

//   const preferred = list.filter(
//     (m: any) => m?.componentType?.brandModel && m.componentType.brandModel !== '其他'
//   );
//   const pool = preferred.length ? preferred : list;
//   return (
//     [...pool].sort((a, b) => {
//       const ta = new Date(a?.installedAt ?? 0).getTime();
//       const tb = new Date(b?.installedAt ?? 0).getTime();
//       return tb - ta;
//     })[0] ?? null
//   );
// };
watch(
  () => props.node,
  async (newVal) => {
    if (newVal) {
      isLoading.value = false;
    } else {
      isLoading.value = true;
    }
  },
  { immediate: true }
);

const toggleUnit = () => {
  isDetailed.value = !isDetailed.value;
};

const formatTime = (time: string) => {
  const value = parseFloat(time);
  if (!isDetailed.value) {
    return `${value.toFixed(2)} 小時`;
  } else {
    const days = Math.floor(value / 24) + '天';
    const hours = Math.floor(value % 24) + '小時';
    const minutes = Math.round((value % 1) * 60) + '分';
    return `${days.toString().padStart(2, '0')}${hours
      .toString()
      .padStart(2, '0')}${minutes.toString().padStart(2, '0')}`;
  }
};

const goToMaintenanceForm = () => {
  if (currentSlot.value) {
    const fromRoute = {
      name: route.name,
      params: route.params,
      query: route.query,
      fullPath: route.fullPath
    };
    console.log(props.node?.meta?.machineID);
    localStorage.setItem('maintenanceFormFrom', JSON.stringify(fromRoute));
    localStorage.setItem('regions', JSON.stringify(regions));
    localStorage.setItem(
      'alarmID',
      JSON.stringify({
        source: 'machine-overview',
        machineID: props.node?.meta?.machineID ?? null
      })
    );
    router.push({
      name: 'maintenance-form-create',
      params: { id: props.node?.componentID ?? 0 },
      query: { ns: '1' }
    });
  }
};

const canShowMaintenance = computed(() => {
  if (userStore.user?.type === 0) {
    return true;
  }

  const fid = currentSlot?.value?.factoryID;
  if (fid == null) {
    return false;
  }

  if (typeof userStore.permissionItems === 'undefined') {
    return false;
  }

  const checkPermission = (factoryIDs?: number[]): boolean => {
    if (typeof factoryIDs === 'undefined') {
      return false;
    }

    if (factoryIDs.length === 0) {
      return true;
    }

    return factoryIDs.includes(fid);
  };

  return (
    (userStore.permissionItems &&
      checkPermission(userStore.permissionItems.manage_machine_component_slot_maintenance_form)) ||
    (userStore.permissionItems &&
      checkPermission(userStore.permissionItems.submit_machine_component_slot_maintenance_form))
  );
});
const openConetentModal = () => {
  modalContentOpen.value = true;
};
</script>

<template>
  <div v-if="!isLoading" class="p-4 overflow-x-auto h-[75vh]">
    <!-- Equipment Header -->
    <div class="flex items-center mb-4">
      <div class="flex items-center">
        <span class="inline-block mr-2">
          <ComponentIcon class="h-5 w-5 text-black" />
        </span>
        <h1 class="text-xl font-bold">設備組成名稱：{{ currentSlot?.label }}</h1>
      </div>
    </div>

    <!-- Equipment Details -->
    <div
      class="relative p-6 mb-6 rounded-xl bg-gradient-to-br from-white to-gray-50 shadow-xl border-l-4 border-green-500 overflow-hidden"
    >
      <!-- 裝飾元素 -->
      <div
        class="absolute top-0 right-0 w-24 h-24 bg-green-100 rounded-full -mr-12 -mt-12 opacity-50"
      ></div>

      <!-- 標題與按鈕容器 -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <span class="w-2 h-2 bg-green-500 rounded-full"></span> 零件資訊
        </h2>
        <div class="flex gap-4">
          <button
            class="relative bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
            @click="openConetentModal"
          >
            維護單紀錄
            <span
              class="absolute inset-0 rounded-lg bg-orange-400 opacity-0 hover:opacity-20 transition-opacity duration-300"
            ></span>
          </button>
          <button
            v-if="canShowMaintenance"
            class="relative bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
            @click="goToMaintenanceForm()"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              ></path>
            </svg>
            填寫維護單
            <span
              class="absolute inset-0 rounded-lg bg-green-400 opacity-0 hover:opacity-20 transition-opacity duration-300"
            ></span>
          </button>
        </div>
      </div>
      <!-- 主內容 -->
      <div class="flex flex-col gap-6">
        <!-- 基本資訊 -->
        <div class="bg-white p-5 rounded-lg shadow-sm">
          <div class="flex items-center gap-2 mb-3">
            <span class="w-2 h-2 bg-green-500 rounded-full"></span>
            <h3 class="text-lg font-bold text-gray-800">基本資訊</h3>
          </div>

          <!-- 無資料 -->
          <p v-if="!parts?.top" class="text-gray-400 italic">尚無零件資料</p>

          <!-- 多單元：Table 條列 -->
          <div
            v-else-if="parts.top.componentGeneralType && parts.top.componentGeneralType.isMultiUnit"
            class="overflow-x-auto"
          >
            <table class="min-w-full text-lg">
              <thead class="bg-gray-50 text-gray-600 font-medium">
                <tr>
                  <th class="px-3 py-2 text-left">廠商</th>
                  <th class="px-3 py-2 text-left">型號</th>
                  <th class="px-3 py-2 text-left">規格</th>
                  <th class="px-3 py-2 text-left">品號</th>
                  <th class="px-3 py-2 text-left">數量</th>
                  <th class="px-3 py-2 text-left">安裝時間</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-500 text-gray-800 text-lg">
                <tr v-for="(meta, i) in parts.top.componentMetaData" :key="i">
                  <td class="px-3 py-2">{{ F(meta.componentType?.brand?.name) }}</td>
                  <td class="px-3 py-2">{{ F(meta.componentType?.brandModel) }}</td>
                  <td class="px-3 py-2">{{ F(meta.componentType?.brandSpec) }}</td>
                  <td class="px-3 py-2">{{ F(meta.componentType?.code) }}</td>
                  <td class="px-3 py-2">{{ F(meta.componentCount) }}</td>
                  <td class="px-3 py-2">
                    {{
                      meta.installedAt
                        ? new Date(meta.installedAt).toLocaleString('zh-TW', { hour12: false })
                        : '無資料'
                    }}
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="py-4 text-lg">共 {{ parts.top.totalCount }} ［ 單位 ］</div>
          </div>

          <!-- 單單元：只顯示第一筆 -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="flex flex-col">
              <span class="text-lg text-gray-500">零件名稱</span>
              <span class="text-gray-900 font-medium">{{
                F(parts.top.componentGeneralType?.name)
              }}</span>
            </div>
            <div class="flex flex-col">
              <span class="text-lg text-gray-500">零件型號</span>
              <span class="text-gray-900">{{
                F(parts.top.componentMetaData?.[0]?.componentType?.brandModel)
              }}</span>
            </div>
            <div class="flex flex-col">
              <span class="text-lg text-gray-500">零件廠商</span>
              <span class="text-gray-900">{{
                F(parts.top.componentMetaData?.[0]?.componentType?.brand?.name)
              }}</span>
            </div>
            <div class="flex flex-col">
              <span class="text-lg text-gray-500">零件品號</span>
              <span class="text-gray-900">{{
                F(parts.top.componentMetaData?.[0]?.componentType?.code)
              }}</span>
            </div>
            <div class="flex flex-col sm:col-span-2">
              <span class="text-lg text-gray-500">零件數量</span>
              <span class="text-gray-900 break-words">{{ F(parts.top.totalCount) }}</span>
            </div>
            <div class="flex flex-col sm:col-span-2">
              <span class="text-lg text-gray-500">零件規格</span>
              <span class="text-gray-900 break-words">{{
                F(parts.top.componentMetaData?.[0]?.componentType?.brandSpec)
              }}</span>
            </div>
          </div>
        </div>

        <!-- 運作狀態（放大） -->
        <div v-if="parts?.top" class="bg-white p-6 rounded-lg shadow-sm flex-1">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span class="w-2 h-2 bg-green-500 rounded-full"></span> 運作狀態
            </h3>
            <button
              class="px-3 py-1 text-lg bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition-colors"
              @click="toggleUnit"
            >
              {{ isDetailed ? '顯示小時' : '顯示天數' }}
            </button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="flex flex-col">
              <span class="text-lg text-gray-500">首次零件裝上日期</span>
              <span class="text-gray-900 text-base">
                {{ parts.top.addedAt ? new Date(parts.top.addedAt).toLocaleString() : '無資料' }}
              </span>
            </div>
            <div class="flex flex-col">
              <span class="text-lg text-gray-500">已裝上時間</span>
              <span class="text-gray-900 text-base break-words">
                {{ formatTime(parts.top.installedTime || '') }}
              </span>
            </div>
            <div class="flex flex-col md:col-span-2">
              <span class="text-lg text-gray-500">運轉時數</span>
              <span class="text-gray-900 text-base break-words">
                {{ formatTime(parts.top.runTime || '') }} （截至：{{
                  parts.top.lastCheckTime || '無資料'
                }}）
              </span>
            </div>
          </div>
        </div>

        <!-- 無資料提示 -->
        <p v-else class="text-red-400 italic text-center py-4">尚無零件資料</p>
      </div>
    </div>

    <!-- Child Components Section -->
    <div>
      <h2 class="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <span class="w-2 h-2 bg-green-500 rounded-full"></span> 子零件
      </h2>

      <div v-if="parts?.sub && parts.sub.length > 0" class="space-y-4">
        <div
          v-for="(slot, slotIndex) in parts.sub"
          :key="slotIndex"
          class="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
        >
          <div
            class="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white cursor-pointer"
          >
            <div class="flex items-center gap-2">
              <Blocks class="h-5 w-5 text-green-600" />
              <span class="font-medium text-gray-900">{{ slot?.name ?? '未命名' }}</span>
            </div>
            <svg
              :class="['h-5 w-5 transition-transform']"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          <div class="p-4 pt-0 space-y-4">
            <div class="border-t border-gray-100 pt-2">
              <h3 class="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                基本資訊
                <span
                  v-if="slot.componentGeneralType?.isMultiUnit"
                  class="px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded-full"
                >
                  多單元
                </span>
                <span
                  v-if="Array.isArray(slot?.componentMetaData)"
                  class="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full"
                >
                  已安裝：{{ slot.componentMetaData.length }} 筆
                </span>
              </h3>

              <!-- 多單元：Table 條列 componentMetaData[] -->
              <div v-if="slot.componentGeneralType?.isMultiUnit" class="overflow-x-auto">
                <table class="min-w-full text-lg">
                  <thead class="bg-gray-50 text-gray-600 font-medium">
                    <tr>
                      <th class="px-3 py-2 text-left">廠商</th>
                      <th class="px-3 py-2 text-left">型號</th>
                      <th class="px-3 py-2 text-left">規格</th>
                      <th class="px-3 py-2 text-left">品號</th>
                      <th class="px-3 py-2 text-left">數量</th>
                      <th class="px-3 py-2 text-left">安裝時間</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100">
                    <tr v-for="(meta, mi) in slot.componentMetaData" :key="mi">
                      <td class="px-3 py-2">
                        {{ F(meta?.componentType?.brand?.name ?? '無資料') }}
                      </td>
                      <td class="px-3 py-2">
                        {{ F(meta?.componentType?.brandModel ?? '無資料') }}
                      </td>
                      <td class="px-3 py-2">
                        {{ F(meta?.componentType?.brandSpec ?? '無資料') }}
                      </td>
                      <td class="px-3 py-2">{{ F(meta?.componentType?.code ?? '無資料') }}</td>
                      <td class="px-3 py-2">{{ F(meta?.componentCount ?? slot.totalCount) }}</td>
                      <td class="px-3 py-2">
                        {{
                          meta?.installedAt
                            ? new Date(meta.installedAt).toLocaleString('zh-TW', { hour12: false })
                            : slot.addedAt || '無資料'
                        }}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div class="py-4 text-lg">共 {{ slot.totalCount }} ［ 單位 ］</div>
              </div>

              <!-- 單單元：顯示一筆（自動挑 primary 或退回第 0 筆） -->
              <template v-else>
                <table class="min-w-full text-lg">
                  <thead class="bg-gray-50 text-gray-600 font-medium">
                    <tr>
                      <th class="px-3 py-2 text-left">廠商</th>
                      <th class="px-3 py-2 text-left">型號</th>
                      <th class="px-3 py-2 text-left">規格</th>
                      <th class="px-3 py-2 text-left">品號</th>
                      <th class="px-3 py-2 text-left">數量</th>
                      <th class="px-3 py-2 text-left">安裝時間</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100">
                    <tr v-for="(meta, mi) in slot.componentMetaData" :key="mi">
                      <td class="px-3 py-2">
                        {{ F(meta?.componentType?.brand?.name ?? '無資料') }}
                      </td>
                      <td class="px-3 py-2">
                        {{ F(meta?.componentType?.brandModel ?? '無資料') }}
                      </td>
                      <td class="px-3 py-2">
                        {{ F(meta?.componentType?.brandSpec ?? '無資料') }}
                      </td>
                      <td class="px-3 py-2">{{ F(meta?.componentType?.code ?? '無資料') }}</td>
                      <td class="px-3 py-2">{{ F(meta?.componentCount ?? slot.totalCount) }}</td>
                      <td class="px-3 py-2">
                        {{
                          meta?.installedAt
                            ? new Date(meta.installedAt).toLocaleString('zh-TW', { hour12: false })
                            : slot.addedAt || '無資料'
                        }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </template>
            </div>

            <div class="border-t border-gray-100 pt-2">
              <h3 class="text-lg font-semibold text-gray-700 mb-2">運作狀態</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-lg">
                <p>
                  <span class="text-gray-500">零件裝上日期：</span>
                  <span class="text-gray-900">{{
                    slot.addedAt ? new Date(slot.addedAt).toLocaleString() : '無資料'
                  }}</span>
                </p>
                <p>
                  <span class="text-gray-500">已裝上時間：</span>
                  <span class="text-gray-900">{{ slot.installedTime || '無資料' }}小時</span>
                </p>
                <p class="flex flex-col md:col-span-2">
                  <span class="text-gray-500">運轉時數：</span>
                  <span class="text-gray-900"
                    >{{ slot.runTime || '無資料' }}小時 (截至：{{
                      slot.lastCheckTime || '無資料'
                    }})</span
                  >
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="bg-white p-4 rounded-xl shadow-md text-center text-gray-500">無子零件</div>
    </div>
  </div>
  <div v-else class="flex justify-center items-center pt-20">
    <svg class="animate-spin h-6 w-6 mr-3 text-green-600" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
    載入中...
  </div>
  <MaintenanceContentForm
    v-if="modalContentOpen"
    :openModal="modalContentOpen"
    :roots="regions"
    :node="props.nodeClick"
    @do-close="modalContentOpen = false"
  />
</template>
