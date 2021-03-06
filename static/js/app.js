"use strict";

// PEDASI API endpoints
const PEDASI_API = 'https://dev.iotobservatory.io';  // Root PEDASI API endpoint
const DATASET_IOTUK = '/api/datasources/2/data/';    // IoT UK Nations Database external data source
const DATASET_POSTCODE = '/api/datasources/1/data/'; // PEDASI's internal geolocation lookup data source


let map = initialise_map();

/**
 * Initialise a new Leaflet.js map focused on the UK.
 * @returns {Map} map The leaflet map instance.
 */
function initialise_map() {
    // Create our map and set the initial view to the UK
    let mapOptions = {center: [17.385044, 78.486671], zoom: 10};
    let map = new L.map('map', mapOptions);
    let uk_bbox = [[49.82380908513249, -10.8544921875], [59.478568831926395, 2.021484375]];
    map.fitBounds(uk_bbox);

    // Add new TileLayer specifying the interface format to OpenStreetMap
    let layer = new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
    map.addLayer(layer);

    return map;
}

/**
 * Provide list of addresses and geocoords from list of IoT UK Nations organisations.
 * @param {Array} results Array of results from IoT UK Nations Database.
 * @returns {Array.<{address_html: String, lat: number, lng: number}>} markers Array of organisation marker objects.
 */
async function get_orgs_geocoords(results, pedasi_app_api_key) {
    // Hold geocoords and address data for each result to add as a map marker
    let markers = [];

    // To keep track of the asynchonous requests for geocode lookups,
    // so we can know when they're all finished
    let promises = [];

    // For each result, perform geocode lookup using PEDASI's internal postcode/geolocation
    // dataset, based on the organisations' address, and add lat/lng to our marker results
    // with an HTML description of the address
    for(let result_num in results) {
        let org_name = results[result_num].organisation_name;
        let org_addr = results[result_num].address;
        let html_addr = '<p><strong>' + org_name + '</strong><br> ' +
                        org_addr.address_line_1 + '<br>' +
                        org_addr.town + '<br>' + org_addr.postcode + '</p>';
        let query_addr = org_addr.postcode;

        // Perform geocode lookup asynchronously, making note of the promise, using
        // the PEDASI Application or User API key. The service doesn't require it,
        // but as an application it's expected practice to supply it anyway
        let postcode_query_url = PEDASI_API + DATASET_POSTCODE + '?postcode=' + query_addr;
        promises.push($.ajax({
            url: postcode_query_url,
            type: "GET",
            headers: { 'Authorization': 'Token ' + pedasi_app_api_key },
            success: function(response) {
                // If we have at least one result returned, add the first one
                markers.push({'address_html': html_addr, 'lat': response.lat, 'lng': response.long});
            }, error: function(jq_xhr, exception) {
                console.log("Error: " + jq_xhr, exception);
            }
        }));
    }

    // Convenience function to ignore raised errors from promises, since we only
    // care about valid results and Promises.all() will not complete with >0 errors
    function ignore(promise) {
        return promise.catch(e => undefined);
    }

    // Wait until all our promise requests are finished (either failed or successful)
    await Promise.all(promises.map(ignore));

    return markers;
}

/**
 * Add a given list of organisations to a Leaflet.js map.
 * @param {Array} results Array of results from IoT UK Nations Database.
 * @param {Map} map The leaflet map instance.
 */
async function add_orgs_to_map(results, map, pedasi_app_api_key) {
    // Get geocoords for organisations
    let markers = await get_orgs_geocoords(results, pedasi_app_api_key);

    // Add each marker to a feature group on our map, with an address displayed when clicked
    let l_group = L.featureGroup().addTo(map);
    for(let marker_num in markers) {
        let marker = markers[marker_num];
        let l_marker = L.marker([marker.lat, marker.lng]).bindPopup(marker.address_html);
        l_group.addLayer(l_marker);
    }

    // Determine the boundary for all our markers, and restrict map view accordingly,
    map.fitBounds(l_group.getBounds());
}

/**
 * Update map with Internet of Things organisations for a given location.
 * @returns {boolean} false Return false to ensure the page doesn't refresh on form submit.
 */
function populate_map() {
    let city_name = $('#mapParamsCityName').val();
    let pedasi_app_api_key = $('#mapParamsAppKey').val();

    // Request IoT company address data from PEDASI for the given location, using the
    // provided PEDASI Application or User API key required to authorise the request
    let dataset_url = PEDASI_API + DATASET_IOTUK;
    let ped_query_url = dataset_url + '?town=' + city_name;

    $.ajax({
        url: ped_query_url,
        type: "GET",
        headers: { 'Authorization': 'Token ' + pedasi_app_api_key },
        success: function(response) {
            add_orgs_to_map(response.data, map, pedasi_app_api_key);
        }
    });

    return false;
}
