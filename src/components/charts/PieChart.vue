<template>
  <DoughnutChart :chartData="dnChartData" :options="dnOptions" />
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { DoughnutChart } from 'vue-chart-3'
import { Chart, registerables  } from 'chart.js'
Chart.register(...registerables)

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
      default: () => {
        return {
          datasets: [{ x: '' }]
        }
      }
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
        datasets: [],
        ...props?.chartData,
      }
    })

    return { dnChartData, dnOptions }
  }
})
</script>

<style scoped>

</style>
