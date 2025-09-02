import React,{ Component } from "react";
import { Link } from '@inertiajs/react';
import { EachMethod } from '@/Components/EachMethod'
import { ReactNotificationManager,ReactNotificationContainer } from '@/Components/Notification';  
import swal from 'sweetalert';
import Swal from 'sweetalert2';
import moment from 'moment';
import Select from 'react-select'  
import QRCode from "react-qr-code";
import Webcam from "react-webcam";
import { ImageCrop } from '@/Components/ImageCrop';
import axios from 'axios';
import ApexCharts from 'apexcharts'

import ReactTable from "@/Components/ReactTable"; 

import DashboardLayout from '@/Layouts/DashboardLayout';


export default class NotificationSettings extends Component {
    constructor(props) {
		super(props);
        this.state = {
            data: [],
            selectedfb: "",
            shcool_id: "",
            school_name: "",
            schoolRegistry: this.props.schoolRegistry,
            advisory: this.props.advisory,
            selectedMonthYear: "",
            ATTENDANCE_CLASS_STUDENT_PRESENT: this.props.systemSettings.find(e=>e.setting=="ATTENDANCE_CLASS_STUDENT_PRESENT").value,
            ATTENDANCE_CLASS_STUDENT_ABSENT: this.props.systemSettings.find(e=>e.setting=="ATTENDANCE_CLASS_STUDENT_ABSENT").value,
            ENABLE_SMS: this.props.systemSettings.find(e=>e.setting=="ENABLE_SMS").value,
            ENABLE_FB_MESSENGER: this.props.systemSettings.find(e=>e.setting=="ENABLE_FB_MESSENGER").value,
            ENABLE_PUSH_NOTIFICATION: this.props.systemSettings.find(e=>e.setting=="ENABLE_PUSH_NOTIFICATION").value,
        }
        this.saveData = this.saveData.bind(this);
        this.sendFBMSG = this.sendFBMSG.bind(this);
        this.sendSMS = this.sendSMS.bind(this);
        // console.log(this.state);
    }
    componentDidMount() {
        let self = this;
        let selected = $("#fbmsg" ).select2({
            theme: "bootstrap",
            selectionCssClass: 'form-control mb-2',
            containerCssClass: 'form-control mb-2',
            width: '100%'
        });

        $('#fbmsg').on('select2:select', function (e) { 
            var selectedData = e.params.data; 
            self.setState({
                selectedfb: selectedData.id, 
            },() => {
            });
        })
        
        this.getFBList();
    }
    saveData() {
        let self = this; 
        let enable_sms = String($("input[name='enable_sms']").prop('checked'));
        let enable_fb = String($("input[name='enable_fb']").prop('checked')); 
        let sms_present = $("input[name='sms_present']").val(); 
        let sms_absent = $("input[name='sms_absent']").val(); 


        let datas =  { 
            enable_sms,
            enable_fb,
            sms_absent,
            sms_present
        };
        console.log(datas);
        if(enable_sms != null && enable_fb != null && sms_present != "" && sms_absent != "" ) {
            if($('#invalidCheck').prop('checked') == false) {
                $("#invalidCheck-alert").removeAttr('class'); 
                $("#invalidCheck-alert").addClass('d-block invalid-feedback');
                alert('Please check aggree to all fields are correct');
                return;
            }
            Swal.fire({
                title: "If all fields are correct and please click to continue to save", 
                showCancelButton: true,
                allowOutsideClick: false,
                allowEscapeKey: false,
                confirmButtonText: "Continue", 
                icon: "warning",
                showLoaderOnConfirm: true, 
                closeOnClickOutside: false,  
                dangerMode: true,
            }).then((result) => {
                // console.log("result",result)
                if(result.isConfirmed) {
                    Swal.fire({  
                        title: 'Saving Records.\nPlease wait.', 
                        html:'<i class="fa fa-times-circle-o"></i>&nbsp;&nbsp;Close',
                        showCancelButton: true,
                        showConfirmButton: false,
                        allowOutsideClick: false,
                        didOpen: () => {
                          Swal.showLoading();
                        }
                    });
                    axios.post('/admin/system/settings',datas).then( async function (response) {
                        // handle success
                        console.log(response);
                            if( typeof(response.status) != "undefined" && response.status == "201" ) {
                                let data = typeof(response.data) != "undefined" && typeof(response.data)!="undefined"?response.data:{};
                                if(data.status == "success") {
                                    Swal.fire({  
                                        title: "Successfuly save!", 
                                        showCancelButton: true,
                                        allowOutsideClick: false,
                                        allowEscapeKey: false,
                                        confirmButtonText: "Continue", 
                                        icon: "success",
                                        showLoaderOnConfirm: true, 
                                        closeOnClickOutside: false,  
                                        dangerMode: true,
                                    }).then(function (result2) {
                                        if(result2.isConfirmed) { 
                                            Swal.close(); 
                                        }
                                    });
                                } else {
                                    Swal.fire({  
                                        title: "Fail to save", 
                                        showCancelButton: true,
                                        showConfirmButton: false,
                                        allowOutsideClick: false,
                                        allowEscapeKey: false,
                                        cancelButtonText: "Ok",
                                        confirmButtonText: "Continue",
                                        confirmButtonColor: "#DD6B55",
                                        icon: "error",
                                        showLoaderOnConfirm: false, 
                                        closeOnClickOutside: false,  
                                        dangerMode: true,
                                    });
                                }
                            } else if( typeof(response.status) != "undefined" && response.status == "200" ) {
                                let data = typeof(response.data) != "undefined" && typeof(response.data)!="undefined"?response.data:{};
                                if(data.status == "data_exist") { 
                                    Swal.fire({  
                                        title: "Data Exist", 
                                        cancelButtonText: "Ok",
                                        showCancelButton: true,
                                        showConfirmButton: false,
                                        allowOutsideClick: false,
                                        allowEscapeKey: false, 
                                        confirmButtonColor: "#DD6B55",
                                        icon: "error",
                                        showLoaderOnConfirm: true, 
                                        closeOnClickOutside: false,  
                                        dangerMode: true,
                                    });
                                }
                            } else if( typeof(response.status) != "undefined" && response.status == "422" ) {

                            }
                      }).catch(function (error) {
                        // handle error
                        console.log(error);
                        Swal.fire({  
                            title: "Server Error", 
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
                      })
                } else if(result.isDismissed) {

                }
                return false
            });            
        } else {
            
            if(school_name == "") {
                $("#fteacher-alert").removeAttr('class');
                $("#teacher-alert").html('Required Field');
                $("#teacher-alert").addClass('d-block invalid-feedback');
            }
            if(school_id == "") {
                $("#yearlevel-alert").removeAttr('class');
                $("#yearlevel-alert").html('Required Field');
                $("#yearlevel-alert").addClass('d-block invalid-feedback');
            }
            if(school_address == "") {
                $("#section-alert").removeAttr('class');
                $("#section-alert").html('Required Field');
                $("#section-alert").addClass('d-block invalid-feedback');
            }
            if(school_division == "") {
                $("#schoolyear-alert").removeAttr('class');
                $("#schoolyear-alert").html('Required Field');
                $("#schoolyear-alert").addClass('d-block invalid-feedback');
            }
            if(school_region == "") {
                $("#subject-alert").removeAttr('class');
                $("#subject-alert").html('Required Field');
                $("#subject-alert").addClass('d-block invalid-feedback');
            }
            if(school_head_teacher == "") {
                $("#subject-alert").removeAttr('class');
                $("#subject-alert").html('Required Field');
                $("#subject-alert").addClass('d-block invalid-feedback');
            }
            if(school_head_teacher_position == "") {
                $("#subject-alert").removeAttr('class');
                $("#subject-alert").html('Required Field');
                $("#subject-alert").addClass('d-block invalid-feedback');
            }
            if(school_sy == "") {
                $("#subject-alert").removeAttr('class');
                $("#subject-alert").html('Required Field');
                $("#subject-alert").addClass('d-block invalid-feedback');
            }
        }
    }

    sendSMS() {
        let message = $("#message").val(); 
        let phone_number = $("#phonenumber").val(); 
        if(phonenumber != "" && message != "" ) {
            let datas =  { 
                message,
                phone_number
            };
            axios.post('/sms/send/test',datas).then( async function (response) {
                // handle success
                console.log(response);
                    if( typeof(response.status) != "undefined" && response.status == "201" ) {
                        let data = typeof(response.data) != "undefined" && typeof(response.data)!="undefined"?response.data:{};
                        if(data.status == "success") {
                            Swal.fire({  
                                title: "Successfuly save!", 
                                showCancelButton: true,
                                allowOutsideClick: false,
                                allowEscapeKey: false,
                                confirmButtonText: "Continue", 
                                icon: "success",
                                showLoaderOnConfirm: true, 
                                closeOnClickOutside: false,  
                                dangerMode: true,
                            }).then(function (result2) {
                                if(result2.isConfirmed) { 
                                    Swal.close(); 
                                }
                            });
                        } else {
                            Swal.fire({  
                                title: "Fail to save", 
                                showCancelButton: true,
                                showConfirmButton: false,
                                allowOutsideClick: false,
                                allowEscapeKey: false,
                                cancelButtonText: "Ok",
                                confirmButtonText: "Continue",
                                confirmButtonColor: "#DD6B55",
                                icon: "error",
                                showLoaderOnConfirm: false, 
                                closeOnClickOutside: false,  
                                dangerMode: true,
                            });
                        }
                    } else if( typeof(response.status) != "undefined" && response.status == "200" ) {
                        let data = typeof(response.data) != "undefined" && typeof(response.data)!="undefined"?response.data:{};
                        if(data.status == "data_exist") { 
                            Swal.fire({  
                                title: "Data Exist", 
                                cancelButtonText: "Ok",
                                showCancelButton: true,
                                showConfirmButton: false,
                                allowOutsideClick: false,
                                allowEscapeKey: false, 
                                confirmButtonColor: "#DD6B55",
                                icon: "error",
                                showLoaderOnConfirm: true, 
                                closeOnClickOutside: false,  
                                dangerMode: true,
                            });
                        }
                    } else if( typeof(response.status) != "undefined" && response.status == "422" ) {

                    }
            }).catch(function (error) {
                // handle error
                console.log(error);
                Swal.fire({  
                    title: "Server Error", 
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
            });
        } else {
            alert("Required Fields")
        }
    }

    getFBList() {
        let list  = []; 
        let self = this;
        axios.post('/messenger/all/recepient').then(function (response) {
          // handle success
          console.log(response)
            if( typeof(response.status) != "undefined" && response.status == "200" ) {
                let data = typeof(response.data) != "undefined" && typeof(response.data.data)!="undefined"?response.data.data:[];
                self.setState({data: data});
            }
        }).catch(function (error) {
          // handle error
        //   console.log(error);
        }).finally(function () {
          // always executed
        });
    }

    sendFBMSG() {
        let message = $("#fbmessage").val(); 
        let id = this.state.selectedfb; 
        if(phonenumber != "" && message != "" ) {
            let datas =  { 
                message,
                id
            };
            console.log(datas)
            axios.post('/messenger/send/message',datas).then( async function (response) {
                // handle success
                console.log(response);
                if( typeof(response.status) != "undefined" && response.status == "201" ) {
                    let data = typeof(response.data) != "undefined" && typeof(response.data)!="undefined"?response.data:{};
                    if(data.status == "success") {
                        Swal.fire({  
                            title: "Successfuly save!", 
                            showCancelButton: true,
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            confirmButtonText: "Continue", 
                            icon: "success",
                            showLoaderOnConfirm: true, 
                            closeOnClickOutside: false,  
                            dangerMode: true,
                        }).then(function (result2) {
                            if(result2.isConfirmed) { 
                                Swal.close(); 
                            }
                        });
                    } else {
                        Swal.fire({  
                            title: "Fail to save", 
                            showCancelButton: true,
                            showConfirmButton: false,
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            cancelButtonText: "Ok",
                            confirmButtonText: "Continue",
                            confirmButtonColor: "#DD6B55",
                            icon: "error",
                            showLoaderOnConfirm: false, 
                            closeOnClickOutside: false,  
                            dangerMode: true,
                        });
                    }
                } else if( typeof(response.status) != "undefined" && response.status == "200" ) {
                    let data = typeof(response.data) != "undefined" && typeof(response.data)!="undefined"?response.data:{};
                    if(data.status == "data_exist") { 
                        Swal.fire({  
                            title: "Data Exist", 
                            cancelButtonText: "Ok",
                            showCancelButton: true,
                            showConfirmButton: false,
                            allowOutsideClick: false,
                            allowEscapeKey: false, 
                            confirmButtonColor: "#DD6B55",
                            icon: "error",
                            showLoaderOnConfirm: true, 
                            closeOnClickOutside: false,  
                            dangerMode: true,
                        });
                    }
                } else if( typeof(response.status) != "undefined" && response.status == "422" ) {
                    Swal.fire({  
                        title: "Server Error, Request Failed", 
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
            }).catch(function (error) {
                // handle error
                console.log(error);
                if( typeof(error.response.status) != "undefined" && error.response.status == "422" ) {
                    Swal.fire({  
                        title: "Server Error, Request Failed", 
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
                } else {
                    Swal.fire({  
                        title: "Server Error", 
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

            });
        } else {
            alert("Required Fields")
        }
    }

    render() {
        return <DashboardLayout title="Notifications" user={this.props.auth.user} ><div className="noselect">
            <div className="app-content-header"> 
                <div className="container-fluid"> 
                    <div className="row">
                    <div className="col-sm-6"><h3 className="mb-0"><i className="nav-icon bi bi-buildings-fill"></i> Notification Settings</h3></div>
                    <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-end">
                            <li className="breadcrumb-item"><Link href="/admin/dashboard">Dashboard</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">School Details</li>
                        </ol>
                    </div>
                    </div> 
                </div> 
            </div>

            <div className="app-content">
                <div className="container-fluid">
                    
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card mb-4">
                                <div className="card-header">
                                    <h3 className="card-title"> <i className="bi bi-info-square-fill"></i> Details</h3> 
                                    <button className="btn btn-info float-right mr-1" onClick={() => { this.saveData(); }}> <i className="bi bi-pen"></i> Update</button>  
                                </div>
                                <div className="card-body">
                                    <div className="mb-3">
                                        <label htmlFor="" className="form-label">Enable SMS</label>
                                        <div className="form-check form-switch float-right"> 
                                            <input className="form-check-input fs-3" name="enable_sms" type="checkbox" defaultChecked={(this.state.ENABLE_SMS=="true")?true:false} onChange={(e) => { this.setState({ENABLE_SMS: (e.checked)?"true":"false"}); }} id="sms" />
                                        </div>
                                    </div> 
                                    <hr />
                                    <div className="mb-3">
                                        <label htmlFor="" className="form-label">Enable Facebook Messenger</label>
                                        <div className="form-check form-switch float-right"> 
                                            <input className="form-check-input fs-3" name="enable_fb" type="checkbox" defaultChecked={(this.state.ENABLE_FB_MESSENGER=="true")?true:false} onChange={(e) => { this.setState({ENABLE_SMS: (e.checked)?"true":"false"}); }} id="fbs" />
                                        </div>
                                    </div> 
                                    <hr />
                                    <div className="mb-3">
                                        <label htmlFor="" className="form-label ">Student attendance message for PRESENT</label>
                                        <input type="text" name="sms_present" className="form-control" id="school_name" placeholder="" defaultValue={this.state.ATTENDANCE_CLASS_STUDENT_PRESENT} /> 
                                        <i className="form-text">Note: %s is required for delimiter to parse data (1st for fullname, 2nd for time, 3rd for  date)</i>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="" className="form-label">Student attendance message for ABSENT</label>
                                        <input type="text" name="sms_absent" className="form-control" id="school_id" placeholder="" defaultValue={this.state.ATTENDANCE_CLASS_STUDENT_ABSENT} />
                                        <i className="form-text">Note: %s is required for delimiter to parse data (1st for fullname, 2nd for time, 3rd for  date)</i>
                                    </div>
                                </div>
                            </div>
                            <div className="card card-primary">
                                <div className="card-header">
                                    <h3 className="card-title">Test SMS</h3>
                                </div> 
                                <div className="form-horizontal">
                                    <div className="card-body">
                                        <input type="text" id="phonenumber" className="form-control mb-1" placeholder="Phone Number (09000000000)" />
                                        <div className="form-group">
                                            <textarea type="email" className="form-control" id="message" placeholder="Message" />
                                        </div> 
                                    </div> 
                                    <div className="card-footer">
                                        <i className="form-text">Note: This will work on kiosk only or where SMS device installed</i>
                                        <button type="submit" className="btn btn-primary float-right" onClick={() =>  this.sendSMS() }>Send SMS</button>
                                    </div> 
                                </div>
                            </div>
                            <div className="card card-primary mt-3">
                                <div className="card-header">
                                    <h3 className="card-title">Test FB Messenger</h3>
                                </div> 
                                <div className="form-horizontal">
                                    <div className="card-body"> 
                                        <select name="fbmsg" id="fbmsg" className="form-control mb-1">
                                        <option value={''}>{''}</option>        
                                            <EachMethod of={this.state.data} render={(element,index) => {
                                                return   <option value={element.fb_id}>{element.fullname}</option>              
                                            }} />
                                        </select>
                                        <div className="form-group">
                                            <textarea type="email" className="form-control" id="fbmessage" placeholder="Message" />
                                        </div> 
                                    </div> 
                                    <div className="card-footer">
                                        <i className="form-text">Note: This will work on kiosk only or where SMS device installed</i>
                                        <button type="submit" className="btn btn-primary float-right" onClick={() =>  this.sendFBMSG() }>Send</button>
                                    </div> 
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            
        </div>
    </DashboardLayout>}
}
