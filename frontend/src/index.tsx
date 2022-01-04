import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {BrowserRouter as Router} from "react-router-dom";
import {ChakraProvider} from "@chakra-ui/react";
import store from "./store";
import {Provider} from "react-redux";
import {setCurrentUser} from "./store/auth";
import {setApis} from "./store/apis";
import {setRoles} from "./store/roles";

ReactDOM.render(
  <React.StrictMode>
      <Provider store={store}>
          <ChakraProvider>
              <Router>
                  <App/>
              </Router>
          </ChakraProvider>
      </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
store.dispatch(setCurrentUser())
