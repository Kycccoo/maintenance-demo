<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import type { User } from '@/types/User';
// import { useErrorStore } from '@/stores/error';
// import { EditFactoryPatchError, SetFactoryOrderPutError } from '@occ-web/error-code';
// import {
//   editFactoryPatchErrorMessageMap,
//   setFactoryOrderPutErrorMessageMap
// } from '@/api/errors/factory';
import { useToast } from 'vue-toast-notification';
import { GlobalToastProps } from '@/types/Toast';
// import { fetchUserErrorMessageMap } from '@/api/errors/login';
// import { AxiosError } from 'axios';
import { useUserStore } from '@/stores/user';

const $toast = useToast(GlobalToastProps);

const emit = defineEmits<{
  'do-close': [];
}>();
const props = defineProps<{
  openModal: boolean;
  user: User;
}>();

const initUpdateError = {
  name: '',
  email: '',
  type: '',
  employee: '',
  credentials: ''
};
const confirmPassword = ref('');
const confirmAccount = ref('');
const store = useUserStore();
const modalUpdateOpen = ref<boolean>(props.openModal);
const updateUser = ref<User>({
  ...props.user,
  employee: props.user.employee,
  credentials: props.user.credentials
});
const updateError = ref<{
  name: string;
  email: string;
  type: string;
  employee: string;
  credentials: string;
}>(structuredClone(initUpdateError));

onMounted(() => {
  store.searchColumns.keyword = '';
  if (!props.user) return;
  updateUser.value = JSON.parse(JSON.stringify(props.user));

  store.getEmployee(updateUser.value.id).then((res: any) => {
    updateUser.value.employee = res;
    if (updateUser.value.employee) {
      updateUser.value.employee.binding = true;
    }
  });
  store.getCredentials(updateUser.value.id).then((res: any) => {
    updateUser.value.credentials = res;
    confirmAccount.value = updateUser.value.credentials?.account ?? '';
    if (updateUser.value.credentials) {
      updateUser.value.credentials.binding = true;
    }
  });
});

const passwordsMatch = computed(() => {
  if (!bindingModelCredentials.value) return true;
  return adAccountModelCredentialsPassword.value === confirmPassword.value;
});

const bindingModel = computed<boolean>({
  get() {
    return updateUser.value.employee?.binding ?? false;
  },
  set(val) {
    if (!updateUser.value.employee) {
      updateUser.value.employee = { adAccount: '', loginable: false, binding: false };
    }
    updateUser.value.employee.binding = val;
  }
});

const loginableModel = computed<boolean>({
  get() {
    return updateUser.value.employee?.loginable ?? false;
  },
  set(val: boolean) {
    if (!updateUser.value.employee) {
      updateUser.value.employee = { adAccount: '', loginable: false };
    }
    updateUser.value.employee.loginable = val;
  }
});

const adAccountModel = computed<string>({
  get() {
    return updateUser.value.employee?.adAccount ?? '';
  },
  set(val: string) {
    if (!updateUser.value.employee) {
      updateUser.value.employee = { adAccount: '', loginable: false };
    }
    updateUser.value.employee.adAccount = val;
  }
});
const bindingModelCredentials = computed<boolean>({
  get() {
    return updateUser.value.credentials?.binding ?? false;
  },
  set(val) {
    if (!updateUser.value.credentials) {
      updateUser.value.credentials = {
        account: '',
        password: '',
        loginable: false,
        binding: false
      };
    }
    updateUser.value.credentials.binding = val;
  }
});

const loginableModelCredentials = computed<boolean>({
  get() {
    return updateUser.value.credentials?.loginable ?? false;
  },
  set(val: boolean) {
    if (!updateUser.value.credentials) {
      updateUser.value.credentials = { account: '', password: '', loginable: false };
    }
    updateUser.value.credentials.loginable = val;
  }
});

const adAccountModelCredentials = computed<string>({
  get() {
    return updateUser.value.credentials?.account ?? '';
  },
  set(val: string) {
    if (!updateUser.value.credentials) {
      updateUser.value.credentials = { account: '', password: '', loginable: false };
    }
    updateUser.value.credentials.account = val;
  }
});
const adAccountModelCredentialsPassword = computed<string>({
  get() {
    return updateUser.value.credentials?.password ?? '';
  },
  set(val: string) {
    if (!updateUser.value.credentials) {
      updateUser.value.credentials = { account: '', password: '', loginable: false };
    }
    updateUser.value.credentials.password = val;
  }
});

