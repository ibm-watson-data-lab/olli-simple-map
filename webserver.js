require('dotenv').config()
const http = require('http')
const env = require('cfenv').getAppEnv()
const path = require('path')
const express = require('express')
const app = express()

const server = http.createServer((req,res) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Request-Method', '*');
	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
	res.setHeader('Access-Control-Allow-Headers', '*');
	if ( req.method === 'OPTIONS' ) {
		res.writeHead(200);
		res.end();
		return;
	}
})
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, '/index.html'))
// })
app.use(express.static('www'))
server.on('request', app)
server.listen(env.port, () => {
  console.log(`To view your app, open this link in your browser: ${env.url}`)
})
