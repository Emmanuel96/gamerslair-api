const reverse = require('../helpers/for_test').reverse

describe('Random tests', () => {
  test('reverse of a', () => {
    const result = reverse('a')
  
    expect(result).toBe('a')
  })
  
  test('reverse of react', () => {
    const result = reverse('react')
  
    expect(result).toBe('tcaer')
  })
  
  test('reverse of releveler', () => {
    const result = reverse('releveler')
  
    expect(result).toBe('releveler')
  })
})