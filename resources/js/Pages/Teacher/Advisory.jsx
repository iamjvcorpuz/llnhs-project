import React,{ Component } from "react";
import { Link } from '@inertiajs/react';
import { EachMethod } from '@/Components/EachMethod'
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


export default class Advisory extends Component {
    constructor(props) {
		super(props);
        this.state = {
            data: this.props.advisory,
            subjects: this.props.subjects, 
            teachers: this.props.teacher,
            advisoryList: this.props.advisory,
            sectionListTemp: this.props.sections,
            sectionList: [],
            yeargrade: this.props.schoolyeargrades,
            selected_grade: "",
            selected_grade_id: "",
            selected_section: "",
            selected_section_id: "",
            selected_teacher_name: "",
            selected_teacher_id: "",
            selected_subject: "",
            selected_subejct_id: "",
            selected_school_year: "",
            columns: [
                {
                    id: "no",
                    accessor: 'id',
                    Header: 'No.', 
                    width: 70,
                    className: "center"
                }, 
                {
                    id: "section",
                    Header: 'Section',  
                    accessor: 'section_name', 
                    width: 300,
                },
                {
                    id: "year_level",
                    Header: 'Grade Level',  
                    width: 200,
                    accessor: 'year_level'
                },  
                {
                    id: "school_year",
                    Header: 'S.Y.',  
                    width: 200,
                    accessor: 'school_year'
                },  
                {
                    id: "total_students",
                    Header: 'No. Students',  
                    width: 100,
                    className: "center",
                    accessor: 'total_students'
                },  
                {
                    id: "Action",
                    Header: 'Action',  
                    width: 150,
                    accessor: 'status',
                    className: "center",
                    Cell: ({row}) => { 
                       return <>  
                        <Link href={`/teacher/advisory/students/${row.original.qrcode}?stamp=${moment(new Date()).toString()}`}  className="btn btn-info btn-block btn-sm col-12"> <i className="bi bi-eye"></i> View</Link> 
                        <Link href={`/teacher/advisory/final/grading/${row.original.qrcode}`} className="btn btn-success btn-block btn-sm col-12 mt-1" > <i className="bi bi-card-checklist"></i> Final Grades </Link> 
                       </>            
                    }
                }
            ]
        }
        this._isMounted = false;
        // this.saveData = this.getAllRequiredData.bind(this);
        this.saveData = this.saveData.bind(this);
        this.deleteAdvisory = this.deleteAdvisory.bind(this);
        this.getAllData = this.getAllData.bind(this);
        console.log(this.props)
    }

    componentDidMount() {
        this._isMounted = true; 
        // console.log(this);
        // this.getAllData();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getAllData() {
        let self = this;
        axios.get('/advisory').then(function (response) {
            console.log(response);
            if( typeof(response.status) != "undefined" && response.status == "200" ) {
                let data = typeof(response.data) != "undefined" && typeof(response.data)!="undefined"?response.data:{};
                if(Object.keys(data).length>0) {
                    self.setState({
                        data: data.advisory,
                        subjects: data.subjects, 
                        teachers: data.teacher,
                        advisoryList: data.advisory,
                        sectionListTemp: data.sections,
                        sectionList: [],
                        yeargrade: data.schoolyeargrades,
                    });
                    
                }
            }
        });
    }

