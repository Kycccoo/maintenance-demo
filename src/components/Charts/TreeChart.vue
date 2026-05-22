<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, nextTick } from 'vue';
import * as echarts from 'echarts';
import { tree2 } from '@/api/services/machineComponentSlot';

const chartRef = ref(null);
let myChart: echarts.ECharts | null = null;

const chartHeight = ref('600px');

function transformData(apiData: { [s: string]: unknown } | ArrayLike<unknown>) {
  return {
    name: '＊＊水泥廠',
    children: Object.entries(apiData).map(([region, factories]) => ({
      name: region,
      children: (Array.isArray(factories) ? factories : []).map((factory: any) => ({
        name: factory.name,
        children: (factory.machineSystems || []).map((sys: any) => ({
          name: sys.name,
          children: (sys.machines || []).map((machine: any) => ({
            name: machine.name,
            children: (machine.machineComponentSlots || []).map((slot: any) => ({
              name: slot.name
            }))
          }))
        }))
      }))
    }))
  };
}

onMounted(async () => {
  try {
    const apiData = await tree2();
    const newData = { ...apiData };
    const treeData = transformData(newData);

    // 先更新 chartHeight
    const level4Height = calcLevelHeight(treeData, 3);
    chartHeight.value = level4Height * 7 + 'px';

    // 等待 DOM 更新後初始化 ECharts
    await nextTick(); // 確保 DOM 已更新
    myChart = echarts.init(chartRef.value);

    const option = {
      title: {
        text: '測試',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
        formatter: (params: { data: { description: any }; name: any }) =>
          params.data?.description || params.name
      },
      series: [
        {
          type: 'tree',
          data: [treeData],
          orient: 'LR',
          top: '1%',
          left: '10%',
          bottom: '5%',
          right: '15%',
          symbolSize: 8,
          label: {
            position: 'left',
            verticalAlign: 'middle',
            align: 'right',
            fontSize: 24
          },
          leaves: {
            label: {
              position: 'right',
              verticalAlign: 'middle',
              align: 'left'
            }
          },

          expandAndCollapse: true,
          initialTreeDepth: 3,
          animation: true,
          animationThreshold: 200000, //數字太低會影響顯示狀況
          animationDuration: 500,
          animationDurationUpdate: 750
        }
      ]
    };

    myChart.setOption(option, { notMerge: true });

    window.addEventListener('resize', resizeChart);
  } catch (err) {
    console.error('載入樹狀圖失敗:', err);
  }
});

const resizeChart = () => {
  if (myChart) myChart.resize();
};

function countNodesAtLevel(node: { children: any }, targetLevel: number, currentLevel = 1) {
  let count = 0;
  if (currentLevel === targetLevel) count += 1;
  if (node.children) {
    for (const child of node.children) {
      count += countNodesAtLevel(child, targetLevel, currentLevel + 1);
    }
  }
  return count;
}

function calcLevelHeight(
  node: { name?: string; children: any },
  targetLevel: number,
  unitHeight = 40
) {
  const nodes = countNodesAtLevel(node, targetLevel);
  return nodes * unitHeight;
}

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeChart);
  if (myChart) {
    myChart.dispose();
  }
});
</script>

<template>
  <div ref="chartRef" :style="{ width: '100%', height: chartHeight }"></div>
</template>
