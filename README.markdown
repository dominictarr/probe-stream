# probe-stream

insert a metric-gathering probe into a set of streams.

``` js

var probe = require('probe-stream')({interval: 1000}) //this is the default.

localStream
  .pipe(probe.createProbe())
  .pipe(remoteStream)

```

`probe` will emit updated stream stats every second (by default) on the

actually, probe is a `Stream` itself!
so you can do this:

``` js

var es = require('event-stream')

probe
  .pipe(es.stringify())
  .pipe(toRemoteMonitor)

```

probe is a stream of raw objects, so remember to stringify it.


## custom metrics.

by default, `probe-stream` measures bytes per-second. 
but it can be used to measure any kind of data coming down the stream.

create new metric formats like this:

``` js
var probeStream = require('probe-stream')

var probe = probeStream({
  init: function (measured) {
    return {
      chunks: new measured.Gauge()
    }
  },
  create: function (metrics) {
    var self = this // the probe-stream. a Stream.
    return {
      data: function (data) {
        metrics.chunks.mark() //count another chunk.
      }
    }
  }
})

```

`init` is called once, to set up the metrics that will be used.
it must return an object of metrics. It will be passed an instance 
of [measured](https:/github.com/felixge/node-measured) as the first argument.

`create` is called whenever you create a probe with `probe.createProbe()`.
`create` is called in the context of the new probe stream. The first arg is the metrics object
that `init` returned. `create` should return an object of listeners, these will be assigned to 
the probe stream, and cleaned up automatically when the stream ends. 

You can also assign listeners manually, it's up to you.
