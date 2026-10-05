import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';

const RootRouter = (ChildRouter) => {
  return (
    class ParentRouter extends Component {
      render() {
        return (
          <BrowserRouter basename='/app'>
            <ChildRouter {...this.props} />
          </BrowserRouter>
        )
      }
    }
  )
}

export default RootRouter;