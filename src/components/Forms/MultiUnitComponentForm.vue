<script setup lang="ts">
import { ref, computed, onMounted, defineAsyncComponent, watch } from 'vue';
import NumberSelector from '@/components/Modals/Selector/NumberSelector.vue';
import type { ComponentDetail } from '@/types/MachineComponentSlotMaintenance';
import { useMachineComponentSlotMaintenanceStore } from '@/stores/machineComponentSlotMaintenance';
import { get as getComponentType } from '@/api/services/componentType';
import { getBrand } from '@/api/services/componentBrand';
import { Cog } from 'lucide-vue-next';
import type { MachineComponentSlotMaintenance } from '@/types/MachineComponentSlotMaintenance';
import { machineComponentSlotMaintenanceAPI } from '@/api/index';
import type { ComponentGeneralType } from '@/types/ComponentGeneralType';

const ComponentInstallModal = defineAsyncComponent(
  () => import('@/components/Modals/Selector/ComponentInstallModal.vue')
);
import moment from 'moment';

const store = useMachineComponentSlotMaintenanceStore();

const props = defineProps<{
  removedCount?: number;
  createError: any;
  maintenance?: MachineComponentSlotMaintenance;
}>();

const preflight = ref<ComponentDetail[]>([]);
const isFullReplacement = ref<boolean>(false);
const modalComponentInstallOpen = ref<boolean>(false);
const addedStatus = ref<boolean>(false);
const generalTypeSnapshot = ref<ComponentGeneralType | null>(null);

onMounted(async () => {
  setTimeout(async () => {
    if (store.overview?.top && store.overview?.top?.componentMetaData.length > 0) {
      for (const component of store.overview.top.componentMetaData) {
        if (component.componentTypeID) {
          const response = await getComponentType(component.componentTypeID);
          const componentType = response.data;
          if (componentType.brandID) {
            const brandResponse = await getBrand(componentType.brandID);
            componentType.brand = brandResponse;
          }
          component.componentType = componentType;
        }
      }
    }
  }, 1000);

  setTimeout(() => {
    if (typeof props.removedCount !== 'undefined' && props.removedCount > 0) {
      if (props.maintenance) {
        store.maintenance.machineComponentSlotID = props.maintenance.machineComponentSlotID;
      }
      updateRemovedComponentCount(props.removedCount);
    }
  }, 1500);
});

watch(
  () => props.maintenance?.addedComponentNames,
  (newVal) => {
    if (newVal && newVal.length > 0) {
      addedStatus.value = true;
    } else {
      addedStatus.value = false;
    }
  },
  { immediate: true }
);

const replacedComponentCount = computed(() => {
  return (
    store.maintenance.removedComponents.find((component) => component.name === null)
      ?.componentCount || 0
  );
});

const updateFixedComponentCount = (count: number) => {
  const updatedMaintenance = { ...store.maintenance };
  const existingComponentIndex = updatedMaintenance.fixedComponents.findIndex(
    (component) => component.name === null
  );

  if (existingComponentIndex !== -1) {
    if (count > 0) {
      updatedMaintenance.fixedComponents[existingComponentIndex] = {
        ...updatedMaintenance.fixedComponents[existingComponentIndex],
        componentCount: count
      };
    } else {
      updatedMaintenance.fixedComponents.splice(existingComponentIndex, 1);
    }
  } else if (count > 0) {
    updatedMaintenance.fixedComponents.push({
      name: null,
      componentTypeID: store.overview?.top?.componentMetaData[0]?.componentTypeID,
      componentCount: count
    });
  }

  store.maintenance = { ...updatedMaintenance };
};

const currentFixedCount = computed(() => {
  return (
    store.maintenance.fixedComponents.find((component) => component.name === null)
      ?.componentCount || 0
  );
});

