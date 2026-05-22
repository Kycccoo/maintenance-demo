<script setup lang="ts">
import { computed, watch, ref, defineAsyncComponent } from 'vue';
import NumberSelector from '@/components/Modals/Selector/NumberSelector.vue';
import ComponentTypeRadioModal from '@/components/Modals/Selector/ComponentTypeRadio.vue';
import { useMachineComponentSlotMaintenanceStore } from '@/stores/machineComponentSlotMaintenance';
import type { ComponentType } from '@/types/ComponentType';
import type { ComponentDetail } from '@/types/MachineComponentSlotMaintenance';
import { machineComponentSlotMaintenanceAPI } from '@/api/index';
const ComponentInstallModal = defineAsyncComponent(
  () => import('@/components/Modals/Selector/ComponentInstallModal.vue')
);
import moment from 'moment';
import { Cog } from 'lucide-vue-next';
const modalComponentInstallOpen = ref<boolean>(false);
const isFullReplacement = ref<boolean>(false);
const fullReplacementComponentDetail = ref<ComponentDetail | null>(null);
const preflight = ref<SubComponent[]>([]);

interface ComponentGeneralType {
  id: number;
  name: string;
  code: string;
  isMultiUnit: boolean;
  description: string;
  order: number;
}

interface SubComponent {
  name?: string;
  totalCount: number;
  componentGeneralType?: ComponentGeneralType;
  componentMetaData: Array<{
    componentType?: {
      brand?: {
        name: string;
      };
      code?: string;
      brandModel?: string;
      brandSpec?: string;
    };
    componentMaintainer?: string;
    installedDuration?: number;
    componentCount?: number;
    componentTypeID?: number;
    installedAt?: string;
  }>;
}

interface Props {
  subComponent: SubComponent;
}

const props = defineProps<Props>();
const maintenanceStore = useMachineComponentSlotMaintenanceStore();

const updateFixedComponentCount = (count: number) => {
  if (!props.subComponent.name) return;

  const updatedMaintenance = { ...maintenanceStore.maintenance };
  const existingComponentIndex = updatedMaintenance.fixedComponents.findIndex(
    (component) => component.name === props.subComponent.name
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
  } else {
    updatedMaintenance.fixedComponents.push({
      name: props.subComponent.name,
      componentTypeID: props.subComponent.componentMetaData[0]?.componentTypeID,
      componentCount: count
    });
  }

  maintenanceStore.maintenance = updatedMaintenance;
};

const currentFixedCount = computed(() => {
  return (
    maintenanceStore.maintenance.fixedComponents.find(
      (component) => component.name === props.subComponent.name
    )?.componentCount || 0
  );
});

const showReplaceDialog = ref(false);
const confirmPure = ref(false);
const updateRemovedComponentCount = async (count: number) => {
  if (!props.subComponent.name) return;
  if (maintenanceStore.maintenance.machineComponentSlotID == 0) {
    maintenanceStore.maintenance.machineComponentSlotID =
      maintenanceStore.overview?.machineComponentSlot.id ?? 0;
  }
  const updatedMaintenance = { ...maintenanceStore.maintenance };
  const existingComponentIndex = updatedMaintenance.removedComponents.findIndex(
    (component) => component.name === props.subComponent.name
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
      name: props.subComponent.name,
      componentCount: count
    });
  }
  if (count === 0) {
    preflight.value = [];
  } else {
    const preflightResponse = await machineComponentSlotMaintenanceAPI.preflight(
      maintenanceStore.maintenance
    );
    preflight.value = preflightResponse.data.data.removedComponents.sub;
    preflight.value.forEach((component) => {
      component.componentMetaData.forEach((metaData) => {
        if (maintenanceStore.overview?.sub) {
          const foundSubComponent = maintenanceStore.overview.sub.find((subComponent) =>
            subComponent.componentMetaData.some(
              (component) => component.componentTypeID === metaData?.componentTypeID
            )
          );

          if (foundSubComponent?.componentMetaData?.[0]?.componentType) {
            metaData.componentType = foundSubComponent.componentMetaData[0].componentType;
          }
        }
      });
    });
  }
  if (currentRemovedCount.value === 0) {
    preflight.value = [];
  }
  maintenanceStore.maintenance = updatedMaintenance;
  if (count == props.subComponent.totalCount) {
    showReplaceDialog.value = true;
    return;
  }
};

