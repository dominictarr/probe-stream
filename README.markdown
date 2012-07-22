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

