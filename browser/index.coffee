fs = require 'fs'
path = require 'path'
http = require 'http'
https = require 'https'
net = require 'net'
zlib = require 'zlib'
url = require 'url'
timers = require 'timers'

httpProxy = require 'http-proxy'
prettyBytes = require 'pretty-bytes'

ssl =
  key: fs.readFileSync(path.resolve __dirname, '../cert/ssl.key')
  cert: fs.readFileSync(path.resolve __dirname, '../cert/ssl.crt')

module.exports = (window) ->

  timers.setInterval ->
    mem = process.memoryUsage()
    window.webContents.send 'memuse', prettyBytes mem.rss
  , 2000

  options = secure: false, xfwd: false
  proxy = httpProxy.createProxyServer options
  proxy.on 'error', (err, req) -> console.log err
  proxy.on 'proxyRes', (proxyRes, req, resp) ->
    # console.log req.headers
    # console.log proxyRes.headers
    done = (err, buffer) ->
      body = buffer.toString()
      obj =
        req: req
        resp: proxyRes
        host: 'http://' + req.headers.host
        path: req.url
        body: body
      # console.log obj.host, obj.path
      window.webContents.send 'request', obj

    chunks = []
    proxyRes.on 'data', (chunk) -> chunks.push chunk
    proxyRes.on 'end', ->
      buffer = Buffer.concat chunks
      encoding = proxyRes.headers['content-encoding']
      switch encoding
        when 'gzip'
          zlib.gunzip buffer, done
        when 'deflate'
          zlib.inflate buffer, done
        else
          done null, buffer

  # SSL Server
  options =
    key: fs.readFileSync(path.resolve __dirname, '../cert/ssl.key')
    cert: fs.readFileSync(path.resolve __dirname, '../cert/ssl.crt')

  httpsServer = https.createServer options, (req, resp) ->
    console.log 'HTTPS', req.headers.host + req.url
    # delete req.headers['accept-encoding']
    proxy.web req, resp, { target: 'https://' + req.headers.host}

  httpsServer.listen 61235, ->
    window.webContents.send 'server:mitm:ready', 61234
    console.log("HTTPS Server listening on port 61235")

  # HTTP server
  server = http.createServer (req, resp) ->
    console.log 'HTTP', req.url
    # delete req.headers['accept-encoding']
    proxy.web req, resp, { target: 'http://' + req.headers.host }

  server.addListener 'connect', (req, socket, head) ->
    parts = req.url.split(':', 2)
    conn = net.connect 61235, '127.0.0.1', ->
      # respond to the client that the connection was made
      socket.write("HTTP/1.1 200 OK\r\n\r\n")
      # create a tunnel between the two hosts
      socket.pipe(conn)
      conn.pipe(socket)
    conn.on 'error', (err) ->
      console.log 'CONN', err

  server.listen 61234, ->
    window.webContents.send 'server:proxy:ready', 61234
    console.log("Proxy Server listening on port 61234")
