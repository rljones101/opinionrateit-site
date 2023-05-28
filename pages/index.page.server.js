import fetch from 'node-fetch'
async function onBeforeRender( pageContext ) {
  let reviewers = []
  try {
    const res = await fetch(`${process.env.VITE_BASE_URL}api/v1/reviewers`)
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