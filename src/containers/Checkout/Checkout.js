import React, { Component } from 'react';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import { Route, Redirect } from 'react-router-dom';
import ContactData from './ContactData/ContactData';
import { connect } from 'react-redux';

class Checkout extends Component {
  // state = {
  //   ingredients: null,
  //   price:0
  // };

  // // Before we render the child component
  // componentWillMount(){

  //     // const query =new URLSearchParams(this.props.location.search);
  //     // const ingredients ={};
  //     // let price=0;
  //     // for(let param of query.entries()){
  //     //     // query.entries method converts our query search paramaters (http://localhost:3000/checkout?bacon=1&cheese=1&meat=1&salad=5)
  //     //     // in key value arrays something like this:
  //     //       // (2) ["bacon", "1"]
  //     //       // (2) ["cheese", "1"]
  //     //       // (2) ["meat", "1"]
  //     //       // (2) ["salad", "5"]
  //     //     //console.log(param);
  //     //     if(param[0]==='price'){
  //     //         price = param[1];

  //     //     }else{
  //     //       ingredients[param[0]] = +param[1];
  //     //     }
  //     // }
  //     // this.setState({ingredients: ingredients, totalPrice:price});

  // }
  
  checkoutCancelledHandler = () => {
    // Goes back to the last page
    this.props.history.goBack();
  };
  checkoutContinuedHandler = () => {
    this.props.history.replace('/checkout/contact-data');
  };
  render() {
    let summary = <Redirect to="/" />;
    if (this.props.ings) {
      const purchaseRedirect = this.props.purchased ? <Redirect to="/" />: null
      summary = (
        <div>
          {purchaseRedirect}
          <CheckoutSummary
            ingredients={this.props.ings}
            checkoutCancelled={this.checkoutCancelledHandler}
            checkoutContinued={this.checkoutContinuedHandler}
          />

          <Route
            path={this.props.match.path + '/contact-data'}
            component={ContactData}
          />
        </div>
      );
    }
    return summary;
  }
}

const mapStateToProps = (state) => {
  return {
    ings: state.burgerBuilder.ingredients,
    purchased: state.order.purchased
  };
};


export default connect(mapStateToProps)(Checkout);
