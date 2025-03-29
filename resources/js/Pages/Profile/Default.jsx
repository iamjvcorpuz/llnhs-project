import React,{ Component } from "react";
import { Link } from '@inertiajs/react';
import { EachMethod } from '@/Components/EachMethod'
import swal from 'sweetalert';
import Swal from 'sweetalert2';
import moment from 'moment';

import ReactTable from "@/Components/ReactTable"; 
import DashboardLayout from '@/Layouts/DashboardLayout';
import QRCode from "react-qr-code";
import Webcam from "react-webcam";
import { ImageCrop } from '@/Components/ImageCrop';
import axios from 'axios'; 


export default class NewStudent extends Component {
    constructor(props) {
		super(props);
        this.state = {
            dashboard_url: "/admin/dashboard",
            photoupload: "",
            photobase64: "",
            photobase64final: "",
            id: "",
            teacher_id: "",
            lrn: "",
            psa_cert_no: "",
            qrcode: "",
            first_name: "",
            last_name: "",
            middle_name: "",
            extension_name: "",
            sex: "",
            bdate: "",
            status: "",
            email: "",
            contact_list: [],
            filedata: null,
            filedataName: "",
            filetype: "",
            filetype_: "",
            cameraOn: false,
            bdate_max: moment(new Date()).subtract('years',15).format('YYYY-MM-DD')
        };
        this.webCam = React.createRef(); 
        this.updateCrop = this.updateCrop.bind(this);
        this._isMounted = false;
        
    }
    
    componentDidMount() {
        let link = this.state.dashboard_url;
        if(this.props.auth.user.user_type == "Admin") {
            link = "/admin/dashboard";
        } else if(this.props.auth.user.user_type == "Teacher") {
            link = "/teacher/dashboard";
        } else if(this.props.auth.user.user_type == "Student") {
            link = "/student/dashboard";
        } else if(this.props.auth.user.user_type == "Guardian") {
            link = "/guardian/dashboard";
        }
        this.setState({
            dashboard_url: link
        });
        // var triggerFirstTabEl = document.querySelector('.nav.nav-pills')
        // bootstrap.Tab.getInstance(triggerFirstTabEl)
        // $('#tabs li:last-child a').tab('show');
        $('#tabs a').on('click', function (event) {
            event.preventDefault()
            $(this).tab('show')
          })
    }