const closeUpdateModal = () => {
  emit('do-close');
};

// const preventNotNumber = (event: KeyboardEvent) => {
//   if (event.key === 'e' || event.key === 'E' || event.key === '+' || event.key === '-') {
//     event.preventDefault();
//   }
// };

const handleUpdate = async () => {
  updateError.value = structuredClone(initUpdateError);

  if (!updateUser.value.employee?.adAccount && updateUser.value.employee?.binding) {
    $toast.error('AD帳號名稱必填');
    updateError.value.employee = 'AD帳號名稱必填';
    return;
  }

  if (store.canCreate('manage_factory')) {
    if (!updateUser.value.employee?.binding) {
      await store.updateEmployee(updateUser.value.id, null);
    } else {
      await store.updateEmployee(updateUser.value.id, updateUser.value.employee);
    }
  }

  const oldAccount = confirmAccount.value;
  const creds = updateUser.value.credentials;
  const loginable = creds?.binding;
  const newAccount = creds?.account ?? '';
  const password = creds?.password ?? '';
  const confirmPass = confirmPassword.value;
  console.log(oldAccount, newAccount);
  const userTypedPassword = password !== '' || confirmPass !== '';
  if (loginable && userTypedPassword && password !== confirmPass) {
    $toast.error('密碼與確認密碼不一致');
    updateError.value.credentials = '密碼與確認密碼不一致';
    return;
  }

  if (loginable && !newAccount) {
    $toast.error('勾選後登入帳號必填');
    updateError.value.credentials = '勾選後登入帳號必填';
    return;
  }

  if (loginable && newAccount !== oldAccount && password === '') {
    $toast.error('修改密碼必填');
    updateError.value.credentials = '修改密碼必填';
    return;
  }

  if (creds?.password) {
    try {
      if (!loginable) {
        await store.updateCredentials(updateUser.value.id, null);
      } else {
        await store.updateCredentials(updateUser.value.id, creds!);
      }
    } catch {
      $toast.error('密碼太簡單');
      return;
    }
  }

  // if (loginableModelCredentials.value && !passwordsMatch.value) {
  //   $toast.error("密碼與確認密碼不一致，請重新確認");
  //   return;
  // }

  // if (updateUser.value.credentials?.loginable && !updateUser.value.credentials?.account) {
  //   $toast.error("勾選後登入帳號必填");
  //   updateError.value.credentials = "勾選後登入帳號必填";
  //   return;
  // }

  // if (!updateUser.value.credentials?.loginable) {
  //   await store.updateCredentials(updateUser.value.id, null);
  // } else if (
  //   confirmAccount.value !== updateUser.value?.credentials?.account ||
  //   updateUser.value?.credentials?.password
  // ) {
  //   if (
  //     updateUser.value.credentials?.loginable &&
  //     confirmAccount.value !== updateUser.value?.credentials?.account &&
  //     !updateUser.value?.credentials?.password
  //   ) {
  //     $toast.error("修改密碼必填");
  //     updateError.value.credentials = "修改密碼必填";
  //     return;
  //   }
  //   try {
  //     if (store.canCreate("manage_factory")) {
  //       if (!updateUser.value.credentials?.loginable) {
  //         await store.updateCredentials(updateUser.value.id, null);
  //       } else {
  //         await store.updateCredentials(
  //           updateUser.value.id,
  //           updateUser.value.credentials
  //         );
  //       }
  //     }
  //   } catch {
  //     $toast.error("密碼太簡單");
  //     updateError.value.credentials = "密碼太簡單";
  //     return;
  //   }
  // }

  try {
    await store.update(updateUser.value);
    store.sync(updateUser.value);
    updateError.value = structuredClone(initUpdateError);
    $toast.success('工廠更新成功');
    closeUpdateModal();
  } catch (error: unknown) {
    console.log(error);
    // $toast.error('工廠更新失敗');
    // if (!(error instanceof AxiosError)) {
    //   useErrorStore().setUnknownError();
    //   return;
    // }
    // if (error instanceof AxiosError && error.response?.data?.errors) {
    //   const errorCodes = error.response.data.errors;
    //   if (!Array.isArray(errorCodes)) {
    //     useErrorStore().setUnknownError();
    //     return;
    //   }
    //   errorCodes.forEach((code) => {
    //     if (
    //       [
    //         EditFactoryPatchError.BodyNameType,
    //         EditFactoryPatchError.BodyNameMaxLength,
    //         EditFactoryPatchError.BodyNamePattern,
    //         EditFactoryPatchError.NameDuplicated
    //       ].includes(code)
    //     ) {
    //       updateError.value.name = editFactoryPatchErrorMessageMap[code];
    //     } else if (
    //       [
    //         EditFactoryPatchError.BodyCodeType,
    //         EditFactoryPatchError.BodyCodeMaxLength,
    //         EditFactoryPatchError.BodyCodePattern,
    //         EditFactoryPatchError.CodeDuplicated
    //       ].includes(code)
    //     ) {
    //       updateError.value.code = editFactoryPatchErrorMessageMap[code];
    //     } else if (
    //       [
    //         EditFactoryPatchError.BodyDescriptionType,
    //         EditFactoryPatchError.BodyDescriptionMaxLength
    //       ].includes(code)
    //     ) {
    //       updateError.value.description = editFactoryPatchErrorMessageMap[code];
    //     } else {
    //       updateError.value.general = editFactoryPatchErrorMessageMap[code] || `未知錯誤: ${code}`;
    //     }
    //   });
    // } else {
    //   updateError.value.general = '更新工廠失敗';
    // }
  }
};

