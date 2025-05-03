import React,{ Component } from "react";
import { Link } from '@inertiajs/react';
import { EachMethod } from '@/Components/EachMethod'
import swal from 'sweetalert';
import Swal from 'sweetalert2';

import QRCode from "react-qr-code";
import ReactTable from "@/Components/ReactTable"; 

import DashboardLayout from '@/Layouts/DashboardLayout';


export default class QRCodeClass extends Component {
    constructor(props) {
		super(props);
        this.state = {
            code: ""
        }
        $('body').attr('class', '');
    }
    componentDidMount() {
        const urlParams = new URLSearchParams(window.location.search);
        const stamp = urlParams.get('code');
        console.log(stamp)
        if(stamp!=null) {
            this.setState({
                code:stamp
            });
        }
    }
    render() {
        return <div className="" style={{padding:"16%", background: 'white',textAlign:"center"}}> 
        <QRCode value={this.state.code} size={256} style={{ height: "auto", maxWidth: "50%", width: "50%" }}  />           
    </div>}
}
