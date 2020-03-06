import React,{Component} from 'react';

const WeatherContext = React.createContext()

const reducer = (state,action) => {
    const {location,temperature,humidity,conditions,err} = action.payload;
    switch (action.type){
        case "FIND_WEATHER":
            return{
                ...state,
                location,
                temperature,
                humidity,
                conditions,
                err,
            };
        default:
            return "";
    }
}
export default class Provider extends Component{
    state = {
        location: "",
        temperature: "",
        humidity: "",
        conditions: "",
        err: "",
        dispatch: (action) => this.setState( (state) => reducer(state,action) )
    }
    render(){
        return(
            <WeatherContext.Provider value={this.state}>
                {this.props.children}
            </WeatherContext.Provider>
        )
    }
}

const WeatherConsumer = WeatherContext.Consumer;

export {WeatherContext,WeatherConsumer}
