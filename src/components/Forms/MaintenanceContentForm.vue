<script setup lang="ts">
import { onMounted, watch, ref, computed } from 'vue';
import { useMachineComponentSlotMaintenanceStore } from '@/stores/machineComponentSlotMaintenance';
import { getComponentSloNav } from '@/api/services/machineComponentSlot';
import type { TreeNode } from '@/types/MachineTree';
import type { MachineComponentSlotMaintenance } from '@/types/MachineComponentSlotMaintenance';
import type { MaintenanceStatus } from '@/api/services/machineComponentSlot';
import { useMachineComponentSlotStore } from '@/stores/machineComponentSlot';
import { useMachineStore } from '@/stores/machine';
import { useComponentTypeStore } from '@/stores/componentType';
import { useComponentBrandStore } from '@/stores/componentBrand';
import MaintenanceDialogComponent from '@/components/Modals/Details/MaintenanceDialogComponent.vue';

const store = useMachineComponentSlotMaintenanceStore();
const storeMachineSlot = useMachineComponentSlotStore();
const storeMachine = useMachineStore();

const storeComponentTypeStore = useComponentTypeStore();
const storeComponentBrandStore = useComponentBrandStore();
const emit = defineEmits(['do-close']);
type Props = {
  openModal?: boolean;
  roots: TreeNode[];
  node: TreeNode | null;
};

const props = defineProps<Props>();
const data = ref<MachineComponentSlotMaintenance[]>([]);
const navs = ref<Record<number, MaintenanceStatus | null>>({});
const isDialogLoading = ref(false);
const dialogVisible = ref(false);
const dialogData = ref<MachineComponentSlotMaintenance>({
  id: 0,
  factoryIDs: [],
  machineSystemIDs: [],
  machineIDs: [],
  machineTypeIDs: [],
  componentGeneralTypeIDs: [],
  componentGeneralTypeIDsForComponents: [],
  machineComponentSlotIDs: [],
  number: '',
  intouchName: '',
  createAt: '',
  machineComponentSlotID: 0,
  submittedStaffID: 0,
  staffID: 0,
  malfunctionAt: '',
  finishAt: '',
  isHumanError: false,
  failureCause: '',
  failureCategory: '',
  maintainer: '',
  workerCount: 0,
  maintenanceHour: 0,
  equipment: '',
  note: '',
  addedComponentNames: [],
  installedComponents: [],
  removedComponents: [],
  fixedComponents: [],
  attachments: []
});

onMounted(async () => {
  fetch();
});

const loadNav = async (id: number) => {
  if (!navs.value[id]) {
    navs.value[id] = await getComponentSloNav(id);
  }
};

const resetSearch = () => {
  store.searchColumns = {
    keyword: '',
    factoryIDs: [],
    machineSystemIDs: [],
    machineTypeIDs: [],
    machineIDs: [],
    machineComponentSlotIDs: []
  };
};

const fetch = async () => {
  resetSearch();
  store.searchColumns.factoryIDs =
    typeof props.node?.meta?.factoryID === 'number' ? [props.node.meta.factoryID] : [];
  store.searchColumns.machineSystemIDs =
    typeof props.node?.meta?.systemID === 'number' ? [props.node.meta.systemID] : [];
  store.searchColumns.machineIDs =
    typeof props.node?.meta?.machineID === 'number' ? [props.node.meta.machineID] : [];
  store.searchColumns.machineComponentSlotIDs =
    typeof props.node?.componentID === 'number' ? [props.node.componentID] : [];
  store.orderColumns.orderByCreateAt = undefined as any;
  store.orderColumns.orderByFinishAt = -1;
  // store.searchColumns.filterAdmin = true;
  const res = await store.fetch();
  data.value = res.data;

  res.data.forEach((item) => loadNav(item.machineComponentSlotID));
};

const rows = computed(() =>
  data.value.map((item) => {
    const nav = navs.value[item.machineComponentSlotID] ?? null;
    const machineID = nav?.machineComponentSlot?.machineID ?? -1;
    const machine = machineID >= 0 ? nav?.machines?.[machineID] : undefined;
    const sysIDsRaw = machineID >= 0 ? nav?.machineToMachineSystemIDs?.[machineID] : [];
    const sysIDs = Array.isArray(sysIDsRaw) ? sysIDsRaw : [];
    const sysNames = sysIDs
      .map((id) => nav?.machineSystems?.[id]?.name)
      .filter(Boolean) as string[];

    return {
      id: item.id,
      number: item.number,
      factoryName: nav?.factory?.name ?? item.factoryName ?? item.maintainer ?? '-',
      machineSystemNames: sysNames[0],
      machineName: machine?.name ?? item.machineName ?? '-',
      componentName: nav?.componentGeneralType?.name ?? item.componentName ?? '-',
      isMultiUnit: !!nav?.componentGeneralType?.isMultiUnit,
      createAt: item.createAt,
      malfunctionAt: item.malfunctionAt,
      finishAt: item.finishAt,
      installed:
        item.installedComponents?.map((c) => `${c.name ?? '未命名'}×${c.componentCount ?? 1}`) ??
        [],
      removed:
        item.removedComponents?.map((c) => `${c.name ?? '未命名'}×${c.componentCount ?? 1}`) ?? [],
      fixed:
        item.fixedComponents?.map((c) => `${c.name ?? '未命名'}×${c.componentCount ?? 1}`) ?? [],
      attachmentsCount: item.attachments?.length ?? 0,
      failureCategory: item.failureCategory,
      failureCause: item.failureCause,
      note: item.note,
      slotId: item.machineComponentSlotID
    };
  })
);

