var probe = require('..')()
var request = require('request')
var through = require('through')
var tester = require('stream-tester')

request('http://isaacs.iriscouch.com/registry/_all_docs')
  .pipe(probe.createProbe())
  .pipe(tester.createPauseStream(0.001, 100))
  .on('end', function () {
    probe.end()
  })
  
//  .pipe(process.stdout, {end: false})
probe.pipe(through(function (data) {
  console.error(data)
}))
