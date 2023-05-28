import fetch from 'node-fetch'
async function onBeforeRender( pageContext ) {
  let reviewers = []
  try {
    const baseApiUrl = 'https://lr23wc2w67.execute-api.us-east-2.amazonaws.com/devbackend'

    const res = await fetch(`${baseApiUrl}/reviewers`)
    reviewers = await res.json()
  } catch (err) {
    console.log(err)
  }

  reviewers = [...reviewers.data.data].map(reviewer => {
    return { ...reviewer, style: { opacity: 1 }}
  })

  const pageProps = { reviewers }
  return {
    pageContext: { pageProps }
  }
}
export { onBeforeRender }