import { useState, useEffect } from 'react';

  export default httpClient => {
    const [error, setError] = useState(null);

    // this code executes before the content is rendered

    const reqInterceptor = httpClient.interceptors.request.use((request) => {
      // clean up error for future requests
      setError(null);
      return request;
    });
    const resInterceptor = httpClient.interceptors.response.use(
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
        httpClient.interceptors.request.eject(reqInterceptor);
        httpClient.interceptors.response.eject(resInterceptor);
      };
    }, [reqInterceptor,resInterceptor]);

    const errorConfirmedHandler = () => {
      setError(null);
    };

    return [error, errorConfirmedHandler];
}