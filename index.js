var measured = require('measured')
var Stream = require('stream')
var inherits = require('util').inherits
var through = require('through')

var N = 'toJSON'//'printObj'

var iterate = require('iterate')
var each = iterate.each
var map  = iterate.map

module.exports = Probe

inherits(Probe, Stream)
function Probe (opts) {
  if(!(this instanceof Probe)) return new Probe(opts)
  opts = opts || {}
  init   = opts.init   || defaultInit
  this._create = opts.create || defaultCreate
  interval = opts.interval || 1e3

  this.metrics = init (measured)
  this.streams = []
  this.readable = true

  var self = this

  this.emitData = function () {
    self.emit('data', self.metrics[N] ? self.metrics[N]() : map(self.metrics, function (e) {
      return e[N]()
    }))
  }
  self._interval = setInterval(this.emitData, 1e3)
}

function addListeners(emitter, listeners) {
  if(!listeners) return
  each(listeners, function (l, e) {
    emitter.on(e, l)
  })
}

function removeListeners(emitter, listeners) {
  if(!listeners) return
  each(listeners, function (l, e) {
    emitter.removeListener(e, l)
  })
}

Probe.prototype.createProbeStream =
Probe.prototype.createProbe =
Probe.prototype.createStream = function (name) {
  name = name || 'default'
  var stream = through() 
  var self = this
  var cleaners = {end: cleanup, close: cleanup, error: cleanup}
  var listeners = this._create.call(stream, this.metrics)

  addListeners(stream, listeners)
  addListeners(stream, cleaners)

  function cleanup () {
    var i = self.streams.indexOf(stream)
    self.streams.splice(i, 1)
    removeListeners(stream, listeners)
    removeListeners(stream, cleaners)
    self.emit('remove', stream)
  }

  each(['end', 'close', 'error'], function (e) {
    stream.on(e, cleanup)
  })

  self.streams.push(stream)
  self.emit('add', stream)
 
  return stream 
}

Probe.prototype.end = function () {
  this.emitData()
  each(this.metrics, function (e) {
    if(e.end) e.end()
  })
  this.destroy()
}

Probe.prototype.destroy = function () {
  clearInterval(this._interval)
}


function defaultInit (m) {
  // return an object of the things you want to meter.
  // this function is called once when a probe is created.
  return {
    rate: new m.Meter({tickInterval: 200}), //bytes per second.
//    pause: new m.Meter({tickInterval: 200}), //avg time to drain
    streams: new m.Counter()
  }
}

//create a metrics for a stream
//currently, this has data rate,
//and avg drain time.
//want something like duty cycle.
//how often is the stream paused?
//how does the paused data rate differ from the ready data rate?

function defaultCreate (m) {
  //this is the stream.
  var self = this
  m.streams.inc()
  function onEnd () {
    m.streams.dec()
  }
  return {
    data: function (data, encoding) {
      var length = (
          typeof data == 'string' 
          ? Buffer.byteLength(data, encoding) 
        : data && data.length 
          ? data.length
        : 1
      )
      m.rate.mark(length)
    },
    end: onEnd, close: onEnd, error: onEnd
  } 
}
