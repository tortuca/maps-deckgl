import React, { Component } from 'react';

class OptionsPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      radius: 200,
      upperPercent: 98
    };

    this._handleChangeRadius = this._handleChangeRadius.bind(this);
    this._handleChangePercent = this._handleChangePercent.bind(this);
  }

  _handleChangeRadius(event) {
    let radius = event.target.value;
    this.setState({radius: radius});
    this.props.onRadiusChange(radius);
  }

  _handleChangePercent(event) {
    // this.setState({upperPercent: event.target.value});
    let percent = event.target.value;
    this.setState({upperPercent: percent});
    this.props.onPercentChange(percent);
  }

  render() {
    return (
      <div className="options-panel top-right">
        <h3>Singapore Taxi Availability</h3>
        <p>Locations of taxis in Singapore using&nbsp;
          <a href="https://deck.gl" target="_new">deck.gl</a></p>
        <p>Data source: <a href="https://data.gov.sg">DATA.GOV.SG</a></p>

        <div className="layout">
          <div className="stat col-1-2">Taxis:
            <b>{this.props.taxiCount}</b></div>
        </div>
        <div className="input">
          <label>Radius: {this.state.radius}</label>
          <input name="radius" type="range" step="100" min="100" max="500"
                 value={this.state.radius}
                 onChange={this._handleChangeRadius}/>
        </div>
        <div className="input">
          <label>Upper Percentile: {this.state.upperPercent}</label>
          <input name="upperPercentile" type="range" step="1" min="90" max="100"
                 value={this.state.upperPercent}
                 onChange={this._handleChangePercent}/>
        </div>
        <div className="source-link">
          <a href="https://github.com/uber/deck.gl/tree/6.0-release/examples/website/3d-heatmap" target="_new">
            View Code ↗</a>
        </div>
      </div>
    );
  }
}

export default OptionsPanel;
