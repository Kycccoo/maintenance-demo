<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { onMounted, ref, computed, shallowRef } from 'vue';
import { machineComponentSlotAPI } from '@/api';
import type { RegionMap, TreeNode } from '@/types/MachineTree';
import { toTreeNodes } from '@/types/MachineTree';
import { useToast } from 'vue-toast-notification';
import { GlobalToastProps } from '@/types/Toast';
import TreeItems from '@/components/Forms/TreeItems.vue';
import MachineSearchBox from '@/components/Modals/Selector/MachineSearchBox.vue';
import MaintenanceCreateForm from '@/components/Forms/MaintenanceCreateForm.vue';
import MaintenanceContentForm from '@/components/Forms/MaintenanceContentForm.vue';
import { fetchMaintenanceByMachineID } from '@/api/services/machineComponentSlotMaintenance';
type ApiTree = RegionMap;

const $toast = useToast(GlobalToastProps);
const dialogOpen = ref(false);
const dialogNode = ref<TreeNode | null>(null);
const nodeClick = ref<TreeNode | null>(null);
const tree = ref<ApiTree | null>(null);
const treeRef = ref<InstanceType<typeof TreeItems> | null>(null);
const modalSearchMachineOpen = shallowRef<boolean>(false);
const modalContentOpen = shallowRef<boolean>(false);
const regions = computed<TreeNode[]>(() => (tree.value ? toTreeNodes(tree.value) : []));

onMounted(async () => {
  tree.value = (await machineComponentSlotAPI.tree2()) as unknown as ApiTree;
});

function handleComponentClick(node: TreeNode) {
  dialogNode.value = node;
  dialogOpen.value = true;
}
function handleNodeClick(node: TreeNode) {
  nodeClick.value = node;
}
function closeDialog() {
  dialogOpen.value = false;
  dialogNode.value = null;
}

const openSearchMachineModal = () => {
  modalSearchMachineOpen.value = true;
};
const openContentModal = () => {
  modalContentOpen.value = true;
};

// 尋找第一個「符合條件」的子孫（例如第一個 component）
function findFirstDescendant(node: TreeNode, test: (n: TreeNode) => boolean): TreeNode | null {
  if (test(node)) return node;
  for (const c of node.children ?? []) {
    const hit = findFirstDescendant(c, test);
    if (hit) return hit;
  }
  return null;
}

// 當從搜尋視窗 pick 一筆時：展到對應機台（或其 member 機台），並預設打開第一個 component 節點
async function onPickMachine(payload: {
  factoryID: number | null;
  systemID: number | null;
  machineID: number | null;
}) {
  modalSearchMachineOpen.value = false;

  $toast.info('已選擇設備，請在上方樹狀圖中查看');
  // 1) 先展到該機台（支援 member machine：我們只要找到 type==='machine' 且 meta.machineID===payload.machineID 的任何一個）
  const matched = treeRef.value?.expandToMatch(
    (n: TreeNode) => {
      if (n.type !== 'machine') return false;
      const metaMid = (n.meta as any)?.machineID;
      if (metaMid != null) return metaMid === payload.machineID;
      const m = String(n.id).match(/(\d+)$/);
      const numericId = m ? Number(m[1]) : Number(n.id);
      return payload.machineID != null && numericId === payload.machineID;
    },
    { exclusive: true } // 👈 只保留這條路徑
  ) as TreeNode | null;

  if (matched && matched.type === 'machine') {
    const machineID = (matched as any).meta?.machineID ?? payload.machineID;

    if (machineID != null) {
      try {
        const maintenanceStoreValue = fetchMaintenanceByMachineID(Number(machineID));
        const res = (await maintenanceStoreValue).data;
        const hasMaintenance = new Set(res.data.map((i: any) => i.machineComponentSlotID));

        const children = matched.children ?? [];

        children.forEach((child: any) => {
          const slotId = child.machineComponentSlotID ?? child.componentID;

          if (typeof slotId === 'number') {
            child.nonMaintenance = hasMaintenance.has(slotId);
          }
        });
      } catch (e) {
        console.error('fetchMaintenanceByMachineID 失敗', e);
      }
    }
  }

  // 2) 如果找到機台節點，嘗試往下找到第一個 component；找不到就用該機台本身
  const target = matched
    ? (findFirstDescendant(matched, (x) => x.type === 'component') ?? matched)
    : null;

  if (target) {
    // 再把機台→component 的完整路徑設為唯一展開
    treeRef.value?.expandToMatch((n) => n.id === target.id, { exclusive: true }); // 👈
    return;
  } else {
    // 找不到機台（可能樹尚未載入或資料落差）：退而求其次，展到系統或工廠
    const systemHit = payload.systemID
      ? treeRef.value?.expandToMatch(
          (n: TreeNode) => n.type === 'system' && (n as any).meta?.systemID === payload.systemID,
          { exclusive: true } // 👈
        )
      : null;

    if (!systemHit && payload.factoryID) {
      treeRef.value?.expandToMatch(
        (n: TreeNode) =>
          n.type === 'factory' &&
          ((n as any).factoryID ?? (n as any).meta?.factoryID) === payload.factoryID,
        { exclusive: true } // 👈
      );
    }
  }
}
</script>

