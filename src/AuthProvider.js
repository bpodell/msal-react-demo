import React, { Component, useState } from "react";
import {
    msalApp,
    requiresInteraction,
    fetchMsGraph,
    isIE,
    GRAPH_ENDPOINTS,
    GRAPH_SCOPES,
    GRAPH_REQUESTS
} from "./auth-utils";

// If you support IE, our recommendation is that you sign-in using Redirect APIs
const useRedirectFlow = isIE();
// const useRedirectFlow = true;

const AuthProvider = (Component) => {
    const [account, setAccount] = useState();

        const  acquireToken = async (request, redirect) => {
            return msalApp.acquireTokenSilent(request).catch(error => {
                // Call acquireTokenPopup (popup window) in case of acquireTokenSilent failure
                // due to consent or interaction required ONLY
                if (requiresInteraction(error.errorCode)) {
                    return redirect
                        ? msalApp.acquireTokenRedirect(request)
                        : msalApp.acquireTokenPopup(request);
                } else {
                    console.error('Non-interactive error:', error.errorCode)
                }
            });
        }

        const onSignIn = async (redirect) => {
            if (redirect) {
                return msalApp.loginRedirect(GRAPH_REQUESTS.LOGIN);
            }

            const loginResponse = await msalApp
                .loginPopup(GRAPH_REQUESTS.LOGIN)
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
                    GRAPH_REQUESTS.LOGIN
                ).catch(error => {
                    this.setState({
                        error: error.message
                    });
                });

                if (tokenResponse) {
                    const graphProfile = await fetchMsGraph(
                        GRAPH_ENDPOINTS.ME,
                        tokenResponse.accessToken
                    ).catch(() => {
                        this.setState({
                            error: "Unable to fetch Graph profile."
                        });
                    });

                    if (graphProfile) {
                        this.setState({
                            graphProfile
                        });
                    }

                    if (tokenResponse.scopes.indexOf(GRAPH_SCOPES.MAIL_READ) > 0) {
                        return this.readMail(tokenResponse.accessToken);
                    }
                }
            }
        }

        const onSignOut = () => {
            msalApp.logout();
        }

        const onRequestEmailToken = async () => {
            const tokenResponse = await this.acquireToken(
                GRAPH_REQUESTS.EMAIL,
                useRedirectFlow
            ).catch(e => {
                this.setState({
                    error: "Unable to acquire access token for reading email."
                });
            });

            if (tokenResponse) {
                return this.readMail(tokenResponse.accessToken);
            }
        }

        const  readMail = async (accessToken) => {
            const emailMessages = await fetchMsGraph(
                GRAPH_ENDPOINTS.MAIL,
                accessToken
            ).catch(() => {
                this.setState({
                    error: "Unable to fetch email messages."
                });
            });

            if (emailMessages) {
                this.setState({
                    emailMessages,
                    error: null
                });
            }
        }

        // async componentDidMount() {
        //     msalApp.handleRedirectCallback(error => {
        //         if (error) {
        //             const errorMessage = error.errorMessage ? error.errorMessage : "Unable to acquire access token.";
        //             // setState works as long as navigateToLoginRequestUrl: false
        //             this.setState({
        //                 error: errorMessage
        //             });
        //         }
        //     });

        //     const account = msalApp.getAccount();

        //     this.setState({
        //         account
        //     });

        //     if (account) {
        //         const tokenResponse = await this.acquireToken(
        //             GRAPH_REQUESTS.LOGIN,
        //             useRedirectFlow
        //         );

        //         if (tokenResponse) {
        //             const graphProfile = await fetchMsGraph(
        //                 GRAPH_ENDPOINTS.ME,
        //                 tokenResponse.accessToken
        //             ).catch(() => {
        //                 this.setState({
        //                     error: "Unable to fetch Graph profile."
        //                 });
        //             });

        //             if (graphProfile) {
        //                 this.setState({
        //                     graphProfile
        //                 });
        //             }

        //             if (tokenResponse.scopes.indexOf(GRAPH_SCOPES.MAIL_READ) > 0) {
        //                 return this.readMail(tokenResponse.accessToken);
        //             }
        //         }
        //     }
        // }

        
            return (
                <Component
                    {...this.props}
                    account={this.state.account}
                    onSignIn={() => onSignIn(useRedirectFlow)}
                    onSignOut={() => onSignOut()}
                />
            );
        
    };

    export default AuthProvider;