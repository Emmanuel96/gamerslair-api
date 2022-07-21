const reverse = (string: string): string => {
  return string
    .split('')
    .reverse()
    .join('')
}

const average = (array: Array<number>): number => {
  const reducer = (sum: number, item: number) => {
    return sum + item
  }

  return array.reduce(reducer, 0) / array.length
}

module.exports = {
  reverse,
  average,
}