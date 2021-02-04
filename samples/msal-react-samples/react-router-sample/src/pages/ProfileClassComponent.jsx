import { Component } from "react";

// Msal imports
import { MsalAuthenticationTemplate, withMsal, MsalContext } from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";
import { loginRequest } from "../authConfig";

// Sample app imports
import { ProfileData } from "../ui-components/ProfileData";
import { Loading } from "../ui-components/Loading";
import { ErrorComponent } from "../ui-components/ErrorComponent";
import { callMsGraph } from "../utils/MsGraphApiCall";

// Material-ui imports
import Paper from "@material-ui/core/Paper";

/**
 * This class is a child component of "Profile". MsalContext is passed
 * down from the parent and available as a prop here.
 */
class ProfileContent extends Component {

    constructor(props) {
        super(props)

        this.state = {
            graphData: null,
        }
    }

    componentDidMount() {
        if (this.props.msalContext.accounts[0] && this.props.msalContext.inProgress === "none") {
            this.props.msalContext.instance.acquireTokenSilent({
                ...loginRequest,
                account: this.props.msalContext.accounts[0]
            }).then((response) => {
                callMsGraph(response.accessToken).then(response => this.setState({graphData: response}));
            });
        }
    }
  
    render() {
        return (
            <Paper>
                { this.state.graphData ? <ProfileData graphData={this.state.graphData} /> : null }
            </Paper>
        );
    }
}


/**
 * Alternative: This class is using the raw context directly. The available
 * objects and methods are the same as in "withMsal" HOC usage.
 */
// class ProfileContent extends Component {

//     static contextType = MsalContext;

//     constructor(props) {
//         super(props)

//         this.state = {
//             graphData: null,
//         }
//     }

//     componentDidMount() {
//         if (this.context.accounts[0] && this.context.inProgress === "none") {
//             this.context.instance.acquireTokenSilent({
//                 ...loginRequest,
//                 account: this.context.accounts[0]
//             }).then((response) => {
//                 callMsGraph(response.accessToken).then(response => this.setState({graphData: response}));
//             });
//         }
//     }
  
//     render() {
//         return (
//             <Paper>
//                 { this.state.graphData ? <ProfileData graphData={this.state.graphData} /> : null }
//             </Paper>
//         );
//     }
// }


/**
 * This class is using "withMsal" HOC. It passes down the msalContext 
 * as a prop to its children.
 */
class Profile extends Component {

    render() {
        
        const authRequest = {
            ...loginRequest
        };

        return (
            <MsalAuthenticationTemplate 
                interactionType={InteractionType.Popup} 
                authenticationRequest={authRequest} 
                errorComponent={ErrorComponent} 
                loadingComponent={Loading}
            >
                <ProfileContent msalContext = {this.props.msalContext}/>
            </MsalAuthenticationTemplate>
        );
    }
}

// Wrap your class component to access authentication state as props
export const ProfileWithMsal = withMsal(Profile);