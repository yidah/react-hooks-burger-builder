import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
// import axios instance to post and order
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import { connect } from 'react-redux';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as orderActions from '../../../store/actions/index';
import { updateObject, checkValidity } from '../../../shared/utility';


class ContactData extends Component {
  state = {
    orderForm: {
      name: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your Name',
        },
        value: '',
        validation:{
          required:true
        },
        valid:false,
        touched:false
      },
      street: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Street',
        },
        value: '',
        validation:{
          required:true
        },
        valid:false,
        touched:false
      },
      zipCode: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'ZIP Code',
        },
        value: '',
        validation:{
          required:true,
          minLength:5,
          maxLength:5
        },
        valid:false,
        touched:false
      },
      country: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Country',
        },
        value: '',
        validation:{
          required:true
        },
        valid:false,
        touched:false
      },
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Your E-mail',
        },
        value: '',
        validation:{
          required:true
        },
        valid:false,
        touched:false
      },
      deliveryMethod: {
        elementType: 'select',
        elementConfig: {
          options: [
            { value: 'fastest', displayValue: 'Fastest' },
            { value: 'cheapest', displayValue: 'Cheapest' },
          ],
        },
        value: 'fastest',
        validation:{},        
        valid:true
      },
    },
    formIsValid:false,
  };

  orderHandler = (event) => {
    event.preventDefault();
    // console.log(this.props.ingredients);
    // Enables spinner
    // this.setState({ loading: true });

    const formData={};
    for(let formElementIdentifier in this.state.orderForm){
      formData[formElementIdentifier]= this.state.orderForm[formElementIdentifier].value;
    }
    // console.log(formData);
    const order = {
      ingredients: this.props.ings,
      price: this.props.price,
      orderData:formData,
      userId:this.props.userId
    };

    // console.log(order);
    // handled with action creators and redux-thunk 
    this.props.onOrderBurger(order, this.props.token);
    
    // // Firebase uses a MongoDB structure, so we do not have tables but json like nested structure
    // // the syntax below create orders node and store orders beneath the node
    // // .json is for Firebase only
    // axios
    //   .post('/orders.json', order)
    //   .then((response) => {
    //     //console.log(response)
    //     // stop spinner (loading) and hide modal (purchasing)
    //     this.setState({ loading: false });
    //     this.props.history.push('/');
    //   })
    //   .catch((error) => {
    //     // console.log(error)
    //     // stop spinner (loading) and hide modal (purchasing)
    //     this.setState({ loading: false });
    //   });
  };
  inputChangedHandler =(event, inputIdentifier)=>{
    // console.log(event.target.value); // checking if inputs get the onchange event when introducing something
    

    //USING UTILITY FUNCTION updateObject.
    const updatedFormElement = updateObject(this.state.orderForm[inputIdentifier], {
      value: event.target.value,
      valid: checkValidity(event.target.value, this.state.orderForm[inputIdentifier].validation),
      touched: true
    })

    const updatedOrderForm = updateObject(this.state.orderForm, {
      //inputIdentifier = control such as name,street etc
      [inputIdentifier]: updatedFormElement

    })

    // // NOT USING UTILITY FUNCTION updateObject. Cloning deeply orderForm object first level 
    // // (objects are reference values we do not want to change directly this.state.orderForm) 
    // const updatedOrderForm = {
    //   ...this.state.orderForm
    // }
    // // Cloning deeply orderForm object second level to reach value property
    // const updatedFormElement ={
    //   ...updatedOrderForm[inputIdentifier]
    // }

    // updatedFormElement.value= event.target.value;
    // updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation)
    // updatedFormElement.touched=true;

    // updatedOrderForm[inputIdentifier]=updatedFormElement;
    // console.log(updatedFormElement);
  
    let formIsValid =true;
    for(let inputIdentifier in updatedOrderForm){
      formIsValid= updatedOrderForm[inputIdentifier].valid && formIsValid;

    }

    // console.log(formIsValid);


    this.setState({orderForm:updatedOrderForm, formIsValid:formIsValid});

  }
  render() {
    // transforming form objects into an array so it is easy to handle
    const formElementsArray = [];
    for (let key in this.state.orderForm) {
      formElementsArray.push({
        id: key,
        config: this.state.orderForm[key],
      });
    }
    // console.log(formElementsArray);
    
    let form = (
      <form onSubmit={this.orderHandler}>
        {formElementsArray.map((formElement) => (
          <Input
            key={formElement.id}
            elementType={formElement.config.elementType}
            elementConfig={formElement.config.elementConfig}
            value={formElement.config.value}
            invalid={!formElement.config.valid}
            shouldValidate={formElement.config.validation}
            touched={formElement.config.touched}
            changed={(event)=>this.inputChangedHandler(event,formElement.id )}
          />
        ))}
        <Button btnType="Success" clicked={this.orderHandler} disabled={!this.state.formIsValid}>
          ORDER
        </Button>
      </form>
    );

    if (this.props.loading) {
      form = <Spinner />;
    }

    return (
      <div className={classes.ContactData}>
        <h4>Enter your Contact Data</h4>
        {form}
      </div>
    );
  }
}

const mapStateToProps = state=>{
  return{
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    loading: state.order.loading,
    token:state.auth.token,
    userId:state.auth.userId
  }
}

const mapDispatchToProps=dispatch=>{
  return{
    onOrderBurger: (orderData, token)=> dispatch(orderActions.purchaseBurger(orderData, token))
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(ContactData,axios));
