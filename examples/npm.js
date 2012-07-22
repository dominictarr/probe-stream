var probe = require('..')()
var request = require('request')
var through = require('through')

request('http://isaacs.iriscouch.com/registry/_all_docs')
  .pipe(probe.createProbe())
  .on('end', function () {
    probe.end()
  })
  .pipe(process.stdout, {end: false})
probe.pipe(through(function (data) {
  console.error(data)
}))
