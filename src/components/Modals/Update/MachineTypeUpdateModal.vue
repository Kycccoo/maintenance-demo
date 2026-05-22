<script setup lang="ts">
import { ref, shallowRef, onMounted } from 'vue';
import { useToast } from 'vue-toast-notification';
import { GlobalToastProps } from '@/types/Toast';
import { type MachineType } from '@/types/MachineType';
import type { Composition } from '@/types/Composition';
import { machineTypeAPI } from '@/api';
import { useErrorStore } from '@/stores/error';
import { EditMachineTypePatchError } from '@occ-web/error-code';
import {
  editMachineTypePostErrorMessageMap,
  setMachineTypeOrderPutErrorMessageMap
} from '@/api/errors/machineType';
import { fetchUserErrorMessageMap } from '@/api/errors/login';
import { useMachineTypeStore } from '@/stores/machineType';
import ComponentGeneralTypeCheckbox from '@/components/Modals/Selector/ComponentGeneralTypeCheckbox.vue';
import type { ComponentGeneralType } from '@/types/ComponentGeneralType';
import { InitMachineTypeErrors } from '@/types/errors/MachineTypeError';
import { AxiosError } from 'axios';
import RequiredSpan from '@/components/Labels/RequiredSpan.vue';
const $toast = useToast(GlobalToastProps);

const emit = defineEmits<{
  'do-close': [];
}>();

const props = defineProps<{
  openModal: boolean;
  machineType: MachineType;
}>();

const updateError = ref(structuredClone(InitMachineTypeErrors));
const store = useMachineTypeStore();
const updateMachineType = ref<MachineType>();
const modalComponentGeneralTypeCheckboxOpen = shallowRef(false);

onMounted(async () => {
  updateMachineType.value = props.machineType;
  store.loading = true;
  // updateMachineType.value.compositions = await getCompositions(updateMachineType.value.id);
  updateMachineType.value.order = (await store.getOrder(updateMachineType.value.id)) ?? 0;
  store.loading = false;
});

// const getCompositions = async (id: number) => {
//   const response = await machineTypeAPI.getCompositions(id);
//   const compositions: Composition[] = response.data.data || [];
//   if (compositions) {
//     const ids = compositions.map((item) => item.componentGeneralTypeID);
//     const types = await componentGeneralTypeAPI.search(ids);
//     compositions.map((item) => {
//       const type = types.find((type) => type.id === item.componentGeneralTypeID);
//       if (type) {
//         item.componentGeneralType = type;
//       }
//     });

//     return compositions;
//   }
//   return [];
// };

const closeModal = () => {
  emit('do-close');
};

const handleUpdate = async () => {
  updateError.value = structuredClone(InitMachineTypeErrors);
  if (!updateMachineType.value) return;

  if (!updateMachineType.value.name) {
    updateError.value.name = '請輸入主設備類型名稱';
  }

  if (!updateMachineType.value.code) {
    updateError.value.code = '請輸入代號';
  }

  try {
    await store.update(updateMachineType.value);
    store.lastOperationId = updateMachineType.value.id;
    await setOrder(updateMachineType.value.id, updateMachineType.value.order);
    await setComposition(updateMachineType.value.id, updateMachineType.value.compositions || []);
    store.sync(updateMachineType.value);
    updateError.value = structuredClone(InitMachineTypeErrors);
    $toast.success('主設備類型更新成功');
    emit('do-close');
  } catch (error) {
    handleUpdateError(error);
  }
};

const setComposition = async (id: number, compositions: Composition[]) => {
  try {
    const data = compositions.map((item) => {
      return {
        componentGeneralTypeID: item.componentGeneralTypeID,
        minCount: item.minCount
      };
    });
    await machineTypeAPI.putCompositions(id, data);
    return true;
  } catch (error) {
    console.error('Unexpected error', error);
  }
  return false;
};

const setOrder = async (id: number, order: number) => {
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
    $toast.error(setMachineTypeOrderPutErrorMessageMap[code]);
  });
};

