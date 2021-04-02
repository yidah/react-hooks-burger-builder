import * as actionTypes from './actionsTypes'
import axios from '../../axios-orders';

export const purchaseBurgerSuccess =(id, orderData)=>{
    return{
        type: actionTypes.PURCHASE_BURGER_SUCCESS,
        orderId: id,
        orderData: orderData
    }
}

export const purchaseBurgerStart =()=>{
    return{
        type:actionTypes.PURCHASE_BURGER_START,
    }

}
export const purchaseBurger =(orderData, token)=>{
    return dispatch=>{
        dispatch(purchaseBurgerStart());
        axios.post('/orders.json?auth=' + token, orderData)
        .then((response) => {
          //console.log(response.data)
          dispatch(purchaseBurgerSuccess(response.data.name, orderData))
          
        })
        .catch((error) => {
            dispatch(purchaseBurgerFail(error))
        });


    }
}

export const purchaseBurgerFail =(error)=>{
    return{
        type: actionTypes.PURCHASE_BURGER_FAIL,
        error: error
    }
}

export const purchaseInit =()=>{
    return{
        type: actionTypes.PURCHASE_BURGER_INIT
    }
}

//Orders
export const fetchOrdersSuccess =(orders)=>{
    return{
        type: actionTypes.FETCH_ORDERS_SUCCESS,
        orders: orders
    }
}

export const fetchOrdersFail =(error)=>{
    return{
        type: actionTypes.FETCH_ORDERS_FAIL,
        error: error
    }
}

export const fetchOrdersStart=()=>{
    return{
        type:actionTypes.FETCH_ORDERS_START

    }
}

export const fetchedOrders=(token, userId)=>{
    return dispatch =>{
        dispatch(fetchOrdersStart());

        // orderBy another parameter understood by Firebase
        const queryParams = '?auth=' + token + '&orderBy="userId"&equalTo="' + userId + '"';
        axios.get('/orders.json' + queryParams)
        .then(res =>{
            // console.log(res.data);
            // Firebase objects
            // -MOHcRcNIpnCR661NEaX: {customer: {…}, deliveryMethod: "By moto", ingredients: {…}, price: "6.9"}
            // -MOHcaT4c90p68VKKSNi: {customer: {…}, deliveryMethod: "By moto", ingredients: {…}, price: "5.5"}
    
            // turning Order objects from Firebase into an array
            const fetchedOrders = [];
            for(let key in res.data){
                // In order to preserve the id (MOHcRcNIpnCR661NEaX) push a new object
                // where I distribute the properties from the FireBase object with the spread operator
                // and I add a new property id which is the key
                fetchedOrders.push({
                    ...res.data[key],
                    id:key})
            }
            dispatch(fetchOrdersSuccess(fetchedOrders));
        })
        .catch(err=>{
            dispatch(fetchOrdersFail(err));
        })
    }

}


