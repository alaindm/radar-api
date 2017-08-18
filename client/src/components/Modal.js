// /*global FB*/
import React, { Component } from 'react';
import ReactModal from 'react-modal';
import './Modal.css'

export default class Modal extends Component {
    // constructor(props){
    //     super(props)
    // }
    // componentDidMount() {    
    //     window.fbAsyncInit = function() {
    //         FB.init({
    //         appId            : '1793360757579288',
    //         autoLogAppEvents : true,
    //         xfbml            : true,
    //         version          : 'v2.9'
    //         });
    //         FB.AppEvents.logPageView();
    //         // FB.getLoginStatus(function(response) {
    //         //   this.statusChangeCallback(response);
    //         // }.bind(this));
    //     }

    //     (function(d, s, id){
    //         var js, fjs = d.getElementsByTagName(s)[0];
    //         if (d.getElementById(id)) {return;}
    //         js = d.createElement(s); js.id = id;
    //         js.src = "//connect.facebook.net/en_US/sdk.js";
    //         fjs.parentNode.insertBefore(js, fjs);
    //     }(document, 'script', 'facebook-jssdk'))
    // } 

    render () {
        return (
        <div>
            <ReactModal 
                isOpen={this.props.showModal}
                contentLabel="onRequestClose Example"
                onRequestClose={this.props.onRequestClose}
                className="Modal"
                overlayClassName="Overlay"
                >
                <button onClick={this.props.onRequestClose}>Close Modal</button>
            </ReactModal>
        </div>
        );
  }
}
