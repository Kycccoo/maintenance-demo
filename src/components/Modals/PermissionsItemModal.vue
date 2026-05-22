<script setup lang="ts">
import { ref, onMounted, watch, shallowRef } from 'vue';
import type { Permission } from '@/types/Permission';
// import type { PermissionItems } from '@/types/PermissionItems';defineAsyncComponent
import type { Factory } from '@/types/Factory';
import { useToast } from 'vue-toast-notification';
// import { GlobalToastProps } from '@/types/Toast';
import { usePermissionStore } from '@/stores/permissions';
import { useFactoryStore } from '@/stores/factory';
import { accountAPI, permissionAPI, factoryAPI } from '@/api';
import FactoryCheckbox from '@/components/Modals/Selector/FactoryCheckbox.vue';

const $toast = useToast();
const store = usePermissionStore();
const factoryStore = useFactoryStore();
const title = ref<string>('');
const props = defineProps<{
  openModal: boolean;
  permission: Permission;
}>();

const emit = defineEmits<{
  'do-close': [];
}>();
const allFactories = ref<Factory[]>([]);
const modalPermissionsItemOpen = ref<boolean>(props.openModal);
const modalSearchFactoryOpen = shallowRef<boolean>(false);

type PermissionItem = {
  permissionID: number;
  name: string;
  factoryIDs: number[];
  factoryNames: string[];
  checkAll: boolean;
};

const adminPermission = ref<Permission[]>([]);
const groupPermission = ref<PermissionItem[]>([]);
const clonePermission = ref<PermissionItem[]>([]);
const selectedPermissionID = ref<number | null>(null);
const permissionResponse = ref<any>(null);
onMounted(async () => {
  fetchData();
  factoryStore;
});

const fetchData = async (): Promise<void> => {
  const id = props.permission.staffID;
  permissionResponse.value = await accountAPI.permission(id);
  if (permissionResponse.value?.data?.staffType === 0) {
    const res = await store.getPermissionList();
    const wrapper = Array.isArray(res.data) ? res.data[0] : res.data;
    console.log(wrapper.data.map((item: any) => item.isFactoryConstrained));
    adminPermission.value = wrapper.data;
    title.value = `權限清單／管理員_${props.permission.staffName}`;
  } else {
    let items: any[] = [];
    const res = await store.getPermission(props.permission);
    if (Array.isArray(res)) {
      items = res;
    } else if (
      res &&
      typeof res === 'object' &&
      'data' in res &&
      Array.isArray((res as any).data)
    ) {
      items = (res as any).data;
    }

    const permissionIDs = items.map((item: any) => item.permissionID);
    const permissionResponse = await permissionAPI.search(permissionIDs);
    console.log(permissionResponse.map((item: any) => item.isFactoryConstrained));
    const defs: Array<{ id: number; key: string; name: string }> = permissionResponse;

    const merged = defs.map((def) => {
      const match = items.find((item) => item.permissionID === def.id);
      return {
        ...def,
        factoryIDs: match?.factoryIDs ?? [],
        staffID: props.permission.staffID,
        staff: props.permission.staff
      } as Permission;
    });
    const withNames = await Promise.all(
      merged.map(async (item) => {
        if (item.factoryIDs.length === 0) {
          item.factoryNames = [];
        } else {
          const facs = await factoryAPI.search(item.factoryIDs);
          item.factoryNames = facs.map((f) => f.name);
        }
        return item;
      })
    );

    adminPermission.value = withNames;

    title.value = `權限清單／一般員工_${props.permission.staffName}`;
  }
  const groupValue = await store.getPermissionItem(props.permission);
  const groupPermissionValue = groupValue.data as Array<{
    permissionID: number;
    factoryIDs: any[];
  }>;
  const groupItems = adminPermission.value;

  const mixData = groupItems.map((g) => {
    const match = groupPermissionValue.find((a) => a.permissionID === g.id);
    return {
      permissionID: g.id,
      name: g.name,
      factoryIDs: match ? match.factoryIDs : [],
      factoryNames: [] as string[],
      checkAll: false
    };
  });

  const withNames = await Promise.all(
    mixData.map(async (item) => {
      if (item.factoryIDs.length === 0) {
        item.factoryNames = [];
      } else {
        const facs = await factoryAPI.search(item.factoryIDs);
        item.factoryNames = facs.map((f) => f.name);
      }
      return item;
    })
  );

  const withAdminPermission = withNames.map((item) => {
    const adminMatch = adminPermission.value.find((admin) => admin.id === item.permissionID);

    const adminFids = Array.isArray(adminMatch?.factoryIDs) ? adminMatch!.factoryIDs : [];

    item.checkAll =
      adminFids.length === item.factoryIDs.length &&
      adminFids.every((fid) => item.factoryIDs.includes(fid));
    if (
      groupPermissionValue &&
      groupPermissionValue.find((g) => g.permissionID === item.permissionID) === undefined
    ) {
      item.checkAll = false;
    }
    if (
      groupPermissionValue &&
      groupPermissionValue.find((g) => g.permissionID === item.permissionID)?.factoryIDs.length ===
        0 &&
      groupPermissionValue.find((g) => g.permissionID === item.permissionID) !== undefined
    ) {
      item.factoryNames = ['All'];
    }
    return item;
  });

  groupPermission.value = withAdminPermission;
  clonePermission.value = groupPermission.value;
};

