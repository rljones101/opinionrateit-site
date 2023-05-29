// import axios from 'axios';

export default class ReviewerService {
// private reviewers: any[] = [
//     {
//       "id": 1,
//       "name": "zReviews",
//       "channelId": "UC3XdYJjWliOdKuZMNaTiP8Q",
//       "social": [
//         {
//           "type": "youtube",
//           "url": "https://www.youtube.com/c/ZeosReviews"
//         },
//         {
//           "type": "patreon",
//           "url": "https://www.patreon.com/Zeos"
//         }
//       ],
//       "metrics": [
//         {
//           "type": "clarity",
//           "value": 80
//         },
//         {
//           "type": "product view",
//           "value": 70
//         },
//         {
//           "type": "product detail explanation",
//           "value": 60
//         },
//         {
//           "type": "non bias",
//           "value": 70
//         },
//         {
//           "type": "average review time",
//           "value": 50
//         },
//         {
//           "type": "product focus",
//           "value": 60
//         },
//         {
//           "type": "provided additional resources",
//           "value": 80
//         },
//         {
//           "type": "share",
//           "value": 80
//         },
//         {
//           "type": "overall presentation",
//           "value": 90
//         }
//       ]
//     },
//     {
//       "id": 2,
//       "name": "Josh Valour",
//       "channelId": "UCx9bOYEjkevIDYONBAstK-A",
//       "social": [
//         {
//           "type": "youtube",
//           "url": "https://www.youtube.com/c/JoshuaValour"
//         }
//       ],
//       "metrics": [
//         {
//           "type": "clarity",
//           "value": 90
//         },
//         {
//           "type": "product view",
//           "value": 40
//         },
//         {
//           "type": "product detail explanation",
//           "value": 30
//         },
//         {
//           "type": "non bias",
//           "value": 50
//         },
//         {
//           "type": "average review time",
//           "value": 50
//         },
//         {
//           "type": "product focus",
//           "value": 90
//         },
//         {
//           "type": "provided additional resources",
//           "value": 35
//         },
//         {
//           "type": "share",
//           "value": 80
//         },
//         {
//           "type": "overall presentation",
//           "value": 80
//         }
//       ]
//     },
//     {
//       "id": 3,
//       "name": "Badseed Tech",
//       "channelId": "UCOFH59uoSs8SUF0L_p3W0sg",
//       "social": [
//         {
//           "type": "youtube",
//           "url": "https://www.youtube.com/c/badseedtech"
//         },
//         {
//           "type": "twitter",
//           "url": "https://twitter.com/badseedtech"
//         }
//       ],
//       "metrics": [
//         {
//           "type": "clarity",
//           "value": 95
//         },
//         {
//           "type": "product view",
//           "value": 90
//         },
//         {
//           "type": "product detail explanation",
//           "value": 70
//         },
//         {
//           "type": "non bias",
//           "value": 80
//         },
//         {
//           "type": "average review time",
//           "value": 70
//         },
//         {
//           "type": "product focus",
//           "value": 70
//         },
//         {
//           "type": "provided additional resources",
//           "value": 80
//         },
//         {
//           "type": "share",
//           "value": 80
//         },
//         {
//           "type": "overall presentation",
//           "value": 90
//         }
//       ]
//     },
//     {
//       "id": 4,
//       "name": "JayzTwoCents",
//       "channelId": "UCkWQ0gDrqOCarmUKmppD7GQ",
//       "social": [
//         {
//           "type": "youtube",
//           "url": "https://www.youtube.com/c/Jayztwocents"
//         },
//         {
//           "type": "twitter",
//           "url": "https://twitter.com/jayztwocents"
//         }
//       ],
//       "metrics": [
//         {
//           "type": "clarity",
//           "value": 80
//         },
//         {
//           "type": "product view",
//           "value": 70
//         },
//         {
//           "type": "product detail explanation",
//           "value": 80
//         },
//         {
//           "type": "non bias",
//           "value": 85
//         },
//         {
//           "type": "average review time",
//           "value": 65
//         },
//         {
//           "type": "product focus",
//           "value": 70
//         },
//         {
//           "type": "provided additional resources",
//           "value": 80
//         },
//         {
//           "type": "share",
//           "value": 80
//         },
//         {
//           "type": "overall presentation",
//           "value": 80
//         }
//       ]
//     },
//     {
//       "id": 5,
//       "name": "DMS",
//       "channelId": "UC7WtLipHnndkqwSxvL0oyVQ",
//       "social": [
//         {
//           "type": "youtube",
//           "url": "https://www.youtube.com/c/DMS3TV"
//         },
//         {
//           "type": "twitter",
//           "url": "https://twitter.com/dms3tv"
//         },
//         {
//           "type": "patreon",
//           "url": "https://www.patreon.com/DMS3TV"
//         }
//       ],
//       "metrics": [
//         {
//           "type": "clarity",
//           "value": 90
//         },
//         {
//           "type": "product view",
//           "value": 70
//         },
//         {
//           "type": "product detail explanation",
//           "value": 50
//         },
//         {
//           "type": "non bias",
//           "value": 50
//         },
//         {
//           "type": "average review time",
//           "value": 80
//         },
//         {
//           "type": "product focus",
//           "value": 80
//         },
//         {
//           "type": "provided additional resources",
//           "value": 80
//         },
//         {
//           "type": "share",
//           "value": 70
//         },
//         {
//           "type": "overall presentation",
//           "value": 80
//         }
//       ]
//     },
//     {
//       "id": 6,
//       "name": "Bitwit",
//       "channelId": "UCftcLVz-jtPXoH3cWUUDwYw",
//       "social": [
//         {
//           "type": "youtube",
//           "url": "https://www.youtube.com/c/BitWit"
//         },
//         {
//           "type": "twitter",
//           "url": "https://twitter.com/bitwitkyle"
//         },
//         {
//           "type": "instagram",
//           "url": "https://www.instagram.com/bitwitkyle/?hl=en"
//         }
//       ],
//       "metrics": [
//         {
//           "type": "clarity",
//           "value": 90
//         },
//         {
//           "type": "product view",
//           "value": 70
//         },
//         {
//           "type": "product detail explanation",
//           "value": 80
//         },
//         {
//           "type": "non bias",
//           "value": 70
//         },
//         {
//           "type": "average review time",
//           "value": 80
//         },
//         {
//           "type": "product focus",
//           "value": 70
//         },
//         {
//           "type": "provided additional resources",
//           "value": 80
//         },
//         {
//           "type": "share",
//           "value": 80
//         },
//         {
//           "type": "overall presentation",
//           "value": 90
//         }
//       ]
//     },
//     {
//       "id": 7,
//       "name": "Hardware Canucks",
//       "channelId": "UCTzLRZUgelatKZ4nyIKcAbg",
//       "social": [],
//       "metrics": [
//         {
//           "type": "clarity",
//           "value": 75
//         },
//         {
//           "type": "product view",
//           "value": 70
//         },
//         {
//           "type": "product detail explanation",
//           "value": 80
//         },
//         {
//           "type": "non bias",
//           "value": 50
//         },
//         {
//           "type": "average review time",
//           "value": 80
//         },
//         {
//           "type": "product focus",
//           "value": 80
//         },
//         {
//           "type": "provided additional resources",
//           "value": 80
//         },
//         {
//           "type": "share",
//           "value": 70
//         },
//         {
//           "type": "overall presentation",
//           "value": 80
//         }
//       ]
//     },
//     {
//       "id": 8,
//       "name": "randomfrankp",
//       "channelId": "UChnN9MPURwKV2PbEoT2vhTQ",
//       "social": [],
//       "metrics": [
//         {
//           "type": "clarity",
//           "value": 80
//         },
//         {
//           "type": "product view",
//           "value": 80
//         },
//         {
//           "type": "product detail explanation",
//           "value": 70
//         },
//         {
//           "type": "non bias",
//           "value": 75
//         },
//         {
//           "type": "average review time",
//           "value": 60
//         },
//         {
//           "type": "product focus",
//           "value": 70
//         },
//         {
//           "type": "provided additional resources",
//           "value": 80
//         },
//         {
//           "type": "share",
//           "value": 80
//         },
//         {
//           "type": "overall presentation",
//           "value": 85
//         }
//       ]
//     }
//   ]

  constructor () {
    //console.log(this)
  }

  async getReviewers() {
    // const response = await axios.get('reviewers.json')
    // const reviewers = response.data
    //console.log('called async > getReviewers:', this.reviewers)

    let reviewers = []

    try {
      const baseApiUrl = import.meta.env.VITE_API_URL

      const res = await fetch(`${baseApiUrl}/api/v1/reviewers`)
      reviewers = await res.json()
      // console.log(reviewers)
    } catch (err) {
      console.log(err)
    }

    reviewers = [...reviewers.data.data].map(reviewer => {
      return { ...reviewer, id: reviewer._id }
    })

    return reviewers
  }
}