const closeComponentGeneralTypeCheckboxModal = () => {
  modalComponentGeneralTypeCheckboxOpen.value = false;
};

// const openComponentGeneralTypeCheckboxModal = () => {
//   modalComponentGeneralTypeCheckboxOpen.value = true;
// };

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
        EditMachineTypePatchError.BodyNameType,
        EditMachineTypePatchError.BodyNameMaxLength,
        EditMachineTypePatchError.BodyNamePattern,
        EditMachineTypePatchError.NameDuplicated
      ].includes(code)
    ) {
      updateError.value.name = editMachineTypePostErrorMessageMap[code];
    } else if (
      [
        EditMachineTypePatchError.BodyCodeType,
        EditMachineTypePatchError.BodyCodeMaxLength,
        EditMachineTypePatchError.BodyCodePattern,
        EditMachineTypePatchError.CodeDuplicated
      ].includes(code)
    ) {
      updateError.value.code = editMachineTypePostErrorMessageMap[code];
    } else if (
      [
        EditMachineTypePatchError.BodyDescriptionType,
        EditMachineTypePatchError.BodyDescriptionMaxLength
      ].includes(code)
    ) {
      updateError.value.description = editMachineTypePostErrorMessageMap[code];
    } else if ([EditMachineTypePatchError.BodyType].includes(code)) {
      updateError.value.general = editMachineTypePostErrorMessageMap[code];
    } else {
      updateError.value.general =
        editMachineTypePostErrorMessageMap[code] ||
        fetchUserErrorMessageMap[code] ||
        `未知錯誤: ${code}`;
    }
  });
};

const handleComponentGeneralTypeCheckboxSubmit = (selectedItems: ComponentGeneralType[]) => {
  if (!updateMachineType.value) return;

  updateMachineType.value.compositions = selectedItems.map((item) => {
    return {
      componentGeneralType: item,
      componentGeneralTypeID: item.id,
      minCount: 0
    } as Composition;
  });

  modalComponentGeneralTypeCheckboxOpen.value = false;
};
</script>

