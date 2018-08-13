import React, { Component } from 'react';

class OptionsPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      radius: 200,
      upperPercent: 100
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
          <a href="https://deck.gl" target="_new">deck.gl</a>&nbsp;
          <a href="https://github.com/tortuca/maps-deckgl" target="_new">
              (code)</a>
        </p>
        <p>Data source: <a href="https://data.gov.sg">DATA.GOV.SG</a></p>

        <div className="layout">
          <div className="stat">Timestamp:
            <b>{this.props.timestamp}</b></div>
          <div className="stat">Taxis:
            <b>{this.props.taxiCount}</b></div>
        </div>
        <hr/>
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
      </div>
    );
  }
}

export default OptionsPanel;
