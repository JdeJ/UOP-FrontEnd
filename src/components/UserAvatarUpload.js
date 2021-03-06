import React, { Component } from 'react';
import firebase from 'firebase/app';
import 'firebase/storage';
import { toast } from 'react-toastify';

import {errorTypes} from "../constants/constants";

firebase.initializeApp({ 
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_DATABASEURL,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_APPID
})


class UserAvatarUpload extends Component {
  state = {
    uploaded: 0,
  }

  handleFileChange (e) {
    const file = e.target.files[0];
    const storageRef = firebase.storage().ref(`${this.props.type}/${Date.now()} - ${this.props.name}`);
    const task = storageRef.put(file);

    task.on('state_changed', 
      (snapshot) => {
        this.setState({
          uploaded: Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
        })
      }, 
      (error) => {
        toast.error(`Sorry. ${errorTypes.E600U}`, {
          position: toast.POSITION.BOTTOM_RIGHT
        });
      }, 
      () => {
        task.snapshot.ref.getDownloadURL().then((newUrl) => {
          this.props.updateFunction(newUrl);
          this.setState({
            uploaded: 0,
          })
        })
      }
    )
  }

  render () {
    const {uploaded} = this.state.uploaded;
    return (
      <div className="d-flex justify-content-center profile-update-img">
        <label className="cnt-pos profile-upload-img" style={{ backgroundImage: `url(${this.props.actualImg})`}}>
          Edit
          <input type="file" style={{display: 'none'}} onChange={this.handleFileChange.bind(this)} />
          { (uploaded < 100) && <progress value={uploaded} max='100' style={{backgroundColor: 'blue'}}>{uploaded} %</progress> }
        </label>
      </div>

    )
  }
}

export default UserAvatarUpload