<script setup lang="ts">
import { ref, onMounted, watch, defineAsyncComponent, shallowRef } from 'vue';
import type { User } from '@/types/User';
import { useToast } from 'vue-toast-notification';
import { GlobalToastProps } from '@/types/Toast';
import { useUserStore } from '@/stores/user';
import { PlusIcon, TrashIcon, XIcon, Users } from 'lucide-vue-next';
import { getStaff } from '@/api/services/account';
const $toast = useToast(GlobalToastProps);

const store = useUserStore();
const UserRadio = defineAsyncComponent(() => import('@/components/Modals/Selector/UserRadio.vue'));
// const initUpdateError = { name: "", email: "", type: "", supervisors: "", members: "" };

const emit = defineEmits<{
  'do-close': [];
}>();
const props = defineProps<{
  openModal: boolean;
  user: User;
}>();

const modalSupervisorsOpen = ref(props.openModal);
const updateUser = ref<User>({ ...props.user });
const modalUserRadioOpen = shallowRef<boolean>(false);

const selectedOrgId = ref<number>(props.user.id);
const selectedMember = ref<User>(props.user.members?.[0] || props.user);
const roleMap = ['管理員', '單位', '個人'];

onMounted(() => {
  store.searchColumns.keyword = '';
  if (!props.user) return;
  updateUser.value = JSON.parse(JSON.stringify(props.user));
  store.getSupervisors(updateUser.value.id).then((res: any) => {
    updateUser.value.supervisors = res.data;
  });
  store.getMembers(updateUser.value.id).then((res: any) => {
    updateUser.value.members = res.data;
  });
});

watch(
  () => props.openModal,
  (open) => (modalSupervisorsOpen.value = open)
);

const selectOrgCard = async (sup: User): Promise<void> => {
  selectedOrgId.value = sup.id;

  try {
    const resStaff = await getStaff(sup.id);

    selectedMember.value = resStaff as unknown as User;

    store.getSupervisors(selectedOrgId.value).then((res: any) => {
      updateUser.value.supervisors = res.data;
    });
    store.getMembers(selectedOrgId.value).then((res: any) => {
      updateUser.value.members = res.data;
    });
    $toast.success(`選擇成功，${sup.name} 的名單`);
  } catch (err) {
    console.error('selectOrgCard 發生錯誤', err);
  }
};

const openAddMemberModal = async (payload: any): Promise<void> => {
  try {
    await store.addMembers(selectedMember.value.id, payload.id);
    store.getMembers(updateUser.value.id).then((res: any) => {
      updateUser.value.members = res.data;
    });
    store.getSupervisors(selectedOrgId.value).then((res: any) => {
      updateUser.value.supervisors = res.data;
    });
    modalUserRadioOpen.value = false;
    $toast.success('新增成功');
  } catch (error: any) {
    $toast.error('新增失敗，請檢查名單是否重複', error);
    return;
  }
};

const openUserRadio = () => {
  modalUserRadioOpen.value = true;
};

const removeMember = async (memberId: number): Promise<void> => {
  try {
    await store.deleteMember(selectedMember.value.id, memberId);

    store.getMembers(selectedMember.value.id).then((res: any) => {
      updateUser.value.members = res.data;
    });
    store.getSupervisors(selectedOrgId.value).then((res: any) => {
      updateUser.value.supervisors = res.data;
    });
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
      v-if="modalSupervisorsOpen && updateUser"
      class="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 p-4"
    >
      <div
        class="relative flex w-full max-w-4xl overflow-hidden rounded-lg bg-white dark:bg-gray-800 h-[90vh]"
      >
        <div
          class="flex w-1/3 flex-col border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-6 overflow-y-auto"
        >
          <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">所屬組織</h3>

          <div class="flex flex-col space-y-3 mb-6">
            <div
              v-for="sup in updateUser.supervisors"
              :key="sup.id"
              :class="[
                'cursor-pointer rounded-lg p-4 shadow hover:shadow-md transition',
                sup.id === selectedOrgId
                  ? 'bg-blue-100 border-2 border-blue-500'
                  : 'bg-white dark:bg-gray-800'
              ]"
              @click="selectOrgCard(sup)"
            >
              <p class="font-semibold text-gray-900 dark:text-white">{{ sup.name }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ roleMap[sup.type] }}
              </p>
            </div>
          </div>

          <div
            v-if="selectedMember"
            class="mt-auto rounded-lg bg-white dark:bg-gray-800 p-4 shadow"
          >
            <div class="flex items-center gap-4">
              <h4 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ selectedMember.name }}
              </h4>
              <div class="text-gray-400 hover:text-red-600">
                <Users class="h-5 w-5" />
              </div>
            </div>

            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ roleMap[selectedMember.type] }}
            </p>
            <p class="mt-2 break-words text-sm text-gray-700 dark:text-gray-300">
              {{ selectedMember.email || '-' }}
            </p>
          </div>
        </div>

        <div class="w-2/3 p-6 overflow-y-auto">
          <div class="mb-4 flex items-center gap-4">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">組織內部名單列表</h3>
            <button
              class="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 hover:bg-green-600 text-white"
              @click="openUserRadio"
            >
              <PlusIcon class="h-6 w-6" />
            </button>
          </div>

          <div
            v-for="member in updateUser.members"
            :key="member.id"
            class="grid grid-cols-[1fr_1fr_auto] items-center gap-4 border border-gray-200 rounded-lg bg-white dark:bg-gray-700 p-4 mb-2"
            :class="[
              'cursor-pointer rounded-lg p-4 shadow hover:shadow-md transition',
              member.id === selectedOrgId
                ? 'bg-blue-100 border-2 border-blue-500'
                : 'bg-white dark:bg-gray-800'
            ]"
            @click="selectOrgCard(member)"
          >
            <div class="flex flex-none w-32 flex-col">
              <p class="font-semibold text-gray-900 dark:text-white truncate">
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
            <button class="text-gray-400 hover:text-red-600" @click.stop="removeMember(member.id)">
              <TrashIcon class="h-5 w-5" />
            </button>
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
  <UserRadio
    v-if="modalUserRadioOpen"
    :id="updateUser.id"
    :open-modal="modalUserRadioOpen"
    @do-close="modalUserRadioOpen = false"
    @do-submit="openAddMemberModal"
  />
</template>
