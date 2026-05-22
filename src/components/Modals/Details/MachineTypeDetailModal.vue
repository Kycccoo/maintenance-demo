<script setup lang="ts">
import type { MachineType } from '@/types/MachineType';
import { watch, ref, shallowRef, defineAsyncComponent } from 'vue';
import { componentGeneralTypeAPI, machineTypeAPI } from '@/api';
import type { Composition } from '@/types/Composition';
import type { Machine } from '@/types/Machine';
import type { ComponentGeneralType } from '@/types/ComponentGeneralType';
import TableMachine from '@/components/Tables/TableMachine.vue';
const ComponentGeneralTypeDetailModal = defineAsyncComponent(
  () => import('@/components/Modals/Details/ComponentGeneralTypeDetailModal.vue')
);
const MachineDetailModal = defineAsyncComponent(
  () => import('@/components/Modals/Details/MachineDetailModal.vue')
);

const props = defineProps<{
  openModal: boolean;
  detailMachineType?: MachineType;
}>();

const tabs = ref<string[]>(['插槽組成列表', '主設備列表']);
const selectedTab = ref<string>('插槽組成列表');
const compositions = ref<Composition[]>([]);
const emit = defineEmits(['do-close']);
const loading = shallowRef<boolean>(false);
const openMachineModal = shallowRef<boolean>(false);
const openComponentGeneralTypeModal = shallowRef<boolean>(false);
const detailMachine = ref<Machine | null>(null);

const fetchCompositions = async () => {
  const id = props.detailMachineType?.id;
  if (!id) return;
  const response = await machineTypeAPI.getMachineComponentSlotCompositions(id);
  compositions.value = response.data as unknown as Composition[];
  const ids = compositions.value.map((composition) => {
    return composition.componentGeneralTypeID;
  });
  const types = await componentGeneralTypeAPI.search(ids);
  compositions.value.forEach((composition) => {
    composition.componentGeneralType = types.find((type) => {
      return type.id === composition.componentGeneralTypeID;
    });
  });
};

const closeModal = (): void => {
  emit('do-close');
};
const selectTab = (tab: string) => {
  selectedTab.value = tab;
};
const detailComponentGeneralType = ref<ComponentGeneralType>();
const openDetailGeneralTypeModel = (generalType?: ComponentGeneralType) => {
  detailComponentGeneralType.value = generalType;
  openComponentGeneralTypeModal.value = true;
};
watch(
  () => props.detailMachineType,
  (machineType?: MachineType) => {
    if (machineType) {
      fetchCompositions();
    }
  },
  { immediate: true }
);
</script>