const fmtDateTime = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleString(undefined, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    : '-';

const openDialog = async (id: number) => {
  if (isDialogLoading.value) return;
  isDialogLoading.value = true;
  dialogVisible.value = true;

  try {
    const maintenanceData = await store.getMaintenance(id);

    const [staffList, slotMachineList] = await Promise.all([
      store.getStaff(maintenanceData.staffID),
      storeMachineSlot.getComponentSlot(maintenanceData.machineComponentSlotID)
    ]);

    await store.appendAttachmentFileKey(maintenanceData);
    await store.appendAttachment(maintenanceData, resolution.value, false);

    for (const sup of maintenanceData.supplements ?? []) {
      await store.appendAttachmentFileKey(sup as any);
      await store.appendAttachment(sup as any, resolution.value, false);
    }
    const staffSubmitNamea = await store.getStaff(maintenanceData.submittedStaffID);
    maintenanceData.staffSubmitName = staffSubmitNamea?.name ?? '未知';
    maintenanceData.staffName = staffList?.name ?? '未知';

    maintenanceData.componentName = slotMachineList?.name ?? '未知';

    if (slotMachineList.machineID) {
      const machine = await storeMachine.getMachine(slotMachineList.machineID);
      maintenanceData.machineName = machine?.name ?? '未知';
    } else {
      maintenanceData.machineName = '未知';
    }
    maintenanceData.note = maintenanceData.note?.replace(/\n/g, '<br>') ?? '無';

    if (maintenanceData.installedComponents?.length) {
      const componentTypeIds = maintenanceData.installedComponents
        .map((item) => item?.componentTypeID)
        .filter((id) => id !== undefined && id !== null);

      const componentDetailsPromises = componentTypeIds.map(async (typeId) => {
        const details = await storeComponentTypeStore.getComponentTypes(typeId);
        return {
          componentTypeID: typeId,
          details: details || {
            brandModel: '-',
            brandSpec: '-',
            brandID: 0,
            code: '-'
          }
        };
      });

      const componentDetailsArray = await Promise.all(componentDetailsPromises);

      maintenanceData.installedComponents = await Promise.all(
        maintenanceData.installedComponents.map(async (item) => {
          const matchingDetail = componentDetailsArray.find(
            (detail) => detail.componentTypeID === item.componentTypeID
          );

          let brandName = '-';
          if (matchingDetail?.details?.brandID !== undefined) {
            try {
              const brandResponse = await storeComponentBrandStore.getBrand(
                matchingDetail.details.brandID
              );

              brandName = brandResponse?.name || '-';
            } catch (error) {
              console.error('獲取 brandName 失敗', error);
            }
          }

          return {
            ...item,
            componentDetails: matchingDetail
              ? {
                  brandID: matchingDetail.details.brandID || 0,
                  brandName,
                  brandModel: matchingDetail.details.brandModel || '-',
                  brandSpec: matchingDetail.details.brandSpec || '-',
                  code: matchingDetail.details.code || '-'
                }
              : {
                  brandID: 0,
                  brandName: '-',
                  brandModel: '-',
                  brandSpec: '-',
                  code: '-'
                }
          };
        })
      );
    }

    if (maintenanceData.removedComponents?.length) {
      const componentTypeIds = maintenanceData.removedComponents
        .map((item) => item?.componentTypeID)
        .filter((id) => id !== undefined && id !== null);

      const componentDetailsPromises = componentTypeIds.map(async (typeId) => {
        const details = await storeComponentTypeStore.getComponentTypes(typeId);
        return {
          componentTypeID: typeId,
          details: details || {
            brandModel: '-',
            brandSpec: '-',
            brandID: 0,
            code: '-'
          }
        };
      });

      const componentDetailsArray = await Promise.all(componentDetailsPromises);

      maintenanceData.removedComponents = await Promise.all(
        maintenanceData.removedComponents.map(async (item) => {
          const matchingDetail = componentDetailsArray.find(
            (detail) => detail.componentTypeID === item.componentTypeID
          );

          let brandName = '-';
          if (matchingDetail?.details?.brandID !== undefined) {
            try {
              const brandResponse = await storeComponentBrandStore.getBrand(
                matchingDetail.details.brandID
              );

              brandName = brandResponse?.name || '-';
            } catch (error) {
              console.error('獲取 brandName 失敗', error);
            }
          }

          return {
            ...item,
            componentDetails: matchingDetail
              ? {
                  brandID: matchingDetail.details.brandID || 0,
                  brandName,
                  brandModel: matchingDetail.details.brandModel || '-',
                  brandSpec: matchingDetail.details.brandSpec || '-',
                  code: matchingDetail.details.code || '-'
                }
              : {
                  brandID: 0,
                  brandName: '-',
                  brandModel: '-',
                  brandSpec: '-',
                  code: '-'
                }
          };
        })
      );
    }

    dialogData.value = maintenanceData;
  } catch (error) {
    console.error('獲取維護資訊失敗', error);
  } finally {
    isDialogLoading.value = false;
  }
};

const doClose = (): void => {
  emit('do-close');
};

const resolution = computed<'1x' | '2x' | '3x' | 'original'>(() => {
  const dpr = window.devicePixelRatio || 1;
  if (dpr >= 3) return '3x';
  if (dpr >= 2) return '2x';
  return '1x';
});

function formatDate(dateStr: string | number | Date) {
  try {
    const date = new Date(dateStr);
    if (!dateStr || isNaN(date.getTime())) return '無資料';
    return date.toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  } catch (e) {
    console.log(e);
    return '無資料';
  }
}

watch(
  () => props.node,
  () => {
    fetch();
  }
);
</script>
<template>
  <transition name="fade">
    <div
      v-if="props.openModal"
      class="fixed left-0 top-0 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5"
    >
      <!-- 容器改為單欄置中，限制最大寬度 -->
      <div
        class="relative w-full max-w-7xl h-[90vh] overflow-y-auto rounded-lg bg-white px-6 py-4 text-left dark:bg-boxdark md:px-10 md:py-7"
      >
        <button class="absolute text-black top-6 right-6" @click="doClose">
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
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold">
              此
              <span class="text-green-600"
                >＜{{ props.node?.label || '全部' }} ({{ props.node?.type || 'ALL' }})＞ </span
              >維護單（近期10筆）
            </h2>
          </div>
          <div class="overflow-hidden rounded-xl border">
            <div class="overflow-x-auto">
              <table class="min-w-full text-sm">
                <thead class="bg-slate-800 text-white">
                  <tr>
                    <th class="px-4 py-3 text-left font-medium whitespace-nowrap">單號</th>
                    <th class="px-4 py-3 text-left font-medium whitespace-nowrap">工廠</th>
                    <th class="px-4 py-3 text-left font-medium whitespace-nowrap">系統</th>
                    <th class="px-4 py-3 text-left font-medium whitespace-nowrap">設備</th>
                    <th class="px-4 py-3 text-left font-medium whitespace-nowrap">組成</th>
                    <!-- <th class="px-4 py-3 text-left font-medium whitespace-nowrap">內容</th> -->
                    <th class="px-4 py-3 text-left font-medium whitespace-nowrap">建立時間</th>
                    <th class="px-4 py-3 text-left font-medium whitespace-nowrap">維護時間</th>
                    <th class="px-4 py-3 text-left font-medium whitespace-nowrap">操作</th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    v-for="r in rows"
                    :key="r.id"
                    class="border-t hover:bg-gray-50 transition text-black tex"
                  >
                    <td class="px-4 py-3 font-medium whitespace-nowrap text-md">{{ r.number }}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-md">{{ r.factoryName }}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-md">{{ r.machineSystemNames }}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-md">
                      {{ r.machineName }}
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-md">{{ r.componentName }}</td>
                    <!-- <td class="px-4 py-3 truncate text-md max-w-[12rem]">{{ r.note }}</td> -->
                    <td class="px-4 py-3 text-right text-md">
                      {{ fmtDateTime(r.createAt) }}
                    </td>
                    <td class="px-4 py-3 text-right text-md">
                      {{ fmtDateTime(r.finishAt) }}
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-md">
                      <button
                        class="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-300 transition-all duration-200 text-sm font-medium whitespace-nowrap"
                        @click="openDialog(r.id)"
                      >
                        詳細
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div></transition
  >
  <MaintenanceDialogComponent
    :dialogVisible="dialogVisible"
    :dialogData="dialogData"
    :isDialogLoading="isDialogLoading"
    :formatDate="formatDate"
    @close="dialogVisible = false"
  />
</template>
