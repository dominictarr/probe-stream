var measured = require('measured')
var Stream = require('stream')
var inherits = require('util').inherits
var through = require('through')

var iterate = require('iterate')
var each = iterate.each
var map  = iterate.map

module.exports = Probe

inherits(Probe, Stream)

function Probe (init, create, interval) {
  if(!(this instanceof Probe)) return new Probe(init, create, interval)
  init   = init   || defaultInit
  this._create = create || defaultCreate
  interval = interval || 1e3

  this.metrics = init (measured)
  this.streams = []
  this.readable = true

  var self = this

  this.emitData = function () {
    self.emit('data', map(self.metrics, function (e) {
      return e.toJSON()
    }))
  }
  self._interval = setInterval(this.emitData, 1e3)
}

Probe.prototype.createProbeStream =
Probe.prototype.createProbe =
Probe.prototype.createStream = function (name) {
  name = name || 'default'
  var stream = through() 
  var self = this
  this._create.call(stream, this.metrics)

  function cleanup () {
    var i = self.streams.indexOf(stream)
    self.streams.splice(i, 1)
    each(['end', 'close', 'error'], function (e) {
      stream.removeListener(e, cleanup)
    })
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
  this.destroy()
}

Probe.prototype.destroy = function () {
  clearInterval(this._interval)
}


function defaultInit (m) {
  // return an object of the things you want to meter.
  // this function is called once when a probe is created.
  return {
    rate: new m.Histogram(), //bytes per second.
    drain: new m.Histogram(), //avg time to drain
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
  var l = {
    data: function (data) {
      m.rate.update(data && data.length ? data.length : 1)
    },
    pause: function () {
      var s = m.drain.start()
      self.once('drain', function () {
        s.end()
      })
    },
    end: cleanup, close: cleanup, error: cleanup
  } 

  function cleanup() {
    each(l, function (listener, event) {
      self.removeListener(event, listener)
    })  
  }

  each(l, function (listener, event) {
var measured = require('measured')
var Stream = require('stream')
var inherits = require('util').inherits
var through = require('through')

var iterate = require('iterate')
var each = iterate.each
var map  = iterate.map

module.exports = Probe

inherits(Probe, Stream)

function Probe (init, create, interval) {
  if(!(this instanceof Probe)) return new Probe(init, create, interval)
  init   = init   || defaultInit
  this._create = create || defaultCreate
  interval = interval || 1e3

  this.metrics = init (measured)
  this.streams = []
  this.readable = true

  var self = this

  this.emitData = function () {
    self.emit('data', i.map(self.metrics, function (e) {
      return e.toJSON()
    }))
  }
  self._interval = setInterval(this.emitData, 1e3)
}

Probe.prototype.createProbeStream =
Probe.prototype.createProbe =
Probe.prototype.createStream = function (name) {
  name = name || 'default'
  var stream = through() 
  var self = this
  this._create.call(stream, this.metrics)

  function cleanup () {
    var i = self.streams.indexOf(stream)
    self.streams.splice(i, 1)
    each(['end', 'close', 'error'], function (e) {
      stream.removeListener(e, cleanup)
    })
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
  this.destroy()
}

Probe.prototype.destroy = function () {
  clearInterval(this._interval)
}


function defaultInit (m) {
  // return an object of the things you want to meter.
  // this function is called once when a probe is created.
  return {
    rate: new m.Histogram(), //bytes per second.
    drain: new m.Histogram(), //avg time to drain
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
  var l = {
    data: function (data) {
      m.rate.update(data && data.length ? data.length : 1)
    },
    pause: function () {
      var s = m.drain.start()
      self.once('drain', function () {
        s.end()
      })
    },
    end: cleanup, close: cleanup, error: cleanup
  } 

  function cleanup() {
    i.each(l, function (listener, event) {
      self.removeListener(event, listener)
    })  
  }

  i.each(l, function (listener, event) {
    self.on(event, listener) 
  })
  
}
    self.on(event, listener) 
  })
  
}
