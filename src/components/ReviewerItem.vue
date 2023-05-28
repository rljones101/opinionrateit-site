<script setup lang="ts">
import { reactive, computed, ref } from "vue";
import { DateTime } from 'luxon';
import PieChart from "@/components/charts/PieChart.vue";
import ButtonReviews from "@/components/buttons/ButtonReviews.vue";
import StringUtils from '../utils/StringUtils'
import reviewerController from "@/controllers/reviewerController";

// Define Props
const props = defineProps<{
  name: string,
  id: number,
  channelId: string,
  social: any[],
  metrics: any[]
}>()

// interface ChannelDetails {
//   id: string,
//   name: string,
//   title?: string,
//   description?: string,
//   channelThumbnail?: string,
//   thumbnails?: {
//     default?: {
//       url?: string
//     },
//     high?: {
//       url?: string
//     }
//   },
//   publishedAt?: string,
//   statistics: {
//     commentCount: number,
//     hiddenSubscriberCount: boolean,
//     subscriberCount: number,
//     videoCount: number,
//     viewCount: number
//   }
// }

// Define data
let channelDetails = ref({
  id: null,
  name: props.name,
  title: 'Default',
  description: 'Replace this description...',
  channelThumbnail: '<span>Image here...</span>',
  thumbnails: {
    default: {
      url: null
    },
    high: {
      url: null
    }
  },
  publishedAt: '',
  statistics: {
    commentCount: 0,
    hiddenSubscriberCount: false,
    subscriberCount: 0,
    videoCount: 0,
    viewCount: 0
  }
})
const chartData = ref({
  labels: ['score'],
  datasets: [{
    label: 'score',
    data: [],
    cutout: '80%',
    backgroundColor: ['rgb(22,167,46)', 'rgba(247,114,22,0.2)'],
    borderColor: 'rgba(0,0,0,0)',
    borderWidth: 1
  }]
})
const chartOptions = reactive({
  legend: {
    display: false
  },
  tooltips: {
    enabled: false
  }
})

// Define computed data
const reviewerImage = computed(() => {
  return channelDetails.value.thumbnails.default.url
})

// const backgroundImage = computed(() => {
//   return channelDetails.value.thumbnails.high.url
// })

const publishDate = computed(() => {
  const now = DateTime.now()
  const previousDate = DateTime.fromISO(channelDetails.value.publishedAt)
  const dateDiff = now.diff(previousDate, 'years').toObject()

  let years = ''
  if (dateDiff.years) {
    years = Math.floor(dateDiff.years) + ' years'
  }
  return years
})

const formattedSubscriberCount = computed(() => {
  // console.log('channelDetails:', this.channelDetails)
  const count = channelDetails.value.statistics.subscriberCount
  return StringUtils.nFormatter(count, 1)
})

const formattedVideoCount = computed(() => {
  const count = channelDetails.value.statistics.videoCount
  return StringUtils.nFormatter(count, 1)
})

const metricScore = computed(() => {
  if (props.metrics.length) {
    const metricWeights = props.metrics.map((metric) => metric.value)
    return getMetricScore(metricWeights);
  }
  return 0
})

const setChannelDetails = (id:string, snippet:any, stats:any) => {
  return {
    id,
    name: props.name,
    title: snippet.title,
    description: snippet.description,
    channelThumbnail: '',
    publishedAt: snippet.publishedAt,
    thumbnails: {
      default: {
        url: snippet.thumbnails.default.url
      },
      high: {
        url: snippet.thumbnails.high.url
      }
    },
    statistics: {
      commentCount: 0,
      hiddenSubscriberCount: stats.hiddenSubscriberCount,
      subscriberCount: stats.subscriberCount,
      videoCount: stats.videoCount,
      viewCount: stats.viewCount
    }
  }
}
const getChannelDetails = async () => {
  try {
    const {id, snippet, statistics } = await reviewerController.getChannelDetails(props.channelId)
    channelDetails.value = setChannelDetails(id, snippet, statistics)
  } catch (err) {
    console.error(err);
  }
}

const getMetricScore = (weights: any[]) => {
  const sum = weights.reduce((acc, cur) => acc + cur);
  const average = Math.floor(sum/weights.length);
  chartData.value.datasets[0].data.push(average);
  chartData.value.datasets[0].data.push(Math.floor((100 - average)))
  // console.log('datasets:', this.chartData.datasets[0].data)
  return Math.floor(average) + '%';
}

getChannelDetails()

</script>

<template>
  <div class="flex flex-col gap-4 items-center p-8 transition-all duration-300 group hover:bg-gray-800 hover:font-bold hover:shadow-lg hover:scale-105 rounded">
    <!--    <div class="flex w-full">-->
    <!--      <social-links :social="social" />-->
    <!--    </div>-->
    <div v-if='reviewerImage' class="reviewer-image-container"><img :alt="channelDetails.title" :src="reviewerImage" class="reviewer-image" /></div>
<!--    <router-link :to="`/reviewers/${channelDetails.name}`" class="font-bold text-orange-500">{{channelDetails.title}}</router-link>-->
    <a :href="`/reviewers/${channelDetails.name}`" class="font-bold text-orange-500">{{channelDetails.title}}</a>
    <div class="flex items-center flex-grow gap-4">
      <div class="chart-container">
        <div class="graph-card">
          <div>
            <div class="metrics-chart-container">
              <div class="metrics-chart-container-value">
                <div class="actual-value">
                  {{ metricScore }}
                </div>
<!--                <div class="actual-label">-->
<!--                  Review Score-->
<!--                </div>-->
              </div>
              <PieChart :chart-data="chartData" :options="chartOptions" />
            </div>
          </div>
        </div>
      </div>
      <div class="details">
        <!--          <div v-if='reviewerImage' class="reviewer-image-container" v-html='channelDetails.channelThumbnail'></div>-->
        <div class="reviewer-stats">
          <p class="detail-stat">{{publishDate}}</p>
          <p class="detail-stat">Subscribers: {{formattedSubscriberCount}} </p>
          <p class="detail-stat">Videos: {{formattedVideoCount}}</p>
        </div>
      </div>
    </div>
    <ButtonReviews class="mt-8 w-full" :youtube-channel-id="channelDetails.id" />
  </div>
</template>

<style scoped>
.reviewer-image-container {
  border-radius: 50%;
  width: 88px;
  height: 88px;
  overflow: hidden;
  margin-bottom: 20px;
}

.metrics-chart-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  place-items: center;
  position: relative;
  margin: 0 auto;
}

.metrics-chart-container .metrics-chart-container-value {
  position: absolute;
  left: 20%;
  right: 20%;
  top: 20%;
  bottom: 20%;
  text-transform: uppercase;
  //color: var(--color-secondary);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.metrics-chart-container-value .actual-value {
  padding: 10px;
}

.metrics-chart-container-value .actual-label {
  color: rgba(255,255,255,0.5)
}
</style>