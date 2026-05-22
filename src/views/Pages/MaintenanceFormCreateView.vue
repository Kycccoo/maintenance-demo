<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent, computed, watch } from 'vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import type { ComponentBrand } from '@/types/ComponentBrand';
import { useMachineComponentSlotMaintenanceStore } from '@/stores/machineComponentSlotMaintenance';
import { addMachineComponentSlotMaintenanceFormPostErrorMessageMap } from '@/api/errors/machineComponentSlotMaintenance';
import { Wrench } from 'lucide-vue-next';
import { AddMachineComponentSlotMaintenanceFormPostError } from '@occ-web/error-code';
import NumberSelector from '@/components/Modals/Selector/NumberSelector.vue';
import type { ComponentType } from '@/types/ComponentType';
import { AxiosError } from 'axios';
import { useErrorStore } from '@/stores/error';
import { ChevronLeft } from 'lucide-vue-next';
import RequiredSpan from '@/components/Labels/RequiredSpan.vue';
import { useMachineComponentSlotStore } from '@/stores/machineComponentSlot';
import MultiUnitSubComponentForm from '@/components/Forms/MultiUnitSubComponentForm.vue';
import SingleUnitSubComponentForm from '@/components/Forms/SingleUnitSubComponentForm.vue';
import SingleUnitComponentForm from '@/components/Forms/SingleUnitComponentForm.vue';
import SubComponentCreateModal from '@/components/Modals/Selector/SubComponentCreateModal.vue';
import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

const machineComponentSlotStore = useMachineComponentSlotStore();
const ComponentTypeRadioModal = defineAsyncComponent(
  () => import('@/components/Modals/Selector/ComponentTypeRadio.vue')
);

const FileUploader = defineAsyncComponent(
  () => import('@/components/Forms/FileUploader/FileUploader.vue')
);
const DatetimePicker = defineAsyncComponent(
  () => import('@/components/Forms/DatePicker/DatetimePicker.vue')
);
const ComponentBrandRadio = defineAsyncComponent(
  () => import('@/components/Modals/Selector/ComponentBrandRadio.vue')
);
const UserRadio = defineAsyncComponent(() => import('@/components/Modals/Selector/UserRadio.vue'));
import type { User } from '@/types/User';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toast-notification';
import { factoryAPI, machineAPI, machineComponentSlotAPI, machineSystemAPI } from '@/api';
import MultiUnitComponentForm from '@/components/Forms/MultiUnitComponentForm.vue';
import type { ComponentDetail } from '@/types/MachineComponentSlotMaintenance';
const $toast = useToast();
const router = useRouter();
const allRepair = ref<boolean>(false);
const store = useMachineComponentSlotMaintenanceStore();
const modalUserRadioOpen = ref<boolean>(false);
const modalComponentBrandRadioOpen = ref<boolean>(false);
const modalComponentTypeRadioOpen = ref<boolean>(false);
const modalSubComponentTypeRadioOpen = ref<boolean>(false);

const machineIssueOptions = [
  { label: '機械老化與磨損', value: '機械老化與磨損' },
  { label: '液壓/氣動與潤滑', value: '液壓/氣動與潤滑' },
  { label: '電氣與控制系統故障', value: '電氣與控制系統故障' },
  { label: '原料與供料異常', value: '原料與供料異常' },
  { label: '結構與外部因素', value: '結構與外部因素' },
  { label: '人為因素與維護不當', value: '人為因素與維護不當' },
  { label: '其他', value: '其他' }
];

const openStaffSelector = () => {
  createError.value.staff = '';
  modalUserRadioOpen.value = true;
};

const handleUserSubmit = (staff: User) => {
  store.maintenance.staffID = staff.id;
  store.maintenance.staff = staff;
  modalUserRadioOpen.value = false;
};

const handleComponentBrandRadioSubmit = (brand: ComponentBrand) => {
  store.maintenance.maintainer = brand.name;
  modalComponentBrandRadioOpen.value = false;
};

const handleComponentTypeRadioSubmit = (componentType: ComponentType) => {
  if (!componentType.id) {
    modalComponentTypeRadioOpen.value = false;
    return;
  }
  store.maintenance.addedComponentNames = [null];
  store.maintenance.installedComponents = [
    {
      name: null,
      componentCount: 1,
      componentTypeID: componentType.id,
      componentType: componentType
    }
  ];
  modalComponentTypeRadioOpen.value = false;
};

const handleSubComponentTypeRadioSubmit = (subComponentType: ComponentType) => {
  const name =
    subComponentType.componentGeneralType?.name +
    '_' +
    `${Math.floor(Math.random() * 900000) + 100000}`;
  store.maintenance.addedComponentNames.push(name);
  store.maintenance.installedComponents.push({
    name: name,
    componentCount: 1,
    componentTypeID: subComponentType.id,
    componentType: subComponentType,
    isNewComponent: true
  });
  modalSubComponentTypeRadioOpen.value = false;
};

const closeComponentTypeRadioModal = () => {
  modalComponentTypeRadioOpen.value = false;
};

const closeSubComponentTypeRadioModal = () => {
  modalSubComponentTypeRadioOpen.value = false;
};

