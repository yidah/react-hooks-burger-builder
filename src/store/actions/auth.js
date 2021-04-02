import axios from 'axios';
import * as actionTypes from './actionsTypes';

export const authStart = ()=>{
    return{
        type:actionTypes.AUTH_START
    }
}

export const authSuccess = (token, userId)=>{
    return{
        type:actionTypes.AUTH_SUCCESS,
        idToken:token,
        userId:userId
    }
}

export const authFail = (error)=>{
    return{
        type:actionTypes.AUTH_FAIL,
        error:error
    }
}

export const logout = () =>{
    // Eliminate invalid tokens
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');


    return{
        type:actionTypes.AUTH_LOGOUT,
    }
}

// ASYNC CODE ACTIONS
export const checkAuthTimeout =(expirationTime)=>{
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());            
        }, expirationTime * 1000); // *1000 to turn my seconds in milliseconds

    }
}

export const auth = (email, password, isSignup)=>{
    return dispatch=> {
        dispatch(authStart());
        const authData = {
            email:email,
            password:password,
            returnSecureToken:true
        }
        // console.log(authData);
        let url= 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyC1tP6nVnk_dn2XtoKFczcbnp40Y6HFJhQ';
        if(!isSignup){
            url='https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyC1tP6nVnk_dn2XtoKFczcbnp40Y6HFJhQ';

        }
        axios.post(url,authData)
        .then(response=>{
            // console.log(response)
            // we need to know when the token expires and only to know the seconds (response.data.expiresIn) is not enough 
            // response.data.expiresIn is given in seconds but JavaScript works in milliseconds
            const expirationDate = new Date (new Date().getTime() + response.data.expiresIn * 1000) // this will give use the current date plus seconds

            //Perisisting authenticated state in case user reloads the page. localStorage is built into JavaScript
            localStorage.setItem('token',response.data.idToken);
            localStorage.setItem('expirationDate', expirationDate);

            // storing user acount details to authenticated him after token expires. This can be requested with Firebase API
            localStorage.setItem('userId', response.data.localId);

            dispatch(authSuccess(response.data.idToken, response.data.localId))
            dispatch(checkAuthTimeout(response.data.expiresIn));
        })
        .catch(err=>{
            // console.log(err.response);
            dispatch(authFail(err.response.data.error));
        })
    }
}

export const setAuthRedirectPath =(path)=>{
    return{
        type:actionTypes.SET_AUTH_REDIRECT_PATH,
        path:path
    }
}

export const authCheckState = ()=>{
    return dispatch =>{
        const token = localStorage.getItem('token');
        if(!token){
            dispatch(logout());
        }else{
            // convet to date object
            const expirationDate = new Date (localStorage.getItem('expirationDate'));
            if(expirationDate <= new Date()){
                dispatch(logout());

            }else{
                const userId = localStorage.getItem('userId');
                dispatch(authSuccess(token, userId));
                // expire time in milliseconds
                dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime())/1000));
            }
        }

    }
}