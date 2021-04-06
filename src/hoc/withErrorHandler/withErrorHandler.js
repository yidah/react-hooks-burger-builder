import React from 'react';
import Modal from '../../components/UI/Modal/Modal';
import Auxi from '../Auxi/Auxi';
import useHttpErrorHandler from '../../hooks/http-error-handler';

const withErrorHandler = (WrappedComponent, axios) => {
  return (props) => {
    const [error, clearError] = useHttpErrorHandler(axios);

    return (
      <Auxi>
        <Modal show={error} modalClosed={clearError}>
          {error ? error.message : null}
        </Modal>
        <WrappedComponent {...props} />
      </Auxi>
    );
  };
};

export default withErrorHandler;
