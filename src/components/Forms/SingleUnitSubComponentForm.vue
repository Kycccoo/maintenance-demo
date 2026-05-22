<script setup lang="ts">
import { computed, watch, ref } from 'vue';
import { useMachineComponentSlotMaintenanceStore } from '@/stores/machineComponentSlotMaintenance';
import type { ComponentType } from '@/types/ComponentType';
import type { ComponentDetail } from '@/types/MachineComponentSlotMaintenance';
import { ArrowBigRight } from 'lucide-vue-next';
import ComponentTypeRadioModal from '@/components/Modals/Selector/ComponentTypeRadio.vue';
import type { ComponentGeneralType } from '@/types/ComponentGeneralType';
import ComponentInstallModal from '@/components/Modals/Selector/ComponentInstallModal.vue';

interface SubComponent {
  name?: string;
  totalCount: number;
  componentGeneralType?: ComponentGeneralType;
  componentMetaData: Array<{
    componentType?: {
      brand?: {
        name: string;
      };
      brandModel?: string;
      brandSpec?: string;
    };
    componentCount?: number;
    componentTypeID?: number;
    installedAt?: string;
  }>;
}

interface Props {
  subComponent: SubComponent;
}

const props = defineProps<Props>();
const store = useMachineComponentSlotMaintenanceStore();
const modalSubComponentTypeRadioOpen = ref<boolean>(false);
const modalComponentInstallOpen = ref<boolean>(false);
const markAsRemoved = ref<boolean>(false);
const subInstalledComponent = ref<ComponentDetail>({
  name: '',
  componentCount: 0,
  componentTypeID: 0,
  componentMaintainer: ''
});

const updateFixedComponentCount = (count: number) => {
  if (!props.subComponent.name) return;

  const updatedMaintenance = { ...store.maintenance };
  const existingComponentIndex = updatedMaintenance.fixedComponents.findIndex(
    (component) => component.name === props.subComponent.name
  );

  if (existingComponentIndex !== -1) {
    updatedMaintenance.fixedComponents.splice(existingComponentIndex, 1);
  } else {
    updatedMaintenance.fixedComponents.push({
      name: props.subComponent.name,
      componentTypeID: props.subComponent.componentMetaData[0]?.componentTypeID,
      componentCount: count
    });
  }

  store.maintenance = { ...updatedMaintenance };
};

const currentFixedCount = computed(() => {
  return (
    store.maintenance.fixedComponents.find(
      (component) => component.name === props.subComponent.name
    )?.componentCount || 0
  );
});

const computedFixedComponentCount = computed(() => {
  const component = store.maintenance.fixedComponents.find(
    (component) => component.name === props.subComponent.name
  );
  return component?.componentCount ? component.componentCount > 0 : false;
});

const closeSubComponentTypeRadioModal = () => {
  modalSubComponentTypeRadioOpen.value = false;
};

const openComponentInstallModal = () => {
  modalComponentInstallOpen.value = true;
};

const closeComponentInstallModal = () => {
  modalComponentInstallOpen.value = false;
};

const handleComponentInstallSubmit = (component: ComponentDetail) => {
  modalComponentInstallOpen.value = false;
  subInstalledComponent.value = {
    name: component.name,
    componentCount: component.componentCount,
    componentTypeID: component.componentTypeID,
    componentType: component.componentType,
    componentMaintainer: component.componentMaintainer
  };
};

const handleSubComponentTypeRadioSubmit = (subComponentType: ComponentType) => {
  const name = props.subComponent?.name ?? '';
  if (!name) {
    throw new Error('不合法的零件名稱');
  }
  subInstalledComponent.value = {
    name: name,
    componentCount: props.subComponent.componentMetaData[0]?.componentCount ?? 0,
    componentTypeID: subComponentType.id,
    componentType: subComponentType,
    componentMaintainer: ''
  };
  store.maintenance.removedComponents.push({
    name: subInstalledComponent.value.name,
    componentCount: subInstalledComponent.value.componentCount
  });
  store.maintenance.installedComponents.push({
    name: subInstalledComponent.value.name,
    componentCount: subInstalledComponent.value.componentCount,
    componentTypeID: subInstalledComponent.value.componentTypeID
  });
  modalSubComponentTypeRadioOpen.value = false;
};

const removeInstalledComponent = () => {
  store.maintenance.installedComponents = store.maintenance.installedComponents.filter(
    (component) => component.name !== subInstalledComponent.value?.name
  );
  store.maintenance.addedComponentNames = store.maintenance.addedComponentNames.filter(
    (name) => name !== subInstalledComponent.value?.name
  );
  subInstalledComponent.value = {
    name: '',
    componentCount: 0,
    componentTypeID: 0,
    componentMaintainer: ''
  };
};

const removeSubComponent = () => {
  store.maintenance.removedComponents.push({
    name: props.subComponent.name ?? null,
    componentCount: 1
  });
  markAsRemoved.value = true;
};

const markAsActive = () => {
  markAsRemoved.value = false;
  store.maintenance.removedComponents = store.maintenance.removedComponents.filter(
    (component) => component.name !== props.subComponent.name
  );
};

