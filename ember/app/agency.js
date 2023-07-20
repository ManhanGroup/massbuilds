const agencys = {
    "type": "AgencyCollection",
    "agencys": [
      {
        "type": "agency",
        "geometry": {
          "type": "Point",
          "coordinates": [
            -121.8048084693152,
            36.57362283291993
          ]
        },
        "properties": {
          "phoneFormatted": "(831)883-3750",
          "phone": "+18318833750",
          "address": "24580 Silver Cloud Ct",
          "city": "Monterey, CA ",
          "postalCode": "93940"
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [
            -77.049766,
            38.900772
          ]
        },
        "properties": {
            "phoneFormatted": "(805)781-4219",
            "phone": "+18057814219",
            "address": "1114 Marsh St",
            "city": " San Luis Obispo, CA",
            "postalCode": "93401"
        }
      },  
    ]
  };

  /* Assign a unique ID to each store */
agencys.features.forEach(function (agency, i) {
    agency.properties.id = i;
  });