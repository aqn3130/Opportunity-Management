'use strict';
const axios = use('axios');
const User = use('App/Models/User');

class AuthController {
  constructor(){
    this.ude_url = `https://hub.springer-sbm.com/live/ude/users`;
    this.search_url = `https://hub.springer-sbm.com/live/ude/users/names?q=`;
    this.auth_url = `https://hub.springer-sbm.com/live/internal/auth`;
  }

  /*
  * login implementation
   */
  async login({ request, response, auth }) {
    let credentials = request.only(['username','password']);
    credentials['_system'] = 'plm'
    const salesReps = await request.Knex.table('SalesRep').select('Email', 'Full_Name');

    try {
      const { data } = await axios.post(this.auth_url, credentials);
      const currentUser = await User.findBy('email',data.email);
      response.implicitEnd = false;
      if (currentUser) {
        return await this.authenticate(auth, currentUser, response);
      }
      else if (this.isSalesRep(salesReps, data.email)){
        try {
          if ( data.username ) {
            request.params.user = data.username;
            await this.addUser({ request })
          } else {
            const user = new User();
            user.email = data.email;
            await user.save();
          }
          const currentUser = await User.findBy('email',data.email);
          return await this.authenticate(auth, currentUser, response);
        } catch (e) {
          console.log(e);
          return response.status(401).json({
            message: 'Can not register user, please contact your system admin'
          })
        }
      }
      else {
        return response.status(401).json({
          message: 'User does not exist, please contact your system admin'
        })
      }
    } catch (e) {
      console.log(e.response);
      if (e.response.status === 429) {
        return response.status(401).json({
          message: 'Too many failed attempts, please try later.'
        });
      } else if (e.response.status === 401) {
        return response.status(401).json({
          message: 'Incorrect username or password'
        });
      } else {
        return response.status(401).json({
          message: 'Login failed, please contact your system admin.'
        });
      }
    }
  }

  async authenticate(auth, currentUser, response) {
    const {token} = await auth.generate(currentUser, false, { expiresIn: '10h' });
    return response.json({
      token: token,
      user: currentUser
    });
  }

  isSalesRep(salesReps, currentUser) {
    let isUser = undefined;
    Object.keys(salesReps).forEach((key) => {
      if (salesReps[key].Email === currentUser) {
        isUser = salesReps[key];
      }
    });
    return isUser;
  }

  async getCurrentUser({ request, response, auth }){
    try {
      const user = await auth.getUser();
      const userPermissions = await user.getPermissions();
      const userRoles = await user.getRoles();
      const userAcc = {};
      userAcc.user = user.toJSON();
      userAcc.roles = userRoles;
      userAcc.permissions = userPermissions;
      return userAcc;
    } catch (e) {
      throw e;
    }
  }

  async fetchUsers({ request, response, auth}){
    const name = request.params.name;

    try{
      const { data } = await axios.get(`${this.search_url}${name}`);
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