    getBase64 = (file, callback) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
          callback(reader.result);
        };
        reader.onerror = function (error) {
          console.log("Error: ", error);
        };
    };
  

    onFileChange = (e) => {
        $('.progress-bar').css("width", '0%');
        if(e.target.files.length) {
            const { name, type } = e.target.files[0];
            // console.log(e.target.files[0]);
            let filetype = "pdf";
            if(type == "application/pdf") {
                filetype = "pdf";
            } else if(type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                filetype = "docs";
            } else if(type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                filetype = "docs";
            } else if(type == "image/png") {
                filetype = "image";
            } else if(type == "image/jpeg") {
                filetype = "image";
            }
            this.getBase64(e.target.files[0], (result) => {
              this.setState({
                photoupload: result,
                filedata: result,
                filedataName: name,
                filetype: type,
                filetype_: filetype
              });
            });
            $("#fileuploadpanel").modal('show');
        }
    };

    updateCrop(result) { 
        this.setState({
            photobase64final:result
        })
    }

    render() {
        return <DashboardLayout title="My Profile"  user={this.props.auth.user}><div className="noselect">

            <div className="app-content-header"> 
                <div className="container-fluid"> 
                    <div className="row">
                    <div className="col-sm-6"><h3 className="mb-0"><i className="nav-icon bi bi-person-lines-fill"></i> Profile</h3></div>
                    <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-end">
                            <li className="breadcrumb-item"><i className="bi bi-speedometer mr-2"></i><Link href={`${this.state.dashboard_url}`}>Dashboard</Link></li> 
                        </ol>
                    </div>
                    </div> 
                </div> 
            </div>

            <div className="app-content">
                <div className="container-fluid">

                    <div className="row">
                        <div className="col-md-3">

                            <div className="card card-info card-outline mb-3">
                                <div className="card-body box-profile">
                                    <div className="center mb-3 ">
                                        <img className="user-image rounded-circle img-fluid img-circle auto-margin-lr shadow" src={this.state.photobase64final!=""?this.state.photobase64final:"/adminlte/dist/assets/img/avatar.png"}
                                        ref={t=> this.upload_view_image = t}
                                        onError={(e)=>{ 
                                            this.upload_view_image.src='/adminlte/dist/assets/img/avatar.png'; 
                                        }} alt="User profile picture" />
                                    </div>

                                    <h3 className="profile-username text-center">{this.props.auth.user.fullname}</h3>

                                    <p className="text-muted text-center">{this.props.auth.user.user_type}</p>

                                    <ul className="list-group list-group-unbordered mb-3">
                                        <li className="list-group-item">
                                            <b>Advisory</b> <a className="float-right">0</a>
                                        </li>
                                        <li className="list-group-item">
                                            <b>Students</b> <a className="float-right">0</a>
                                        </li> 
                                    </ul>
                                </div> 
                            </div> 
                        </div>

                        <div className="col-md-9">
                            <div className="card">
                                <div className="card-header p-2" >
                                    <ul id="tabs" className="nav nav-pills" role="tablist">
                                        <li className="nav-item"><a className="nav-link active" href="#profiles" data-toggle="tab">Profile</a></li>
                                        <li className="nav-item"><a className="nav-link " href="#activity" data-toggle="tab">Activity</a></li>
                                        <li className="nav-item"><a className="nav-link" href="#settings" data-toggle="tab">Settings</a></li>
                                    </ul>
                                </div>
                                <div className="card-body">
                                    <div className="tab-content">
                                        <div className="tab-pane active" id="profiles">
                                            <div className="row">
                                                <div className="col-lg-12">
                                                <div className="row g-3"> 
                                                    <div className="col-md-4"> 
                                                    <label htmlFor="lrn" className="form-label ">Profile Picture</label>
                                                        <div className="input-group">
                                                            <input type="file" className="form-control" id="inputGroupFile02" onChange={this.onFileChange}  />
                                                            <span className="input-group-text" htmlFor="inputGroupFile02" onClick={() => { this.setState({cameraOn: true}); $("#camerapanel").modal('show') }} ><i className="bi bi-camera"></i></span>
                                                        </div> 
                                                    </div> 
                                                    <div className="col-md-8 d-flex flex-column justify-content-end"> 
                                                        <label htmlFor="lrn" className="form-label ">Identification Number</label>
                                                        <input type="text" className="form-control" id="lrn" defaultValue={this.state.qr_code} required="" onChange={(e) => {
                                                            $("#lrn-alert").removeAttr('class').addClass('invalid-feedback'); 
                                                            this.setState({lrn: e.target.value})}} />
                                                        <span id="lrn-alert" className="valid-feedback">Looks good!</span>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <label htmlFor="first_name" className="form-label">First name</label>
                                                        <input type="text" className="form-control" id="first_name" defaultValue={this.state.first_name} required="" onChange={(e) => { $("#first-name-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({first_name: e.target.value})}}  />
                                                        <div id="first-name-alert" className="valid-feedback">Looks good!</div>
                                                    </div> 
                                                    <div className="col-md-3">
                                                        <label htmlFor="middle_name" className="form-label">Middle name</label>
                                                        <input type="text" className="form-control" id="middle_name" defaultValue={this.state.middle_name} required="" onChange={(e) => {  $("#middle-name-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({middle_name: e.target.value})}}  />
                                                        <div id="middle-name-alert" className="valid-feedback">Looks good!</div>
                                                    </div> 
                                                    <div className="col-md-3">
                                                        <label htmlFor="last_name" className="form-label">Last name</label>
                                                        <input type="text" className="form-control" id="last_name" defaultValue={this.state.last_name} required="" onChange={(e) => { $("#last-name-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({last_name: e.target.value})}}  />
                                                        <div id="last-name-alert" className="valid-feedback">Looks good!</div>
                                                    </div> 
                                                    <div className="col-md-3">
                                                        <label htmlFor="extension_name" className="form-label">Extension name</label>
                                                        <select className="form-select" id="extension_name" required="" value={this.state.extension_name} onChange={(e) => {  $("#extension-name-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({extension_name: e.target.value})}}  >
                                                            <option disabled>Choose...</option>
                                                            <option></option>
                                                            <option>Jr.</option>
                                                            <option>Sr.</option>
                                                            <option>II</option>
                                                            <option>III</option>
                                                            <option>VI</option>
                                                            <option>V</option>
                                                        </select>
                                                        <div id="extension-name-alert" className="invalid-feedback">Please select a valid state.</div>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <label htmlFor="gender" className="form-label">Gender</label>
                                                        <select className="form-select" id="gender" required=""  value={this.state.sex} onChange={(e) => { $("#sex-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({sex: e.target.value})}} >
                                                            <option disabled>Choose...</option>
                                                            <option></option>
                                                            <option>Male</option>
                                                            <option>Female</option>
                                                        </select>
                                                        <div id="sex-alert" className="invalid-feedback">Please select a valid state.</div>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <label htmlFor="bdate" className="form-label">Birth Date</label>
                                                        <input type="date" className="form-control" id="bdate" defaultValue={this.state.bdate} required="" max={this.state.bdate_max} onChange={(e) => {  $("#bdate-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({bdate: e.target.value})}}  />
                                                        <div id="bdate-alert" className="valid-feedback">Looks good!</div>
                                                    </div> 
                                                    <div className="col-md-4">
                                                        <label htmlFor="bdate" className="form-label">Email</label>
                                                        <input type="email" className="form-control" id="bdate" defaultValue={this.state.email} required="" onChange={(e) => {  $("#email-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({email: e.target.value})}}  />
                                                        <div id="email-alert" className="valid-feedback">Looks good!</div>
                                                    </div> 
                                                </div> 
                                                <div className="col-lg-12">
                                                    <hr />
                                                    <h5 className="badge fs-5 bg-primary text-start d-block">Contacts</h5>
                                                    <div className="row">
                                                        <EachMethod of={this.state.contact_list} render={(element,index) => {
                                                            return  <div className="input-group ">
                                                                <div className="input-group-prepend col-lg-4">
                                                                    <div htmlFor="lglv" className="input-group-text">{element.phone_number}</div>
                                                                </div> 
                                                                <button className="btn btn-danger" onClick={() => {
                                                                    
                                                                }} >Remove</button>
                                                            </div>                 
                                                        }} />
                                                    </div>
                                                    <div className="row" >
                                                        <div className={`${(this.state.contact_list.length>0)?'form-inline col-lg-6 pt-2':'form-inline col-lg-6'}`}>
                                                            <div className="input-group">
                                                                <div className="input-group-prepend">
                                                                    <div htmlFor="lglv" className="input-group-text">Phone Number : </div>
                                                                </div>
                                                                <input type="number" className="form-control col-2" id="phonenumber" maxLength={12} defaultValue="" placeholder="09000000000" required="" />
                                                                <button className="btn btn-primary" onClick={() => {
                                                                    let temp_numbers = this.state.contact_list;
                                                                    let phonenumber = $("#phonenumber").val();
                                                                    if(phonenumber != "" && temp_numbers.some(e => e.phone_number == phonenumber) == false) {
                                                                        temp_numbers.push({  
                                                                            id: this.state.id,
                                                                            type: null,
                                                                            student_id: null,
                                                                            teacher_id: this.state.teacher_id,
                                                                            guardian_id: null,
                                                                            phone_number: $("#phonenumber").val(),
                                                                            telephone_number: null,
                                                                            status: ""
                                                                        });
                                                                        this.setState({contact_list: temp_numbers});
                                                                    } else if(phonenumber != "" ){
                                                                        Swal.fire({  
                                                                            title: "Sorry already added", 
                                                                            showCancelButton: true,
                                                                            showConfirmButton: false,
                                                                            allowOutsideClick: false,
                                                                            allowEscapeKey: false,
                                                                            cancelButtonText: "Ok",
                                                                            confirmButtonText: "Continue",
                                                                            confirmButtonColor: "#DD6B55",
                                                                            icon: "error",
                                                                            showLoaderOnConfirm: true, 
                                                                            closeOnClickOutside: false,  
                                                                            dangerMode: true,
                                                                        });
                                                                    }

                                                                }}>Save</button>
                                                            </div>
                                                        </div>  
                                                    </div>
                                                </div>
                                                <div className="col-12 pt-3">
                                                    <div className="form-check float-right">
                                                        <br />
                                                        <input className="form-check-input" type="checkbox" defaultValue="" id="invalidCheck" required="" />
                                                        <label className="form-check-label" htmlFor="invalidCheck">
                                                        Agree to all fields are correct
                                                        </label>
                                                        <div id="invalidCheck-alert" className="invalid-feedback">You must agree before submitting.</div>
                                                    </div>
                                                </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="tab-pane " id="activity">
                                            a
                                        </div>
                                        <div className="tab-pane" id="settings">
                                            c
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            
        </div>


        <div className="modal fade" tabIndex="-1" role="dialog" id="fileuploadpanel" data-bs-backdrop="static">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title fs-5">Image</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"> 
                        </button>
                    </div>
                    <div className="modal-body">
                        <ImageCrop src={this.state.photoupload} onChange={this.updateCrop}  />
                    </div>
                    <div className="modal-footer"> 
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" tabIndex="-1" role="dialog" id="camerapanel" data-bs-backdrop="static">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title fs-5">Camera Capture</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"> 
                        </button>
                    </div>
                    <div className="modal-body">
                    {(this.state.cameraOn==true)?<Webcam
                        className="webcam"
                        audio={false}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{
                            width: 600,  
                            height: 600,
                            facingMode: "user"
                        }}
                        mirrored={true}
                        screenshotQuality={1}
                        imageSmoothing={true}
                        ref={this.webCam}
                    />:null}
                    </div>
                    <div className="modal-footer"> 
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary" onClick={()=> { 
                            try {
                                this.setState({
                                    photoupload: this.webCam.current.getScreenshot({width: 400, height: 400}),
                                    cameraOn: false
                                },() => {
                                    $("#camerapanel").modal('hide');
                                    $("#fileuploadpanel").modal('show');
                                });
                            } catch (error) {
                                alert("Pleasse try again")
                            }
                         }}>Capture</button>
                    </div>
                    </div>
                </div>
            </div>
    </DashboardLayout>}
}
