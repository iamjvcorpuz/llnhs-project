
import React, { Component } from 'react'; 
import 'react-notifications-component/dist/theme.css'
import { ReactNotifications, Store } from 'react-notifications-component'; 

export class ReactNotificationContainer extends Component {
   constructor(props) {
      super(props);
      this.enterTimeout = 400;
      this.leaveTimeout = 200;
   }
   render() {
      return <ReactNotifications {...this}  />
   }
}
const CustomNotificationContent = (props) => (
   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
     <p>{props.message}</p>
     <button onClick={props.onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
       &times; {/* HTML entity for a multiplication sign (commonly used for close buttons) */}
     </button>
   </div>
 );
 
export const ReactNotificationManager =  {
   'info': function(title,message) {
      Store.addNotification({
         title: title,
         message: message,
         type: "info",
         insert: "top",
         container: "top-right",
         animationIn: ["animate__animated", "animate__fadeIn"],
         animationOut: ["animate__animated", "animate__fadeOut"],
         dismiss: {
           duration: 2500,
           onScreen: true
         }
       });
   },'success': function(title,message) { 
      Store.addNotification({
         title: title,
         message: message,
         type: "success",
         insert: "top",
         container: "top-right",
         animationIn: ["animate__animated", "animate__fadeIn"],
         animationOut: ["animate__animated", "animate__fadeOut"],
         dismiss: {
           duration: 2500,
           onScreen: true
         }
       });
   },'warning': function(title,message) {
      // NotificationManager.warning(message, 'Title here');
      Store.addNotification({
         title: title,
         message: message,
         type: "warning",
         insert: "top",
         container: "top-right",
         animationIn: ["animate__animated", "animate__fadeIn"],
         animationOut: ["animate__animated", "animate__fadeOut"],
         dismiss: {
           duration: 2500,
           onScreen: true
         }
       });
   },'error': function(title,message) {
      Store.addNotification({
        title: title,
        message: message,
        type: "danger",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 5000,
          onScreen: true
        }
       });
   },
}