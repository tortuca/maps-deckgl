/* global window */
import React, {Component} from 'react';
import {render} from 'react-dom';
import {StaticMap} from 'react-map-gl';
import DeckGL, {HexagonLayer} from 'deck.gl';
import OptionsPanel from './layouts/options-panel';

const d3 = require('d3-request');

// Set your mapbox token here
// const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line
const MAPBOX_TOKEN = 'pk.eyJ1IjoidG9ydHVjYSIsImEiOiJjamtxY2g2NGcwOGxjM3FqdGdtOGx4MHZyIn0.7fTP3ScvefhJ5f--aPTQZA';

// Source data CSV
const TAXI_DATA_URL = 'https://api.data.gov.sg/v1/transport/taxi-availability';
const TAXI_WS_URL = process.env.TAXI_WS_URL || TAXI_DATA_URL;

export const INITIAL_VIEW_STATE = {
  longitude: 103.82,
  latitude: 1.3521,
  zoom: 11,
  minZoom: 8,
  maxZoom: 15,
  pitch: 45,
  // bearing: -27.396674584323023
};

const LIGHT_SETTINGS = {
  lightsPosition: [-0.144528, 49.739968, 8000, -3.807751, 54.104682, 8000],
  ambientRatio: 0.4,
  diffuseRatio: 0.6,
  specularRatio: 0.2,
  lightsStrength: [0.8, 0.0, 0.8, 0.0],
  numberOfLights: 2
};

const colorRange = [
  [1, 152, 189],
  [73, 227, 206],
  [216, 254, 181],
  [254, 237, 177],
  [254, 173, 84],
  [209, 55, 78]
];

const elevationScale = {min: 1, max: 50};

/* eslint-disable react/no-deprecated */
class HexMap extends Component {
  static get defaultColorRange() {
    return colorRange;
  }

  constructor(props) {
    super(props);
    this.state = {
      elevationScale: elevationScale.min,
      hoveredObject: null,
      upperPercent: 100,
      radius: 200,
      taxiCount: 4321
    };

    this.startAnimationTimer = null;
    this.intervalTimer = null;

    this._startAnimate = this._startAnimate.bind(this);
    this._animateHeight = this._animateHeight.bind(this);

    this._onHover = this._onHover.bind(this);
    this._renderTooltip = this._renderTooltip.bind(this);
    this._handlePercent = this._handlePercent.bind(this);
    this._handleRadius = this._handleRadius.bind(this);
  }

  componentDidMount() {
    this._animate();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data && this.props.data && nextProps.data.length !== this.props.data.length) {
      this._animate();
    }
  }

  componentWillUnmount() {
    this._stopAnimate();
  }

  _animate() {
    this._stopAnimate();

    // wait 1.5 secs to start animation so that all data are loaded
    this.startAnimationTimer = window.setTimeout(this._startAnimate, 1500);
  }

  _startAnimate() {
    this.intervalTimer = window.setInterval(this._animateHeight, 20);
  }

  _stopAnimate() {
    window.clearTimeout(this.startAnimationTimer);
    window.clearTimeout(this.intervalTimer);
  }

  _animateHeight() {
    if (this.state.elevationScale === elevationScale.max) {
      this._stopAnimate();
    } else {
      this.setState({elevationScale: this.state.elevationScale + 1});
    }
  }

  _handlePercent(val) {
    this.setState({upperPercent: val});
  }

  _handleRadius(val) {
    this.setState({radius: val});
  }

  _onHover({x, y, object}) {
    this.setState({x, y, hoveredObject: object});
  }

  _renderTooltip() {
    const {x, y, hoveredObject} = this.state;
    return (
      hoveredObject && (
        <div className="tooltip" style={{top: y, left: x}}>
          <div><b>Taxi Count</b></div>
          <div>{hoveredObject.points.length}</div>
        </div>
      )
    );
  }

  _renderLayers() {
    const {data, coverage = 0.9} = this.props;
    return [
      new HexagonLayer({
        id: 'heatmap',
        colorRange,
        coverage,
        data,
        elevationRange: [0, 400],
        elevationScale: 40,
        // elevationScale: this.state.elevationScale,
        extruded: true,
        getPosition: d => d,
        lightSettings: LIGHT_SETTINGS,
        onHover: this._onHover,
        opacity: 1,
        pickable: true,
        radius: this.state.radius,
        upperPercentile: this.state.upperPercent
      })
    ];
  }

  render() {
    const {viewState, controller = true, baseMap = true} = this.props;

    return (
      <div>
        <DeckGL
          layers={this._renderLayers()}
          initialViewState={INITIAL_VIEW_STATE}
          viewState={viewState}
          controller={controller}
        >
          {baseMap && (
            <StaticMap
              reuseMaps
              mapStyle="mapbox://styles/mapbox/dark-v9"
              preventStyleDiffing={true}
              mapboxApiAccessToken={MAPBOX_TOKEN}
            />
          )}
          {this._renderTooltip}
        </DeckGL>
        <OptionsPanel timestamp={this.props.timestamp}
                      taxiCount={this.props.taxiCount}
                      onPercentChange={this._handlePercent}
                      onRadiusChange={this._handleRadius}/>
      </div>
    );
  }
}

function renderToDOM(container) {
  render(<HexMap />, container);
  d3.json(TAXI_WS_URL, (error, response) => {
    if (!error) {
      // console.log(response);
      const ft = response.features[0];
      const data = ft.geometry.coordinates.map(
        row => [Number(row[0]), Number(row[1])]
      );
      // console.log(data);
      render(<HexMap data={data}
                     timestamp={ft.properties.timestamp}
                     taxiCount={ft.properties.taxi_count} />, container);
    }
  });
}

export default HexMap;
export {renderToDOM};