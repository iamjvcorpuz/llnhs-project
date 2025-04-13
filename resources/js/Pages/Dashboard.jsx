import React,{ Component } from "react";
import { Head } from '@inertiajs/react';
import { EachMethod } from '@/Components/EachMethod'
import swal from 'sweetalert';
import Swal from 'sweetalert2';


export default class Dashboard extends Component {
    constructor(props) {
		super(props);
        this.state = {
            
        }
        console.log(this.props.auth.user);
        if(this.props.auth.user.user_type == "Admin") {
            window.location.href = "/admin/dashboard";
        } else if(this.props.auth.user.user_type == "Teacher") {
            window.location.href = "/teacher/dashboard";
        } else if(this.props.auth.user.user_type == "Student") {
            window.location.href = "/student/profiles";
        } else if(this.props.auth.user.user_type == "Guardian") {
            window.location.href = "/teacher/dashboard";
        }
    }
    render() {
        return <div className="noselect">
            <Head title="Please Wait" />            
        </div>
    }
}