<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import ComponentInstallModal from '@/components/Modals/Selector/ComponentInstallModal.vue';
import { useMachineComponentSlotMaintenanceStore } from '@/stores/machineComponentSlotMaintenance';
import { getBrand } from '@/api/services/componentBrand';
import { ArrowBigRight } from 'lucide-vue-next';
import { get as getComponentType } from '@/api/services/componentType';
import type { ComponentGeneralType } from '@/types/ComponentGeneralType';

const props = defineProps<{
  finishAt?: string;
  maintenanceID?: number;
}>();

const store = useMachineComponentSlotMaintenanceStore();
const modalComponentInstallOpen = ref<boolean>(false);
const allRepair = ref<boolean>(false);
const generalTypeSnapshot = ref<ComponentGeneralType | null>(null);

onMounted(async () => {
  setTimeout(async () => {
    if (store.overview?.top && store.overview?.top?.componentMetaData.length > 0) {
      for (const component of store.overview.top.componentMetaData) {
        if (component.componentTypeID) {
          const response = await getComponentType(component.componentTypeID);
          component.componentType = response.data;
          if (component.componentType.brandID !== undefined) {
            const brandResponse = await getBrand(component.componentType.brandID);
            component.componentType.brand = brandResponse;
          }
        }
      }
      // if (
      //   store.maintenance.fixedComponents.filter((component) => component.name == null).length > 0
      // ) {
      //   allRepair.value = true;
      // }
    }
  }, 1000);
});

watch(
  () => store.maintenance.fixedComponents,
  (newVal) => {
    if (newVal && newVal.some((component) => !component.name)) {
      allRepair.value = true;
    }
  },
  { deep: true, immediate: true }
);