const updateRemovedComponentCount = async (count: number) => {
  if (store.maintenance.machineComponentSlotID == 0) {
    store.maintenance.machineComponentSlotID = store.overview?.machineComponentSlot.id ?? 0;
  }

  const updatedMaintenance = { ...store.maintenance };

  const existingComponentIndex = updatedMaintenance.removedComponents.findIndex(
    (component) => component.name === null
  );

  if (existingComponentIndex !== -1) {
    if (count > 0) {
      updatedMaintenance.removedComponents[existingComponentIndex] = {
        ...updatedMaintenance.removedComponents[existingComponentIndex],
        componentCount: count
      };
    } else {
      updatedMaintenance.removedComponents.splice(existingComponentIndex, 1);
    }
  } else if (count > 0) {
    updatedMaintenance.removedComponents.push({
      name: null,
      componentCount: count
    });
  }

  if (count === 0) {
    preflight.value = [];
  } else {
    const preflightResponse =
      await machineComponentSlotMaintenanceAPI.preflight(updatedMaintenance);
    preflight.value = preflightResponse.data.data.removedComponents.top.componentMetaData;
    preflight.value.forEach((metaData) => {
      if (store.overview?.top) {
        const foundSubComponent = store.overview.top.componentMetaData.find(
          (component) => component.componentTypeID === metaData?.componentTypeID
        );
        if (foundSubComponent?.componentType) {
          metaData.componentType = foundSubComponent.componentType;
        }
      }
    });
  }
  if (currentRemovedCount.value === 0) {
    preflight.value = [];
  }

  store.maintenance = { ...updatedMaintenance };
};

const removeInstalledComponent = (index: number) => {
  const newList = [
    ...store.maintenance.installedComponents.filter((component) => component.name == null)
  ];
  newList.splice(index, 1);
  store.maintenance.installedComponents = newList;
  if (isFullReplacement.value) {
    store.maintenance.addedComponentNames = store.maintenance.addedComponentNames.filter(
      (component) => component !== null
    );
    isFullReplacement.value = false;
  }
  addedStatus.value = false;
};

const currentRemovedCount = computed(() => {
  const component = store.maintenance.removedComponents.find(
    (component) => component.name === null
  );
  return component?.componentCount ? component.componentCount : 0;
});

const showReplaceDialog = ref(false);
const confirmPure = ref(false);
const handleComponentRemoveCountPlus = () => {
  console.log(store.maintenance.installedComponents);
  if (
    store.overview?.top?.totalCount &&
    currentRemovedCount.value < store.overview.top.totalCount &&
    store.maintenance.installedComponents.length == 0
  ) {
    updateRemovedComponentCount(currentRemovedCount.value + 1);
    if (currentRemovedCount.value == store.overview?.top.totalCount) {
      showReplaceDialog.value = true;
      console.log(
        'showReplaceDialog',
        currentRemovedCount.value,
        '/',
        store.overview?.top.totalCount
      );
      return;
    }
  }
};

const closeReplaceDialog = () => {
  showReplaceDialog.value = false;
};

watch(showReplaceDialog, (v: any) => {
  if (v) confirmPure.value = false;
});

const handleComponentRemoveCountMinus = () => {
  if (currentRemovedCount.value > 0) {
    updateRemovedComponentCount(currentRemovedCount.value - 1);
  }
};

const closeComponentInstallModal = () => {
  modalComponentInstallOpen.value = false;
};

const openComponentInstallModal = () => {
  const v = resolveGeneralType();
  if (!generalTypeSnapshot.value && v) generalTypeSnapshot.value = v;

  modalComponentInstallOpen.value = true;
};
const resolveGeneralType = () => {
  return (
    store?.overview?.top?.componentGeneralType ??
    store?.currentSlot?.componentGeneralType ??
    store.maintenance.installedComponents?.[0]?.componentType?.componentGeneralType ??
    null
  );
};

watch(
  () => resolveGeneralType(),
  (v) => {
    if (!generalTypeSnapshot.value && v) generalTypeSnapshot.value = v;
  },
  { immediate: true }
);

const handleComponentInstallSubmit = (component: ComponentDetail) => {
  if (component.isFullReplacement) {
    isFullReplacement.value = true;
  } else {
    isFullReplacement.value = false;
  }
  modalComponentInstallOpen.value = false;
  console.log(component.currentRemovedCount);
  updateRemovedComponentCount(Number(component.currentRemovedCount));
};
</script>

