<template>
  <DoughnutChart :chartData="dnChartData" :options="dnOptions" />
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { DoughnutChart } from 'vue-chart-3'
import { Chart, DoughnutController, ArcElement  } from 'chart.js'
if (!import.meta.env.SSR) {
  Chart.register(DoughnutController, ArcElement)
}
export default defineComponent({
  name: 'PieChart',
  components: { DoughnutChart },
  props: {
    options: {
      type: Object,
      default: () => {}
    },
    chartData: {
      type: Object,
      default: () => {}
    }
  },
  setup(props) {

    const dnOptions = ref({
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
      },
      datasets: {
        doughnut: {
          cutout: '90%'
        }
      },
      ...props?.options,
    })

    const dnChartData = computed(() => {
      return {
        ...props?.chartData,
      }
    })

    return { dnChartData, dnOptions }
  }
})
</script>

<style scoped>

</style>