type CreateError = {
  failureCause: string;
  failureCategory?: string;
  maintainer: string;
  equipment: string;
  note: string;
  malfunctionAt: string;
  finishAt: string;
  number: string;
  staff: string;
  createAt: string;
  general: string;
  installedComponent: string;
};
const initCreateError: CreateError = {
  failureCause: '',
  failureCategory: '',
  maintainer: '',
  equipment: '',
  note: '',
  malfunctionAt: '',
  finishAt: '',
  number: '',
  staff: '',
  createAt: '',
  general: '',
  installedComponent: ''
};
const createError = ref<CreateError>(structuredClone(initCreateError));
type NotificationContent = {
  id: number | null;
  scheduledAt: string;
  failureCategory: string;
  reason: string;
};
const machineComponentSlotNotification = ref<NotificationContent>();

onMounted(async () => {
  const notification = localStorage.getItem('alarmID');
  if (notification) {
    const notificationID = JSON.parse(notification);
    const data = await notificationID;
    machineComponentSlotNotification.value = {
      id: data.id,
      failureCategory: data.category,
      scheduledAt: data.scheduledAt,
      reason: data.reason
    };
  }
  showDialog.value = true;
  store.resetMaintenance();
  store.maintenance.malfunctionAt = '';
  store.maintenance.finishAt = '';
  if (machineComponentSlotNotification.value) {
    store.maintenance.malfunctionAt = machineComponentSlotNotification.value?.scheduledAt;
    store.maintenance.failureCause = machineComponentSlotNotification.value?.reason;
    store.maintenance.failureCategory = machineComponentSlotNotification.value?.failureCategory;
  } else {
    store.maintenance.failureCause = '1.故障什麼？2.怎麼故障的？';
  }
  store.maintenance.note = `1.維護什麼？2.怎麼維護的？`;

  const id = router.currentRoute.value.params.id;
  if (id) {
    const currentSlot = await machineComponentSlotStore.getComponentSlot(Number(id));
    let slots = await machineComponentSlotAPI.appendComponentGeneralType([currentSlot]);
    slots = await machineComponentSlotAPI.appendMachine(slots);
    slots = await machineComponentSlotAPI.appendMachineFactory(slots);
    const machineID = slots[0].machineID;
    const factoryID = slots[0].machine?.factoryID ?? 0;
    const tree = await machineComponentSlotAPI.tree(factoryID, machineID);
    const notEmptyMachines = ['北部', '東部', '南部', '中部']
      .filter((region) => tree[region as keyof typeof tree])
      .map((region) => tree[region as keyof typeof tree][0]);
    const treeFactory = notEmptyMachines[0];
    const systemID = treeFactory.machineSystems.filter((system) => system.machines.length > 0)[0]
      .id;
    const system = await machineSystemAPI.get(systemID);
    const factory = await factoryAPI.getFactory(factoryID);
    const machine = await machineAPI.get(machineID);

    store.currentEquipment = machine;
    store.currentFactory = factory;
    store.currentSystem = system;
    store.currentSlot = slots[0];
  }
  checkFactory();
  store.maintenance.staff = {
    id: userStore.user?.id ?? 0,
    type: userStore.user?.type ?? 0,
    name: userStore.user?.name ?? '',
    isDeprecated: userStore.user?.isDeprecated ?? false
  };
  store.maintenance.staffID = userStore.user?.id ?? 0;
  setTimeout(async () => {
    if (!store.currentSlot) {
      router.push('/');
      return;
    }
    store.maintenance.machineComponentSlotID = Number(router.currentRoute.value.params.id);
  }, 1000);
});

watch(
  () => store.maintenance.finishAt,
  () => {
    const lastTime = new Date(new Date(store.maintenance.finishAt).getTime() - 1).toISOString();
    if (!store.maintenance.finishAt) return;
    store.initUpdateOverView(Number(store.maintenance.machineComponentSlotID), lastTime);
  }
);

