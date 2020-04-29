import React from 'react';
import './App.css';

function App(props) {
      return (
          <div>
              <section>
                  <h1>
                      Welcome to the Microsoft Authentication Library For
                      Javascript - React Quickstart
                  </h1>
                  {!props.account ? (
                      <button onClick={props.onSignIn}>Sign In</button>
                  ) : (
                      
                          <button onClick={props.onSignOut}>
                              Sign Out
                          </button>
                      
                  )}
                  {props.error && (
                      <p className="error">Error: {props.error}</p>
                  )}
              </section>
              <section className="data">
                  {props.account && (
                      <div className="data-account">
                          <h2>{props.account}</h2>
                      </div>
                  )}
              </section>
          </div>
      );
}

export default App;
