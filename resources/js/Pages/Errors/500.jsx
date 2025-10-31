import React,{ Component } from "react";
import { Head } from '@inertiajs/react';
import { EachMethod } from '@/Components/EachMethod'
import swal from 'sweetalert';
import Swal from 'sweetalert2';


export default class Errors extends Component {
    constructor(props) {
		super(props);
        this.state = {
            
        }
        console.log(this);
    }
    render() {
        return <div className="noselect">
            <Head title="Error Page" />            
        </div>
    }
}