const installedNames = computed<string[]>(() => {
  const subs = store.overview?.sub ?? [];
  return subs.map((item) => item.name).filter((name): name is string => name !== undefined);
});
const handleCreate = async () => {
  let text;
  if (confirm('是否還有需新增圖片，點"確定"送出，若仍有請點"取消"') == true) {
    text = 'You pressed OK!';
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    text = 'You canceled!';
    return;
  }
  if (!store.maintenance.staffID) {
    createError.value.staff = '負責人是必填欄位';
  }

  if (createError.value.staff) {
    $toast.error('請選擇負責人');
    return;
  }

  if (
    store.maintenance.installedComponents.length === 0 &&
    store.maintenance.fixedComponents.length === 0
  ) {
    $toast.error('請至少選擇：【更換】或【勾選維修/保養】維護項目');
    return;
  }

  createError.value.failureCause = '';
  createError.value.failureCategory = '';
  createError.value.maintainer = '';
  createError.value.equipment = '';
  createError.value.note = '';
  createError.value.malfunctionAt = '';
  createError.value.finishAt = '';
  createError.value.number = '';
  createError.value.staff = '';
  createError.value.createAt = '';
  createError.value.general = '';

  if (!store.maintenance.malfunctionAt) {
    createError.value.malfunctionAt = '故障時間是必填欄位';
    $toast.error('請選擇故障時間');
    return;
  }
  if (!store.maintenance.failureCategory) {
    createError.value.failureCategory = '故障類別是必填欄位';
    $toast.error('請選擇故障類別');
    return;
  }
  if (!store.maintenance.finishAt) {
    createError.value.finishAt = '維護完成時間是必填欄位';
    $toast.error('請選擇維護完成時間');
    return;
  }
  if (store.maintenance.installedComponents.length > 0) {
    for (const component of store.maintenance.installedComponents) {
      if (!component.componentTypeID) {
        createError.value.installedComponent = '請選擇換上的零件';
        $toast.error('請選擇換上的零件');
        return;
      }
    }
  }

  try {
    store.maintenance.machineComponentSlotID = Number(router.currentRoute.value.params.id);
    await store.create(store.maintenance, machineComponentSlotNotification.value?.id ?? undefined);
    createError.value = structuredClone(initCreateError);
    localStorage.removeItem('alarmID');
    store.resetMaintenance();
    $toast.success('新增維護單成功');
    router.push('/maintenance-form/thanks');
  } catch (error: unknown) {
    $toast.error('新增維護單失敗');
    if (!(error instanceof AxiosError)) {
      useErrorStore().setUnknownError();
      return;
    }
    if (error.response?.data?.errors) {
      const errorCodes = error.response.data.errors;
      if (!Array.isArray(errorCodes)) {
        useErrorStore().setUnknownError();
        return;
      }

      errorCodes.forEach((code) => {
        if (
          [
            AddMachineComponentSlotMaintenanceFormPostError.BodyFailureCauseType,
            AddMachineComponentSlotMaintenanceFormPostError.BodyFailureCauseMaxLength
          ].includes(code)
        ) {
          createError.value.failureCause =
            addMachineComponentSlotMaintenanceFormPostErrorMessageMap[code];
        } else if (
          [
            AddMachineComponentSlotMaintenanceFormPostError.BodyMaintainerType,
            AddMachineComponentSlotMaintenanceFormPostError.BodyMaintainerMaxLength
          ].includes(code)
        ) {
          createError.value.maintainer =
            addMachineComponentSlotMaintenanceFormPostErrorMessageMap[code];
        } else if (
          [
            AddMachineComponentSlotMaintenanceFormPostError.BodyEquipmentType,
            AddMachineComponentSlotMaintenanceFormPostError.BodyEquipmentMaxLength
          ].includes(code)
        ) {
          createError.value.equipment =
            addMachineComponentSlotMaintenanceFormPostErrorMessageMap[code];
        } else if (
          [
            AddMachineComponentSlotMaintenanceFormPostError.BodyNoteRequired,
            AddMachineComponentSlotMaintenanceFormPostError.BodyNoteType,
            AddMachineComponentSlotMaintenanceFormPostError.BodyNoteMaxLength
          ].includes(code)
        ) {
          createError.value.note = addMachineComponentSlotMaintenanceFormPostErrorMessageMap[code];
        } else if (
          [
            AddMachineComponentSlotMaintenanceFormPostError.BodyMalfunctionAtType,
            AddMachineComponentSlotMaintenanceFormPostError.BodyMalfunctionAtFormat
          ].includes(code)
        ) {
          createError.value.malfunctionAt =
            addMachineComponentSlotMaintenanceFormPostErrorMessageMap[code];
        } else if (
          [
            AddMachineComponentSlotMaintenanceFormPostError.BodyFinishAtRequired,
            AddMachineComponentSlotMaintenanceFormPostError.BodyFinishAtType,
            AddMachineComponentSlotMaintenanceFormPostError.BodyFinishAtFormat
          ].includes(code)
        ) {
          createError.value.finishAt =
            addMachineComponentSlotMaintenanceFormPostErrorMessageMap[code];
        } else if (
          [
            AddMachineComponentSlotMaintenanceFormPostError.BodyStaffIDRequired,
            AddMachineComponentSlotMaintenanceFormPostError.BodyStaffIDType,
            AddMachineComponentSlotMaintenanceFormPostError.BodyStaffIDMinimum
          ].includes(code)
        ) {
          createError.value.staff = addMachineComponentSlotMaintenanceFormPostErrorMessageMap[code];
        } else {
          createError.value.general =
            addMachineComponentSlotMaintenanceFormPostErrorMessageMap[code] || `未知錯誤: ${code}`;
        }
      });
    } else {
      createError.value.general = '新增維護單失敗';
    }
  }
};

const checkedMaintenanceDepartment = ref<boolean>(false);
const checkedFactory = ref<boolean>(false);
const checkedBrand = ref<boolean>(false);

const checkMaintenanceDepartment = () => {
  store.maintenance.maintainer = '工務隊';
  checkedFactory.value = false;
  checkedBrand.value = false;
  checkedMaintenanceDepartment.value = true;
};

const checkFactory = () => {
  store.maintenance.maintainer = store?.currentFactory?.name ?? '自廠';
  checkedMaintenanceDepartment.value = false;
  checkedBrand.value = false;
  checkedFactory.value = true;
};
const checkBrand = () => {
  store.maintenance.maintainer = '其他廠商';
  checkedMaintenanceDepartment.value = false;
  checkedFactory.value = false;
  checkedBrand.value = true;
};

