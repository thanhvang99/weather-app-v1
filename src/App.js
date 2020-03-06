import React, { Component } from "react";
import Provider, { WeatherConsumer } from "./Context";
import "./App.sass";

class App extends Component {
  state = {
    cityInput: "",
    stateInput: ""
  };

  async getWeather(dispatch) {
    let res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${this.state.cityInput},${this.state.stateInput}&appid=${process.env.REACT_APP_API_KEY}`
    );
    // let res = await fetch('./simulation.json');
    let city_weather = await res.json();
    let payload = {};
    if (city_weather.cod == "404") {
      payload = {
        err: city_weather.cod
      };
    } else {
      const conditions = city_weather.weather
        .map(weather => weather.main)
        .join(", ");
      payload = {
        location: `${city_weather.name}, ${city_weather.sys.country}`,
        temperature: city_weather.main.temp,
        humidity: city_weather.main.humidity,
        // err: city_weather.cod,
        conditions
      };
    }
    dispatch({
      type: "FIND_WEATHER",
      payload
    });
  }
  handleSubmit(dispatch, e) {
    e.preventDefault();
    this.getWeather(dispatch);
    this.setState({
      cityInput: "",
      stateInput: ""
    });
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  render() {
    return (
      <Provider>
        <div className="container">
          <div className="img-wrapper">
            <div className="title">Weather Finder</div>
            <div className="subtitle">
              Find out the temperature, weather conditions and more
            </div>
          </div>
          <div className="content">
            <WeatherConsumer>
              {value => {
                const {
                  location,
                  temperature,
                  humidity,
                  conditions,
                  err
                } = value;
                return (
                  <React.Fragment>
                    <form
                      className="input-group"
                      onSubmit={this.handleSubmit.bind(this, value.dispatch)}
                    >
                      <input
                        type="text"
                        placeholder="City"
                        value={this.state.cityInput}
                        name="cityInput"
                        onChange={this.handleChange.bind(this)}
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={this.state.stateInput}
                        name="stateInput"
                        onChange={this.handleChange.bind(this)}
                      />
                      <button className="btn" type="submit">Get weather</button>
                    </form>
                    {err == "404" ? (
                      <NotFound />
                    ) : (
                      <div className="results">
                        <div>
                          <span className="red-color-text">Location:</span>
                          {location}
                        </div>
                        <div>
                          <span className="red-color-text">Temperature:</span>
                          {temperature}
                        </div>
                        <div>
                          <span className="red-color-text">Humidity:</span>
                          {humidity}
                        </div>
                        <div>
                          <span className="red-color-text">Conditions:</span>
                          {conditions}
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              }}
            </WeatherConsumer>
          </div>
        </div>
      </Provider>
    );
  }
}
const NotFound = () => {
  return <div>Not Found</div>;
};

export default App;
