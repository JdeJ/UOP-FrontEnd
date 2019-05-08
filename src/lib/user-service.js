import axios from 'axios';

class User {
  constructor() {
    this.userConnect = axios.create({
      baseURL: process.env.REACT_APP_URL,
      withCredentials: true,
    });
  }

  user(id) {
    return this.userConnect
      .get(`users/${id}`)
      .then(({ data }) => data)
  }
}

const userService = new User();

export default userService;