const openComponentInstallModal = () => {
  store.maintenance.addedComponentNames = [];
  store.maintenance.installedComponents = [];
  store.maintenance.removedComponents = [];
  store.maintenance.fixedComponents = [];
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

const closeComponentInstallModal = () => {
  modalComponentInstallOpen.value = false;
};

const handleComponentInstallSubmit = () => {
  modalComponentInstallOpen.value = false;
};

const addAllToFixComponent = () => {
  if (allRepair.value) {
    store.maintenance.fixedComponents = store.maintenance.fixedComponents.filter(
      (component) => component.name !== null
    );
    allRepair.value = false;
  } else {
    if (store.overview?.top) {
      if (store.overview.top.componentMetaData.length > 0) {
        for (const component of store.overview.top.componentMetaData) {
          store.maintenance.fixedComponents.push({
            name: store.overview.top.name ?? null,
            componentTypeID: component.componentTypeID,
            componentCount: 1
          });
          allRepair.value = true;
          break;
        }
      }
    }
  }
};

const emit = defineEmits<{
  (e: 'update-clear-button', value: boolean): void;
}>();

const removeInstalledComponent = async () => {
  store.maintenance.installedComponents = [];
  store.maintenance.removedComponents = [];
  store.maintenance.fixedComponents = [];
  store.maintenance.addedComponentNames = [];

  const lastTime = props.finishAt
    ? new Date(new Date(props.finishAt).getTime() - 1).toISOString()
    : new Date().toISOString();

  await store.initUpdateOverView(Number(props.maintenanceID), lastTime);
  setTimeout(async () => {
    if (store.overview?.top && store.overview?.top?.componentMetaData.length > 0) {
      for (const component of store.overview.top.componentMetaData) {
        if (component.componentTypeID) {
          const response = await getComponentType(component.componentTypeID);
          component.componentType = response.data;
          if (component.componentType.brandID !== undefined) {
            const brandResponse = await getBrand(component.componentType.brandID);
            component.componentType.brand = brandResponse;
          }
        }
      }
    }
  }, 1000);
  emit('update-clear-button', true);
};

const mainInstalledComponent = computed(() => {
  const components = store.maintenance.installedComponents.filter(
    (component) => component.name === null
  );
  if (components.length > 0) {
    return components.pop();
  }
  return null;
});
</script>

<template>
  <div v-if="mainInstalledComponent" class="w-full relative">
    <div v-if="store?.overview?.top" class="flex flex-col md:flex-row gap-4 py-4 max-w-6xl mx-auto">
      <!-- Original Component Panel -->
      <div class="bg-gray-200 rounded-lg p-6 flex-1">
        <h2 class="text-xl font-bold mb-4">原始零件：</h2>
        <div class="space-y-2">
          <p>零件名稱：{{ store?.overview?.top?.componentGeneralType?.name ?? '' }}</p>
          <p>
            零件代號：{{ store?.overview?.top?.componentMetaData[0].componentType?.code ?? '無' }}
          </p>
          <p>零件描述：{{ store?.overview?.top?.componentGeneralType?.description ?? '無描述' }}</p>
          <p>
            零件廠商：{{
              store?.overview?.top?.componentMetaData[0].componentType?.brand?.name || '無'
            }}
          </p>
          <p>
            零件型號：{{
              store?.overview?.top?.componentMetaData[0].componentType?.brandModel || '無'
            }}
          </p>
          <p>
            零件規格：{{
              store?.overview?.top?.componentMetaData[0].componentType?.brandSpec || '無'
            }}
          </p>
        </div>
      </div>

      <!-- Arrow for desktop view -->
      <div class="md:flex items-center justify-center">
        <div class="text-4xl text-gray-500">
          <ArrowBigRight />
        </div>
      </div>
      <div class="bg-gray-200 rounded-lg p-6 flex-1">
        <!-- Component Details -->
        <div class="space-y-2 mb-4">
          <p>
            零件名稱：{{ mainInstalledComponent.componentType?.componentGeneralType?.name || '無' }}
          </p>
          <p>零件代號：{{ mainInstalledComponent.componentType?.code || '無' }}</p>
          <p>零件描述：{{ mainInstalledComponent.componentType?.description || '無' }}</p>
          <p>零件廠商：{{ mainInstalledComponent.componentType?.brand?.name || '無' }}</p>
          <p>零件型號：{{ mainInstalledComponent.componentType?.brandModel || '無' }}</p>
          <p>零件規格：{{ mainInstalledComponent.componentType?.brandSpec || '無' }}</p>
          <p v-if="!mainInstalledComponent.componentMaintainer">零件狀態：新品</p>
          <p v-else>零件維護人：{{ mainInstalledComponent.componentMaintainer || '無' }}</p>
        </div>
        <!-- Reselect Button -->
        <div class="flex items-center gap-2">
          <button
            class="flex justify-center gap-2 items-center bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
            @click="removeInstalledComponent()"
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
            <span>取消</span>
          </button>
        </div>
      </div>
    </div>
    <div v-else class="flex flex-col md:flex-row gap-4 py-4 max-w-6xl mx-auto">
      <div class="bg-gray-200 rounded-lg p-6 flex-1">
        <h1 class="text-xl font-bold mb-4">首次安裝零件</h1>
        <!-- Component Details -->
        <div class="space-y-2 mb-4">
          <p>
            零件名稱：{{ mainInstalledComponent.componentType?.componentGeneralType?.name || '無' }}
          </p>
          <p>零件代號：{{ mainInstalledComponent.componentType?.code || '無' }}</p>
          <p>零件描述：{{ mainInstalledComponent.componentType?.description || '無' }}</p>
          <p>零件廠商：{{ mainInstalledComponent.componentType?.brand?.name || '無' }}</p>
          <p>零件型號：{{ mainInstalledComponent.componentType?.brandModel || '無' }}</p>
          <p>零件規格：{{ mainInstalledComponent.componentType?.brandSpec || '無' }}</p>
          <p v-if="!mainInstalledComponent.componentMaintainer">零件狀態：新品</p>
          <p v-else>零件維護人：{{ mainInstalledComponent.componentMaintainer || '無' }}</p>
        </div>
        <!-- Reselect Button -->
        <div class="flex items-center gap-2">
          <button
            class="flex justify-center gap-2 items-center bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
            @click="removeInstalledComponent()"
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
            <span>取消</span>
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="w-full relative p-6 bg-gray-200 rounded-lg">
    <div class="flex justify-between items-start mb-3">
      <h2 class="text-xl font-bold">
        {{
          store?.currentSlot?.name ?? store?.overview?.top?.componentGeneralType?.name ?? '無零件'
        }}
      </h2>
    </div>
    <div v-if="store?.overview?.top" class="mb-3">
      <div class="flex flex-col justify-between gap-2 w-fit">
        <div class="flex justify-start gap-2">
          <div class="inline-flex items-center gap-2">
            <button
              v-if="store?.overview?.top"
              class="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              @click="openComponentInstallModal()"
            >
              🔧 完全更換此零件
            </button>
            <label class="flex items-center cursor-pointer relative gap-2">
              <input
                v-model="allRepair"
                type="checkbox"
                class="peer h-6 w-6 cursor-pointer transition-all bg-white appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-primary checked:border-primary"
                @click="addAllToFixComponent()"
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
        </div>
      </div>
    </div>
    <div v-else class="mb-3">
      <button
        class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
        @click="openComponentInstallModal()"
      >
        選擇首次安裝零件
      </button>
    </div>
    <!-- Part Information -->
    <div v-if="store?.overview?.top" class="space-y-2">
      <p>
        零件名稱：{{
          store?.currentSlot?.componentGeneralType?.name ??
          store?.overview?.top?.componentGeneralType?.name ??
          ''
        }}
      </p>
      <p>零件代號：{{ store?.overview?.top?.componentMetaData[0].componentType?.code ?? '無' }}</p>
      <p>
        零件描述：{{
          store?.currentSlot?.componentGeneralType?.description ??
          store?.overview?.top?.componentGeneralType?.description ??
          '無描述'
        }}
      </p>
      <p>
        零件廠商：{{
          store?.overview?.top?.componentMetaData[0].componentType?.brand?.name ?? '無'
        }}
      </p>
      <p>
        零件型號：{{ store?.overview?.top?.componentMetaData[0].componentType?.brandModel ?? '無' }}
      </p>
      <p>
        零件規格：{{ store?.overview?.top?.componentMetaData[0].componentType?.brandSpec ?? '無' }}
      </p>
    </div>
  </div>
  <ComponentInstallModal
    v-if="
      (store?.currentSlot?.componentGeneralType || store.maintenance) && modalComponentInstallOpen
    "
    :open-modal="modalComponentInstallOpen"
    :general-type="
      store?.currentSlot?.componentGeneralType ||
      store.overview?.top?.componentGeneralType ||
      generalTypeSnapshot
    "
    :subComponent="store?.overview?.top"
    @do-close="closeComponentInstallModal"
    @do-submit="handleComponentInstallSubmit"
  />
</template>
