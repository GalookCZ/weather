import React from 'react';

// mnou instalované packages 
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  closeWeather = () => {  // nastaví city na false a tím efektivně Weather element uzavře
    this.setState(() => {
      return {
        city: false
      }
    })
  }

  handleSubmit = () => {
    let mesto = document.getElementById('mesto').value

    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${mesto}&appid=0b80783471d1df6fc9d2475c563fa52b`) // pro http interakci využívá axios - standard, pošle get na OpenWeather
      .then((response) => {
        this.setState(() => {
          return {                                                                                // z API response vytáhne důležité údaje a uloží je do state 
            city: response.data.name,
            humidity: response.data.main.humidity + '%',
            temperature: Math.round(response.data.main.temp - 273.15) + "° Celsius",
            icon: `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png` 
          }
        })
        
        
      })
      .catch((error) => {                                                             // Pro případ chyby ze strany API napíše důvod, v případě 404 v češtině
        if (error.response.status == 404) this.setState(() => {
          return {
            city: "Nepodařilo se najít Vámi zadané město.",
            humidity: error.response.data.message,
            temperature: error.response.data.cod,
            icon: "https://cdn1.iconfinder.com/data/icons/ios-11-glyphs/30/error-128.png"
          }
        })
        else this.setState(() => {
          return {
            city: "Vyskytla se neočekávaná chyba.",
            humidity: error.response.data.message,
            temperature: error.response.data.cod,
            icon: "https://cdn1.iconfinder.com/data/icons/ios-11-glyphs/30/error-128.png"
          }
        })

      });

  };
  render() {
    return (
      <div className="App">
        <h1>Weather for everyone</h1>
        <h5>Enter your city name to see its current weather.</h5>
        <Form.Group className="mainForm">
          <Form.Label>
            City:
        <Form.Control type="text" id="mesto" placeholder="Enter the city name" />
          </Form.Label>
          <br />
          <Button onClick={this.handleSubmit} >Submit</Button>
        </Form.Group>
        <br />
        {this.state.city && <WeatherBar cityName={this.state.city} humidity={this.state.humidity} temperature={this.state.temperature} icon={this.state.icon} close={this.closeWeather}/>}
      </div>
    );
  }
}

class WeatherBar extends React.Component {
  render() {
    return (
      <div className="Emphasized">
        <img src={this.props.icon} alt="Weather Icon" />
        <h1> {this.props.cityName} </h1> <br />
        <h4>Humidity: <p>{this.props.humidity}</p> </h4> <br />
        <h4>Temperature: <p>{this.props.temperature}</p> </h4> <br />
        <Button onClick={this.props.close}>Close</Button>
      </div>
    )
  }
}

export default App;
