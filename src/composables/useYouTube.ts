import { onMounted } from 'vue'

export const useYouTube = (iframe: string, videoId: string) => {
  let player: any

  const onPlayerReady = (event: any) => {
    //event.target.playVideo()
    console.log('Player is ready!')
  }

  const stopVideo = () => {
    player.stopVideo()
  }

  const onPlayerStateChange = (event: any) => {
    // if (event.data == window.YT.PlayerState.PLAYING && !done) {
    //   setTimeout(stopVideo, 6000)
    //   done = true
    // }
    console.log('player state changed:', event.data)
  }

  const createPlayer = (iframe: string, options = {}) => {
    // @ts-ignore
    return new window.YT.Player(iframe, options)
  }

  const onYouTubeIframeAPIReady = () => {
    player = createPlayer(iframe, {
      height: '390',
      width: '640',
      videoId: videoId,
      playerVars: {
        playsinline: 1
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange
      }
    })
  }

  // globals
  // @ts-ignore
  if (!window.onYouTubeIframeAPIReady) {
    console.log('...add listener')
    // @ts-ignore
    window.onYouTubeIframeAPIReady = () => onYouTubeIframeAPIReady
  }

  onMounted(() => {
    if (!player) {
      player = createPlayer('player', {
        height: '390',
        width: '640',
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
      })
    }
  })
}
