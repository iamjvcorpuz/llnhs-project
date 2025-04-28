import React,{ Component } from "react";
import { Link } from '@inertiajs/react';
import { EachMethod } from '@/Components/EachMethod'
import swal from 'sweetalert';
import Swal from 'sweetalert2';

// import QRCode from "react-qr-code";
import ReactTable from "@/Components/ReactTable"; 

import DashboardLayout from '@/Layouts/DashboardLayout';

import QRCode from 'qrcode';


// import { FixedSizeList as List } from "react-window";
// import AutoSizer from "react-virtualized-auto-sizer";

export default class QRCodeList extends Component {
    constructor(props) {
		super(props);
        this.state = {
            data: []
        }
        $('body').attr('class', '');
        this.generateQR = this.generateQR.bind(this);
        this.loadData = this.loadData.bind(this);
        console.log(this.props)
    }
    componentDidMount() {
        let self = this;
        // this.loadData('Teacher');
    }
    loadData(val) {
        let self = this;
        let data = [];
        if(val == "Teacher") {
            data =  this.props.teacher;
        } else if(val == "Student") {
            data =  this.props.student;
        } else if(val == "Employee") {
            data =  this.props.employee;
        }
        this.setState({
            data
        },() => {
            self.state.data.forEach( async element => {
                console.log(element.qr_code)
                await self.generateQR(element.qr_code);
            });
        })
    }
    async generateQR(text) {
        try {
            let sgv = await QRCode.toDataURL(text, { errorCorrectionLevel: 'H' ,width: 500 });
            console.log(text)
            $(`#${text}`).attr('src',sgv);
            return ""; 
        } catch (err) {
            console.log(err)
            return "";
        }
    }
    render() {
        return <div className="" style={{background: 'white',textAlign:"center"}}> 
        <select name="data" className="form-control" id="data" onChange={(e) => {
            this.loadData(e.target.value);
        }}>
            <option disabled>-- Select Type --</option>
            <option value=""></option>
            <option value="Teacher">Teacher</option>
            <option value="Student">Student</option>
            <option value="Employee">Employee</option>
        </select>
        <EachMethod  of={this.state.data} render={(element,index) => {
            return <div className="row">
                <div className="qr-code ">
                    <div className="qr-code-content">
                        <div className="center">
                            <strong>
                            {element.last_name}, {element.first_name}
                            </strong>
                        </div>
                        <img id={element.qr_code} className="mx-auto" onClick={(e) => {
                            $("#qrfile").modal("show");
                            $("#viewqr").attr("src",e.target.src);
                        }} /> 
                    </div>
                </div>
                <hr />
            </div> ;
        }} />
        <div className="modal fade" tabIndex="-1" role="dialog" id="qrfile" data-bs-backdrop="static">
            <div className="modal-dialog modal-fullscreen" role="document">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title fs-5">QR Code</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"> 
                    </button>
                </div>
                <div className="modal-body m-0 p-0">
                    <img id="viewqr" className="mx-auto" /> 
                </div>
                <div className="modal-footer"> 
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
                </div>
            </div>
        </div>
    </div>}
}
