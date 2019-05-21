import React, {Component} from 'react';
import { inject, observer } from 'mobx-react';

import {spinnerTypes} from "../constants/constants";

import { withAuth } from '../lib/AuthProvider';

import Spinner from "../components/Spinner";
import Navbar from "../components/Navbar";
import InMyZoneUser from "../components/InMyZoneUser";
import InMyZoneUopers from "../components/InMyZoneUopers";

@inject('appStore')
@observer
class InMyZone extends Component {
  state = {
    isLoading: true,
    nearUopers: null,
  }
  
  componentDidMount() {
    this.props.appStore.inMyZone(this.props.user._id);
  }

  render() {
    return (
      <>
        <Navbar {...this.props}/>
        { (this.props.appStore.nearUopers === null) ? 
          <Spinner type={spinnerTypes.SPIN} color={"black"} />
          : 
            <div className="container nav-after d-flex flex-wrap">
              <div className="your-profile mb-2">
                <div className="profile-title mt-2 mb-2">
                  <h2 className="tertiary-color">In My Zone</h2> 
                </div>
                <InMyZoneUser nearUopers={this.props.appStore.nearUopers.toJS()}/>
              </div>
              <div className="your-opinions">
                <h2 className="profile-title pt-3 tertiary-color mb-2">Uopers around you</h2>
                <div className="container d-flex flex-wrap">
                  {this.props.appStore.nearUopers.toJS().map((uoper, index)=> {
                    if (uoper.username !== this.props.user.username){
                      return <InMyZoneUopers key={index} user={uoper} />
                    }
                  })}
                </div>
              </div>
            </div>              
        } 
      </>
    );
  }
}

export default withAuth(InMyZone);