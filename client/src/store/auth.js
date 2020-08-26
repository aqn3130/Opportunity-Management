import axios from '../plugins/axios';
import router from "../router";
export default {
    namespaced: true,
    state: {
        username: null,
        password: null,
        token: null,
        loginError: null
    },
    mutations: {
        setUsername(state,username){
            state.username = username;
        },
        setPassword(state,password){
            state.password = password;
        },
        setToken(state, token){
            state.token = token;
        },
        setError(state, error){
            state.loginError = error;
        }
    },
    actions: {
        login({ commit, state }){
            axios({
                method: 'post',
                url: `auth/login`,
                data: {
                    username: state.username,
                    password: state.password
                }
            }).then(function ({ data }) {
                if (data.token){
                    commit('setToken',data.token);
                } else {
                    commit('setError', data.message);
                }
            }).catch(function (error) {
                console.log(error);
            }).finally(function () {
                if (state.token){
                    router.push('/dashboard');
                }
            })
        }
    }
}