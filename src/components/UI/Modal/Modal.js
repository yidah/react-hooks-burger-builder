import React from 'react';
import classes from './Modal.css';
import Auxi from '../../../hoc/Auxi/Auxi';
import Backdrop from '../Backdrop/Backdrop';
// using class components here to use "shouldcomponentupdate" update life cycle 
// to make sure that Model does not updates unnecessarily nor the <OrderSummary/> wrapped component 

const modal =(props)=>{

  // now <OrderSummary/> updates only when the modal is displayed
  // nextProps.children - to check if spinner should be display
  // shouldComponentUpdate(nextProps, nextState){
  //   return nextProps.show !== props.show || nextProps.children !== props.children;
  // }

    return(  <Auxi>
      <Backdrop show={props.show} clicked={props.modalClosed} />
      <div
        className={classes.Modal}
        style={{
          transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
          opacity: props.show ? '1' : '0',
        }}
      >
        {props.children}
      </div>
    </Auxi>)

}

// With hooks if you want to check if only certain properties change not all we use memo 
// with its own comparison function like this
export default React.memo(modal,(prevProps, nextProps)=>nextProps.show === prevProps.show && nextProps.children === prevProps.children);