const openSearchFactoryModal = async () => {
  const factoryIDs =
    clonePermission.value.find((item) => item.permissionID === selectedPermissionID.value)
      ?.factoryIDs || [];
  await factoryAPI.search(factoryIDs).then((res) => {
    allFactories.value = res;
  });

  modalSearchFactoryOpen.value = true;
};

const handleFactoryCheckboxSubmit = async (
  selectedFactoryIDs: Array<{ id: number }>,
  permissionID: number
) => {
  const factoryValue = selectedFactoryIDs.map((item) => item.id);

  const idx = clonePermission.value.findIndex((entry) => entry.permissionID === permissionID);

  if (idx >= 0) {
    clonePermission.value[idx].factoryIDs = factoryValue;
  } else {
    clonePermission.value.push({
      permissionID,
      name: groupPermission.value.find((g) => g.permissionID === permissionID)?.name || '',
      factoryIDs: factoryValue,
      factoryNames: ['All'] as string[],
      checkAll: false
    });
  }

  const withNames = await Promise.all(
    clonePermission.value.map(async (item) => {
      if (item.factoryIDs.length === 0) {
        item.factoryNames = [];
      } else {
        const facs = await factoryAPI.search(item.factoryIDs);
        item.factoryNames = facs.map((f) => f.name);
      }
      return item;
    })
  );

  groupPermission.value = withNames;
  modalSearchFactoryOpen.value = false;
};

const clickPermissionCheck = (permissionID: number) => {
  const idx = clonePermission.value.findIndex((entry) => entry.permissionID === permissionID);
  if (idx >= 0) {
    clonePermission.value[idx].checkAll = !clonePermission.value[idx].checkAll;
  }
  if (clonePermission.value[idx].checkAll) {
    clonePermission.value[idx].factoryIDs =
      adminPermission.value.find((admin) => admin.id === permissionID)?.factoryIDs || [];
    clonePermission.value[idx].factoryNames = Array.isArray(
      adminPermission.value.find((admin) => admin.id === permissionID)?.factoryNames
    )
      ? (adminPermission.value.find((admin) => admin.id === permissionID)?.factoryNames as string[])
      : [];
    if (clonePermission.value[idx].factoryNames.length === 0) {
      clonePermission.value[idx].factoryNames = ['ALL'];
    }
    $toast.info('已設定為等同擁有者權限', { duration: 2000 });
  } else {
    clonePermission.value[idx].factoryIDs = [];
    clonePermission.value[idx].factoryNames = [];
    $toast.info('已清除權限', { duration: 2000 });
  }
};