const checkHumanError = () => {
  store.maintenance.isHumanError = true;
};
const checkNonHumanError = () => {
  store.maintenance.isHumanError = false;
};

const modalComponentInstallOpen = ref<boolean>(false);

const openCreateSubComponentModal = () => {
  modalComponentInstallOpen.value = true;
};

const handleComponentInstallClose = () => {
  modalComponentInstallOpen.value = false;
};

const handleComponentInstallSubmit = () => {
  modalComponentInstallOpen.value = false;
};

const subInstalledComponents = computed(() => {
  return store.maintenance.installedComponents.filter(
    (component) =>
      component.name !== 'null' &&
      !store.overview?.sub?.some((sub) => sub.name === component.name) &&
      component.isNewComponent
  );
});

const removeSubInstalledComponent = (subInstalledComponent: ComponentDetail) => {
  store.maintenance.installedComponents = store.maintenance.installedComponents.filter(
    (component) => component.name !== subInstalledComponent.name
  );
};

const calculateComponentCounts = () => {
  if (!store.overview?.top || !store.overview?.sub) {
    return { totalCount: 0, fixedComponentsCount: 0 };
  }

  let totalCount = 0;

  // 計算 store.overview.top 的數量
  if (store.overview.top.componentMetaData.length > 0) {
    totalCount += store.overview.top.componentMetaData.reduce(
      (acc, curr) => acc + (curr.componentCount || 0),
      0
    );
  }

  // 計算 store.overview.sub 的數量
  store.overview.sub.forEach((subComponent) => {
    totalCount += subComponent.componentMetaData.reduce(
      (acc, curr) => acc + (curr.componentCount || 0),
      0
    );
  });

  // 計算 fixedComponents 的數量
  const fixedComponentsCount = store.maintenance.fixedComponents.reduce(
    (acc, curr) => acc + (curr.componentCount || 0),
    0
  );

  return { totalCount, fixedComponentsCount };
};

const durationText = computed(() => {
  const start = store.maintenance.malfunctionAt as string | Date;
  const end = store.maintenance.finishAt as string | Date;
  if (!start || !end) return '—';

  const s = start instanceof Date ? (start as Date).getTime() : new Date(String(start)).getTime();
  const e = end instanceof Date ? (end as Date).getTime() : new Date(String(end)).getTime();
  if (Number.isNaN(s) || Number.isNaN(e)) return '（時間格式錯誤）';
  if (e < s) return '（完成時間早於故障時間）';

  const totalMin = Math.floor((e - s) / 60000);
  const hr = Math.floor(totalMin / 60);
  const min = totalMin % 60;
  return `${hr} 小時 ${min} 分鐘`;
});

watch(
  () => store.maintenance.fixedComponents,
  () => {
    const { totalCount, fixedComponentsCount } = calculateComponentCounts();
    if (fixedComponentsCount === 0) {
      allRepair.value = false;
      return;
    }
    if (fixedComponentsCount !== totalCount) {
      allRepair.value = false;
    } else {
      allRepair.value = true;
    }
  },
  { deep: true }
);
const showDialog = ref(false);
const openBtnRef = ref<HTMLElement | null>(null);

/**
 * 退場位移量：會在關閉前計算
 * 預設給個右下方向，避免 ref 尚未就緒時沒有值
 */
const leaveDx = ref(160);
const leaveDy = ref(160);

/**
 * 用 CSS 變數把位移帶進 Transition class
 */
const panelStyle = computed(
  () =>
    ({
      '--leave-x': `${leaveDx.value}px`,
      '--leave-y': `${leaveDy.value}px`
    }) as Record<string, string>
);

const openDialog = () => {
  showDialog.value = true;
};

const closeDialog = () => {
  showDialog.value = false;
};

/**
 * 在退場前計算「置中 modal」到「按鈕中心點」的向量
 * modal 置中點 = viewport 中心
 * btn 中心點 = button.getBoundingClientRect() 推算
 */
const onBeforeLeave = () => {
  const btn = openBtnRef.value;
  if (!btn) return;

  const rect = btn.getBoundingClientRect();
  const btnCx = rect.left + rect.width / 2;
  const btnCy = rect.top + rect.height / 2;

  const vpCx = window.innerWidth / 2;
  const vpCy = window.innerHeight / 2;

  const dx = btnCx - vpCx;
  const dy = btnCy - vpCy;

  // 讓移動幅度不要太小也不要太誇張（可自行調整）
  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
  leaveDx.value = clamp(dx, -320, 320);
  leaveDy.value = clamp(dy, -320, 320);
};
</script>

