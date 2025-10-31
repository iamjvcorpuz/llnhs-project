
import React,{ Component } from "react";
import { Head } from '@inertiajs/react';
import { EachMethod } from '@/Components/EachMethod'
import swal from 'sweetalert';
import Swal from 'sweetalert2';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import LoginLayout from '@/Layouts/LoginLayout';
export default class Default extends Component {
    constructor(props) {
		super(props);
        this.state = {
            
        }
        console.log(this);
    }
    render() {
        return <LoginLayout>
            <Head title="Error Page" />
            <div className="row">
                <div className="error-page">
                    <h1 className="headline text-danger">{this.props.error_code}</h1>
                    <div className="error-content">
                    <h2>Page Not Found</h2>
                    <p>{this.props.message}</p>
                    <p><a href="/login">← Go to LOGN</a></p>

                    </div>
                </div>
            </div>
            <div className=" flex  justify-center">
                <i className='center'>{this.props.version}</i>
            </div>
        </LoginLayout>
    }
}