    deleteAdvisory(id) {
        let self = this;
        Swal.fire({
            title: "Are you sure to remove this data?", 
            showCancelButton: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonText: "Yes",
            confirmButtonColor: 'red', 
            icon: "question",
            showLoaderOnConfirm: true, 
            closeOnClickOutside: false,  
            dangerMode: true,
        }).then((result) => {
            if(result.isConfirmed){
                Swal.fire({  
                    title: 'Removing Records.\nPlease wait.', 
                    showCancelButton: false,
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    didOpen: () => {
                      Swal.showLoading();
                    }
                });
                axios.delete('/advisory',{data: {id:id}}).then(function (response) {
                    // handle success
                    // console.log(response);
                        if( typeof(response.status) != "undefined" && response.status == "201" ) {
                            let data = typeof(response.data) != "undefined" && typeof(response.data)!="undefined"?response.data:{};
                            if(data.status == "success") {

                                self.getAllData();
                                Swal.fire({  
                                    title: "Successfuly remove!", 
                                    showCancelButton: false,
                                    allowOutsideClick: false,
                                    allowEscapeKey: false,
                                    confirmButtonText: "Ok", 
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
                                    title: "Fail to remove", 
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
                            if(data.status == "data_not_exist") { 
                                Swal.fire({  
                                    title: "Data Not Exist", 
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
            } else {
                Swal.close();
            }
        });
    }

    saveData() {
        let self = this;
        console.log($("#teacher").val());
        console.log($("#yearlevel").val());
        console.log($("#yearlevel").val());
        console.log($("#section").val());
        console.log($("#subject").val());
        let teacher_name = $("#teacher").val();
        let teacher = self.state.teachers.find(e=>(e.last_name + ', ' + e.first_name)==teacher_name).id;
        let yearlevel = $("#yearlevel").val();
        let year_level =  self.state.sectionList.find(e => e.id==$("#yearlevel").val()).year_grade;
        let section_name = $("#section").val();
        let section = self.state.sectionList.find(e => e.section_name==section_name).id;
        let schoolyear = $("#schoolyear").val();
        let subject = $("#subject").val();


        if(teacher != "" && yearlevel != "" && section != "" && schoolyear != "" && subject != "") {
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
                        teacher_id: teacher,
                        teacher_name: teacher_name,
                        year_level: year_level,
                        school_sections_id: section,
                        section_name: section_name,
                        schoolyear: schoolyear,
                        subject_id: subject
                    };
                    // console.log(datas);
                    axios.post('/advisory',datas).then( async function (response) {
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
                                            // window.location.reload();
                                            $("#newAdvisory").modal('hide');
                                            self.getAllData();
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
            
            if(teacher == "") {
                $("#fteacher-alert").removeAttr('class');
                $("#teacher-alert").html('Required Field');
                $("#teacher-alert").addClass('d-block invalid-feedback');
            }
            if(yearlevel == "") {
                $("#yearlevel-alert").removeAttr('class');
                $("#yearlevel-alert").html('Required Field');
                $("#yearlevel-alert").addClass('d-block invalid-feedback');
            }
            if(section == "") {
                $("#section-alert").removeAttr('class');
                $("#section-alert").html('Required Field');
                $("#section-alert").addClass('d-block invalid-feedback');
            }
            if(schoolyear == "") {
                $("#schoolyear-alert").removeAttr('class');
                $("#schoolyear-alert").html('Required Field');
                $("#schoolyear-alert").addClass('d-block invalid-feedback');
            }
            if(subject == "") {
                $("#subject-alert").removeAttr('class');
                $("#subject-alert").html('Required Field');
                $("#subject-alert").addClass('d-block invalid-feedback');
            }
        }
    }

    render() {
        return <DashboardLayout title="Subject" user={this.props.auth.user} profile={this.props.auth.profile}>
            <div className="app-content-header"> 
                <div className="container-fluid"> 
                    <div className="row">
                    <div className="col-sm-6"><h3 className="mb-0"><i className="nav-icon bi bi-card-list"></i> Teacher's Advisory</h3></div>
                    <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-end">
                            <li className="breadcrumb-item"> <i className="bi bi-speedometer mr-2"></i><Link href="/admin/dashboard">Dashboard</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Advisory</li>
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
                                    <h3 className="card-title  mt-2"> <i className="bi bi-person"></i> List</h3> 
                                    {/* <Link className="btn btn-primary float-right mr-1" href="/admin/dashboard/advisory/new" > <i className="bi bi-person-plus-fill"></i> Add</Link>   */}
                                    {/* <button className="btn btn-primary float-right mr-1" onClick={() => {
                                        this.setState({sectionList: this.state.sectionListTemp.filter(ee => ee.year_grade_id==1)})  
                                        $("#newAdvisory").modal('show');
                                    }} > <i className="bi bi-person-plus-fill"></i> Add</button>   */}
                                </div>
                                <div className="card-body">
                                    <ReactTable
                                        key={"react-tables"}
                                        className={"table table-bordered table-striped "}
                                        data={this.state.data} 
                                        columns={this.state.columns}
                                    />
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
                <EachMethod of={this.state.yeargrade} render={(element,index) => {
                    return <option >{`${element.year_grade}`}</option>
                }} />
            </datalist>

            <datalist id="selectedSection"> 
                <EachMethod of={this.state.sectionList} render={(element,index) => {
                    return <option >{`${element.section_name}`}</option>
                }} />
            </datalist>

            <datalist id="selectedSY">
                <option >2025 - 2026</option>
            </datalist>

            <datalist id="selectedSubject"> 
                <EachMethod of={this.state.teachers} render={(element,index) => {
                    return <option >{`${element.last_name}, ${element.first_name}`}</option>
                }} />
            </datalist>

            <div className="modal fade" tabIndex="-1" role="dialog" id="newAdvisory" aria-hidden="true" data-bs-backdrop="static">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title fs-5">New Advisory</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"> 
                        </button>
                    </div>
                    <div className="modal-body">
                        
                        <div className="card-body"> 
                            <div className="row g-3"> 
                                
                                <div className="col-md-12">
                                    <label htmlFor="teacher" className="form-label">Teacher</label>
                                    <input type="text" className="form-control" list="selectedTeacher" id="teacher" defaultValue="" required="" onChange={(e) => {  $("#teacher-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({selectedTeacher: e.target.value})}}  />
                                    <div id="teacher-alert" className="invalid-feedback">Please select a valid state.</div>
                                </div>
                                <div className="col-md-12">
                                    <label htmlFor="yearlevel" className="form-label">Year Level</label>                                            
                                    {/* <input type="text" className="form-control" list="selectedYearLevel" id="yearlevel" defaultValue="" required=""   /> */}

                                    <select name="yearlevel" id="yearlevel" className="form-control" onChange={(e) => { 
                                         $("#teacher-alert").removeAttr('class').addClass('invalid-feedback'); 
                                         $('#section').val("");
                                         console.log(e.target.value)
                                         if(e.target.value != "") {
                                            this.setState({selectedYearLevel: e.target.value,sectionList: this.state.sectionListTemp.filter(ee => ee.year_grade_id==e.target.value)})  
                                         }
                                         }}>
                                        <EachMethod of={this.state.yeargrade} render={(element,index) => {
                                            return <option value={`${element.id}`} >{`${element.year_grade}`}</option>
                                        }} />
                                    </select>
                                    <div id="yearlevel-alert" className="invalid-feedback">Please select a valid state.</div>
                                </div>
                                <div className="col-md-12">
                                    <label htmlFor="section" className="form-label">Section</label>
                                    <input type="text" className="form-control" list="selectedSection" id="section" defaultValue="" required="" onChange={(e) => {  $("#teacher-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({selectedSection: e.target.value})}}  />
                                    <div id="section-alert" className="invalid-feedback">Please select a valid state.</div>
                                </div>
                                <div className="col-md-12">
                                    <label htmlFor="schoolyear" className="form-label">School Year</label>
                                    <input type="text" className="form-control" list="selectedSY" id="schoolyear" defaultValue="" required="" onChange={(e) => {  $("#teacher-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({selectedSY: e.target.value})}}  />
                                    <div id="schoolyear-alert" className="invalid-feedback">Please select a valid state.</div>
                                </div>
                                <div className="col-md-12">
                                    <label htmlFor="subject" className="form-label">Subject</label>
                                    <select className="form-select" id="subject" required="" onChange={(e) => {  $("#extension-name-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({selectedSubject: e.target.value})}}  >
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
                    <div className="modal-footer"> 
                        <button className="btn btn-success float-right mr-1" onClick={() =>{ this.saveData() }}> <i className="bi bi-save"></i> Save</button>   
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                    </div>
                </div>
            </div>

        </DashboardLayout>
    }
}