// 監聽 subComponent 的變化
watch(
  () => props.subComponent,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      // 在這裡處理 subComponent 更新後的邏輯
      const count = currentFixedCount.value;
      updateFixedComponentCount(count);
    }
  },
  { deep: true } // 深度監聽，確保能監聽到物件內部屬性的變化
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
    <div
      v-if="
        store.maintenance.installedComponents.filter((c) => c.name === subComponent.name).length ===
        0
      "
      class="p-6 bg-gray-200 rounded-lg"
    >
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-bold">
          {{ subComponent?.name ?? '-' }}
        </h3>
        <div class="flex gap-2">
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
      <!-- Part Information -->
      <div class="space-y-2">
        <div class="flex items-center gap-2">
          <button
            v-if="
              store.maintenance.installedComponents.filter((c) => c.name === subComponent.name)
                .length === 0
            "
            class="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            @click="openComponentInstallModal()"
          >
            🔧更換此子零件
          </button>
          <label
            v-if="store.maintenance?.fixedComponents"
            class="flex items-center cursor-pointer relative gap-2"
          >
            <input
              :checked="computedFixedComponentCount"
              type="checkbox"
              class="peer h-6 w-6 cursor-pointer transition-all bg-white appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-primary checked:border-primary"
              @change="
                updateFixedComponentCount(subComponent.componentMetaData[0]?.componentCount ?? 0)
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

        <p>零件類型：{{ subComponent?.componentGeneralType?.name ?? '-' }}</p>
        <template
          v-for="componentMetaData in subComponent.componentMetaData"
          :key="componentMetaData.componentTypeID"
        >
          <p>零件廠商：{{ componentMetaData.componentType?.brand?.name ?? '-' }}</p>
          <p>零件型號：{{ componentMetaData.componentType?.brandModel ?? '-' }}</p>
          <p>零件規格：{{ componentMetaData.componentType?.brandSpec ?? '-' }}</p>
        </template>
      </div>
    </div>
    <div v-else>
      <div class="w-full">
        <div class="flex mx-auto gap-3">
          <!-- Original Component Panel -->
          <div class="bg-gray-200 rounded-lg flex-1 p-6">
            <h2 class="text-xl font-bold mb-4">原零件：</h2>
            <div class="space-y-2">
              <p>零件名稱：{{ subComponent?.componentGeneralType?.name ?? '-' }}</p>
              <p>零件代號：{{ subComponent?.componentGeneralType?.code ?? '-' }}</p>
              <p>零件描述：{{ subComponent?.componentGeneralType?.description ?? '-' }}</p>
              <p>
                零件廠商：{{
                  subComponent?.componentMetaData[0]?.componentType?.brand?.name ?? '-'
                }}
              </p>
              <p>
                零件型號：{{ subComponent?.componentMetaData[0]?.componentType?.brandModel ?? '-' }}
              </p>
              <p>
                零件規格：{{ subComponent?.componentMetaData[0]?.componentType?.brandSpec ?? '-' }}
              </p>
            </div>
          </div>

          <!-- Arrow for desktop view -->
          <div class="md:flex items-center justify-center">
            <div class="text-4xl text-gray-500">
              <ArrowBigRight />
            </div>
          </div>

          <!-- Replacement Component Panel -->
          <div
            v-if="
              store.maintenance.installedComponents.filter((c) => c.name === subComponent.name)
                .length > 0
            "
            class="bg-gray-200 rounded-lg flex-1 p-6"
          >
            <h2 class="text-xl font-bold mb-4">置換零件：</h2>
            <!-- Component Details -->
            <div class="space-y-2 mb-4">
              <p>
                零件名稱：{{
                  subInstalledComponent?.componentType?.componentGeneralType?.name || '-'
                }}
              </p>
              <p>
                零件代號：{{
                  subInstalledComponent?.componentType?.componentGeneralType?.code || '-'
                }}
              </p>
              <p>
                零件描述：{{
                  subInstalledComponent?.componentType?.componentGeneralType?.description || '-'
                }}
              </p>
              <p>零件廠商：{{ subInstalledComponent?.componentType?.brand?.name || '-' }}</p>
              <p>零件型號：{{ subInstalledComponent?.componentType?.brandModel || '-' }}</p>
              <p>零件規格：{{ subInstalledComponent?.componentType?.brandSpec || '-' }}</p>
              <p v-if="!subInstalledComponent?.componentMaintainer">零件狀態：新品</p>
              <p v-else>零件維護人：{{ subInstalledComponent?.componentMaintainer || '-' }}</p>
            </div>
            <!-- Reselect Button -->
            <div class="flex items-center gap-2">
              <button
                class="flex justify-center gap-2 items-center bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                @click="removeInstalledComponent()"
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
  </div>
  <ComponentTypeRadioModal
    v-if="subComponent.componentGeneralType"
    :open-modal="modalSubComponentTypeRadioOpen"
    :component-general-type="subComponent.componentGeneralType"
    @do-close="closeSubComponentTypeRadioModal"
    @do-submit="handleSubComponentTypeRadioSubmit"
  />
  <ComponentInstallModal
    v-if="subComponent.componentGeneralType && modalComponentInstallOpen"
    :open-modal="modalComponentInstallOpen"
    :sub-component="subComponent"
    :general-type="subComponent.componentGeneralType"
    @do-close="closeComponentInstallModal"
    @do-submit="handleComponentInstallSubmit"
  />
</template>
