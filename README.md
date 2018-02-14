# Olli Simple Bus Movement Simulator

## Prerequisites

* [Node.js](https://nodejs.org/en/download/)

## Quick Start

1. Clone this [repo](https://github.com/ibm-watson-data-lab/olli-simple-sim)
1. From terminal, go to the root directory of the cloned repo
1. From terminal, Run command

    `npm install`

1. Edit `.env` (in root directory) accordingly
1. From terminal,  run command

    `npm start`

Simulator should start and you should see events in the console.log. If a client app is configured with same Cloudant database, you should see a bus move on the map

## Configuration

The following settings can be configured in the `.env` file:

* `simulator_target_cloudant` -  Cloudant/CouchDB database url (fully qualified) to send events to (e.g, `http://username:password@127.0.0.1:5984/ollilocation`)
* `simulator_number_of_runs` - number of times the simulator runs through the complete route (default: `-1` which mean infinite)
* `simulator_stop_duration` - how long (in milliseconds) to wait at each stop (default: `25`)
* `simulator_event_interval` - how long (in milliseconds) to wait before sending the next coordinate to the database (default: `5`)
