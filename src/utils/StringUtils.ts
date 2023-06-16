const urlify = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  return text.replace(urlRegex, function (url) {
    return (
      '<a href="' +
      url +
      '" class="text-orange-500 hover:underline" target="_blank">' +
      url +
      '</a>'
    )
  })
  // or alternatively
  // return text.replace(urlRegex, '<a href="$1">$1</a>')
}

const replaceNewlines = (text: string) => {
  const urlRegex = /(\n+)/g
  return text.replace(urlRegex, '<br/>')
}

const nFormatter = (num: number, digits: number): string => {
  const si = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' }
  ]
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
  let i
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol
}

export { urlify, replaceNewlines, nFormatter }
