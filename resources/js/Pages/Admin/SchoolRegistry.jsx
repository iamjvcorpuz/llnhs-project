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


export default class SchoolRegistry extends Component {
    constructor(props) {
		super(props);
        this.state = {
            shcool_id: "",
            school_name: "",
            schoolRegistry: this.props.schoolRegistry,
            advisory: this.props.advisory,
            selectedMonthYear: ""
        }
        this.saveData = this.saveData.bind(this);
        console.log(this.props);
    }

    saveData() {
        let self = this; 
        let school_name = $("#school_name").val(); 
        let school_id = $("#school_id").val(); 
        let school_address = $("#school_address").val(); 
        let school_district = $("#school_district").val(); 
        let school_division = $("#school_division").val(); 
        let school_region = $("#school_region").val(); 
        let school_head_teacher = $("#school_head_teacher").val(); 
        let school_head_teacher_position = $("#school_head_teacher_position").val(); 
        let school_sy = $("#school_sy").val();


        if(school_name != "" && school_id != "" && school_address != "" && school_district != "" && school_division != "" && school_region != "" && school_division != "" && school_head_teacher != "" && school_head_teacher_position != "" && school_sy != "") {
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
                    let datas =  { 
                        school_name,
                        school_id,
                        school_address,
                        school_district,
                        school_division,
                        school_region,
                        school_head_teacher,
                        school_head_teacher_position,
                        school_sy
                    };
                    // console.log(datas);
                    axios.post('/admin/school/details/update',datas).then( async function (response) {
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

    render() {
        return <DashboardLayout title="Registry" user={this.props.auth.user} ><div className="noselect">
            <div className="app-content-header"> 
                <div className="container-fluid"> 
                    <div className="row">
                    <div className="col-sm-6"><h3 className="mb-0"><i className="nav-icon bi bi-buildings-fill"></i> School Details</h3></div>
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
                                        <label htmlFor="" className="form-label ">School Name</label>
                                        <input type="text" name="school_name" className="form-control" id="school_name" placeholder="" defaultValue={this.state.schoolRegistry.school_name} /> 
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="" className="form-label">School ID</label>
                                        <input type="text" name="school_id" className="form-control" id="school_id" placeholder="" defaultValue={this.state.schoolRegistry.school_id} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="" className="form-label">School Address</label>
                                        <input type="text" name="school_address" className="form-control" id="school_address" placeholder="" defaultValue={this.state.schoolRegistry.school_address} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="" className="form-label">Region</label>
                                        <input type="text" name="school_region" className="form-control" id="school_region" defaultValue={this.state.schoolRegistry.region} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="" className="form-label">Division</label>
                                        <input type="text" name="school_division"  className="form-control" id="school_division" defaultValue={this.state.schoolRegistry.division} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="" className="form-label">District</label>
                                        <input type="text" name="school_district"  className="form-control" id="school_district" defaultValue={this.state.schoolRegistry.district} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="" className="form-label">School Year</label>
                                        <input type="text" name="school_sy"  className="form-control" id="school_sy" defaultValue={this.state.schoolRegistry.school_year}  />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="" className="form-label">Head Teacher Name</label>
                                        <input type="text" name="school_head_teacher"  className="form-control" id="school_head_teacher" defaultValue={this.state.schoolRegistry.head_name} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="" className="form-label">Position</label>
                                        <input type="text" name="school_head_teacher_position"  className="form-control" id="school_head_teacher_position" defaultValue={this.state.schoolRegistry.head_position} />
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
