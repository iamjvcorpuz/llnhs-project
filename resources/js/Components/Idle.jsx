import React from 'react';
import ReactDom from 'react-dom';
/**
 * timeout = per seconds, default value 3600sec/1hr
 * callbackOption = stop|continue
 * containerElement = gegamot sa pag render sa router e.g. render(renderRoutes(), document.getElementById('react-target')); ang element id ang kwaon => react-target
 * 
 * <Idle
 *   timeout={3600} //seconds
 *   callbackOption={"once"} // continue|once
 *   containerElement={"react-target"}
 *   callback={()=>{
 *     // callback pag timeout na. callbackOption kung continue mag return/call or loop xa every timeout. pag 'once' one lang xa mag loop
 *   }}
 * />
 * 
 */
export default  class Idle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeout: 3600,
      callbackOption: "once",
      runningtime: 0
    };
    // this.containerElement = props.containerElement
    this.timeout = props.timeout
    this.callbackOption = props.callbackOption
    this.runningtime = 0;
    this.blockIntervalKeep = 5; //sec
    this._isMounted = false;
  }
   handleMouseMove = e => {
    this.runningtime = 0;
   };
   handleKeyDown = e => {
    //  console.log(e)
    this.runningtime = 0;
   }
   handleMouseClick = e => {
    this.runningtime = 0;
   }
   componentWillUnmount() {
    this._isMounted = false;
   }
   componentDidMount() {
    let self = this;
    this._isMounted = true;
    if( this._isMounted == true ) {
      this.setState({
        timeout: this.timeout,
        callbackOption: this.callbackOption
      });
    }
    document.body.addEventListener('mousemove', this.handleMouseMove );
    document.body.addEventListener('keypress', this.handleKeyDown );
    document.body.addEventListener('click', this.handleMouseClick );
    setInterval(() => {
      if(self.runningtime>=self.state.timeout && self.callbackOption != "") { 
        if(self.state.callbackOption === "once") {
          self.setState({
            callbackOption: ""
          },()=>{
            self.props.callback("timeout");
            self.callbackOption = "";
            this.runningtime = 0;
          })
        } else {
          self.props.callback("timeout");
          this.runningtime = 0;
        }
      } else {
        self.runningtime++;
      }
      // console.log(self.runningtime);
    }, 1000);    
   }
   componentWillUnmount() {
    document.body.removeEventListener('mousemove',this.handleMouseMove,true);
    document.body.removeEventListener('keypress',this.handleMouseMove,true);
    document.body.removeEventListener('click',this.handleMouseMove,true);
   }
   render() {
    return <></>
   }
 }