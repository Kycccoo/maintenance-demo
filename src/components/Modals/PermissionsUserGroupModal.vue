<script setup lang="ts">
import { ref, onMounted, watch, defineAsyncComponent, shallowRef } from 'vue';
import type { Permission } from '@/types/Permission';
import type { User } from '@/types/User';
import { useToast } from 'vue-toast-notification';
import { GlobalToastProps } from '@/types/Toast';
import { usePermissionStore } from '@/stores/permissions';

import { PlusIcon, TrashIcon, XIcon, Users } from 'lucide-vue-next';
import { search } from '@/api/services/account';
const $toast = useToast(GlobalToastProps);

const store = usePermissionStore();
const PermissionRadio = defineAsyncComponent(
  () => import('@/components/Modals/Selector/UserRadio.vue')
);
// const initUpdateError = { name: "", email: "", type: "", supervisors: "", members: "" };

const emit = defineEmits<{
  'do-close': [];
}>();
const props = defineProps<{
  openModal: boolean;
  permission: Permission;
}>();

const modalSupervisorsOpen = ref(props.openModal);
const updatePermission = ref<Permission>({ ...props.permission });
const modalPermissionRadioOpen = shallowRef<boolean>(false);

const selectedOrgId = ref<number>(props.permission.id);
const selectedMember = ref<User>((props.permission.members as User[])?.[0] || props.permission);
const roleMap = ['管理員', '單位', '個人'];
const groupMembers = ref<User[]>([]);
onMounted(async () => {
  store.searchColumns.keyword = '';
  if (!props.permission) return;
  fetchData();
});

const fetchData = async () => {
  updatePermission.value = JSON.parse(JSON.stringify(props.permission));
  const res: any = await store.getMembers(updatePermission.value.id);
  updatePermission.value.members = res.data;
  const groupMembersID = updatePermission.value.members as User[];
  groupMembers.value = await search(groupMembersID as unknown as number[]);
};

watch(
  () => props.openModal,
  (open) => (modalSupervisorsOpen.value = open)
);

const openAddMemberModal = async (payload: any): Promise<void> => {
  try {
    await store.addMembers(selectedMember.value.id, payload.id);
    store.getMembers(updatePermission.value.id).then((res: any) => {
      updatePermission.value.members = res.data;
    });

    modalPermissionRadioOpen.value = false;
    fetchData();
    $toast.success('新增成功');
  } catch (error: any) {
    console.log(error);
    $toast.error('新增失敗，請檢查名單是否重複', error);
    return;
  }
};

const openPermissionRadio = () => {
  modalPermissionRadioOpen.value = true;
};

const removeMember = async (memberId: number): Promise<void> => {
  try {
    await store.deleteMember(selectedMember.value.id, memberId);

    store.getMembers(selectedMember.value.id).then((res: any) => {
      updatePermission.value.members = res.data;
    });
    fetchData();
    $toast.success('刪除成功');
  } catch (error: any) {
    $toast.error('刪除失敗，請檢查名單是否重複', error);
    return;
  }
};

const closeSupervisorsModal = (): void => {
  modalSupervisorsOpen.value = false;
  emit('do-close');
};
</script>
<template>
  <transition name="fade">
    <div
      v-if="modalSupervisorsOpen && updatePermission"
      class="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 p-4"
    >
      <div
        class="relative flex w-full max-w-4xl overflow-hidden rounded-lg bg-white dark:bg-gray-800 h-[90vh]"
      >
        <div
          class="flex w-1/3 flex-col border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-6 overflow-y-auto"
        >
          <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">所屬權限群組</h3>

          <div
            v-if="selectedMember"
            class="mt-auto rounded-lg bg-white dark:bg-gray-800 p-4 shadow"
          >
            <div
              class="flex justify-between items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
            >
              <div class="flex flex-col space-y-1">
                <div>
                  <span class="block text-sm text-gray-500 dark:text-gray-400">群組名稱</span>
                  <h4 class="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                    {{ selectedMember.name }}
                  </h4>
                </div>
                <div class="mt-4">
                  <span class="block text-sm text-gray-500 dark:text-gray-400">擁有者</span>
                  <h4 class="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                    {{ selectedMember.staffName }}
                  </h4>
                </div>
              </div>

              <button
                class="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                aria-label="管理群組"
              >
                <Users class="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ roleMap[selectedMember.type] }}
            </p>
          </div>
        </div>

        <div class="w-2/3 p-6 overflow-y-auto">
          <div class="mb-4 flex items-center gap-4">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">權限群組內部名單列表</h3>
            <button
              class="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 hover:bg-green-600 text-white"
              @click="openPermissionRadio"
            >
              <PlusIcon class="h-6 w-6" />
            </button>
          </div>
          <div class="flex flex-col space-y-3 mb-6 overflow-y-auto max-h-[80vh]">
            <div
              v-for="member in groupMembers"
              :key="member.id"
              class="grid grid-cols-[1fr_1fr_auto] items-center gap-4 border border-gray-200 rounded-lg bg-white dark:bg-gray-700 p-4 mb-2"
              :class="[
                ' rounded-lg p-4 shadow hover:shadow-md transition',
                member.id === selectedOrgId
                  ? 'bg-blue-100 border-2 border-blue-500'
                  : 'bg-white dark:bg-gray-800'
              ]"
            >
              <div class="flex flex-none w-48 flex-col">
                <p class="font-semibold text-gray-900 dark:text-white">
                  {{ member.name }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {{ roleMap[member.type] }}
                </p>
              </div>
              <div class="min-w-0">
                <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {{ member.email }}
                </p>
              </div>
              <button
                class="text-gray-400 hover:text-red-600"
                @click.stop="removeMember(member.id)"
              >
                <TrashIcon class="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <button
          class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          @click="closeSupervisorsModal"
        >
          <XIcon class="h-6 w-6" />
        </button>
      </div>
    </div>
  </transition>
  <PermissionRadio
    v-if="modalPermissionRadioOpen"
    :id="updatePermission.id"
    :open-modal="modalPermissionRadioOpen"
    @do-close="modalPermissionRadioOpen = false"
    @do-submit="openAddMemberModal"
  />
</template>