const submitAll = async () => {
  const adminList = adminPermission.value;

  const payload = clonePermission.value;
  const invalid = adminList.some((admin) => {
    if (permissionResponse.value?.data?.staffType === 0) {
      return false;
    }
    const adminFids = admin.factoryIDs;

    if (adminFids.length === 0) return false;
    const match = payload.find((p) => p.permissionID === admin.id);
    if (!match) {
      return true;
    }
    const pFids = match.factoryIDs;
    if (pFids.length === 0) return false;
    if (pFids.length !== adminFids.length) {
      return true;
    }

    const a = [...adminFids].sort((a, b) => a - b);
    const b = [...pFids].sort((a, b) => a - b);
    return !a.every((v, i) => v === b[i]);
  });
  const filterPayload = payload.filter((p) => p.checkAll === true || p.factoryIDs.length > 0);

  if (invalid) {
    $toast.error('請確認群權限是否超出擁有者權限設定', { duration: 2000 });
    return;
  }

  await permissionAPI.addPermissionItem(props.permission.id, filterPayload);
  modalPermissionsItemOpen.value = false;
  emit('do-close');
  $toast.success('已成功送出所有修改', { duration: 2000 });
};

watch(
  () => props.openModal,
  (open) => (modalPermissionsItemOpen.value = open)
);

const closeSupervisorsModal = (): void => {
  modalPermissionsItemOpen.value = false;
  emit('do-close');
};
</script>

<template>
  <transition name="fade">
    <div
      v-if="modalPermissionsItemOpen"
      class="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 p-4"
    >
      <div
        class="relative flex flex-col w-full max-w-4xl h-[90vh] bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg"
      >
        <header
          class="flex-shrink-0 px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700"
        >
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            權限清單：{{ props.permission.name }} {{ title }}
          </h2>
        </header>

        <div class="flex flex-1 overflow-hidden">
          <section class="w-1/2 p-6 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            <h3 class="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">擁有者權限</h3>
            <ul class="space-y-4">
              <li
                v-for="(sup, index) in adminPermission"
                :key="sup.id"
                class="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <p class="font-medium text-gray-900 dark:text-white">
                  {{ index + 1 }}. {{ sup.name }}
                </p>
                <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {{ sup.factoryNames || ['ALL'] }}
                </p>
              </li>
            </ul>
          </section>

          <section
            class="w-1/2 p-6 overflow-y-auto bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700"
          >
            <h3 class="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">群組權限</h3>
            <ul class="space-y-6">
              <li
                v-for="(sup, index) in clonePermission"
                :key="sup.permissionID"
                class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div class="items-start grid grid-cols-5">
                  <div class="col-span-3">
                    <p class="font-medium text-gray-900 dark:text-white">
                      {{ index + 1 }}. {{ sup.name }}
                    </p>
                    <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {{ sup.factoryNames }}
                    </p>
                  </div>
                  <div class="space-x-2 col-span-2 grid grid-cols-1 gap-2">
                    <button
                      v-if="adminPermission[index].isFactoryConstrained === true"
                      :disabled="sup.checkAll"
                      class="px-3 py-1 rounded font-medium bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-300 disabled:opacity-50 transition"
                      @click="
                        () => {
                          selectedPermissionID = sup.permissionID;
                          openSearchFactoryModal();
                        }
                      "
                    >
                      工廠
                    </button>
                    <button
                      type="button"
                      class="px-3 py-1 rounded font-medium hover:bg-green-700 disabled:opacity-50 transition"
                      :class="sup.checkAll ? 'bg-gray-300 text-black' : 'bg-green-600 text-white'"
                      @click="clickPermissionCheck(sup.permissionID)"
                    >
                      {{ sup.checkAll ? '取消複製' : '複製現擁有者' }}
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          </section>
        </div>

        <footer
          class="flex-shrink-0 px-6 py-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3"
        >
          <button
            class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition"
            @click="closeSupervisorsModal"
          >
            取消
          </button>
          <button
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            @click="submitAll"
          >
            送出所有修改
          </button>
        </footer>
      </div>
    </div>
  </transition>

  <FactoryCheckbox
    v-if="modalSearchFactoryOpen"
    :openModal="modalSearchFactoryOpen"
    :items="allFactories"
    @do-close="modalSearchFactoryOpen = false"
    @do-submit="
      (selectedFactoryIDs) => {
        if (selectedPermissionID !== null) {
          handleFactoryCheckboxSubmit(selectedFactoryIDs, selectedPermissionID);
        }
      }
    "
  />
</template>
