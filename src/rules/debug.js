export default function debug (message) {
  try {
    if ((typeof process !== 'undefined' && process.env && process.env.DEBUG ) ||
        (typeof window !== 'undefined' && window.localStorage && window.localStorage.debug)) {
      console.log(message)
    }
  } catch (ex) {
    // Do nothing
  }
}
