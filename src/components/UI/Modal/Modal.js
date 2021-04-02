import React, { Component } from 'react';
import classes from './Modal.css';
import Auxi from '../../../hoc/Auxi/Auxi';
import Backdrop from '../Backdrop/Backdrop';
// using class components here to use "shouldcomponentupdate" update life cycle 
// to make sure that Model does not updates unnecessarily nor the <OrderSummary/> wrapped component 

class Modal extends Component{
  // now <OrderSummary/> updates only when the modal is displayed
  // nextProps.children - to check if spinner should be display
  shouldComponentUpdate(nextProps, nextState){
    return nextProps.show !== this.props.show || nextProps.children !== this.props.children;
  }
  // to confirm that this works we use comp
  componentWillUpdate(){
    // console.log('[Modal] WillUpdate')
  }
  render(){
    return(  <Auxi>
      <Backdrop show={this.props.show} clicked={this.props.modalClosed} />
      <div
        className={classes.Modal}
        style={{
          transform: this.props.show ? 'translateY(0)' : 'translateY(-100vh)',
          opacity: this.props.show ? '1' : '0',
        }}
      >
        {this.props.children}
      </div>
    </Auxi>)
  }
}


export default Modal;
