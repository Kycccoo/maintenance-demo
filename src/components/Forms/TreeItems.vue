<script setup lang="ts">
import { computed, ref, watch, nextTick, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { TreeNode } from '@/types/MachineTree';
import { useDebounceFn } from '@vueuse/core';
import { fetchMaintenanceByMachineID } from '@/api/services/machineComponentSlotMaintenance';

const route = useRoute();
const router = useRouter();

type Props = {
  roots: TreeNode[];
  defaultExpandDepth?: number;
  reflowSiblingsOnExpand?: boolean;
  exclusiveMode?: 'siblings' | 'depth' | 'none';
  childAlign?: 'center' | 'top';
};

const props = defineProps<Props>();

const selectedId = ref<string | null>(null);
const searchText = ref<string>('');
const expanded = ref<Set<string>>(new Set());
// const inited = ref(false);
const content = ref<HTMLElement | null>(null);
const rectsByKey = new Map<string, Rect>();
const rectList: Rect[] = [];
const edges: { from: Rect; to: Rect }[] = [];
const pendingRouteRestore = ref(true);

const state = reactive<{
  currentMarkIndex: number;
  marks: HTMLElement[];
}>({
  currentMarkIndex: -1,
  marks: []
});

const emit = defineEmits<{
  (e: 'component-click', node: TreeNode): void;
  (e: 'node-click', node: TreeNode): void;
}>();

// 面板參數
const PAD_X = 30;
const PAD_Y = 20;
const COL_GAP = 36;
const ROW_GAP = 12;
const ROOT_GAP = 12;
const COL_WIDTH = [160, 160, 200, 230, 230, 230];
const BOX_H = [48, 60, 48, 48, 48, 48];

onMounted(() => {
  restoreFromUrl();
});

watch(
  () => route.fullPath,
  () => {
    restoreFromUrl();
  }
);

function boxW(d: number) {
  return COL_WIDTH[Math.min(d, COL_WIDTH.length - 1)];
}
function boxH(d: number) {
  return BOX_H[Math.min(d, BOX_H.length - 1)];
}
function colX(d: number) {
  let x = PAD_X;
  for (let i = 0; i < d; i++) x += COL_WIDTH[i] + COL_GAP;
  return x;
}

watch(
  () => [props.roots, route.fullPath, props.defaultExpandDepth] as const,
  async ([roots]) => {
    if (!roots || roots.length === 0) return;

    // 先做「預設展開到某層」…但只有在沒有網址 expand 的時候
    if (pendingRouteRestore.value) {
      const hasExpand = typeof route.query.expand === 'string' && route.query.expand.length > 0;
      if (!hasExpand) {
        const maxDepth = props.defaultExpandDepth ?? 1; // 你要工廠層：1
        const s = new Set<string>();
        const visit = (n: TreeNode, d: number) => {
          if ((n.children?.length ?? 0) > 0 && d < maxDepth) s.add(n.id);
          n.children?.forEach((ch) => visit(ch, d + 1));
        };
        roots.forEach((r) => visit(r, 0));
        expanded.value = s;
      }

      // 無論有沒有 expand，都跑一次網址還原（網址優先）
      await restoreFromUrl(); // 看下面 B 版
      pendingRouteRestore.value = false;
    } else {
      // 後續路由變化時（例如別人再點一次分享連結）
      await restoreFromUrl();
    }
  },
  { immediate: true }
);

type Rect = {
  vkey: string;
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  node: TreeNode;
  depth: number;
};

function visibleChildren(n: TreeNode) {
  const kids = n.children ?? [];
  if (!kids.length) return [];
  return expanded.value.has(n.id) ? kids : [];
}

function subtreeHeight(n: TreeNode, depth: number): number {
  const kids = visibleChildren(n);
  if (!kids.length) return boxH(depth);
  let sum = 0;
  kids.forEach((ch, i) => {
    sum += subtreeHeight(ch, depth + 1);
    if (i < kids.length - 1) sum += ROW_GAP;
  });
  return Math.max(sum, boxH(depth));
}

let maxDepthSeen = 0;
function layout(
  n: TreeNode,
  depth: number,
  topY: number,
  pathKey: string
): { height: number; rect: Rect } {
  const hSelf = boxH(depth);
  const wSelf = boxW(depth);
  const x = colX(depth);
  maxDepthSeen = Math.max(maxDepthSeen, depth);

  const kids = visibleChildren(n);
  const vkey = `${n.id}@${pathKey}`;

  // ── 沒子節點：固定佔用自己的盒高 ──
  if (!kids.length) {
    const rect: Rect = { vkey, id: n.id, x, y: topY, w: wSelf, h: hSelf, node: n, depth };
    rectsByKey.set(vkey, rect);
    rectList.push(rect);
    return { height: hSelf, rect };
  }

  // 子群總高度（畫子節點用）
  const kidHeights = kids.map((ch) => subtreeHeight(ch, depth + 1));
  const totalKidsH = kidHeights.reduce((a, b) => a + b, 0) + ROW_GAP * Math.max(0, kids.length - 1);

  // 父節點位置：置中或頂對齊
  const align = props.childAlign ?? 'center';
  const parentY = align === 'center' ? topY + (totalKidsH - hSelf) / 2 : topY;

  const parentRect: Rect = { vkey, id: n.id, x, y: parentY, w: wSelf, h: hSelf, node: n, depth };
  rectsByKey.set(vkey, parentRect);
  rectList.push(parentRect);

  // 子節點從哪裡開始排
  let cursorYForChildren = align === 'center' ? topY : parentY;
  kids.forEach((ch, i) => {
    const child = layout(ch, depth + 1, cursorYForChildren, `${pathKey}.${i}`);
    edges.push({ from: parentRect, to: child.rect });
    cursorYForChildren += child.height + (i < kids.length - 1 ? ROW_GAP : 0);
  });

  // ── 關鍵：回傳給「同層堆疊」使用的高度 ──
  // true  → 同層會依展開高度被往下推（你現在的行為）
  // false → 同層永遠只佔用自己的盒高（不會被往下推）
  const usedForSiblings =
    (props.reflowSiblingsOnExpand ?? true) ? Math.max(totalKidsH, hSelf) : hSelf;

  return { height: usedForSiblings, rect: parentRect };
}

// const canvas = computed(() => {
//   rectsByKey.clear();
//   rectList.length = 0;
//   edges.length = 0;
//   maxDepthSeen = 0;
//   if (!props.roots?.length) return { width: 0, height: 0, rects: [] as Rect[], edges };

//   let cursorY = PAD_Y;
//   props.roots.forEach((root, i) => {
//     layout(root, 0, cursorY, `r${i}`); // 👈 根用 r0、r1… 作為起始 pathKey
//     cursorY += subtreeHeight(root, 0) + ROOT_GAP;
//   });

//   let width = PAD_X + COL_GAP * maxDepthSeen;
//   for (let i = 0; i <= maxDepthSeen; i++) width += COL_WIDTH[i];
//   width += PAD_X;

//   const height = cursorY - ROOT_GAP + PAD_Y;
//   return { width, height, rects: rectList, edges };
// });

const canvas = computed(() => {
  rectsByKey.clear();
  rectList.length = 0;
  edges.length = 0;
  maxDepthSeen = 0;
  if (!props.roots?.length) return { width: 0, height: 0, rects: [] as Rect[], edges };

  let cursorY = PAD_Y;

  props.roots.forEach((root, i) => {
    const beforeCount = rectList.length; // 記錄本區塊開始前的索引
    const startY = cursorY;

    // 先以目前的 cursorY 進行排版
    layout(root, 0, cursorY, `r${i}`);

    // ✅ 量測：本根區塊（from beforeCount）實際用到的最底部 y
    let usedBottom = startY + boxH(0); // 至少有自己的盒高
    for (let k = beforeCount; k < rectList.length; k++) {
      const r = rectList[k];
      if (r.y + r.h > usedBottom) usedBottom = r.y + r.h;
    }
    const usedH = usedBottom - startY; // 這個根實際占用高度

    // 用「實測高度」推下一個根，避免中間空白
    cursorY += usedH + ROOT_GAP;
  });

  // 寬度照舊
  let width = PAD_X + COL_GAP * maxDepthSeen;
  for (let i = 0; i <= maxDepthSeen; i++) width += COL_WIDTH[i];
  width += PAD_X;

  // ✅ 最後總高改用「所有節點的最底部」來量測，保險再保險
  const allBottom = rectList.reduce((m, r) => Math.max(m, r.y + r.h), PAD_Y);
  const height = Math.max(allBottom + PAD_Y, cursorY - ROOT_GAP + PAD_Y);

  return { width, height, rects: rectList, edges };
});

// 工具：深度優先找出「符合條件」的路徑（回傳從 root 到該節點的陣列）
function findPath(
  nodes: TreeNode[] | undefined | null,
  predicate: (n: TreeNode) => boolean,
  acc: TreeNode[] = []
): TreeNode[] | null {
  if (!nodes) return null;
  for (const n of nodes) {
    const path = [...acc, n];
    if (predicate(n)) return path;
    const child = findPath(n.children, predicate, path);
    if (child) return child;
  }
  return null;
}

// 展開一條路徑
function expandByPath(ids: string[], opts?: { exclusive?: boolean }) {
  if (opts?.exclusive) {
    // 只保留這條路徑（祖先們）
    expanded.value = new Set(ids);
    return;
  }
  const s = new Set(expanded.value);
  ids.forEach((id) => s.add(id));
  expanded.value = s;
}

function expandToMatch(
  predicate: (n: TreeNode) => boolean,
  opts?: { exclusive?: boolean }
): TreeNode | null {
  const path = findPath(props.roots ?? [], predicate);
  if (!path) return null;
  expandByPath(
    path.map((n) => n.id),
    opts
  );
  const leaf = path[path.length - 1];
  selectedId.value = leaf.id;
  return leaf;
}

function expandByIds(ids: string[], opts?: { exclusive?: boolean }) {
  expandByPath(ids, opts);
  selectedId.value = ids[ids.length - 1] ?? null;
}

defineExpose({
  expandToMatch,
  expandByIds,
  getSelectedId: () => selectedId.value
});

async function onNodeClick(r: Rect) {
  const n = r.node;
  emit('node-click', n);
  if (n.type === 'component') {
    emit('component-click', n);
    return;
  }
  if ((n.children?.length ?? 0) === 0) return;
  if (n.type === 'machine') {
    const machineID = n.meta?.machineID;

    const maintenanceStoreValue = fetchMaintenanceByMachineID(Number(machineID));
    const res = (await maintenanceStoreValue).data;
    const hasMaintenance = new Set(res.data.map((i) => i.machineComponentSlotID));

    const isChildComponent = (n.children ?? [])
      .map((c) => c.componentID)
      .filter((c) => typeof c === 'number');
    const toOpen = isChildComponent.filter((cid) => hasMaintenance.has(cid));
    n.children?.forEach((child) => {
      if (typeof child.componentID === 'number') {
        child.nonMaintenance = toOpen.includes(child.componentID);
      }
    });
  }
  const s = new Set(expanded.value);
  const isOpen = s.has(n.id);

  if (!isOpen && (props.exclusiveMode ?? 'siblings') !== 'none') {
    const mode = props.exclusiveMode ?? 'siblings';
    const { parent, depth } = findParentAndDepth(n);

    if (mode === 'siblings') {
      const siblings = parent?.children ?? props.roots ?? [];
      for (const sib of siblings) if (sib !== n) s.delete(sib.id);
    } else if (mode === 'depth') {
      function collapseAtDepth(node: TreeNode, d: number) {
        if (d === depth) s.delete(node.id);
        node.children?.forEach((ch) => collapseAtDepth(ch, d + 1));
      }
      for (const root of props.roots ?? []) collapseAtDepth(root, 0);
    }
  }

  if (isOpen) s.delete(n.id);
  else s.add(n.id);

  expanded.value = s;
  selectedId.value = r.node.id;
  updateUrl({ replace: false, withHash: true });
}

function findParentAndDepth(target: TreeNode) {
  let parent: TreeNode | null | undefined = null as TreeNode | null | undefined;
  let depth = -1;
  let found = false;

  function dfs(n: TreeNode, d: number) {
    if (found) return;
    const children = n.children ?? [];
    for (const ch of children) {
      if (ch === target) {
        parent = n;
        depth = d + 1;
        found = true;
        return;
      }
      dfs(ch, d + 1);
    }
  }
  // roots 本身也可能被點擊
  for (const r of props.roots ?? []) {
    if (r === target) {
      parent = null;
      depth = 0;
      found = true;
      break;
    }
    dfs(r, 0);
  }
  return { parent, depth, found };
}

function isExpanded(id: string) {
  return expanded.value.has(id);
}
function isExpandable(n: TreeNode) {
  return n.type !== 'component' && (n.children?.length ?? 0) > 0;
}

const searchBox = async () => {
  const input = document.getElementById('searchInput') as HTMLInputElement | null;
  if (!input || !content.value) {
    console.error('找不到 input 或 content 元素！');
    return;
  }

  const searchValue = searchText.value.trim();
  if (!content.value) return;

  removeAllMarks(content.value);

  if (!searchValue) {
    state.currentMarkIndex = -1;
    state.marks = [];
    return;
  }

  const regex = new RegExp(`(${searchValue})`, 'gi');
  const walker = document.createTreeWalker(content.value, NodeFilter.SHOW_TEXT);
  const fragments: { node: Text; newNodes: Node[] }[] = [];

  let node: Node | null;
  while ((node = walker.nextNode())) {
    const textNode = node as Text;
    if (textNode.nodeValue && regex.test(textNode.nodeValue)) {
      const newNodes = splitAndHighlight(textNode, regex);
      fragments.push({ node: textNode, newNodes });
    }
  }

  fragments.forEach(({ node, newNodes }) => {
    const parent = node.parentNode;
    if (parent) {
      newNodes.forEach((newNode) => parent.insertBefore(newNode, node));
      parent.removeChild(node);
    }
  });

  state.marks = Array.from(content.value.querySelectorAll('mark')) as HTMLElement[];
  state.currentMarkIndex = state.marks.length > 0 ? 0 : -1;
  if (state.marks.length > 0) {
    state.marks[state.currentMarkIndex].scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
    await updateCurrentHighlight();
  }
};

const prevHighlight = async () => {
  if (!state.marks.length) return;
  state.currentMarkIndex = (state.currentMarkIndex - 1 + state.marks.length) % state.marks.length;
  state.marks[state.currentMarkIndex].scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  });
  await updateCurrentHighlight();
};

