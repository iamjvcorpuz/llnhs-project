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


export default class NewAdvisory extends Component {
    constructor(props) {
		super(props);
        this.state = {
            photoupload: "",
            photobase64: "",
            photobase64final: "",
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
            bdate_max: moment(new Date()).subtract('years',15).format('YYYY-MM-DD'),
            subjects: this.props.subjects,
            teachers: this.props.teacher,
            advisoryList: this.props.advisory,
            sectionList: this.props.section,
            selectedTeacher: "",
            selectedSubject: "",
            selectedYearLevel: "",
            selectedSection: "",
            selectedSY: ""
        } 
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;
        console.log(this.props);
        // this.webCam.current.getScreenshot({width: 600, height: 300});
        // $("#fileuploadpanel").modal('show');
        // jQuery.noConflict();
        // console.log($("#fileuploadpanel"));
        // var modal = new bootstrap.Modal('#fileuploadpanel')
        // modal.show();  
        // $("#fileuploadpanel").on('shown.bs.modal', function () {
            
        // });
    }

    getTeacherData() {
        
    }

    getSubjectsData() {

    }

    getAdvisoryData() {

    }
    
    saveData() {
        let self = this;
        if(self.state.first_name != "" && self.state.middle_name != "" && self.state.last_name != "" && self.state.sex != "" && self.state.bdate != ""&& self.state.lrn != "") {
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
                confirmButtonColor: "#DD6B55",
                icon: "warning",
                showLoaderOnConfirm: true, 
                closeOnClickOutside: false,  
                dangerMode: true,
            }).then((result) => {
                // console.log("result",result)
                if(result.isConfirmed) {
                    Swal.fire({  
                        title: 'Submitting Records.\nPlease wait.', 
                        html:'<i class="fa fa-times-circle-o"></i>&nbsp;&nbsp;Close',
                        showCancelButton: true,
                        showConfirmButton: false,
                        allowOutsideClick: false,
                        didOpen: () => {
                          Swal.showLoading();
                        }
                    });
                    let datas =  {
                        qr_code: self.state.lrn, 
                        first_name:self.state.first_name,
                        last_name:self.state.last_name,
                        middle_name:self.state.middle_name,
                        extension_name:self.state.extension_name,
                        bdate:self.state.bdate,
                        status: "active",
                        picture_base64:self.state.photobase64final,
                        email:self.state.email,
                        sex:self.state.sex
                    };
                    console.log(datas);
                    axios.post('/parents',datas).then( async function (response) {
                        // handle success
                        console.log(response);
                            if( typeof(response.status) != "undefined" && response.status == "201" ) {
                                let data = typeof(response.data) != "undefined" && typeof(response.data)!="undefined"?response.data:{};
                                if(data.status ="sucess") {
                                    let phone_list = [];
                                    self.state.contact_list.forEach( async element => {
                                        // phone_list.push();
                                        console.log({
                                            type: null,
                                            student_id: null,
                                            teacher_id: response.data.data.id,
                                            guardian_id: null,
                                            phone_number: element.phone_number,
                                            telephone_number: element.phone_number
                                        })
                                        axios.post('/contacts',{
                                            type: null,
                                            student_id: null,
                                            teacher_id: response.data.data.id,
                                            guardian_id: null,
                                            phone_number: element.phone_number,
                                            telephone_number: element.phone_number
                                        }).then(function (response2) {
                                            if( typeof(response2.status) != "undefined" && response2.status == "201" ) {

                                            }
                                        })
                                    });

                                    Swal.fire({  
                                        title: "Successfuly save!", 
                                        showCancelButton: true,
                                        allowOutsideClick: false,
                                        allowEscapeKey: false,
                                        confirmButtonText: "Continue",
                                        confirmButtonColor: "#DD6B55",
                                        icon: "success",
                                        showLoaderOnConfirm: true, 
                                        closeOnClickOutside: false,  
                                        dangerMode: true,
                                    }).then(function (result2) {
                                        if(result2.isConfirmed) { 
                                            Swal.close();
                                            document.getElementById("cancel").click();
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
                                if(data.status ="data_exist") { 
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
            
            if(self.state.first_name == "") {
                $("#first-name-alert").removeAttr('class');
                $("#first-name-alert").html('Required Field');
                $("#first-name-alert").addClass('d-block invalid-feedback');
            }
            if(self.state.middle_name == "") {
                $("#middle-name-alert").removeAttr('class');
                $("#middle-name-alert").html('Required Field');
                $("#middle-name-alert").addClass('d-block invalid-feedback');
            }
            if(self.state.last_name == "") {
                $("#last-name-alert").removeAttr('class');
                $("#last-name-alert").html('Required Field');
                $("#last-name-alert").addClass('d-block invalid-feedback');
            }
            if(self.state.sex == "") {
                $("#sex-alert").removeAttr('class');
                $("#sex-alert").html('Required Field');
                $("#sex-alert").addClass('d-block invalid-feedback');
            }
            if(self.state.bdate == "") {
                $("#bdate-alert").removeAttr('class');
                $("#bdate-alert").html('Required Field');
                $("#bdate-alert").addClass('d-block invalid-feedback');
            }
            if(self.state.lrn == "") {
                $("#lrn-alert").removeAttr('class');
                $("#lrn-alert").html('Required Field');
                $("#lrn-alert").addClass('d-block invalid-feedback');
            }
        }
    }

    render() {
        return <DashboardLayout title="New Teacher" ><div className="noselect">
            <div className="app-content-header"> 
                <div className="container-fluid"> 
                    <div className="row">
                    <div className="col-sm-6"><h3 className="mb-0"><i className="nav-icon bi bi-book-half"></i> Teacher's Advisory</h3></div>
                    <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-end">
                            <li className="breadcrumb-item"><i className="bi bi-speedometer mr-2"></i><Link href="/admin/dashboard">Dashboard</Link></li>
                            <li className="breadcrumb-item"><Link href="/admin/dashboard/advisory">Advisory</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">New</li>
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
                                    <h3 className="card-title mt-2"> <i className="bi bi-person"></i> New Advisory</h3>
                                    <Link href="/admin/dashboard/advisory" id="cancel" className="btn btn-danger float-right"> <i className="bi bi-person-fill-x"></i> Cancel</Link>
                                    <button className="btn btn-success float-right mr-1" onClick={() =>{ this.saveData() }}> <i className="bi bi-person-plus-fill"></i> Save</button>   
                                </div>
                                <div className="card-body"> 
                                    <div className="row g-3"> 
                                        
                                        <div className="col-md-3">
                                            <label htmlFor="extension_name" className="form-label">Teacher</label>
                                            <input type="text" className="form-control" list="selectedTeacher" id="teacher" defaultValue="" required="" onChange={(e) => {  $("#teacher-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({selectedTeacher: e.target.value})}}  />
                                            <div id="teacher-alert" className="invalid-feedback">Please select a valid state.</div>
                                        </div>
                                        <div className="col-md-3">
                                            <label htmlFor="extension_name" className="form-label">Year/Grade Level</label>                                            
                                            <input type="text" className="form-control" list="selectedYearLevel" id="teacher" defaultValue="" required="" onChange={(e) => {  $("#teacher-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({selectedYearLevel: e.target.value})}}  />
                                            <div id="extension-name-alert" className="invalid-feedback">Please select a valid state.</div>
                                        </div>
                                        <div className="col-md-3">
                                            <label htmlFor="extension_name" className="form-label">Section</label>
                                            <input type="text" className="form-control" list="selectedSection" id="teacher" defaultValue="" required="" onChange={(e) => {  $("#teacher-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({selectedSection: e.target.value})}}  />
                                            <div id="extension-name-alert" className="invalid-feedback">Please select a valid state.</div>
                                        </div>
                                        <div className="col-md-3">
                                            <label htmlFor="extension_name" className="form-label">School Year</label>
                                            <input type="text" className="form-control" list="selectedSY" id="teacher" defaultValue="" required="" onChange={(e) => {  $("#teacher-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({selectedSY: e.target.value})}}  />
                                            <div id="extension-name-alert" className="invalid-feedback">Please select a valid state.</div>
                                        </div>
                                        <div className="col-md-4">
                                            <label htmlFor="extension_name" className="form-label">Subject</label>
                                            <select className="form-select" id="extension_name" required="" onChange={(e) => {  $("#extension-name-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({selectedSubject: e.target.value})}}  >
                                                <option disabled >Choose...</option>
                                                <option></option>
                                                <EachMethod of={this.state.subjects} render={(element,index) => {
                                                    return <option value={element.id}>{element.subject_name}</option>
                                                }} />
                                            </select>
                                            <div id="extension-name-alert" className="invalid-feedback">Please select a valid state.</div>
                                        </div>

                                    </div> 
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <datalist id="selectedTeacher">
                <EachMethod of={this.state.teachers} render={(element,index) => {
                    return <option >{`${element.last_name}, ${element.first_name}`}</option>
                }} />
            </datalist>

            <datalist id="selectedYearLevel">
            </datalist>

            <datalist id="selectedSection"> 
                <EachMethod of={this.state.sectionList} render={(element,index) => {
                    return <option >{`${element.last_name}, ${element.first_name}`}</option>
                }} />
            </datalist>

            <datalist id="selectedSY"> 
            </datalist>

            <datalist id="selectedSubject"> 
                <EachMethod of={this.state.teachers} render={(element,index) => {
                    return <option >{`${element.last_name}, ${element.first_name}`}</option>
                }} />
            </datalist>

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
        </div>
    </DashboardLayout>}
}