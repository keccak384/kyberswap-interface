// https://stackoverflow.com/questions/36523448/how-do-i-tell-if-a-user-is-using-brave-as-their-browser
let isBraveBrowser = false
;(() => {
  const check = async () => {
    const result = (navigator.brave && (await navigator.brave.isBrave())) || false
    isBraveBrowser = result
    console.log({ isBraveBrowser })
  }
  check()
})()

const checkForBraveBrowser = () => {
  console.log({ isBraveBrowser })
  return isBraveBrowser
}

export default checkForBraveBrowser