// const updateOrder = async (id: number, order: number) => {
//   try {
//     await store.updateOrder(id, order);
//     return true;
//   } catch (error) {
//     handleOrderError(error);
//   }
//   return false;
// };

// const handleOrderError = (error: unknown) => {
//   if (!(error instanceof AxiosError)) {
//     useErrorStore().setUnknownError();
//     return;
//   }
//   const errorCodes = error?.response?.data?.errors;
//   if (!Array.isArray(errorCodes)) {
//     useErrorStore().setUnknownError();
//     return;
//   }

//   errorCodes.forEach((code) => {
//     if (
//       [
//         SetFactoryOrderPutError.ParamsIdType,
//         SetFactoryOrderPutError.ParamsIdMinimum,
//         SetFactoryOrderPutError.BodyType
//       ].includes(code)
//     ) {
//       updateError.value.order = setFactoryOrderPutErrorMessageMap[code];
//     } else {
//       updateError.value.general =
//         setFactoryOrderPutErrorMessageMap[code] ||
//         fetchUserErrorMessageMap[code] ||
//         `未知錯誤: ${code}`;
//     }
//   });
// };
</script>

<template>
  <transition name="fade">
    <div
      v-if="modalUpdateOpen && updateUser"
      class="fixed left-0 top-0 z-[1000] flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5"
    >
      <div
        class="relative w-full max-w-[670px] rounded-lg bg-white px-8 py-12 text-center dark:bg-gray-800 md:px-[70px] md:py-[60px]"
      >
        <button class="absolute text-black top-6 right-8" @click="closeUpdateModal">
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
        <div class="flex justify-center items-center gap-2 pb-2">
          <svg class="w-[25px]" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <path d="m12.5 16.5h-1c-.55 0-1 .45-1 1s.45 1 1 1h1c.55 0 1-.45 1-1s-.45-1-1-1z"></path>
            <path d="m18.5 16.5h-1c-.55 0-1 .45-1 1s.45 1 1 1h1c.55 0 1-.45 1-1s-.45-1-1-1z"></path>
            <path d="m23.5 18.5h1c.55 0 1-.45 1-1s-.45-1-1-1h-1c-.55 0-1 .45-1 1s.45 1 1 1z"></path>
            <path d="m12.5 20.5h-1c-.55 0-1 .45-1 1s.45 1 1 1h1c.55 0 1-.45 1-1s-.45-1-1-1z"></path>
            <path d="m18.5 20.5h-1c-.55 0-1 .45-1 1s.45 1 1 1h1c.55 0 1-.45 1-1s-.45-1-1-1z"></path>
            <path d="m24.5 22.5c.55 0 1-.45 1-1s-.45-1-1-1h-1c-.55 0-1 .45-1 1s.45 1 1 1z"></path>
            <path
              d="m30 29h-1v-13.57c0-1.19-.87-2.18-2-2.39v-9.54c0-1.38-1.12-2.5-2.5-2.5h-1c-1.38 0-2.5 1.12-2.5 2.5v9.5h-2v-4.05c0-.78-.36-1.51-.98-1.98-.62-.48-1.41-.64-2.19-.43l-10.98 3.19c-1.09.29-1.86 1.28-1.86 2.42v16.85h-1c-.55 0-1 .45-1 1s.45 1 1 1h28c.55 0 1-.45 1-1s-.45-1-1-1zm-11-3h2v3h-2zm-2 3h-2v-3h2zm5-5h-8c-.55 0-1 .45-1 1v4h-4v-13.57c0-.24.19-.43.43-.43h17.14c.24 0 .43.19.43.43v13.57h-4v-4c0-.55-.45-1-1-1zm1-20.5c0-.28.22-.5.5-.5h1c.28 0 .5.22.5.5v9.5h-2zm-18 8.65c0-.23.15-.42.39-.49l10.98-3.19c.21-.06.36.03.43.09s.2.18.2.4v4.05h-7.57c-1.34 0-2.43 1.09-2.43 2.43v13.57h-2z"
            ></path>
          </svg>
          <h3 class="text-xl font-bold text-black dark:text-white sm:text-2xl">
            修改使用者資訊 ID: {{ updateUser.id }}
          </h3>
        </div>
        <span class="mx-auto mb-6 inline-block h-1 w-[260px] rounded bg-primary"></span>
        <div class="text-left flex flex-row items-center justify-between gap-4">
          <div>
            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white">使用者名稱</label>
              <div class="relative">
                <input
                  v-model="updateUser.name"
                  required
                  type="text"
                  placeholder="請輸入使用者名稱"
                  :class="`border ${
                    updateError.name ? 'border-red' : 'border-stroke'
                  } w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                />
              </div>
              <p v-if="updateError.name" class="text-sm text-red-500 mt-1">
                *{{ updateError.name }}
              </p>
            </div>
            <div class="gap-2">
              <div class="mb-4">
                <label class="mb-2.5 block font-medium text-black dark:text-white">Email</label>
                <div class="relative">
                  <input
                    v-model="updateUser.email"
                    required
                    type="text"
                    placeholder="請輸入Email"
                    :class="`border ${
                      updateError.email ? 'border-red' : 'border-stroke'
                    } w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                  />
                </div>
                <p v-if="updateError.email" class="text-sm text-red-500 mt-1">
                  *{{ updateError.email }}
                </p>
              </div>
            </div>
            <div class="flex gap-2">
              <div class="mb-4">
                <label class="mb-2.5 block font-medium text-black dark:text-white">
                  <RequiredSpan />使用者類型：
                </label>

                <div class="flex items-center gap-4">
                  <label class="flex items-center space-x-1">
                    <input
                      v-model="updateUser.type"
                      type="radio"
                      name="multiUnit"
                      :value="0"
                      class="border"
                      :class="updateError.type ? 'border-red' : 'border-stroke'"
                    />
                    <span>管理員</span>
                  </label>

                  <label class="flex items-center space-x-1">
                    <input
                      v-model="updateUser.type"
                      type="radio"
                      name="multiUnit"
                      :value="1"
                      class="border"
                      :class="updateError.type ? 'border-red' : 'border-stroke'"
                    />
                    <span>單位</span>
                  </label>
                  <label class="flex items-center space-x-1">
                    <input
                      v-model="updateUser.type"
                      type="radio"
                      name="multiUnit"
                      :value="2"
                      class="border"
                      :class="updateError.type ? 'border-red' : 'border-stroke'"
                    />
                    <span>個人</span>
                  </label>
                </div>

                <p v-if="updateError.type" class="text-sm text-red-500 mt-1">
                  *{{ updateError.type }}
                </p>
              </div>
            </div>
            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white"
                ><span class="text-red">* </span>顯示設定</label
              >
              <div class="relative">
                <select
                  v-model="updateUser.isDeprecated"
                  required
                  :class="`border border-stroke w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                >
                  <option :value="false">不棄用</option>
                  <option :value="true">棄用</option>
                </select>
                <!-- <p v-if="updateError.factoryID" class="text-sm text-red-500 mt-1">
                  *{{ updateError.factoryID }}
                </p> -->
              </div>
              <!-- <p v-if="updateError.name" class="text-sm text-red-500 mt-1">
                *{{ updateError.name }}
              </p> -->
            </div>
          </div>
          <div>
            <div class="mb-4 w-full">
              <label class="flex items-center gap-2 mb-2.5">
                <input
                  v-model="bindingModel"
                  type="checkbox"
                  :disabled="!store.canCreate('manage_factory')"
                  class="h-5 w-5 rounded border-stroke checked:bg-primary checked:border-primary"
                />
                <span class="font-medium">綁定 AD 帳號</span>
              </label>

              <div v-if="bindingModel">
                <label class="block mb-2 font-medium">是否可登入</label>
                <div class="flex gap-4">
                  <label class="flex items-center gap-2">
                    <input
                      v-model="loginableModel"
                      type="radio"
                      name="loginable"
                      :value="true"
                      :disabled="!store.canCreate('manage_factory')"
                      class="h-5 w-5 rounded border-stroke checked:bg-primary checked:border-primary"
                    />
                    <span class="font-medium">是</span>
                  </label>
                  <label class="flex items-center gap-2">
                    <input
                      v-model="loginableModel"
                      type="radio"
                      name="loginable"
                      :value="false"
                      :disabled="!store.canCreate('manage_factory')"
                      class="h-5 w-5 rounded border-stroke checked:bg-primary checked:border-primary"
                    />
                    <span class="font-medium">否</span>
                  </label>
                </div>
              </div>

              <div v-if="bindingModel" class="mt-2">
                <label class="block mb-2 font-medium">AD 帳號</label>
                <input
                  v-model="adAccountModel"
                  type="text"
                  class="w-full border rounded p-2"
                  placeholder="請輸入 AD 帳號"
                  :readonly="!store.canCreate('manage_factory')"
                />
                <p v-if="updateError.employee" class="text-sm text-red-500 mt-1">
                  *{{ updateError.employee }}
                </p>
              </div>
            </div>
            <div class="mb-4 w-full">
              <label class="flex items-center gap-2 mb-2.5">
                <input
                  v-model="bindingModelCredentials"
                  type="checkbox"
                  :disabled="!store.canCreate('manage_factory')"
                  class="h-5 w-5 rounded border-stroke checked:bg-primary checked:border-primary"
                />
                <span class="font-medium">綁定登入帳號</span>
              </label>
              <div v-if="bindingModelCredentials">
                <label class="block mb-2 font-medium">是否可登入</label>
                <div class="flex gap-4">
                  <label class="flex items-center gap-2">
                    <input
                      v-model="loginableModelCredentials"
                      type="radio"
                      name="loginableCredentials"
                      :value="true"
                      :disabled="!store.canCreate('manage_factory')"
                      class="h-5 w-5 rounded border-stroke checked:bg-primary checked:border-primary"
                    />
                    <span class="font-medium">是</span>
                  </label>
                  <label class="flex items-center gap-2">
                    <input
                      v-model="loginableModelCredentials"
                      type="radio"
                      name="loginableCredentials"
                      :value="false"
                      :disabled="!store.canCreate('manage_factory')"
                      class="h-5 w-5 rounded border-stroke checked:bg-primary checked:border-primary"
                    />
                    <span class="font-medium">否</span>
                  </label>
                </div>
              </div>
              <div v-if="bindingModelCredentials" class="mt-2">
                <label class="block mb-2 font-medium">登入帳號</label>
                <input
                  v-model="adAccountModelCredentials"
                  type="text"
                  class="w-full border rounded p-2"
                  placeholder="請輸入登入帳號"
                  :readonly="!store.canCreate('manage_factory')"
                />

                <div class="mt-2">
                  <label class="block mb-2 font-medium">登入密碼(不能太簡單)</label>
                  <input
                    v-model="adAccountModelCredentialsPassword"
                    type="password"
                    class="w-full border rounded p-2"
                    placeholder="請輸入登入密碼"
                    :readonly="!store.canCreate('manage_factory')"
                  />
                </div>

                <div class="mt-2">
                  <label class="block mb-2 font-medium">確認登入密碼</label>
                  <input
                    v-model="confirmPassword"
                    type="password"
                    :disabled="adAccountModelCredentialsPassword === ''"
                    class="w-full border rounded p-2"
                    placeholder="請再次輸入登入密碼"
                    :readonly="!store.canCreate('manage_factory')"
                  />
                </div>

                <p
                  v-if="bindingModelCredentials && !passwordsMatch"
                  class="text-sm text-red-500 mt-1"
                >
                  * 密碼與確認密碼不一致
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="-mx-3 flex flex-wrap gap-y-4 flex-row-reverse">
          <div class="w-full px-3 flex">
            <button
              v-if="!store.loading"
              class="block w-full rounded border border-primary bg-primary p-3 text-center font-medium text-white hover:opacity-80"
              @click="handleUpdate"
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
  </transition>
</template>