const closeReplaceDialog = () => {
  showReplaceDialog.value = false;
};
watch(showReplaceDialog, (v: any) => {
  if (v) confirmPure.value = false;
});

const currentRemovedCount = computed(() => {
  return (
    maintenanceStore.maintenance.removedComponents.find(
      (component) => component.name === props.subComponent.name
    )?.componentCount || 0
  );
});

// 新增的功能
const showComponentTypeModal = ref(false);
const markAsRemoved = ref<boolean>(false);
const selectedComponentIndex = ref<number | null>(null);
const currentComponentType = ref<ComponentType | undefined>(undefined);

const openComponentInstallModal = () => {
  modalComponentInstallOpen.value = true;
};

const handleComponentInstallSubmit = (component: ComponentDetail) => {
  if (component.isFullReplacement) {
    fullReplacementComponentDetail.value = component;
    isFullReplacement.value = true;
  } else {
    isFullReplacement.value = false;
  }
  modalComponentInstallOpen.value = false;
};

const handleComponentInstallClose = () => {
  console.log('handleComponentInstallClose');
  modalComponentInstallOpen.value = false;
};

const removeInstalledComponent = (index: number) => {
  const newList = [
    ...maintenanceStore.maintenance.installedComponents.filter(
      (component) => component.name == props.subComponent.name
    )
  ];
  newList.splice(index, 1);
  maintenanceStore.maintenance.installedComponents = newList;
  if (isFullReplacement.value) {
    maintenanceStore.maintenance.addedComponentNames =
      maintenanceStore.maintenance.addedComponentNames.filter(
        (component) => component !== props.subComponent.name
      );
    isFullReplacement.value = false;
  }
};

const handleComponentTypeRadioSubmit = (componentType: ComponentType) => {
  if (selectedComponentIndex.value !== null) {
    maintenanceStore.maintenance.installedComponents[selectedComponentIndex.value].componentType =
      componentType;
    maintenanceStore.maintenance.installedComponents[selectedComponentIndex.value].componentTypeID =
      componentType.id;
  }
  showComponentTypeModal.value = false;
  selectedComponentIndex.value = null;
};

const resetFullReplacementComponentDetail = () => {
  maintenanceStore.maintenance.installedComponents =
    maintenanceStore.maintenance.installedComponents.filter(
      (component) => component.name !== fullReplacementComponentDetail.value?.name
    );
  maintenanceStore.maintenance.addedComponentNames =
    maintenanceStore.maintenance.addedComponentNames.filter(
      (component) => component !== fullReplacementComponentDetail.value?.name
    );
  fullReplacementComponentDetail.value = null;
  isFullReplacement.value = false;
};

const removeSubComponent = () => {
  maintenanceStore.maintenance.removedComponents.push({
    name: props.subComponent.name ?? null,
    componentCount: props.subComponent.totalCount
  });
  markAsRemoved.value = true;
};

const markAsActive = () => {
  markAsRemoved.value = false;
  maintenanceStore.maintenance.removedComponents =
    maintenanceStore.maintenance.removedComponents.filter(
      (component) => component.name !== props.subComponent.name
    );
};

watch(
  () => props.subComponent,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      const count = currentFixedCount.value;
      updateFixedComponentCount(count);
    }
  },
  { deep: true }
);
</script>

