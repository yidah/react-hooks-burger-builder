import React, { useState, useEffect } from 'react';
import Modal from '../../components/UI/Modal/Modal';
import Auxi from '../Auxi/Auxi';

const withErrorHandler = (WrappedComponent, axios) => {
  // anonymous functional component
  return (props) => {
    const [error, setError] = useState(null);

    // this code executes before the content is rendered

    const reqInterceptor = axios.interceptors.request.use((request) => {
      // clean up error for future requests
      setError(null);
      return request;
    });
    const resInterceptor = axios.interceptors.response.use(
      (response) => response,
      (err) => {
        setError(err);
      }
    );

    // this code is run when a component is being removed from the DOM
    // when using the clean up function of useEffect
    // as we will be using withErrorHandler component
    // in different components, this will create
    // memory leaks so we need to eject interceptors
    // once are not needed
    useEffect(() => {
      return () => {
        axios.interceptors.request.eject(reqInterceptor);
        axios.interceptors.response.eject(resInterceptor);
      };
    }, [reqInterceptor,resInterceptor]);

    const errorConfirmedHandler = () => {
      setError(null);
    };

    return (
      <Auxi>
        <Modal show={error} modalClosed={errorConfirmedHandler}>
          {error ? error.message : null}
        </Modal>
        <WrappedComponent {...props} />
      </Auxi>
    );
  };
};

export default withErrorHandler;
