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

Simulator should start and you should see events in the console.log. If an OlliRevisited app is configured with same Cloudant database or is listening on the websocket connection, you should see Olli move on the map

## Configuration

The following settings can be configured in the `.env` file:

* `simulator_target_cloudant` -  Cloudant/CouchDB database url (fully qualified) to send events to (e.g, `http://username:password@127.0.0.1:5984/ollilocation`)
* `simulator_route_source` - URL or file path to JSON file containing the route GeoJSON (default: `data/route.json`)
* `simulator_stops_source` - URL or file path to JSON file containing the stops GeoJSON (default: `data/stops.json`)
* `simulator_number_of_runs` - number of times the simulator runs through the complete route (default: `-1` which mean infinite)
* `simulator_stop_duration` - how long (in seconds) to wait at each stop (default: `3`)
* `simulator_route_precision` - when computing points along the route how precise/frequent should coordinates. the lower the number, the more coordinates (default: `3`)
* `simulator_event_interval` - the time interval to send the events (default: `3` which equates to approximately every _300 ms_)

## Events

The simulator sends events to the configured websocket and/or Cloudant/CouchDB database. The events are:

* __route_info__ - coordinates and stops data for the route

```
{
    'type': 'route_info',
    'coordinates': [<coordinates>],
    'stops': [<stops>],
    'distance': distance,
    'ts': <event time in ms>
}
```

* __door_open__ - when the doors are opened


```
{
    'type': 'door_open',
    'ts': <event time in ms>
}
```

* __door_close__ - when the doors are closed


```
{
    'type': 'door_close',
    'ts': <event time in ms>
}
```

* __trip_start__ - when starting a drive from one stop to the next

```
{
    'type': 'trip_start',
    'from_coordinates': [<lng>, <lat>],
    'to_coordinates': [<lng>, <lat>],
    'distance': <trip distance>,
    'from_stop': <stop>,
    'to_stop': <stop>,
    'ts': <event time in ms>
}
```

* __trip_end__ - when next stop has been reached

```
{
    'type': 'trip_end',
    'from_coordinates': [<lng>, <lat>],
    'to_coordinates': [<lng>, <lat>],
    'distance': <trip distance>,
    'from_stop': <stop>,
    'to_stop': <stop>,
    'ts': <event time in ms>
}
```

* __geo_position__ - current position

```
{
    'type': 'geo_position',
    'coordinates': [<lng>, <lat>],
    'distance_travelled': <distance from previous stop>,
    'distance_remaining': <distance to next stop>,
    'ts': <event time in ms>
}
```

Example series of events:

```
{
  "type": "route_info",
  "coordinates": [
    [-92.467044, 44.022365],
    . . .
    [-92.467044,44.022365]
  ],
  "stops": [
    {
      "name": "Mayo Gonda Building",
      "description": "Mayo Clinic main patient building",
      "poi": [
        "Mayo Clinic specialties (cardiology, gastroenterology, neurology, etc.",
        "May Clinic Gift Shop",
        "Mayo Clinic Center for Innovation","Gonda Building Atrium"
      ],
      "coordinates": [-92.467044, 44.022365]
    },
    . . .
    {
      "name": "Mayo Guggenheim Building",
      "description": "Mayo Clinic research laboratories",
      "poi": [
        "Mayo Clinic research laboratories",
        "Mayo Medical School",
        "Mayo Clinic Hilton building",
        "Mayo Clinic Stabile building"
      ],
      "coordinates": [-92.467347, 44.020764]
    }
  ],
  "distance": 1.4280120038830966,
  "ts": 1509021021379
}

{
  "type": "trip_start",
  "from_coordinates": [-92.467044, 44.022365],
  "to_coordinates": [-92.464521, 44.022527],
  "distance": 0.47045331828285003,
  "ts": 1509002875000
}

{
  "type": "geo_position",
  "coordinates": [-92.46704041048083, 44.02237361484655],
  "distance_travelled": 0.0009999999987825268,
  "distance_remaining": 0.4694533182840675,
  "ts": 1509002875615
}

. . .

{
  "type": "geo_position",
  "coordinates": [-92.464521, 44.02252],
  "distance_travelled": 0.47045331828285003,
  "distance_remaining": 0,
  "ts": 1509003074903
}

{
  "type": "trip_end",
  "from_coordinates": [-92.467044, 44.022365],
  "to_coordinates": [-92.464521, 44.022527],
  "distance": 0.47045331828285003,
  "ts": 1509003075455
}

{
  "type": "door_open",
  "ts": 1509003075499
}

{
  "type": "door_close",
  "ts": 1509003078548
}

{
  "type": "trip_start",
  "from_coordinates": [-92.464521, 44.02252],
  "to_coordinates": [-92.46450396041575, 44.02054792282925],
  "distance": 0.2412910537873316,
  "ts": 1509003080599
}

{
  "type": "geo_position",
  "coordinates": [-92.464521, 44.02252],
  "distance_travelled": 0,
  "distance_remaining": 0.2412910537873316,
  "ts": 1509003080649
}

. . .
```
