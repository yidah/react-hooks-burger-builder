import React, { Component } from 'react';
import Modal from '../../components/UI/Modal/Modal';
import Auxi from '../Auxi/Auxi';

const withErrorHandler = (WrappedComponent, axios) => {
  return class extends Component {
    state = {
      error: null,
    };

    // componentDidMount works for posts requests but not get as this function executes once the components are rendered
    // we will use use componentWillMount but as this will be removed in the future this actions can be done in the class
    // constructor
    componentWillMount() {
      this.reqInterceptor=axios.interceptors.request.use((request) => {
        // clean up error for future requests
        this.setState({ error: null });
        return request;
      });
      this.resInterceptor=axios.interceptors.response.use(response => response, (error) => {
        this.setState({ error: error });
      });
    }

    // as we will be using withErrorHandler component 
    // in different components, this will create 
    // memory leaks so we need to eject interceptors 
    // once are not needed
    componentWillUnmount(){//This method is called when a component is being removed from the DOM
      // console.log('Will Unmount', this.reqInterceptor, this.resInterceptor); //console for TEST ONLY
      axios.interceptors.request.eject(this.reqInterceptor);
      axios.interceptors.response.eject(this.resInterceptor);
    }

    errorConfirmedHandler = () => {
      this.setState({ error: null });
    };

    render() {
      return (
        <Auxi>
          <Modal show={this.state.error} 
                 modalClosed={this.errorConfirmedHandler}>
            {this.state.error ? this.state.error.message:null}
          </Modal>
          <WrappedComponent {...this.props} />
        </Auxi>
      );
    }
  };
};

export default withErrorHandler;
