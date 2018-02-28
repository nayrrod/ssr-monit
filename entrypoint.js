
const pmx = require('pmx')
const Probe = pmx.probe()

const render = require('./index.js')
const {
  getTimeFromPerformanceMetrics,
  extractDataFromPerformanceMetrics,
  getValueFromPerformanceMetrics
} = require('./helpers');

var remoteMetrics = {
  scripting : Probe.metric({
    name : 'Script Duration'
  }),
  styleDuration : Probe.metric({
    name : 'Style Duration'
  }),
  layoutDuration : Probe.metric({
    name : 'Layout Duration'
  }),
  heapUser : Probe.metric({
    name : 'Heap Used Size'
  }),
  heapTotal : Probe.metric({
    name : 'Heap Total Size'
  })
}

let update = async() => {
  var metrics = await render('https://www.facebook.com/');

  remoteMetrics.scripting.set(Math.floor(getTimeFromPerformanceMetrics(metrics.performanceMetrics, 'ScriptDuration')))
  remoteMetrics.styleDuration.set(Math.floor(getTimeFromPerformanceMetrics(metrics.performanceMetrics, 'RecalcStyleDuration')))
  remoteMetrics.layoutDuration.set(Math.floor(getTimeFromPerformanceMetrics(metrics.performanceMetrics, 'LayoutDuration')))
  remoteMetrics.heapUser.set(Math.floor(getValueFromPerformanceMetrics(metrics.performanceMetrics, 'JSHeapUsedSize')))
  remoteMetrics.heapTotal.set(Math.floor(getValueFromPerformanceMetrics(metrics.performanceMetrics, 'JSHeapTotalSize')))
}

setInterval(function() {
  update()
}, 1000 * 15)

update()
