import React, { Component } from 'react';
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



export class BurgerBuilder extends Component {
  state = {
    purchasing: false
  };

  componentDidMount() {
    // Will handle this code in bugerBuilder.js action creators
    this.props.onInitIngredients();
    // axios
    //   .get(
    //     'https://react-kay-burger-builder-default-rtdb.firebaseio.com/Ingredients.json'
    //   )
    //   .then((response) => {
    //     this.setState({ ingredients: response.data });
    //   });
  }

  updatePurachaseableState(ingredients) {
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
  }

  purchaseHandler = () => {
    if(this.props.isAuthenticated){
      this.setState({ purchasing: true });
    }else{
      // this is where the user should go after authenticating 
      // this is also set in our navigation authenticate option if the user clicks there
      this.props.onSetAuthRedirectPath('/checkout');
      // history comes from React Router
      this.props.history.push('/auth');
    }
  };

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  };

  purchaseContinueHandler = () => {
    this.props.onInitPruchase();
    this.props.history.push('/checkout');

    // const queryParams = [];
    // for(let i in this.state.ingredients){
    //   // encodes element so this can be used in a URL
    //   queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
    // }
    // queryParams.push('price=' + this.state.totalPrice);
    // const queryString = queryParams.join('&');

    // // This will create something like this http://localhost:3000/checkout?bacon=1&cheese=1&meat=0&salad=1
    // this.props.history.push({
    //   pathname:'/checkout',
    //   search:'?' + queryString
    // });
  };

  render() {
    const disabledInfo = {
      ...this.props.ing,
    };

    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let orderSummary = null;
    let burger = this.props.error ? <p>Ingredients cannot be loaded</p> : <Spinner />;

    // As we load ingredients dynamically from Firebase db we need to check if they have been downloaded
    if (this.props.ing) {
      burger = (
        <Auxi>
          <Burger ingredients={this.props.ing} />
          <BuildControls
            ingredientAdded={this.props.onIngredientAdded}
            ingredientRemoved={this.props.onIngredientRemoved}
            disabled={disabledInfo}
            purchaseable={this.updatePurachaseableState(this.props.ing)}
            ordered={this.purchaseHandler}
            isAuth={this.props.isAuthenticated}
            price={this.props.tPrice}/>
        </Auxi>
      );
      orderSummary = ( 
        <OrderSummary
          ingredients={this.props.ing}
          price={this.props.tPrice}
          purchaseCancelled={this.purchaseCancelHandler}
          purchaseContinued={this.purchaseContinueHandler}/>
      );
    }

    return (
      <Auxi>
        <Modal
          show={this.state.purchasing}
          modalClosed={this.purchaseCancelHandler}>
          {orderSummary}
        </Modal>
        {burger}
      </Auxi>
    );
  }
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

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));