<template>
  <transition name="fade">
    <div
      v-if="openModal && updateMachineType"
      class="fixed left-0 top-0 z-[1000] flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5"
    >
      <div
        class="relative w-[80vw] h-[90vh] overflow-y-scroll rounded-lg bg-white px-8 py-8 text-center dark:bg-gray-800"
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
        <h3 class="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl"></h3>
        <div class="flex flex-col justify-center items-center gap-2 pb-2">
          <h3 class="text-xl font-bold text-black dark:text-white sm:text-2xl">
            修改主設備類型資訊 ID: {{ props.machineType.id }}
          </h3>
          <span class="mx-auto mb-6 inline-block h-1 w-[260px] rounded bg-primary"></span>
        </div>
        <div class="grid grid-cols-1 gap-3 mb-3">
          <div class="text-left">
            <div>
              <div class="mb-4">
                <label class="mb-2.5 block font-medium text-black dark:text-white"
                  ><RequiredSpan />主設備類型名稱</label
                >
                <div class="relative">
                  <input
                    v-model="updateMachineType.name"
                    required
                    type="text"
                    placeholder="請輸入主設備類型名稱"
                    :class="`border ${
                      updateError.name ? 'border-red' : 'border-stroke'
                    } w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                  />
                </div>
                <p v-if="updateError.name" class="text-sm text-red-500 mt-1">
                  *{{ updateError.name }}
                </p>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div class="mb-4">
                  <label class="mb-2.5 block font-medium text-black dark:text-white"
                    ><RequiredSpan />代號</label
                  >
                  <div class="relative">
                    <input
                      v-model="updateMachineType.code"
                      required
                      type="text"
                      placeholder="請輸入代號"
                      :class="`border ${
                        updateError.code ? 'border-red' : 'border-stroke'
                      } w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                    />
                  </div>
                  <p v-if="updateError.code" class="text-sm text-red-500 mt-1">
                    *{{ updateError.code }}
                  </p>
                </div>
                <div class="mb-4">
                  <label class="mb-2.5 block font-medium text-black dark:text-white">排序</label>
                  <div class="relative">
                    <input
                      v-model="updateMachineType.order"
                      required
                      value="0"
                      type="number"
                      placeholder="請輸入排序"
                      :class="`border ${
                        updateError.order ? 'border-red' : 'border-stroke'
                      } w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                    />
                  </div>
                  <p v-if="updateError.order" class="text-sm text-red-500 mt-1">
                    *{{ updateError.order }}
                  </p>
                </div>
              </div>
            </div>
            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white">描述</label>
              <div class="relative">
                <textarea
                  v-model="updateMachineType.description"
                  rows="6"
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

          <!-- <div class="text-left">
            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white"
                >通用零件類型組成列表 (共
                {{ updateMachineType?.compositions?.length || 0 }} 項)</label
              >
              <div class="relative">
                <div
                  v-if="
                    updateMachineType &&
                    updateMachineType.compositions &&
                    updateMachineType.compositions.length > 0
                  "
                  class="h-[46vh] overflow-y-scroll"
                >
                  <div>
                    <div class="grid grid-cols-2 gap-2 text-black">
                      <div class="mb-2 px-1">
                        <p>通用類型名稱</p>
                      </div>
                      <div class="mb-2 px-1">設置最小數量</div>
                    </div>
                  </div>
                  <div
                    v-if="
                      updateMachineType?.compositions &&
                      updateMachineType.compositions.length > 0
                    "
                  >
                    <div
                      v-for="item in updateMachineType.compositions"
                      :key="item.componentGeneralTypeID"
                    >
                      <div>
                        <div class="flex gap-2">
                          <div class="mb-4">
                            <div class="relative">
                              <input
                                :value="item.componentGeneralType?.name"
                                type="text"
                                readonly
                                :class="`bg-slate-100 border border-stroke w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                                @click="openComponentGeneralTypeCheckboxModal"
                              />
                            </div>
                          </div>
                          <div class="mb-4">
                            <div class="relative">
                              <input
                                v-model="item.minCount"
                                min="0"
                                type="number"
                                placeholder="請輸入最小數量"
                                :class="`border ${
                                  item.minCount < 0 || !Number.isInteger(item.minCount)
                                    ? 'border-red focus:border-red'
                                    : 'border-stroke focus:border-primary'
                                } w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                                @blur="
                                  !item.minCount ? (item.minCount = 0) : item.minCount
                                "
                                @keyup="
                                  item.minCount < 0 ||
                                  (item.minCount && !Number.isInteger(item.minCount))
                                    ? (item.minCount = 0)
                                    : item.minCount
                                "
                              />
                              <p
                                v-if="
                                  item.minCount < 0 || !Number.isInteger(item.minCount)
                                "
                                class="text-sm text-red-500 mt-1"
                              >
                                *請輸入大於或等於 0 的整數
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else>無</div>
                </div>
              </div>
            </div>
            <button
              class="px-4 py-2 text-white w-full rounded border border-primary bg-primary text-center font-medium transition hover:bg-opacity-90"
              @click="openComponentGeneralTypeCheckboxModal"
            >
              選擇通用零件類型
            </button>
          </div> -->
        </div>
        <div class="-mx-3 flex flex-wrap gap-y-4 flex-row-reverse">
          <div class="w-full px-3 flex">
            <button
              :disabled="store.loading"
              class="disabled:opacity-60 block w-full rounded border border-primary bg-primary p-3 text-center font-medium text-white hover:opacity-80"
              @click="handleUpdate"
            >
              送出
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
  <ComponentGeneralTypeCheckbox
    :open-modal="modalComponentGeneralTypeCheckboxOpen"
    :items="
      updateMachineType?.compositions
        ?.map((item) => item.componentGeneralType)
        .filter((item): item is ComponentGeneralType => item !== undefined) ?? []
    "
    @do-close="closeComponentGeneralTypeCheckboxModal"
    @do-submit="handleComponentGeneralTypeCheckboxSubmit"
  />
</template>