<template>
  <transition name="fade">
    <div
      v-if="props.openModal && detailMachineType"
      class="fixed left-0 top-0 z-[1000] flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5"
      @click.self="closeModal"
    >
      <div
        class="relative w-[80vw] h-[90vh] overflow-y-scroll rounded-lg bg-white px-8 py-12 text-center dark:bg-gray-800 md:px-[70px] md:py-[60px]"
      >
        <button class="absolute text-black top-6 right-8" @click="closeModal">
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
        <h3 class="pb-2 text-xl font-bold text-black">
          <span class="truncate">主設備類型詳細資料</span>
        </h3>
        <span class="mx-auto mb-2 inline-block h-1 w-[230px] rounded bg-primary"></span>
        <h2 class="pb-2 text-xl font-bold text-black">
          {{ props?.detailMachineType?.name }}
        </h2>
        <div class="flex justify-center items-center mb-2">
          <span>{{ props?.detailMachineType?.description || '' }}</span>
        </div>
        <div class="flex flex-col bg-stroke p-3 mb-2">
          <div class="grid grid-cols-2 mb-2">
            <div class="flex justify-center items-center font-semibold">ID</div>
            <div class="flex justify-center items-center font-semibold">代號</div>
          </div>
          <div class="grid grid-cols-2">
            <div class="flex justify-center items-center">
              <span class="truncate">{{ detailMachineType?.id || '-' }}</span>
            </div>
            <div class="flex justify-center items-center">
              <span class="truncate">{{ detailMachineType?.code || '-' }}</span>
            </div>
          </div>
        </div>
        <div class="">
          <div
            class="mt-3 grid grid-cols-2 gap-3 justify-center items-center text-xl text-black mb-2 font-bold"
          >
            <div class="cursor-pointer" @click="selectTab('插槽組成列表')">
              插槽組成列表 (共 {{ compositions.length }} 項)
              <span
                :class="`mx-auto mb-1 inline-block h-[2px] w-full rounded ${
                  selectedTab == tabs[0] ? 'bg-primary' : 'bg-stroke'
                }`"
              ></span>
            </div>
            <div class="cursor-pointer" @click="selectTab('主設備列表')">
              主設備列表
              <span
                :class="`mx-auto mb-1 inline-block h-[2px] w-full rounded ${
                  selectedTab == tabs[1] ? 'bg-primary' : 'bg-stroke'
                }`"
              ></span>
            </div>
          </div>
          <div class="mb-2">
            <div v-show="selectedTab === '插槽組成列表'" class="text-left">
              <div class="flex flex-col">
                <div v-if="loading" class="h-[40vh] flex justify-center items-center">
                  <svg
                    class="animate-spin h-5 w-5 mr-3 text-primary"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V4a10 10 0 00-1.93 19.7L4 12z"
                    ></path>
                  </svg>
                </div>
                <div v-else>
                  <div class="rounded-sm bg-gray-2 dark:bg-meta-4">
                    <div class="grid grid-cols-2">
                      <div class="p-2.5 text-center xl:p-5 flex gap-1 items-center justify-center">
                        <h5 class="text-sm font-medium uppercase xsm:text-base">插槽名稱</h5>
                      </div>
                      <div class="p-2.5 text-center xl:p-5 flex gap-1 items-center justify-center">
                        <h5 class="text-sm font-medium uppercase xsm:text-base">通用零件類型</h5>
                      </div>
                      <!-- <div class="p-2.5 text-center xl:p-5 flex gap-1 items-center justify-center">
                        <h5 class="text-sm font-medium uppercase xsm:text-base">通用零件代號</h5>
                      </div> -->
                      <!-- <div class="p-2.5 text-center xl:p-5 flex gap-1 items-center justify-center">
                        <h5 class="text-sm font-medium uppercase xsm:text-base">最小數量</h5>
                      </div> -->
                    </div>
                  </div>
                  <div class="">
                    <div v-if="compositions && compositions.length == 0">
                      <div class="grid grid-cols-5">
                        <div class="col-span-5 flex justify-center py-4">無</div>
                      </div>
                    </div>
                    <div
                      v-for="composition in compositions"
                      :key="composition.componentGeneralTypeID"
                      class="grid hover:bg-green-50 border-b border-stroke dark:border-strokedark"
                      @click="openDetailGeneralTypeModel(composition?.componentGeneralType)"
                    >
                      <div class="grid grid-cols-2">
                        <div class="flex items-center justify-center p-2.5 xl:p-5">
                          <p class="text-black dark:text-white truncate">
                            {{ composition?.machineComponentSlotName || '-' }}
                          </p>
                        </div>
                        <div class="flex items-center justify-center p-2.5 xl:p-5">
                          <p class="text-black dark:text-white truncate">
                            {{ composition?.componentGeneralType?.name || '-' }}
                          </p>
                        </div>

                        <!-- <div class="flex items-center justify-center p-2.5 xl:p-5">
                          <p class="text-black dark:text-white truncate">
                            {{ composition?.componentGeneralType?.code || '-' }}
                          </p>
                        </div> -->
                        <!-- <div class="flex items-center justify-center p-2.5 xl:p-5">
                          <p class="text-black dark:text-white truncate">
                            {{ composition?.minCount || 0 }}
                          </p>
                        </div> -->
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-show="selectedTab === '主設備列表'" class="text-left">
              <TableMachine
                v-if="props.detailMachineType"
                :show-operation="false"
                :machine-type="props.detailMachineType"
              />
            </div>
          </div>
          <div class="-mx-3 flex flex-wrap gap-y-4 flex-row-reverse py-5">
            <div class="w-full px-3">
              <button
                class="block w-full rounded border border-stroke bg-stroke p-3 text-center font-medium"
                @click="closeModal"
              >
                確定
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
  <ComponentGeneralTypeDetailModal
    v-if="openComponentGeneralTypeModal && detailComponentGeneralType"
    :open-modal="openComponentGeneralTypeModal"
    :detail-component-general-type="detailComponentGeneralType"
    @do-close="openComponentGeneralTypeModal = false"
  />
  <MachineDetailModal
    v-if="openMachineModal && detailMachine"
    :open-modal="openMachineModal"
    :detail-machine="detailMachine"
    @do-close="openMachineModal = false"
  />
</template>
