# PEDASI IoTUK Nations Mapping Example

## Introduction

This PEDASI example shows how a JavaScript application can make use of the following to build and draw
a map of the locations of Internet of Things organisations at a given location:</p>

* A PEDASI external data source: the IoT UK Nations Database, containing a queryable database of
Internet of Things businesses and organisations across the UK.
* A PEDASI internal data source: a geocode lookup service that returns latitude and longitude
coordinates given a UK postcode.
* Leaflet.js: a JavaScript visualisation library used to plot the IoT businesses for a location on a
zoomed map, using OpenStreetMap as the map plotting service.
* JQuery: a JavaScript library used to simplify HTML DOM tree traversal and manipulation, and handle
asynchronous Ajax calls to the PEDASI Applications API.
* Bootstrap 4: an open-source front-end framework for designing web applications.

## Prerequisites

The following are required to run the application:

* A web browser (e.g. Google Chrome, Mozilla Firefox, Apple Safari, Microsoft Edge but not Microsoft
Internet Explorer).
* Either:
  * Access to the application hosted on GitHub gh-pages.
  * A local web server (e.g. for simple testing, you can use Python's internal test web server).
* A PEDASI Application or User API key, to authenticate with PEDASI to use its datasources.

## Running the Example Locally (Optional)

After cloning the repository, you can just do the following to host the application using Python 3's
basic built-in web server, e.g. on Linux/Mac OS:

```
$ python3 -m http.server
```

By default, this will run the web server on port 8000.

## Using the Application

Then using a web browser:

* If hosting the application locally on port 8000, go to http://localhost:8000.
* If accessing the application via GitHub's gh-pages, go to https://pedasi.github.io/app-iotorgs-map/.

You can then enter a UK city name and your PEDASI Application or User API key, and click submit to
see the locations of organisations and businesses in that area associated with the to Internet of
Things displayed on a map. Clicking on a pin marker will display the name of the organisation and
its address in a popup.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
