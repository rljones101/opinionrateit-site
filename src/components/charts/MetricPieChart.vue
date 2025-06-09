<script setup lang="ts">
import PieChart from '@/components/charts/PieChart.vue'
import { computed, reactive, ref } from 'vue'
import { type ChartData } from 'chart.js'
import { useUserStore } from '@/stores/user'
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../../../tailwind.config.js'

type BrandColor = {
  [key: number]: string
}

const fullConfig = resolveConfig(tailwindConfig)
const colors = fullConfig.theme?.colors
const brandColors = colors!.brand as BrandColor

const props = defineProps<{
  metric: number
}>()

const userStore = useUserStore()

const chartData = ref<ChartData<'doughnut'>>({
  labels: ['score'],
  datasets: [
    {
      label: 'score',
      data: [],
      backgroundColor: [brandColors['500'], brandColors['50']],
      borderColor: 'rgba(0,0,0,0)',
      borderWidth: 1
    }
  ]
})
const chartOptions = reactive({
  /* @ts-ignore */
  onResize: (...args) => {
    const chart = args[0]
    chart.canvas.parentNode.style.width = '20vw'
  },
  responsive: true,
  maintainAspectRatio: false,
  legend: {
    display: false
  },
  tooltips: {
    enabled: false
  }
})

const metricScore = computed(() => {
  if (props.metric) {
    return getMetricScore()
  }
  return 0
})

const getMetricScore = () => {
  // const sum = weights.reduce((acc, cur) => acc + cur)
  // const average = Math.floor(sum / weights.length)
  if (chartData?.value?.datasets?.[0]?.data) {
    // const dataColor = `hsl(${props.metric},100%,50%)`

    chartData.value.datasets[0].data.push(props.metric)
    chartData.value.datasets[0].data.push(Math.floor(100 - props.metric))
    chartData.value.datasets[0].backgroundColor = [brandColors['500'], brandColors['50']]
  }
  return Math.floor(props.metric)
}

// const getColor = (value: number) => {
//   return `hsl(${value},100%,50%)`
// }
</script>

<template>
  <div
    class="relative flex flex-col items-center justify-center flex-grow"
    v-show="userStore.isLoggedIn"
  >
    <div
      class="absolute w-full h-full flex flex-col items-center justify-center"
      style="font-size: 2vw"
    >
      <p>
        {{ metricScore + '%' }}
      </p>
      <p class="text-sm font-semibold">Metric Score</p>
    </div>
    <PieChart
      id="MetricPieChart"
      :chart-data="chartData"
      :options="chartOptions"
      class="relative"
    />
  </div>
</template>

<style scoped></style>
