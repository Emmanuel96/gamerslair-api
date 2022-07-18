type array = Array<string | number>

const info = (...params: array): void => {
  console.log(...params)
}

const error = (...params: array): void => {
  console.error(...params)
}

export default { info, error }