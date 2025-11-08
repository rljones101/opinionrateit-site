import { onMounted, onUnmounted, ref } from 'vue'

export const useYouTube = (iframe: string, videoId: string) => {
  let player: any
  const isReady = ref(false)

  const onPlayerReady = () => {
    console.log('Player is ready!')
    isReady.value = true
  }

  const onPlayerStateChange = (event: any) => {
    console.log('player state changed:', event.data)
  }

  const createPlayer = (iframe: string, options = {}) => {
    // @ts-ignore
    if (window.YT && window.YT.Player) {
      // @ts-ignore
      return new window.YT.Player(iframe, options)
    }
    return null
  }

  const videoPlayerOptions = {
    height: '100%',
    width: '100%',
    videoId: videoId,
    playerVars: {
      playsinline: 1, // fullscreen on IOS = 0, inline = 1
      modestbranding: 1, // hide youtube logo = 1, show youtube logo = 0
      controls: 1 // show = 1, hide = 0
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange
    }
  }

  const initPlayer = () => {
    // @ts-ignore
    if (window.YT && window.YT.Player && !player) {
      player = createPlayer(iframe, videoPlayerOptions)
    }
  }

  const onYouTubeIframeAPIReady = () => {
    initPlayer()
  }

  onMounted(() => {
    // @ts-ignore
    if (window.YT && window.YT.Player) {
      // API already loaded
      initPlayer()
    } else {
      // Wait for API to load
      // @ts-ignore
      const originalCallback = window.onYouTubeIframeAPIReady
      // @ts-ignore
      window.onYouTubeIframeAPIReady = () => {
        if (originalCallback) {
          originalCallback()
        }
        onYouTubeIframeAPIReady()
      }
    }
  })

  onUnmounted(() => {
    if (player && player.destroy) {
      player.destroy()
    }
  })

  return {
    player,
    isReady
  }
}