<template>
  <div v-if="markAsRemoved" class="p-6 bg-red-100 rounded-lg">
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-bold line-through">
        {{ subComponent?.name ?? '-' }}
      </h3>
      <button
        class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
        @click="markAsActive()"
      >
        還原
      </button>
    </div>
  </div>
  <div v-else>
    <div v-if="!isFullReplacement" class="p-6 bg-gray-200 rounded-lg">
      <div class="flex justify-between items-center mb-4">
        <div class="flex items-center gap-2">
          <h3 class="text-lg font-bold">
            {{ subComponent?.name ?? '-' }}
          </h3>
        </div>
        <div class="flex items-center gap-2">
          <div class="px-4 py-2 rounded">重複部件 數量：{{ subComponent.totalCount }}</div>

          <button
            class="flex gap-2 items-center bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
            @click="removeSubComponent()"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M12.0004 9.5L17.0004 14.5M17.0004 9.5L12.0004 14.5M4.50823 13.9546L7.43966 17.7546C7.79218 18.2115 7.96843 18.44 8.18975 18.6047C8.38579 18.7505 8.6069 18.8592 8.84212 18.9253C9.10766 19 9.39623 19 9.97336 19H17.8004C18.9205 19 19.4806 19 19.9084 18.782C20.2847 18.5903 20.5907 18.2843 20.7824 17.908C21.0004 17.4802 21.0004 16.9201 21.0004 15.8V8.2C21.0004 7.0799 21.0004 6.51984 20.7824 6.09202C20.5907 5.71569 20.2847 5.40973 19.9084 5.21799C19.4806 5 18.9205 5 17.8004 5H9.97336C9.39623 5 9.10766 5 8.84212 5.07467C8.6069 5.14081 8.38579 5.2495 8.18975 5.39534C7.96843 5.55998 7.79218 5.78846 7.43966 6.24543L4.50823 10.0454C3.96863 10.7449 3.69883 11.0947 3.59505 11.4804C3.50347 11.8207 3.50347 12.1793 3.59505 12.5196C3.69883 12.9053 3.96863 13.2551 4.50823 13.9546Z"
                  stroke="#FFFFFF"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </g>
            </svg>
            移除
          </button>
        </div>
      </div>

      <!-- 新增的零件列表 -->
      <div class="space-y-3 mt-4">
        <div
          v-if="
            maintenanceStore?.maintenance?.installedComponents.filter(
              (component) => component.name == props.subComponent.name
            ).length > 0
          "
        >
          <h3 class="text-lg font-bold">
            {{ isFullReplacement ? '更換零件內容' : '新增零件內容' }}
          </h3>

          <div
            v-for="(metaData, index) in maintenanceStore?.maintenance?.installedComponents.filter(
              (component) => component.name == props.subComponent.name
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
        </div>
        <h3 class="text-lg font-bold">已安裝零件內容</h3>
        <div class="flex items-center gap-2">
          <button
            class="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            @click="openComponentInstallModal()"
          >
            🔧 完全更換 / 新增零件
          </button>
          <label class="flex items-center cursor-pointer relative gap-2">
            <input
              :checked="currentFixedCount > 0"
              type="checkbox"
              class="peer h-6 w-6 cursor-pointer transition-all bg-white appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-primary checked:border-primary"
              @change="
                (e: Event) =>
                  updateFixedComponentCount(
                    (e.target as HTMLInputElement).checked
                      ? (subComponent.componentMetaData[0]?.componentCount ?? 0)
                      : 0
                  )
              "
            />
            <span
              class="absolute text-white opacity-0 peer-checked:opacity-100 top-[12px] left-[12px] transform -translate-x-1/2 -translate-y-1/2"
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
            <span class="text-gray">維修/保養</span>
          </label>
        </div>
        <div
          v-for="metaData in subComponent.componentMetaData"
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
        <!-- 換下零件數量 -->
        <div class="flex items-center gap-2">
          <span>換下零件數量</span>
          <div class="flex items-center">
            <NumberSelector
              :model-value="currentRemovedCount"
              :max="subComponent.totalCount"
              :min="0"
              @update:model-value="updateRemovedComponentCount"
            />
          </div>
          <span
            v-if="
              currentRemovedCount > 0 &&
              currentFixedCount + currentRemovedCount > subComponent.totalCount
            "
            class="ml-4 text-red-600"
          >
            *超出零件總數量
          </span>
        </div>
        <div class="flex items-center gap-2">
          <!-- 維修/保養數量 -->
          <div v-if="currentFixedCount > 0" class="flex items-center">
            <span>維修/保養零件數量</span>
            <!-- Quantity Counter -->
            <div class="flex items-center mx-2">
              <NumberSelector
                :max="subComponent.totalCount"
                :min="0"
                :modelValue="currentFixedCount"
                @update:modelValue="updateFixedComponentCount($event)"
              />
            </div>
            <span class="ml-4">• 維修/保養數量不包含更換的數量</span>
          </div>
        </div>
      </div>

      <!-- Part Information -->
      <div class="space-y-2 mt-4">
        <template v-if="preflight && preflight.length > 0 && currentRemovedCount > 0">
          <h3 class="text-lg font-bold">換下零件內容</h3>
          <div v-for="removedComponent in preflight" class="">
            <div
              v-for="metaData in removedComponent.componentMetaData"
              v-if="removedComponent.name == subComponent.name"
              class="bg-gray-300 p-3 gap-4 mb-2 rounded-md flex border-2 border-dashed border-red-600"
            >
              <div class="flex items-center">
                <Cog class="w-10 h-10 text-red-600" />
              </div>
              <div class="grid grid-cols-4 gap-4">
                <div class="col-span-2 flex-1">
                  <p class="font-bold">規格</p>
                  <p>
                    {{ metaData.componentType?.brandSpec ?? '-' }}
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
    <div v-else class="">
      <div class="flex gap-4">
        <!-- Original Component Panel -->
        <div class="bg-gray-200 rounded-lg flex-1 p-6">
          <h2 class="text-xl font-bold mb-4">原始零件：</h2>
          <div class="space-y-2">
            <p>
              {{ subComponent?.componentGeneralType?.name ?? '' }}
            </p>
            <p>零件代號：{{ subComponent?.componentGeneralType?.code ?? '無' }}</p>
            <p>零件描述：{{ subComponent?.componentGeneralType?.description ?? '無描述' }}</p>
            <p>零件數量：{{ subComponent.totalCount ?? '無' }}</p>
          </div>
        </div>

        <!-- Arrow for desktop view -->
        <div class="flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>

        <!-- Replacement Component Panel -->
        <div v-if="fullReplacementComponentDetail" class="flex-1 p-6 bg-gray-200 rounded-lg">
          <div>
            <h2 class="text-xl font-bold mb-4">置換零件：</h2>
          </div>
          <!-- Component Details -->
          <div class="space-y-2 mb-4">
            <p>零件代號：{{ fullReplacementComponentDetail.componentGeneralType?.code || '無' }}</p>
            <p>
              零件描述：{{
                fullReplacementComponentDetail.componentGeneralType?.description || '無'
              }}
            </p>
            <p>零件廠商：{{ fullReplacementComponentDetail.componentType?.brand?.name || '無' }}</p>
            <p>零件型號：{{ fullReplacementComponentDetail.componentType?.brandModel || '無' }}</p>
            <p>零件規格：{{ fullReplacementComponentDetail.componentType?.brandSpec || '無' }}</p>
            <p>零件數量：{{ fullReplacementComponentDetail.componentCount || '無' }}</p>
            <p>維護人：{{ fullReplacementComponentDetail.componentMaintainer || '無' }}</p>
            <button
              class="flex justify-center gap-2 items-center bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
              @click="resetFullReplacementComponentDetail()"
            >
              <svg
                class="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M12.0004 9.5L17.0004 14.5M17.0004 9.5L12.0004 14.5M4.50823 13.9546L7.43966 17.7546C7.79218 18.2115 7.96843 18.44 8.18975 18.6047C8.38579 18.7505 8.6069 18.8592 8.84212 18.9253C9.10766 19 9.39623 19 9.97336 19H17.8004C18.9205 19 19.4806 19 19.9084 18.782C20.2847 18.5903 20.5907 18.2843 20.7824 17.908C21.0004 17.4802 21.0004 16.9201 21.0004 15.8V8.2C21.0004 7.0799 21.0004 6.51984 20.7824 6.09202C20.5907 5.71569 20.2847 5.40973 19.9084 5.21799C19.4806 5 18.9205 5 17.8004 5H9.97336C9.39623 5 9.10766 5 8.84212 5.07467C8.6069 5.14081 8.38579 5.2495 8.18975 5.39534C7.96843 5.55998 7.79218 5.78846 7.43966 6.24543L4.50823 10.0454C3.96863 10.7449 3.69883 11.0947 3.59505 11.4804C3.50347 11.8207 3.50347 12.1793 3.59505 12.5196C3.69883 12.9053 3.96863 13.2551 4.50823 13.9546Z"
                    stroke="#FFFFFF"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </g>
              </svg>
              <span>取消</span>
            </button>
          </div>
        </div>
      </div>
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
        {{ props.subComponent.totalCount }})，<br />
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
          🔧 完全更換 / 新增零件
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
  <!-- 零件選擇彈窗 -->
  <ComponentTypeRadioModal
    v-if="showComponentTypeModal && subComponent?.componentGeneralType"
    :item="currentComponentType"
    :open-modal="showComponentTypeModal"
    :component-general-type="subComponent?.componentGeneralType"
    @do-close="showComponentTypeModal = false"
    @do-submit="handleComponentTypeRadioSubmit"
  />
  <ComponentInstallModal
    v-if="modalComponentInstallOpen && subComponent?.componentGeneralType"
    :open-modal="modalComponentInstallOpen"
    :sub-component="subComponent"
    :general-type="subComponent?.componentGeneralType"
    @do-close="handleComponentInstallClose"
    @do-submit="handleComponentInstallSubmit"
  />
</template>