<template>
  <DefaultLayout>
    <section class="flex flex-col gap-10">
      <TreeItems
        ref="treeRef"
        :roots="regions"
        :default-expand-depth="1"
        exclusive-mode="depth"
        child-align="top"
        :reflow-siblings-on-expand="false"
        @component-click="handleComponentClick"
        @node-click="handleNodeClick"
      />
    </section>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="dialogOpen" class="fixed inset-0 z-[1000]">
          <div class="absolute inset-0 bg-black/40" @click="closeDialog" />
          <div class="absolute inset-0 flex items-start justify-center p-4 sm:p-6">
            <Transition name="pop">
              <div
                class="relative z-10 w-full max-w-7xl bg-white rounded-2xl shadow-xl"
                @click.stop
              >
                <div class="flex items-center justify-between p-4 border-b">
                  <h2 class="text-lg font-semibold">{{ '建立維護單' }}</h2>
                  <button class="p-2 rounded hover:bg-gray-100" @click="closeDialog">✕</button>
                </div>
                <div class="p-4">
                  <MaintenanceCreateForm
                    :node="dialogNode"
                    :nodeClick="nodeClick"
                    @close="closeDialog"
                  />
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </Transition>
    </Teleport>
    <div
      v-if="!dialogOpen"
      class="fixed top-12 right-3 py-6 flex flex-col items-center justify-center gap-6 transform-gpu will-change-transform transition-transform duration-300 ease-out hover:-translate-y-3"
    >
      <div class="flex items-center justify-center gap-3 w-full max-w-screen-xl">
        <button
          type="button"
          aria-label="查找設備"
          class="group relative inline-flex items-center gap-2 rounded-l-2xl px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md shadow-emerald-500/30 hover:shadow-lg hover:brightness-[1.05] active:scale-[.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-boxdark disabled:opacity-50 disabled:cursor-not-allowed transition"
          @click="openSearchMachineModal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-5 w-5 transition-transform duration-200 group-hover:scale-110"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span class="font-medium tracking-wide whitespace-nowrap">查找設備</span>
          <span
            class="hidden sm:inline rounded-md bg-white/15 px-1.5 py-0.5 text-[11px] leading-none opacity-80 group-hover:opacity-100"
            >Click</span
          >
        </button>
      </div>
    </div>

    <button
      class="fixed top-1/3 right-3 w-12 bg-orange-600 text-white font-semibold rounded-l-md shadow-lg hover:bg-orange-700 focus:ring-2 focus:ring-orange-300 transition flex items-center justify-center text-base tracking-wide py-3"
      style="writing-mode: vertical-rl; text-orientation: mixed"
      @click="openContentModal"
    >
      查看[<span class="text-black"> {{ nodeClick?.label || '全部' }}</span
      >]維護單
    </button>
  </DefaultLayout>
  <MachineSearchBox
    v-if="modalSearchMachineOpen"
    :openModal="modalSearchMachineOpen"
    @pick="onPickMachine"
    @do-close="modalSearchMachineOpen = false"
  />
  <MaintenanceContentForm
    v-if="modalContentOpen"
    :openModal="modalContentOpen"
    :roots="regions"
    :node="nodeClick"
    @do-close="modalContentOpen = false"
  />
</template>
