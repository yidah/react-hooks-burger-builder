import reducer from './auth';
import * as actionTypes from '../actions/actionsTypes';


describe('auth reducer', ()=>{
    it('should return the initiall state', ()=>{
        // undefined - case when state is just getting set up at the beggining of our app
        // {} -  no specific action
        expect(reducer(undefined,{})).toEqual({
            token:null,
            userId:null,
            error:null,
            loading: false,
            authRedirectPath:'/'
        });
    });

    it('should store the token upon login ', ()=>{
        // undefined - case when state is just getting set up at the beggining of our app
        // {} -  no specific action
        expect(reducer({
            token:null,
            userId:null,
            error:null,
            loading: false,
            authRedirectPath:'/'
        },{
            type: actionTypes.AUTH_SUCCESS,
            idToken:'some-token',
            userId:'some-user-id'
        })).toEqual({
            token:'some-token',
            userId:'some-user-id',
            error:null,
            loading: false,
            authRedirectPath:'/'
        });
    });

});
