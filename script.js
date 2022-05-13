// API for fetching touristic areas: https://opentripmap.io/product.
const opentripmapApiKey = '5ae2e3f221c38a28845f05b64c78a88c33c73d32475f7e0c796455d5';

// Maximum number of results to display.
const maxResults = 10;

// Radius in meters for fetching touristic areas.
const radius = 10000;

$(() => {
    // Fetch touristic places around the coordinates.
    fetchTouristicPlaces = function (longitude, latitude) {
        $.ajax({
            url: 'https://api.opentripmap.com/0.1/en/places/radius',
            method: 'GET',
            dataType: 'json',
            data: {
                apikey: opentripmapApiKey,
                radius: radius,
                limit: maxResults,
                offset: 0,
                lon: longitude,
                lat: latitude,
                rate: 2,
                format: 'json',
            }
        }).then(function (data) {
            console.log(data)
            // Update the divs that contain the touristic places.
            for (let i = 0; i < data.length; i++) {
                $(`#result${i}`).text(data[i].name)
            }
            // Handle cases where the API returns less than max results,
            // by emptying the remaining divs.
            for (let i = data.length; i < maxResults; i++) {
                $(`#result${i}`).text('')
            }
        }).catch(function (err) {
            console.log("Fetch Places Error :-S", err);
        });
    }

    // Find the coordinates associated with the city selected by the user.
    fetchLocationByName = function (locationName) {
        return $.ajax({
            url: 'https://api.opentripmap.com/0.1/en/places/geoname',
            method: 'GET',
            dataType: 'json',
            data: {
                apikey: opentripmapApiKey,
                name: locationName
            }
        });
    }

    $('select[name="dropdown"]').change(function () {
        // When the user picks a city, fetch the coordinates of
        // the city.
        const place = $(this).val();
        fetchLocationByName(place).then(function (data) {
            console.log(data)
            // Once we receive the coordinates of the city,
            // then fetch the touristic areas around those 
            // coordinates.
            fetchTouristicPlaces(data.lon, data.lat);
        }).catch(function (err) {
            console.log("Fetch Location Error :-S", err);
        });

        $('#bestPlaceBegin').text(`Best places in `)
        $('#bestPlaceEnd').text(`${place}`)
    });
})
