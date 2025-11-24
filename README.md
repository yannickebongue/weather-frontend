# Weather Frontend API

This is a sample Weather Frontend API. This application use a subset of the [Open-Meteo](https://open-meteo.com) open-source weather API to just retrieve the current temperature from a given geocoordinates (latitude and longitude).

## Prerequisites

-  **Node.js >= 22.13.1** and **npm >= 11.1.0**

## Run locally

Execute the following command to install required dependencies:

```bash
$ npm install
```

Then run the following command to start the application on port `3000`:

```bash
$ npm start
```

## Run on Docker

### Building and running an image locally

To build and run a docker image with the code checked out on your machine, run the following from the root directory of the project:

```bash
$ docker compose up server-prod --build -d
```

It is also possible to run a docker image in development mode with the following command:

```bash
$ docker compose up server-dev --build -d
```

This last command is very useful during development since the docker will keep the running container updated by watching the application changed files. See [Docker Compose](https://docs.docker.com/compose/) for further information.

## Test the application

After starting the application as described above, open a new terminal and run the following command:

```bash
$ curl -i "http://localhost:3000/v1/search?name=$location"
```

This will return an array of JSON objects with `latitude` and `longitude` properties that can be used for the next command:

```bash
$ curl -i "http://localhost:3000/v1/current?latitude=$latitude&longitude=$longitude"
```

This will return the current weather information of the given latitude and longitude.
