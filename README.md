# maps-deckgl

React app using deck.gl to map taxi availability.

## Google App Engine

1. Create a Google Cloud project.
2. Open a Cloud Shell.

Clone entire repository into the project folder.

    git clone https://github.com/tortuca/maps-deckgl
    cd maps-deckgl
    
## Staging

Install dependencies:

    npm install

Run dev server on port 3000:

    npm start

Build production files to /build folder:

    npm run build
    
Note: May need to change `TAXI_WS_URL` in `hex-map.js` accordingly. 
Webapp will get live data from data.gov.sg directly if the web service API is not available.
    
## Deploy

    gcloud app deploy app.yaml