import React, { useEffect, useState } from 'react';
import Auxi from '../../hoc/Auxi/Auxi';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
// import axios instance to post and order
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import {connect} from 'react-redux'; 
import * as actions from '../../store/actions/index';



const burgerBuilder = (props)=> {

  const [purchasing, setPurchasing]=useState(false);

  useEffect(()=>{
    props.onInitIngredients();
  },[]);

  const updatePurachaseableState = (ingredients) =>{
    // arr.reduce(callback( accumulator, currentValue, [, index[, array]] )[, initialValue]) - we used:
    // arr.reduce(callback( sum (accumulator), el(currentValue)) =>{}, 0(initialValue))
    const sum = Object.keys(ingredients)
      .map((igKey) => {
        return ingredients[igKey];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);
    return sum > 0;
  };

  const purchaseHandler = () => {
    if(props.isAuthenticated){
      setPurchasing(true);
    }else{
      // this is where the user should go after authenticating 
      // this is also set in our navigation authenticate option if the user clicks there
      props.onSetAuthRedirectPath('/checkout');
      // history comes from React Router
      props.history.push('/auth');
    }
  };

 const purchaseCancelHandler = () => {
    setPurchasing(false);
  };

  const purchaseContinueHandler = () => {
    props.onInitPruchase();
    props.history.push('/checkout');
  };

  
    const disabledInfo = {
      ...props.ing,
    };

    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let orderSummary = null;
    let burger = props.error ? <p>Ingredients cannot be loaded</p> : <Spinner />;

    // As we load ingredients dynamically from Firebase db we need to check if they have been downloaded
    if (props.ing) {
      burger = (
        <Auxi>
          <Burger ingredients={props.ing} />
          <BuildControls
            ingredientAdded={props.onIngredientAdded}
            ingredientRemoved={props.onIngredientRemoved}
            disabled={disabledInfo}
            purchaseable={updatePurachaseableState(props.ing)}
            ordered={purchaseHandler}
            isAuth={props.isAuthenticated}
            price={props.tPrice}/>
        </Auxi>
      );
      orderSummary = ( 
        <OrderSummary
          ingredients={props.ing}
          price={props.tPrice}
          purchaseCancelled={purchaseCancelHandler}
          purchaseContinued={purchaseContinueHandler}/>
      );
    }

    return (
      <Auxi>
        <Modal
          show={purchasing}
          modalClosed={purchaseCancelHandler}>
          {orderSummary}
        </Modal>
        {burger}
      </Auxi>
    );
  
}

const mapStateToProps = state=>{
  return{
    ing: state.burgerBuilder.ingredients,
    tPrice: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error,
    isAuthenticated: state.auth.token !== null
  }
}
const mapDispatchToProps = dispatch=> {
  return{
    onIngredientAdded:(ingName) => dispatch(actions.addIngredient(ingName)),
    onIngredientRemoved:(ingName) => dispatch(actions.removeIngredient(ingName)),
    onInitIngredients:()=>dispatch(actions.initIngredients()),
    onInitPruchase:()=>dispatch(actions.purchaseInit()),
    onSetAuthRedirectPath:(path)=> dispatch(actions.setAuthRedirectPath(path))
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(burgerBuilder, axios));
