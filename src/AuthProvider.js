import React, { Component } from "react";
import {
    loginRequest
} from "./auth-utils";
import msalApp from './MsalApp';

// If you support IE, our recommendation is that you sign-in using Redirect APIs
// const useRedirectFlow = isIE();
// const useRedirectFlow = true;

export default C =>
    class AuthProvider extends Component {
        constructor(props) {
            super(props);

            this.state = {
                account: null,
            };
        }

        // async acquireToken(request, redirect) {
        //     return msalApp.acquireTokenSilent(request).catch(error => {
        //         // Call acquireTokenPopup (popup window) in case of acquireTokenSilent failure
        //         // due to consent or interaction required ONLY
        //         if (requiresInteraction(error.errorCode)) {
        //             return redirect
        //                 ? msalApp.acquireTokenRedirect(request)
        //                 : msalApp.acquireTokenPopup(request);
        //         } else {
        //             console.error('Non-interactive error:', error.errorCode)
        //         }
        //     });
        // }

        async onSignIn(redirect) {
            if (redirect) {
                return msalApp.loginRedirect(loginRequest);
            }

            const loginResponse = await msalApp
                .loginPopup(loginRequest)
                .catch(error => {
                    this.setState({
                        error: error.message
                    });
                });

            if (loginResponse) {
                this.setState({
                    account: loginResponse.account,
                    error: null
                });

                const tokenResponse = await this.acquireToken(
                    loginRequest
                ).catch(error => {
                    this.setState({
                        error: error.message
                    });
                });

                // if (tokenResponse) {
                //     const graphProfile = await fetchMsGraph(
                //         GRAPH_ENDPOINTS.ME,
                //         tokenResponse.accessToken
                //     ).catch(() => {
                //         this.setState({
                //             error: "Unable to fetch Graph profile."
                //         });
                //     });

                //     if (graphProfile) {
                //         this.setState({
                //             graphProfile
                //         });
                //     }

                //     if (tokenResponse.scopes.indexOf(GRAPH_SCOPES.MAIL_READ) > 0) {
                //         return this.readMail(tokenResponse.accessToken);
                //     }
                // }
            }
        }

        onSignOut() {
            msalApp.logout();
        }

        // async onRequestEmailToken() {
        //     const tokenResponse = await this.acquireToken(
        //         GRAPH_REQUESTS.EMAIL,
        //         useRedirectFlow
        //     ).catch(e => {
        //         this.setState({
        //             error: "Unable to acquire access token for reading email."
        //         });
        //     });

        //     if (tokenResponse) {
        //         return this.readMail(tokenResponse.accessToken);
        //     }
        // }

        // async readMail(accessToken) {
        //     const emailMessages = await fetchMsGraph(
        //         GRAPH_ENDPOINTS.MAIL,
        //         accessToken
        //     ).catch(() => {
        //         this.setState({
        //             error: "Unable to fetch email messages."
        //         });
        //     });

        //     if (emailMessages) {
        //         this.setState({
        //             emailMessages,
        //             error: null
        //         });
        //     }
        // }

        async componentDidMount() {
            msalApp.handleRedirectCallback(error => {
                if (error) {
                    const errorMessage = error.errorMessage ? error.errorMessage : "Unable to acquire access token.";
                    // setState works as long as navigateToLoginRequestUrl: false
                    this.setState({
                        error: errorMessage
                    });
                }
            });

            const account = msalApp.getAccount();

            this.setState({
                account
            });

            // if (account) {
            //     const tokenResponse = await this.acquireToken(
            //         loginRequest,
            //         useRedirectFlow
            //     );

            //     if (tokenResponse) {
            //         const graphProfile = await fetchMsGraph(
            //             GRAPH_ENDPOINTS.ME,
            //             tokenResponse.accessToken
            //         ).catch(() => {
            //             this.setState({
            //                 error: "Unable to fetch Graph profile."
            //             });
            //         });

            //         if (graphProfile) {
            //             this.setState({
            //                 graphProfile
            //             });
            //         }

            //         if (tokenResponse.scopes.indexOf(GRAPH_SCOPES.MAIL_READ) > 0) {
            //             return this.readMail(tokenResponse.accessToken);
            //         }
            //     }
            // }
        }

        render() {
            return (
                <C
                    {...this.props}
                    account={this.state.account}
                    emailMessages={this.state.emailMessages}
                    error={this.state.error}
                    graphProfile={this.state.graphProfile}
                    onSignIn={() => this.onSignIn()}
                    onSignOut={() => this.onSignOut()}
                    onRequestEmailToken={() => this.onRequestEmailToken()}
                />
            );
        }
    };