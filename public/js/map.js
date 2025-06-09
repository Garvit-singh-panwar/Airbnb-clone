         maptilersdk.config.apiKey = mapApiKey ;
        const map = new maptilersdk.Map({
        container: 'map', // container's id or the HTML element in which the SDK will render the map
        style: maptilersdk.MapStyle.STREETS,
        center: [77.2090, 28.6139], // starting position [lng, lat]
        zoom: 14 // starting zoom
      });