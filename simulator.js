require('dotenv').config()
const cloudant = require('cloudant')
const routeJson = require('./route.json')

let config = {
  LAPS: process.env['simulator_number_of_runs'] || 1,
  INTERVAL: process.env['simulator_event_interval'] || 500,
  STOPTIME: process.env['simulator_stop_duration'] || 2500,
  TARGET_CLOUDANT: process.env['simulator_target_cloudant'] || 'http://127.0.0.1:5984/ollilocation'
}

var db = null
var NUM_RUNS = 0

const simulate = (step) => {
  if ( step >= routeJson.features.length ) {
    step = 0
    NUM_RUNS++
    if ( NUM_RUNS >= config.LAPS ) {
      process.exit()
    }
    else {
      console.log("Starting new lap...")
    }
  }

  let geoPosition = routeJson.features[step]
  insertCloudant(geoPosition)
    .then(() => sleepTimer( geoPosition.properties.is_stop ? config.STOPTIME : config.INTERVAL))
    .then(() => simulate(++step))
}

const insertCloudant = (msg) => {
  return Promise.resolve()
    .then(() => {
      return new Promise((resolve, reject) => {
        db.insert(msg, (err, body) => {
          if (err) {
            console.error(err)
            reject(err)
          } else {
            console.log("Inserted position: "+msg.geometry.coordinates)
            resolve()
          }
        })
        resolve()
      })
    })
    .catch(err => {
      console.error(err)
      return Promise.reject(err)
    })
}

const initCloudant = () => {
  return Promise.resolve()
    .then(() => {
      return new Promise((resolve, reject) => {
        let cloudantindex = config.TARGET_CLOUDANT.lastIndexOf('/')
        let hostcloudant = config.TARGET_CLOUDANT.substring(0, cloudantindex)
        let dbnamecloudant = config.TARGET_CLOUDANT.substring(cloudantindex + 1)
        console.log(`trying to access db at ${hostcloudant}/${dbnamecloudant}`)
        let c = cloudant(hostcloudant)
        c.db.get(dbnamecloudant, (err, body) => {
          if (err) {
            console.error(err)
            resolve(false)
          } else {
            console.log(`accessed db at ${hostcloudant}/${dbnamecloudant}`)
            console.log(body)
            db = c.db.use(dbnamecloudant)
            resolve(true)
          }
        })
      })
    })
    .catch(err => {
      console.error(err)
      db = null
      return Promise.resolve(false)
    })
}

const sleepTimer = (ms) => {
  return new Promise((resolve, reject) => setTimeout(resolve, ms))
}

initCloudant().then( () => simulate(0) )