const nextHighlight = async () => {
  if (!state.marks.length) return;
  state.currentMarkIndex = (state.currentMarkIndex + 1) % state.marks.length;
  state.marks[state.currentMarkIndex].scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  });
  await updateCurrentHighlight();
};

const clearInput = () => {
  const input = document.getElementById('searchInput') as HTMLInputElement | null;
  if (input) {
    searchText.value = '';
    input.focus();
  }

  if (content.value) {
    removeAllMarks(content.value);
    state.currentMarkIndex = -1;
    state.marks = [];
  }
};

const updateCurrentHighlight = async () => {
  await nextTick();

  state.marks.forEach((mark, index) => {
    mark.style.backgroundColor = '';

    if (index === state.currentMarkIndex) {
      mark.style.backgroundColor = 'orange';
    }
  });
};

const removeAllMarks = (root: HTMLElement) => {
  const marks = root.querySelectorAll('mark');
  marks.forEach((mark) => {
    const parent = mark.parentNode;
    if (parent) {
      parent.replaceChild(document.createTextNode(mark.textContent || ''), mark);
      parent.normalize();
    }
  });
};

const splitAndHighlight = (textNode: Text, regex: RegExp): Node[] => {
  const text = textNode.nodeValue || '';
  const fragments: Node[] = [];
  let lastIndex = 0;

  regex.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    const start = match.index;
    const end = match[0].length + start;

    if (start > lastIndex) {
      fragments.push(document.createTextNode(text.slice(lastIndex, start)));
    }

    const mark = document.createElement('mark');
    mark.textContent = match[0];
    fragments.push(mark);

    lastIndex = end;
  }

  if (lastIndex < text.length) {
    fragments.push(document.createTextNode(text.slice(lastIndex)));
  }

  return fragments;
};

