'use strict';
const Env = use('Env');
const Stage = Env.get('STAGE', 'dev');
const axios = use('axios');
const User = use('App/Models/User');

class AuthController {
  constructor(){
    this.ude_url = `https://hub.springer-sbm.com/${Stage}/ude/users/`;
    this.search_url = `https://hub.springer-sbm.com/${Stage}/ude/users/names?q=`;
    this.auth_url = `https://hub.springer-sbm.com/${Stage}/internal/auth`;
  }
  async login({ request, response, auth}) {
    const credentials = request.only(['username','password']);
    try {
      const { data } = await axios.post(this.auth_url, credentials);
      const currentUser = await User.findBy('email',data.email);
      if (currentUser) {
        // const newUser = new User();
        // newUser.username = data.username;
        // newUser.email = data.email;
        // await newUser.save();

        const { token } = await auth.generate(currentUser);
        return response.json({
          token: token
        });
      } else {
        return response.json({
          message: 'User does not exist, please contact your system admin'
        })
      }
    } catch (e) {
      console.log(e);
      return response.json({
        message: 'Incorrect username or password'
      });
    }
  }
  async fetchUsers({ request, response, auth}){
    const name = request.params.name;

    try{
      const { data } = await axios.get(`${this.search_url}${name}`);
      // console.log(data.names);
      return data.names;
    }catch (e) {
      console.log(e);
    }
  }
  async addUser({ request, response, auth }){
    const user = request.params.user;
    try {
      await axios({
        method: 'get',
        url: `${this.ude_url}${user}`
      }).then( async function ({ data }) {
        const user = new User();
        user.username = data.info[0].samaccountname;
        user.email = data.info[0].email;
        await user.save();
      }).catch(function (e) {
        console.log(e);
      })
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = AuthController;