<template>
  <div class="bg-gray-200 p-6 rounded-md relative">
    <div class="flex justify-between items-start mb-6">
      <h2 class="text-xl font-bold flex items-center gap-2">
        {{ store?.currentSlot?.name ?? store?.overview?.machineComponentSlot.name ?? '無零件' }}
      </h2>

      <div
        v-if="store?.overview?.top && store.overview?.top?.componentMetaData[0]"
        class="flex items-center gap-4"
      >
        重複零件數量：{{ store?.overview?.top.totalCount }}
      </div>
    </div>
    <div v-if="!store?.overview?.top">
      <button
        class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
        @click="openComponentInstallModal()"
      >
        選擇首次安裝零件
      </button>
    </div>

    <div v-if="!isFullReplacement" class="mt-3">
      <template
        v-if="
          store?.overview &&
          store?.overview?.top &&
          store?.overview?.top.componentMetaData.length > 0 &&
          !addedStatus
        "
      >
        <h3 class="text-lg font-bold">已安裝零件內容</h3>

        <div class="flex items-center gap-2">
          <button
            v-if="store?.overview?.top && store.overview?.top?.componentMetaData[0]"
            class="bg-green-700 text-white px-4 py-2 mb-2 rounded hover:bg-green-600 transition"
            @click="openComponentInstallModal()"
          >
            🔧 完全更換 /部分更換(換上&換下)
          </button>

          <label
            v-if="store?.overview?.top && !isFullReplacement"
            class="flex items-center cursor-pointer relative gap-2"
          >
            <input
              :checked="currentFixedCount > 0"
              type="checkbox"
              class="peer h-6 w-6 cursor-pointer transition-all bg-white appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-primary checked:border-primary"
              @change="
                (e: Event) =>
                  updateFixedComponentCount(
                    (e.target as HTMLInputElement).checked
                      ? (store?.overview?.top?.componentMetaData[0]?.componentCount ?? 0)
                      : 0
                  )
              "
            />
            <span
              class="absolute text-white opacity-0 peer-checked:opacity-100 top-[14px] left-[12px] transform -translate-x-1/2 -translate-y-1/2"
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
            <span class="text-gray font-light">維修/保養</span>
          </label>
        </div>
        <div
          v-for="metaData in store?.overview?.top.componentMetaData"
          class="bg-gray-300 p-3 gap-4 mb-2 flex rounded-md"
        >
          <div class="flex items-center">
            <Cog class="w-10 h-10" />
          </div>
          <div class="grid grid-cols-4 gap-4 flex-1">
            <div class="col-span-1">
              <p class="font-bold">規格</p>
              <p>
                {{ metaData.componentType?.brandSpec ?? '' }}
                {{ metaData.componentType?.brandModel ?? '' }}
              </p>
            </div>
            <div class="col-span-1">
              <p class="font-bold">品號</p>
              <p>
                {{ metaData.componentType?.code ?? '' }}
              </p>
            </div>
            <div>
              <p class="font-bold">廠商</p>
              <p>{{ metaData.componentType?.brand?.name ?? '-' }}</p>
            </div>
            <div>
              <p class="font-bold">
                {{ metaData.componentMaintainer ? '零件維護人' : '零件狀態' }}
              </p>
              <p>
                {{ metaData.componentMaintainer ? metaData.componentMaintainer : '新品' }}
              </p>
            </div>
            <div class="col-span-2">
              <p class="font-bold">更動時間：</p>
              <p>
                {{
                  metaData?.installedAt
                    ? moment(metaData.installedAt).format('YYYY-MM-DD HH:mm:ss')
                    : '-'
                }}
              </p>
            </div>
            <div>
              <p class="font-bold">零件數量：</p>
              <p>{{ metaData?.componentCount ?? '-' }}</p>
            </div>
            <div>
              <p class="font-bold">持續時間：</p>
              <p>{{ metaData?.installedDuration ?? '-' }}</p>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div
      v-if="
        store?.maintenance?.installedComponents.filter((component) => component.name == null)
          .length > 0
      "
    >
      <h3 class="text-lg font-bold">
        {{ isFullReplacement ? '完全更換零件內容' : '新增零件內容' }}
      </h3>
      <div
        v-for="(metaData, index) in store?.maintenance?.installedComponents.filter(
          (component) => component.name == null
        )"
        class="bg-gray-300 p-3 gap-4 mb-2 flex rounded-md border-2 border-dashed border-green-700"
      >
        <div class="flex items-center">
          <Cog class="w-10 h-10 text-green-700" />
        </div>
        <div class="grid grid-cols-4 gap-4 flex-1">
          <div class="col-span-1">
            <p class="font-bold">規格</p>
            <p>
              {{ metaData.componentType?.brandSpec ?? '' }}
              {{ metaData.componentType?.brandModel ?? '' }}
            </p>
          </div>
          <div class="col-span-1">
            <p class="font-bold">品號</p>
            <p>
              {{ metaData.componentType?.code ?? '' }}
            </p>
          </div>
          <div>
            <p class="font-bold">廠商</p>
            <p>{{ metaData.componentType?.brand?.name ?? '-' }}</p>
          </div>
          <div>
            <p class="font-bold">
              {{ metaData?.componentMaintainer ? '零件維護人' : '零件狀態' }}
            </p>
            <p>
              {{ metaData?.componentMaintainer ? metaData?.componentMaintainer : '新品' }}
            </p>
          </div>
          <div class="col-span-2">
            <p class="font-bold">更動時間：</p>
            <p>
              {{
                metaData?.installedAt
                  ? moment(metaData.installedAt).format('YYYY-MM-DD HH:mm:ss')
                  : '-'
              }}
            </p>
          </div>
          <div>
            <p class="font-bold">零件數量：</p>
            <p>{{ metaData?.componentCount ?? '-' }}</p>
          </div>
          <div>
            <p class="font-bold">持續時間：</p>
            <p>{{ metaData?.installedDuration ?? '-' }}</p>
          </div>
        </div>
        <div class="flex items-center">
          <svg
            class="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            @click="removeInstalledComponent(index as number)"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path
                d="M12.0004 9.5L17.0004 14.5M17.0004 9.5L12.0004 14.5M4.50823 13.9546L7.43966 17.7546C7.79218 18.2115 7.96843 18.44 8.18975 18.6047C8.38579 18.7505 8.6069 18.8592 8.84212 18.9253C9.10766 19 9.39623 19 9.97336 19H17.8004C18.9205 19 19.4806 19 19.9084 18.782C20.2847 18.5903 20.5907 18.2843 20.7824 17.908C21.0004 17.4802 21.0004 16.9201 21.0004 15.8V8.2C21.0004 7.0799 21.0004 6.51984 20.7824 6.09202C20.5907 5.71569 20.2847 5.40973 19.9084 5.21799C19.4806 5 18.9205 5 17.8004 5H9.97336C9.39623 5 9.10766 5 8.84212 5.07467C8.6069 5.14081 8.38579 5.2495 8.18975 5.39534C7.96843 5.55998 7.79218 5.78846 7.43966 6.24543L4.50823 10.0454C3.96863 10.7449 3.69883 11.0947 3.59505 11.4804C3.50347 11.8207 3.50347 12.1793 3.59505 12.5196C3.69883 12.9053 3.96863 13.2551 4.50823 13.9546Z"
                stroke="#000000"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </g>
          </svg>
        </div>
      </div>
      <!-- 可添加零件並設定數量 -->
      <p v-if="createError.installedComponent" class="text-sm text-red-500 mt-1">
        *{{ createError.installedComponent }}
      </p>
    </div>
    <div
      v-if="store?.overview?.top && !isFullReplacement && !addedStatus"
      class="mt-3 flex items-center"
    >
      <span class="mr-4">換下零件數量</span>
      <!-- Quantity Counter -->
      <div class="flex items-center">
        <NumberSelector
          :model-value="currentRemovedCount"
          :max="store?.overview?.top?.totalCount ? store?.overview?.top?.totalCount : 100"
          :min="0"
          @plus="handleComponentRemoveCountPlus"
          @minus="handleComponentRemoveCountMinus"
          @update:model-value="updateRemovedComponentCount"
        />
      </div>
      <span
        v-if="
          store?.overview?.top &&
          store?.overview?.top?.totalCount &&
          currentRemovedCount > 0 &&
          currentFixedCount + currentRemovedCount > store?.overview?.top.totalCount
        "
        class="ml-4 text-red-600"
        >*超出零件總數量</span
      >
    </div>
    <div
      v-if="store?.overview?.top && !isFullReplacement && currentFixedCount > 0"
      class="mt-3 flex items-center"
    >
      <span class="mr-4">維修/保養零件數量</span>
      <!-- Quantity Counter -->
      <div class="flex items-center">
        <NumberSelector
          :model-value="currentFixedCount"
          :max="store?.overview?.top?.totalCount ? store?.overview?.top?.totalCount : 100"
          :min="0"
          @update:model-value="updateFixedComponentCount"
        />
      </div>
      <span
        v-if="
          store?.overview?.top.totalCount &&
          currentFixedCount > 0 &&
          currentFixedCount + replacedComponentCount > store?.overview?.top.totalCount
        "
        class="ml-4 text-red-600"
        >*超出零件總數量</span
      >
    </div>

    <!-- Part Information -->
    <div v-if="!isFullReplacement" class="space-y-2 mt-4">
      <template v-if="preflight && preflight.length > 0 && currentRemovedCount > 0">
        <h3 class="text-lg font-bold">換下零件內容</h3>
        <div class="">
          <div
            v-for="metaData in preflight"
            class="bg-gray-300 p-3 gap-4 mb-2 flex rounded-md border-2 border-dashed border-red-600"
          >
            <div class="flex items-center">
              <Cog class="w-10 h-10 text-red-600" />
            </div>
            <div class="grid grid-cols-4 gap-4 flex-1">
              <div class="col-span-1">
                <p class="font-bold">規格</p>
                <p>
                  {{ metaData.componentType?.brandSpec ?? '' }}
                  {{ metaData.componentType?.brandModel ?? '' }}
                </p>
              </div>
              <div class="col-span-1">
                <p class="font-bold">品號</p>
                <p>
                  {{ metaData.componentType?.code ?? '' }}
                </p>
              </div>
              <div>
                <p class="font-bold">廠商</p>
                <p>{{ metaData.componentType?.brand?.name ?? '-' }}</p>
              </div>
              <div>
                <p class="font-bold">零件維護人</p>
                <p>{{ metaData.componentMaintainer ?? '-' }}</p>
              </div>
              <div class="col-span-2">
                <p class="font-bold">更動時間：</p>
                <p>
                  {{
                    metaData?.installedAt
                      ? moment(metaData.installedAt).format('YYYY-MM-DD HH:mm:ss')
                      : '-'
                  }}
                </p>
              </div>
              <div>
                <p class="font-bold">零件數量：</p>
                <p>{{ metaData?.componentCount ?? '-' }}</p>
              </div>
              <div>
                <p class="font-bold">持續時間：</p>
                <p>{{ metaData?.installedDuration ?? '-' }}</p>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
  <div
    v-if="showReplaceDialog"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
  >
    <div class="bg-white p-6 rounded shadow-lg max-w-sm w-full">
      <h3 class="text-lg font-semibold mb-4">注意</h3>
      <p class="mb-6">
        換下的數量已達到目前裝上總數 ({{ currentRemovedCount }} /
        {{ store.overview?.top.totalCount }})，<br />
        請選擇：
      </p>
      <label class="flex items-center gap-2 mb-4">
        <input
          v-model="confirmPure"
          type="checkbox"
          class="h-4 w-4 rounded border-stroke checked:bg-primary checked:border-primary"
        />
        <span>確認只做拆除</span>
      </label>
      <div class="flex justify-end gap-2">
        <button
          class="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-600 transition"
          @click="
            () => {
              closeReplaceDialog();
              openComponentInstallModal();
            }
          "
        >
          🔧 完全更換 /部分更換(換上&換下)
        </button>

        <button
          class="px-4 py-2 border rounded"
          :class="confirmPure ? 'bg-orange-700 text-white' : 'text-gray-300 bg-gray-100'"
          :disabled="!confirmPure"
          @click="closeReplaceDialog"
        >
          純換下
        </button>
      </div>
    </div>
  </div>

  <ComponentInstallModal
    v-if="
      (store?.overview?.top?.componentGeneralType ||
        store?.currentSlot?.componentGeneralType ||
        store.maintenance) &&
      modalComponentInstallOpen
    "
    :open-modal="modalComponentInstallOpen"
    :removed-count="currentRemovedCount"
    :general-type="
      store?.overview?.top?.componentGeneralType ||
      store?.currentSlot?.componentGeneralType ||
      store.maintenance.installedComponents[0]?.componentType?.componentGeneralType ||
      generalTypeSnapshot
    "
    :subComponent="store?.overview?.top"
    :first-install="store?.overview?.top?.componentGeneralType ? false : true"
    @do-close="closeComponentInstallModal"
    @do-submit="handleComponentInstallSubmit"
  />
  <!-- v-if="
      (store?.currentSlot?.componentGeneralType || store.maintenance) && modalComponentInstallOpen
    "
    :open-modal="modalComponentInstallOpen"
    :general-type="
      store?.currentSlot?.componentGeneralType || store.overview?.top?.componentGeneralType
    " -->
</template>
