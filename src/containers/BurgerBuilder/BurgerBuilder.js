import React, { useCallback, useEffect, useState } from 'react';
import Auxi from '../../hoc/Auxi/Auxi';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
// import axios instance to post and order
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../store/actions/index';

const burgerBuilder = (props) => {
  const [purchasing, setPurchasing] = useState(false);

  // using Redux hooks
  const dispatch = useDispatch();

  const ing = useSelector((state) => {
    return state.burgerBuilder.ingredients;
  });
  const tPrice = useSelector((state) => {
    return state.burgerBuilder.totalPrice;
  });
  const error = useSelector((state) => {
    return state.burgerBuilder.error;
  });
  const isAuthenticated = useSelector((state) => {
    return state.auth.token !== null;
  });

  const onIngredientAdded = (ingName) => dispatch(actions.addIngredient(ingName));
  const onIngredientRemoved = (ingName) => dispatch(actions.removeIngredient(ingName));
  // to avoid infinite loop for every re-render when we use it with useEffect 
  const onInitIngredients = useCallback (() => dispatch(actions.initIngredients()),[dispatch]);
  const onInitPruchase = () => dispatch(actions.purchaseInit());
  const onSetAuthRedirectPath = (path) =>  dispatch(actions.setAuthRedirectPath(path));

  useEffect(() => {
    onInitIngredients();
  }, [onInitIngredients]);

  const updatePurachaseableState = (ingredients) => {
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
    if (isAuthenticated) {
      setPurchasing(true);
    } else {
      // this is where the user should go after authenticating
      // this is also set in our navigation authenticate option if the user clicks there
      onSetAuthRedirectPath('/checkout');
      // history comes from React Router
      props.history.push('/auth');
    }
  };

  const purchaseCancelHandler = () => {
    setPurchasing(false);
  };

  const purchaseContinueHandler = () => {
    onInitPruchase();
    props.history.push('/checkout');
  };

  const disabledInfo = {
    ...ing,
  };

  for (let key in disabledInfo) {
    disabledInfo[key] = disabledInfo[key] <= 0;
  }

  let orderSummary = null;
  let burger = error ? <p>Ingredients cannot be loaded</p> : <Spinner />;

  // As we load ingredients dynamically from Firebase db we need to check if they have been downloaded
  if (ing) {
    burger = (
      <Auxi>
        <Burger ingredients={ing} />
        <BuildControls
          ingredientAdded={onIngredientAdded}
          ingredientRemoved={onIngredientRemoved}
          disabled={disabledInfo}
          purchaseable={updatePurachaseableState(ing)}
          ordered={purchaseHandler}
          isAuth={isAuthenticated}
          price={tPrice}
        />
      </Auxi>
    );
    orderSummary = (
      <OrderSummary
        ingredients={ing}
        price={tPrice}
        purchaseCancelled={purchaseCancelHandler}
        purchaseContinued={purchaseContinueHandler}
      />
    );
  }

  return (
    <Auxi>
      <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
        {orderSummary}
      </Modal>
      {burger}
    </Auxi>
  );
};

export default withErrorHandler(burgerBuilder, axios);