const updateUrl = (ops?: { replace?: boolean; withHash?: boolean }) => {
  const q = {
    selected: selectedId.value ?? undefined,
    expand: Array.from(expanded.value).join(',') || undefined,
    y: content.value ? String(content.value.scrollTop) : undefined
  };

  const hash = ops?.withHash && selectedId.value ? `#node-${selectedId.value}` : undefined;

  router[ops?.replace ? 'replace' : 'push']({ name: '', query: q, hash });
};

async function restoreFromUrl() {
  const { selected, expand, y } = route.query;

  // 1) 展開
  const ids = typeof expand === 'string' && expand.length ? expand.split(',') : [];
  if (ids.length) expandByIds(ids);

  // 2) 選中
  if (typeof selected === 'string' && selected) selectedId.value = selected;

  // 等待節點排版好了
  await nextTick();
  await nextTick(); // 視情況多等一拍，確保 rects 都進來

  // 3) 有 hash -> 直接定位到元素（你目前沒設定 scrollBehavior）
  if (route.hash) {
    const el = document.querySelector(route.hash) as HTMLElement | null;
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
  } else if (y && content.value) {
    // 4) 沒 hash -> 用 y 還原容器捲動
    const n = Number(y);
    if (!Number.isNaN(n)) content.value.scrollTop = n;
    // 也可把 selected 置中
    if (selectedId.value) {
      document.getElementById(`node-${selectedId.value}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });
    }
  }
}

const updateUrlDebounced = useDebounceFn(() => updateUrl({ replace: true }), 400);

watch(expanded, () => updateUrlDebounced(), { deep: true });

// 雖然 Set 變化本來就會觸發，但把位置放對
</script>

<template>
  <!-- diagram-shell -->
  <div
    ref="content"
    class="relative w-full h-full overflow-auto border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-800 mb-16"
  >
    <!-- diagram-stage -->
    <div
      class="relative will-change-transform"
      :style="{
        width: canvas.width + 'px',
        height: canvas.height + 'px',
        transform: `scale(1)`,
        transformOrigin: 'top left'
      }"
    >
      <!-- wires -->
      <svg class="absolute inset-0" :width="canvas.width" :height="canvas.height">
        <g v-for="(e, i) in canvas.edges" :key="i">
          <path
            :d="`M ${e.from.x + e.from.w} ${e.from.y + e.from.h / 2}
                 H ${e.from.x + e.from.w + COL_GAP / 2}
                 V ${e.to.y + e.to.h / 2}
                 H ${e.to.x}`"
            fill="none"
            class="stroke-gray-400"
            stroke-width="2"
            stroke-linejoin="round"
          />
        </g>
      </svg>

      <!-- nodes -->
      <div
        v-for="r in canvas.rects"
        :id="`node-${r.node.id}`"
        :key="r.vkey"
        :title="r.node.label"
        :style="{ left: r.x + 'px', top: r.y + 'px', width: r.w + 'px', height: r.h + 'px' }"
        class="absolute grid place-items-center select-none leading-tight rounded-[10px] px-3 border shadow-sm cursor-pointer"
        :class="[
          'inline-flex items-center gap-1 px-2 py-1 border rounded-md leading-none',
          'shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-1',
          'focus:ring-sky-400 dark:focus:ring-sky-500 dark:focus:ring-offset-stone-900',
          r.node.type === 'region'
            ? 'pointer-events-none bg-sky-100 text-sky-900 border-sky-300 dark:bg-sky-900/30 dark:text-sky-100 dark:border-sky-600'
            : r.node.type === 'factory'
              ? 'bg-stone-200 text-stone-900 border-stone-300 dark:bg-stone-900 dark:text-stone-200 dark:border-stone-600 hover:bg-stone-100'
              : r.node.type === 'system'
                ? 'bg-amber-200 text-amber-900 border-amber-300 dark:bg-amber-900/40 dark:text-amber-100 dark:border-amber-700 hover:bg-amber-100'
                : r.node.type === 'machine'
                  ? 'bg-emerald-200 text-emerald-900 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-100 dark:border-emerald-700 justify-start px-5 text-left hover:bg-emerald-100'
                  : // 🔥 component 特別處理 nonMaintenance
                    r.node.type === 'component' && !r.node.nonMaintenance
                    ? 'bg-gray-200 text-gray-900 border-gray-300 dark:bg-gray-900/40 dark:text-gray-100 dark:border-gray-600 hover:bg-gray-100 justify-start px-5 text-left'
                    : r.node.type === 'component'
                      ? 'bg-orange-200 text-orange-900 border-orange-300 dark:bg-orange-900/40 dark:text-orange-100 dark:border-orange-700 justify-start px-5 text-left hover:bg-orange-100'
                      : 'bg-gray-200 text-gray-900 border-gray-300 dark:bg-gray-900/40 dark:text-gray-100 dark:border-gray-600 hover:bg-gray-100'
        ]"
        @click="onNodeClick(r)"
      >
        <span class="relative">
          <template v-if="r.node.type === 'machine'">
            <!-- 有 "." 才拆前後，前段紅色 -->
            <template v-if="r.node.label.includes('.')">
              <span class="text-red-500">{{ r.node.label.split('.')[0] }}</span
              ><span class="text-green-800 dark:text-green-200"
                >.{{ r.node.label.split('.').slice(1).join('.') }}</span
              >
            </template>

            <!-- 沒有 "." 整段維持綠色 -->
            <template v-else>
              <span class="text-green-800">
                {{ r.node.label }}
              </span>
            </template>
          </template>

          <template v-else>
            {{ r.node.label }}
          </template>
          <span v-if="r.node.type === 'factory' && r.node.meta?.code" class="opacity-80 font-normal"
            >（{{ r.node.meta.code }}）🏭</span
          >

          <span v-if="r.node.type === 'system'" class="opacity-80 font-normal font-lg">⚙️</span>
          <span v-if="r.node.type === 'machine'" class="opacity-80 font-normal font-lg">🛠️</span>
          <span v-if="r.node.type === 'component'" class="opacity-80 font-normal font-lg">🔩</span>
        </span>

        <!-- caret -->
        <span
          v-if="isExpandable(r.node)"
          class="absolute right-1.5 top-1/2 -translate-y-1/2 text-[12px] opacity-70 pointer-events-none transition-transform duration-150 ease-linear"
          :class="{ 'rotate-90': isExpanded(r.node.id) }"
          aria-hidden="true"
          >▶</span
        >
      </div>
    </div>
  </div>
  <div
    class="fixed flex justify-center bg-white bottom-0 items-center gap-3 w-full border border-t py-1"
  >
    <input
      id="searchInput"
      v-model="searchText"
      type="text"
      placeholder="輸入搜尋的文字"
      class="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
      @input="searchBox"
    />
    <div class="text-gray-700">
      搜尋到 {{ state.marks.length }} 個，當前第 {{ state.currentMarkIndex + 1 }} 個
    </div>
    <div class="flex flex-wrap justify-center gap-2 mt-2">
      <button
        class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-200"
        @click="searchBox"
      >
        搜尋
      </button>
      <button
        class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200"
        @click="prevHighlight"
      >
        上一個
      </button>
      <button
        class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200"
        @click="nextHighlight"
      >
        下一個
      </button>
      <button
        class="relative px-6 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold rounded-lg shadow-md hover:from-gray-600 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-300 ease-in-out transform hover:scale-105"
        @click="clearInput"
      >
        <span class="flex items-center justify-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          清除
        </span>
      </button>
    </div>
  </div>
</template>