<template>
  <DefaultLayout>
    <div
      class="container mx-auto px-4 py-8 flex flex-col md:flex-row shadow-lg rounded-lg p-4 bg-white"
    >
      <div class="w-full">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center cursor-pointer text-2xl" @click="router.back()">
            <ChevronLeft class="w-10 h-10 text-green-600" />
            返回
          </div>
          <h1 class="text-2xl font-bold text-center">維護單填寫</h1>
          <div class="w-[100px]"></div>
        </div>

        <!-- Breadcrumb Navigation -->
        <div class="bg-gray-100 p-3 mb-6">
          <p class="text-base">
            目標零件：
            <span class="text-gray-700"
              >{{ store?.currentFactory?.name ?? '無工廠' }}
              >
              {{ store?.currentSystem?.name ?? '無系統' }}
              >
              {{ store?.currentEquipment?.name ?? '無設備' }}
              >
              {{ store?.currentSlot?.name ?? '無零件' }}</span
            >
          </p>
        </div>

        <!-- Date Information -->
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center">
            <span class="mr-2">填單時間：</span>
            <span>{{ new Date().toISOString().slice(0, 10) }}</span>
          </div>

          <div class="flex items-center justify-center">
            <label class="block dark:text-white w-[110px]">故障時間： </label>
            <div class="flex items-center space-x-2 w-full input-xl">
              <DatetimePicker
                v-model="store.maintenance.malfunctionAt"
                placeholder="請選擇故障時間"
              />
            </div>
            <span class="text-red-500">＊</span>
            <p v-if="!store.maintenance.malfunctionAt" class="text-sm text-red-500 mt-1">
              {{ createError.malfunctionAt }}
            </p>
          </div>
          <div class="flex items-center">
            <label class="block dark:text-white w-[170px]">維護完成時間： </label>
            <div class="flex items-center space-x-2 w-full input-xl">
              <DatetimePicker v-model="store.maintenance.finishAt" placeholder="請選擇維護時間" />
            </div>
            <span class="text-red-500">＊</span>
            <p v-if="!store.maintenance.finishAt" class="text-sm text-red-500 mt-1">
              {{ createError.finishAt }}
            </p>
          </div>
          <div class="flex items-center bg-yellow-300">
            <label class="block dark:text-white w-[110px]">時間：</label>
            <div class="w-[200px] input-xl">
              {{ durationText }}
            </div>
          </div>
        </div>
        <div class="fixed right-6 top-40 z-40">
          <button
            ref="openBtnRef"
            class="rounded-lg px-4 py-2 text-white shadow"
            :class="showDialog ? 'bg-green-700' : ' bg-red-600'"
            @click="openDialog"
          >
            ★查看填單說明圖片
          </button>
        </div>

        <Transition name="modal" @before-leave="onBeforeLeave">
          <div v-if="showDialog" class="fixed inset-0 z-50 flex items-center justify-center">
            <!-- 遮罩 -->
            <div class="absolute inset-0 bg-black/60"></div>

            <!-- 內容卡片（動畫主體放在這層） -->
            <div
              class="relative z-10 rounded-xl bg-white p-6 shadow-xl will-change-transform left-20"
              :style="panelStyle"
            >
              <!-- 關閉 -->
              <button
                class="absolute right-3 top-3 rounded-full bg-slate-200 px-2 py-1 text-sm hover:bg-slate-300"
                @click="closeDialog"
              >
                ✕
              </button>

              <div class="flex justify-center">
                <img
                  src="@/assets/images/cover/main0124.png"
                  alt="Attachment Preview"
                  class="max-h-[80vh] max-w-[80vw] object-contain"
                />
              </div>
            </div>
          </div>
        </Transition>
        <p v-if="!store.maintenance.finishAt" class="text-red-500 text-bold">
          請先選擇維護完成時間！
        </p>
        <div
          :class="{
            'opacity-50 pointer-events-none select-none': !store.maintenance.finishAt
          }"
          :aria-disabled="!store.maintenance.finishAt"
        >
          <div v-if="store.currentSlot?.componentGeneralType?.isMultiUnit">
            <MultiUnitComponentForm
              :createError="createError"
              @update:createError="createError = $event"
            />
          </div>
          <div v-else>
            <!-- Part Details Section -->
            <div class="relative">
              <SingleUnitComponentForm />
            </div>
          </div>

          <!-- Sub-components Section -->
          <div
            v-if="
              !store?.currentSlot?.componentGeneralType?.isMultiUnit &&
              store.maintenance.addedComponentNames.filter((name) => name === null).length === 0
            "
            class="pt-4 gap-4"
          >
            <div v-if="store?.overview?.sub && store?.overview?.sub.length > 0">
              <h2 class="text-xl font-bold mb-3">子零件</h2>
              <div v-for="subComponent in store.overview?.sub" class="mb-4">
                <template v-if="subComponent?.componentGeneralType?.isMultiUnit">
                  <MultiUnitSubComponentForm
                    v-if="subComponent?.componentGeneralType"
                    :sub-component="subComponent"
                  />
                </template>
                <template v-else>
                  <SingleUnitSubComponentForm
                    v-if="subComponent?.componentGeneralType"
                    :sub-component="subComponent"
                  />
                </template>
              </div>
            </div>
            <!-- First Sub-component Box -->
            <template v-for="subInstalledComponent in subInstalledComponents">
              <div
                v-if="subInstalledComponent.isNewComponent"
                class="bg-gray-100 p-6 rounded-md mb-4 border-dashed border-gray-400 border-2"
              >
                <div class="flex justify-between items-start mb-4">
                  <h3 class="text-lg font-bold flex justify-between items-center gap-2">
                    {{
                      subInstalledComponent.name ||
                      subInstalledComponent.componentType?.componentGeneralType?.name
                    }}
                    <svg
                      class="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      @click="removeSubInstalledComponent(subInstalledComponent)"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
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
                  </h3>
                </div>
                <!-- Part Information -->
                <div class="space-y-2">
                  <p>
                    零件編號：{{
                      subInstalledComponent.componentType?.componentGeneralType?.code ?? '-'
                    }}
                  </p>
                  <p>
                    零件類型：{{
                      subInstalledComponent.componentType?.componentGeneralType?.name ?? '-'
                    }}
                  </p>
                  <p>零件型號：{{ subInstalledComponent.componentType?.code ?? '-' }}</p>
                  <p>零件廠商：{{ subInstalledComponent.componentType?.brand?.name ?? '-' }}</p>
                  <p>零件型號：{{ subInstalledComponent.componentType?.brandModel ?? '-' }}</p>
                  <p>零件規格：{{ subInstalledComponent.componentType?.brandSpec ?? '-' }}</p>
                </div>
                <div
                  v-show="subInstalledComponent.componentType?.componentGeneralType?.isMultiUnit"
                  class="mt-6 flex items-center"
                >
                  <span class="mr-4">數量</span>
                  <div class="flex items-center">
                    <NumberSelector
                      v-model="subInstalledComponent.componentCount"
                      :max="100"
                      :min="1"
                    />
                  </div>
                </div>
              </div>
            </template>
            <div
              v-if="store?.overview?.top && !store?.currentSlot?.componentGeneralType?.isMultiUnit"
              class="flex items-center w-full justify-center"
            >
              <button
                class="px-4 py-3 bg-primary text-white rounded-md hover:bg-opacity-90 transition min-w-[320px]"
                @click="openCreateSubComponentModal"
              >
                新增子零件
              </button>
            </div>
          </div>
        </div>
        <div class="mt-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Left Section: Unit and Working Hours -->
            <div class="bg-gray-200 p-4 rounded-md">
              <h2 class="text-lg font-bold mb-4">單位與工時：</h2>

              <div class="mb-4">
                <label class="mb-2.5 block dark:text-white"><RequiredSpan />負責人： </label>
                <div class="flex items-center space-x-2 w-full">
                  <input
                    :value="store.maintenance.staff?.name || ''"
                    type="text"
                    :readonly="true"
                    placeholder="請選擇負責人"
                    :class="`${
                      store.maintenance.staff ? 'bg-green-50' : 'bg-slate-50'
                    } flex-grow px-4 py-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`"
                    @click="openStaffSelector"
                  />
                  <button
                    class="px-4 py-4 text-white rounded border border-primary bg-primary text-center font-medium transition hover:bg-opacity-90"
                    @click="openStaffSelector"
                  >
                    選擇
                  </button>
                </div>
                <p v-if="createError.staff" class="text-sm text-red-500 mt-1">
                  *{{ createError.staff }}
                </p>
              </div>

              <div class="mb-4">
                <label class="block mb-1">施工單位：</label>
                <div class="flex items-center gap-2">
                  <div class="flex items-center gap-2">
                    <div class="inline-flex items-center">
                      <label
                        class="relative flex items-center cursor-pointer"
                        for="html"
                        @click="checkFactory"
                      >
                        <input
                          :checked="checkedFactory"
                          type="radio"
                          class="bg-white peer h-6 w-6 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all shadow hover:shadow-md"
                        />
                        <span
                          class="absolute bg-primary w-4 h-4 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        ></span>
                      </label>
                    </div>
                    <span class="truncate cursor-pointer" @click="checkFactory">自廠</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="inline-flex items-center">
                      <label
                        class="relative flex items-center cursor-pointer"
                        for="html"
                        @click="checkMaintenanceDepartment"
                      >
                        <input
                          :checked="checkedMaintenanceDepartment"
                          type="radio"
                          class="bg-white peer h-6 w-6 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all shadow hover:shadow-md"
                        />
                        <span
                          class="absolute bg-primary w-4 h-4 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        ></span>
                      </label>
                    </div>
                    <span class="truncate cursor-pointer" @click="checkMaintenanceDepartment"
                      >工務隊</span
                    >
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="inline-flex items-center">
                      <label
                        class="relative flex items-center cursor-pointer"
                        for="html"
                        @click="checkBrand"
                      >
                        <input
                          :checked="checkedBrand"
                          type="radio"
                          class="bg-white peer h-6 w-6 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all shadow hover:shadow-md"
                        />
                        <span
                          class="absolute bg-primary w-4 h-4 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        ></span>
                      </label>
                    </div>
                    <span class="truncate cursor-pointer" @click="checkBrand">廠商</span>
                  </div>
                </div>
                <div v-if="checkedBrand" class="mt-4">
                  <div class="flex items-center space-x-2 w-full">
                    <input
                      :value="store.maintenance.maintainer"
                      type="text"
                      :readonly="true"
                      placeholder="請選擇零件廠商"
                      :class="`${
                        store.maintenance.maintainer ? 'bg-green-50' : 'bg-slate-50'
                      } flex-grow px-4 py-4 border border-slate-200 rounded-lg `"
                      @click="modalComponentBrandRadioOpen = true"
                    />
                    <button
                      class="px-4 py-4 text-white rounded border border-primary bg-primary text-center font-medium transition hover:bg-opacity-90"
                      @click="modalComponentBrandRadioOpen = true"
                    >
                      選擇
                    </button>
                  </div>
                </div>
                <div v-else class="mt-4">
                  <div class="lex items-center space-x-2">
                    <input
                      :value="store.maintenance.maintainer"
                      type="text"
                      :readonly="true"
                      :class="`${
                        store.maintenance.maintainer ? 'bg-green-50' : 'bg-slate-50'
                      } flex-grow px-4 py-4 border border-slate-200 rounded-lg w-full`"
                    />
                  </div>
                </div>
              </div>
              <div class="mb-4">
                <label class="block mb-1">總工時：</label>
                <div class="flex items-center">
                  <div class="flex">
                    <NumberSelector
                      :min="0"
                      :max="999"
                      :modelValue="store.maintenance.maintenanceHour"
                      @update:modelValue="store.maintenance.maintenanceHour = $event"
                    />
                  </div>
                  <span class="ml-2 text-red-500">※ 請填寫實際處理所需時間（非人時）</span>
                </div>
              </div>
              <div class="mb-4">
                <label class="block mb-1">操作人數：</label>
                <div class="flex items-center">
                  <div class="flex">
                    <NumberSelector
                      :min="0"
                      :max="999"
                      :modelValue="store.maintenance.workerCount"
                      @update:modelValue="store.maintenance.workerCount = $event"
                    />
                  </div>
                  <span class="ml-2">人</span>
                </div>
              </div>
            </div>

            <!-- Right Section: Special Equipment -->
            <div class="bg-gray-200 p-4 rounded-md">
              <h2 class="text-lg font-bold mb-4"><RequiredSpan />維護說明：</h2>
              <textarea
                v-model="store.maintenance.note"
                :class="`border ${
                  createError.equipment ? 'border-red' : 'border-stroke'
                } w-full h-100 rounded-lg bg-white py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                placeholder="請填入維護細節"
              ></textarea>
            </div>
          </div>

          <!-- Bottom Section: Failure Cause and Maintenance Description -->
          <div class="bg-gray-200 p-4 rounded-md mt-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h2 class="text-lg font-bold mb-4">故障原因：</h2>
                <div class="flex items-center space-x-4 mb-2">
                  <div class="flex items-center gap-2">
                    <div class="inline-flex items-center">
                      <label
                        class="relative flex items-center cursor-pointer"
                        for="html"
                        @click="checkHumanError"
                      >
                        <input
                          :checked="store.maintenance.isHumanError"
                          type="radio"
                          class="bg-white peer h-6 w-6 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all shadow hover:shadow-md"
                        />
                        <span
                          class="absolute bg-primary w-4 h-4 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        ></span>
                      </label>
                    </div>
                    <span class="truncate cursor-pointer" @click="checkHumanError">人為</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="inline-flex items-center">
                      <label
                        class="relative flex items-center cursor-pointer"
                        for="html"
                        @click="checkNonHumanError"
                      >
                        <input
                          :checked="!store.maintenance.isHumanError"
                          type="radio"
                          class="bg-white peer h-6 w-6 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all shadow hover:shadow-md"
                        />
                        <span
                          class="absolute bg-primary w-4 h-4 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        ></span>
                      </label>
                    </div>
                    <span class="truncate cursor-pointer" @click="checkNonHumanError">非人為</span>
                  </div>
                  <div class="relative">
                    <select
                      v-model="store.maintenance.failureCategory"
                      required
                      :disabled="!machineIssueOptions.length"
                      class="border border-stroke w-full rounded-lg bg-transparent py-2 px-4 outline-none focus:border-primary focus-visible:shadow-none bg-white dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    >
                      <option value="" disabled selected>請選擇故障類別</option>
                      <option
                        v-for="option in machineIssueOptions"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </option>
                    </select>

                    <p
                      v-if="createError.failureCategory && store.maintenance.failureCategory === ''"
                      class="text-sm text-red-500 mt-1"
                    >
                      *{{ createError.failureCategory }}
                    </p>
                  </div>
                  <div class="relative group inline-block">
                    <Wrench class="w-8 h-8 text-gray-700 cursor-pointer" />

                    <div
                      class="absolute left-full top-0 ml-3 w-[500px] p-4 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50 pointer-events-none"
                    >
                      <div class="grid grid-cols-2 gap-4">
                        <div>
                          <p class="font-bold mb-2">一、機械老化與磨損</p>
                          <ul class="list-disc pl-4 mb-3 space-y-1">
                            <li>軸承、齒輪、皮帶、鏈條等傳動元件磨耗或損壞</li>
                            <li>機械密封、襯板老化與破損</li>
                          </ul>

                          <p class="font-bold mb-2">二、液壓/氣動與潤滑問題</p>
                          <ul class="list-disc pl-4 mb-3 space-y-1">
                            <li>液壓泵、氣缸、閥件或油管漏油/損壞</li>
                            <li>潤滑油不足、變質或供油系統堵塞</li>
                            <li>冷卻系統失效導致過熱</li>
                          </ul>

                          <p class="font-bold mb-2">三、電氣與控制系統故障</p>
                          <ul class="list-disc pl-4 mb-3 space-y-1">
                            <li>馬達過熱或燒毀</li>
                            <li>PLC、變頻器、感測器異常</li>
                            <li>線路短路、接觸不良</li>
                          </ul>
                        </div>
                        <div>
                          <p class="font-bold mb-2">四、原料與供料異常</p>
                          <ul class="list-disc pl-4 mb-3 space-y-1">
                            <li>原料堵塞、卡料</li>
                            <li>配料比例失準或送料設備故障</li>
                          </ul>

                          <p class="font-bold mb-2">五、結構與外部因素</p>
                          <ul class="list-disc pl-4 mb-3 space-y-1">
                            <li>設備振動過大或地基鬆動</li>
                            <li>外力撞擊、火災或自然災害</li>
                            <li>粉塵、水氣或腐蝕性環境影響</li>
                          </ul>

                          <p class="font-bold mb-2">六、人為因素與維護不當</p>
                          <ul class="list-disc pl-4 mb-3 space-y-1">
                            <li>錯誤操作、超負荷運轉</li>
                            <li>保養不足或維修/保養錯誤</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <textarea
                  v-model="store.maintenance.failureCause"
                  :class="`border ${
                    createError.equipment ? 'border-red' : 'border-stroke'
                  } w-full h-60 rounded-lg bg-white py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                  placeholder="故障原因說明"
                ></textarea>
              </div>

              <div class="">
                <h2 class="text-lg font-bold mb-4">使用特殊機具：</h2>

                <p class="text-sm mb-[12px]">
                  ＊若使用吊車、起重機、預拌車等特殊機具，請紀錄使用項目、情況與工時
                </p>
                <textarea
                  v-model="store.maintenance.equipment"
                  :class="`border ${
                    createError.equipment ? 'border-red' : 'border-stroke'
                  } w-full h-60 rounded-lg bg-white py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                  placeholder="特殊機具使用狀況說明，用途與工時等"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-4">
          <FileUploader v-model="store.maintenance.attachments" />
        </div>
        <div class="-mx-3 flex flex-wrap gap-y-4 flex-row-reverse">
          <div class="w-full px-3">
            <button
              v-if="!store.loading"
              class="block w-full rounded border border-primary bg-primary p-3 text-center font-medium text-white"
              @click="handleCreate"
            >
              送出
            </button>
            <button
              v-else
              class="w-full rounded border border-primary bg-primary px-3 py-3 flex justify-center text-white opacity-75"
            >
              <svg class="animate-spin h-5 w-5 mr-3 border-b-2 border-white rounded-full"></svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <UserRadio
      v-if="modalUserRadioOpen"
      :id="store.maintenance.staffID"
      :open-modal="modalUserRadioOpen"
      @do-close="modalUserRadioOpen = false"
      @do-submit="handleUserSubmit"
    />
    <ComponentBrandRadio
      v-if="modalComponentBrandRadioOpen"
      :open-modal="modalComponentBrandRadioOpen"
      @do-close="modalComponentBrandRadioOpen = false"
      @do-submit="handleComponentBrandRadioSubmit"
    />
    <ComponentTypeRadioModal
      v-if="modalComponentTypeRadioOpen"
      :open-modal="modalComponentTypeRadioOpen"
      :component-general-type="store?.currentSlot?.componentGeneralType"
      @do-close="closeComponentTypeRadioModal"
      @do-submit="handleComponentTypeRadioSubmit"
    />
    <ComponentTypeRadioModal
      v-if="modalSubComponentTypeRadioOpen"
      :strict="true"
      :open-modal="modalSubComponentTypeRadioOpen"
      @do-close="closeSubComponentTypeRadioModal"
      @do-submit="handleSubComponentTypeRadioSubmit"
    />
    <SubComponentCreateModal
      v-if="modalComponentInstallOpen"
      :open-modal="modalComponentInstallOpen"
      :existing-names="installedNames"
      @do-close="handleComponentInstallClose"
      @do-submit="handleComponentInstallSubmit"
    />
  </DefaultLayout>
</template>

<style scoped>
/* 整體進出（包含遮罩與內容）可分開做也可一起做
   這裡將主要動畫表現放在「內容卡片」上 */

/* 進場：淡入 + 微縮放 */
.modal-enter-active {
  transition: opacity 220ms ease;
}
.modal-leave-active {
  transition: opacity 220ms ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* 內容卡片進出動畫 */
.modal-enter-active .z-10,
.modal-leave-active .z-10 {
  transition:
    transform 260ms cubic-bezier(0.2, 0.8, 0.2, 1),
    opacity 220ms ease;
}

.modal-enter-from .z-10 {
  transform: translate3d(0, 8px, 0) scale(0.96);
  opacity: 0;
}

.modal-enter-to .z-10 {
  transform: translate3d(0, 0, 0) scale(1);
  opacity: 1;
}

/* 關閉退場：往按鈕方向位移 + 縮小 + 透明 */
.modal-leave-from .z-10 {
  transform: translate3d(0, 0, 0) scale(1);
  opacity: 1;
}
.modal-leave-to .z-10 {
  transform: translate3d(var(--leave-x), var(--leave-y), 0) scale(0.85);
  opacity: 0;
}
</style>
