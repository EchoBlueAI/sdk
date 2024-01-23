const styles = (color: string, textColor: string = '#ffffff') => [
  'color: #a8c7fa;text-decoration: underline;',
  `color: ${color};`,
  'color: #8f8f8f;',
  `color: ${textColor};`,
]

const colors = {
  log: '#49a0ee',
  warn: '#dfc567',
  error: '#df6767',
  debug: '#4678da',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formLog = (type: string, args: any[], caller?: string) =>
  `%c${new Date().toLocaleString().split(', ')[1]} %c${type.toUpperCase()} %c[${caller}] %c${args.join(' ')}`

console.log = new Proxy(console.log, {
  apply(target, thisArg, argumentsList) {
    const caller = new Error().stack
      ?.split('\n')[2]
      ?.trim()
      .split(' ')[1]
      ?.split('.')[0]
    const args = argumentsList.map((arg) => {
      if (typeof arg === 'object') {
        return JSON.stringify(arg, null, 2)
      } else {
        return arg
      }
    })

    return target.apply(thisArg, [
      formLog('log', args, caller),
      ...styles(colors.log),
    ])
  },
})

console.warn = new Proxy(console.warn, {
  apply(target, thisArg, argumentsList) {
    const caller = new Error().stack
      ?.split('\n')[2]
      ?.trim()
      .split(' ')[1]
      ?.split('.')[0]
    const args = argumentsList.map((arg) => {
      if (typeof arg === 'object') {
        return JSON.stringify(arg, null, 2)
      } else {
        return arg
      }
    })

    return target.apply(thisArg, [
      formLog('warn', args, caller),
      ...styles(colors.warn, colors.warn),
    ])
  },
})

console.error = new Proxy(console.error, {
  apply(target, thisArg, argumentsList) {
    const caller = new Error().stack
      ?.split('\n')[2]
      ?.trim()
      .split(' ')[1]
      ?.split('.')[0]
    const args = argumentsList.map((arg) => {
      if (typeof arg === 'object') {
        return JSON.stringify(arg, null, 2)
      } else {
        return arg
      }
    })

    return target.apply(thisArg, [
      formLog('error', args, caller),
      ...styles(colors.error, colors.error),
    ])
  },
})

console.debug = new Proxy(console.debug, {
  apply(target, thisArg, argumentsList) {
    const caller = new Error().stack
      ?.split('\n')[2]
      ?.trim()
      .split(' ')[1]
      ?.split('.')[0]
    const args = argumentsList.map((arg) => {
      if (typeof arg === 'object') {
        return JSON.stringify(arg, null, 2)
      } else {
        return arg
      }
    })

    return target.apply(thisArg, [
      formLog('debug', args, caller),
      ...styles(colors.debug, colors.debug),
    ])
  },
})
