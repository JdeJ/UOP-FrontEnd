import React, { Component } from "react";

import opinionService from "../../lib/opinion-service";
import Question from './Question';

class Opinions extends Component {
  state = {
    isLoading: true,
    opinions: []
  }

  componentDidMount() {
    opinionService.all()
      .then((ops) => {
        this.setState({
          isLoading: false,
          opinions: [...ops]
        }) 
      })
      .catch((error)=> {
        console.log("Couldn't get the opinions");
        console.log(error);
      });
  }


  // TODO Cambiar el loading por un spinner
  render() {
    console.log(this.props)
    const { isLoading, opinions } = this.state
    return (
      <>
        { isLoading ? 'Loading...' : (
          opinions.map((opinion, index) => 
            <Question key={index} {...opinion}/>
          )
          )
        }
      </>
    );
  }
}

export default Opinions