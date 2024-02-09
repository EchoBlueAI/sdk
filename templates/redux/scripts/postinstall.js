/* eslint-disable */
const { lilconfigSync } = require('lilconfig')
const getConfig = (name) => lilconfigSync(name).search()?.config
const config = getConfig('.echobluerc') ?? getConfig('echobluerc.json')

if (config) {
  if (config.api) {
    console.log('config', config)
  } else {
    console.warn('No API configuration found in echobluerc.json. Please add one to configure the Redux API.')
  }
} else {
  console.warn('No echobluerc.json found. Please create one to configure the Redux API.')
}