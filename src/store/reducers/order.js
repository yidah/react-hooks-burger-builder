import * as actionTypes from '../actions/actionsTypes';
import {updateObject} from '../../shared/utility';

const initialState = {
  orders: [],
  loading: false,
  purchased: false,
};

const purchaseInit =(state, action)=>{
  return updateObject(state, {purchased: false });
}
const purchaseStart =(state, action)=>{
  return updateObject(state, {loading: true });
}
const purchaseSuccess =(state, action)=>{
  // merging the id and the orderData I received from the action creators
  const newOrder = updateObject(action.orderData,{id: action.OrderId});
  return updateObject(state, {
    loading: false,
    purchased: true,
    orders: state.orders.concat(newOrder),
  });
}
const purchaseFail =(state, action)=>{
  return updateObject(state, {loading: false});
}
const fetchOrdersStart =(state, action)=>{
  return updateObject(state, {loading: true});
}
const fetchOrdersSuccess =(state, action)=>{
  return updateObject(state, {
    orders: action.orders,
    loading: false,
  });
}
const fetchOrdersfail =(state, action)=>{
  return updateObject(state,{loading: false});
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.PURCHASE_BURGER_INIT: return purchaseInit(state, action);
    case actionTypes.PURCHASE_BURGER_START: return purchaseStart(state,action);
    case actionTypes.PURCHASE_BURGER_SUCCESS:return purchaseSuccess(state,action);
    case actionTypes.PURCHASE_BURGER_FAIL:return purchaseFail(state,action);
    //Orders
    case actionTypes.FETCH_ORDERS_START:return fetchOrdersStart(state,action); 
    case actionTypes.FETCH_ORDERS_SUCCESS: return fetchOrdersSuccess(state,action); 
    case actionTypes.FETCH_ORDERS_FAIL:return fetchOrdersfail(state, action);
    default:
      return state;
  }
};

export default reducer;
