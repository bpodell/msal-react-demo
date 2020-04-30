import React from 'react';
import './App.css';
import AuthProvider from './AuthProvider';

class App extends React.Component {

  render() {
    console.log('props', this.props)
      return (
          <div>
              <section>
                  <h1>
                      Welcome to the Microsoft Authentication Library For
                      Javascript - React Quickstart
                  </h1>
                  {!this.props.account ? 
                      <button onClick={this.props.onSignIn}>Sign In</button>
                    : <button onClick={this.props.onSignOut}>Sign Out</button>
                  }
                  {this.props.error && (
                      <p className="error">Error: {this.props.error}</p>
                  )}
              </section>
              <section className="data">
                  {this.props.account && (
                      <div className="data-account">
                          {/* <h2>{this.props.account}</h2> */}
                      </div>
                  )}
              </section>
          </div>
      );
  }
}

export default AuthProvider(App);
