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


export default class AdvisoryDetails extends Component {
    constructor(props) {
		super(props);
        this.state = {
            schedules: typeof(this.props.schedules)!="undefined"?this.props.schedules:[],
            classDetails: typeof(this.props.classDetails)!="undefined"?this.props.classDetails:[],
            data: [],
            columns: [
                // {
                //     id: "no",
                //     accessor: 'id',
                //     Header: 'No.', 
                //     width: 50,
                //     className: "center"
                // }, 
                {
                    id: "level",
                    Header: 'Subject Name',  
                    accessor: 'subject_name',
                    className: "center",
                    filterable: true,
                    width: 226,
                }, 
                {
                    id: "time",
                    Header: 'Time',  
                    accessor: 'grade',
                    filterable: false,
                    Cell: ({row}) => { 
                       return <> 
                        {moment(row.original.time_start, 'hh:mm A').format('hh:mm A')} - {moment(row.original.time_end, 'hh:mm A').format('hh:mm A')}
                       </>            
                    }
                }
            ],
            columns_all: [
                // {
                //     id: "no",
                //     accessor: 'id',
                //     Header: 'No.', 
                //     width: 50,
                //     className: "center"
                // }, 
                {
                    id: "level",
                    Header: 'Subject Name',  
                    accessor: 'subject_name',
                    className: "center",
                    filterable: true,
                    width: 226,
                }, 
                {
                    id: "time",
                    Header: 'Time',  
                    accessor: 'grade',
                    filterable: false,
                    Cell: ({row}) => { 
                        let schedule_day = [];                      
                        if(row.original.monday=="1"){
                            schedule_day.push("Mon");
                        } 
                        if(row.original.tuesday=="1"){
                            schedule_day.push("Tue");
                        } 
                        if(row.original.wednesday=="1"){
                            schedule_day.push("Wed");
                        } 
                        if(row.original.thursday=="1"){
                            schedule_day.push("Thu");
                        } 
                        if(row.original.friday=="1"){
                            schedule_day.push("Fri");
                        } 
                        if(row.original.saturday=="1"){
                            schedule_day.push("Sat");
                        } 
                       return <> 
                        {moment(row.original.time_start, 'hh:mm A').format('hh:mm A')} - {moment(row.original.time_end, 'hh:mm A').format('hh:mm A')} <br />
                        {(schedule_day.length>0)?schedule_day.toString().replaceAll(',',' - '):""}
                       </>     
                    }
                }
            ],
            columns_student: [
                // {
                //     id: "no",
                //     accessor: 'no',
                //     Header: 'No.', 
                //     width: 100,
                //     className: "center"
                // }, 
                {
                    id: "picture",
                    Header: 'Picture',  
                    accessor: 'photo',
                    Cell: ({row}) => { 
                       return <img className="" height={150} width={150}  onError={(e)=>{ 
                            e.target.src=(row.original.sex=="Male")?'/adminlte/dist/assets/img/avatar.png':'/adminlte/dist/assets/img/avatar-f.jpeg'; 
                       }} alt="Picture Error" src={`/profile/photo/student/${row.original.lrn}`} />
                    }
                }, 
                {
                    id: "lrn",
                    accessor: 'lrn',
                    Header: 'LRN NO.', 
                    maxWidth: 100,
                    filterable: true,
                },
                {
                    id: "fullname",
                    Header: 'Fullname', 
                    width: 800,
                    accessor: 'fullname',
                    filterable: true,
                },
                {
                    id: "action",
                    Header: 'Action',  
                    width: 150,
                    accessor: 'fullname',
                    className: "center",
                    Cell: ({row}) => { 
                       return <>                       
                        <button className="btn btn-danger btn-block btn-sm col-12 mb-1" onClick={()=>{this.deleteStudent(row.original.student_id);}}> <i className="bi bi-person-fill-x"></i> Remove</button>
                       </>            
                    }
                }
            ],
            adviser: "",
            adviserData: typeof(this.props.advisoryDetails)!="undefined"&&this.props.advisoryDetails.length>0?this.props.advisoryDetails[0]:{},
            advisory_list: this.props.advisory,
            student_list: this.props.students,
            studentsList: this.props.studentsList,
            studentsEnrolled: this.props.studentsEnrolled,
            schoolyeargrades: this.props.schoolyeargrades,
            loading: false,
            overAllSchedule: false
        }
        this.loadSched = this.loadSched.bind(this);
        this.saveStudent = this.saveStudent.bind(this);
        // console.log(this.props)
    }

    componentDidMount() {
        this.loadSched("all");
        $('#custom-tabs a').on('click', function (e) {
            e.preventDefault()
            $(this).tab('show')
        });

        $("#studentselection" ).select2({
            theme: "bootstrap",
            selectionCssClass: 'form-control',
            containerCssClass: 'form-control',
            width: '100%',
            dropdownParent: $("#studentModel")
        });

        let temps = this.state.advisory_list.find(e=>e.id==this.state.classDetails[0].id);
        if(typeof(temps)!="undefined") {
            this.setState({adviser: temps.teacher_fullname});
        }
    }

    loadSched(day) { 
        let temp_data = [];
        this.setState({loading: true,overAllSchedule:false});
        if(day == "monday") { 
            this.state.schedules.forEach(val => { 
                if(val.monday == "1") {
                    temp_data.push(val);
                }
            });
        } else if(day == "tueday") { 
            this.state.schedules.forEach(val => { 
                if(val.tueday == "1") {
                    temp_data.push(val);
                }
            });
        } else if(day == "wednesday") { 
            this.state.schedules.forEach(val => { 
                if(val.wednesday == "1") {
                    temp_data.push(val);
                }
            });
        } else if(day == "thursday") { 
            this.state.schedules.forEach(val => { 
                if(val.thursday == "1") {
                    temp_data.push(val);
                }
            });
        } else if(day == "friday") { 
            this.state.schedules.forEach(val => { 
                if(val.friday == "1") {
                    temp_data.push(val);
                }
            });
            
        } else  if(day == "all") { 
            this.state.schedules.forEach(val => {  
                temp_data.push(val); 
            });
            this.setState({overAllSchedule: true});
        }

        setTimeout(() => {
            this.setState({
                data: temp_data,
                loading: false
            })
        }, 1000);


    }

    getAllData() {
        let self = this;
        axios.get(`/advisory/get/student/list/${this.props._id}/${this.props.cupon}`).then(function (response) {
            // console.log(response);
            if( typeof(response.status) != "undefined" && response.status == "200" ) {
                let data = typeof(response.data) != "undefined" && typeof(response.data)!="undefined"?response.data:{};
                if(Object.keys(data).length>0) {
                    self.setState({ 
                        student_list: data.students,  
                        studentsList: data.studentsList,
                    });                    
                }
            }
        });
    }

    deleteStudent(id) {
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
                // console.log({student_id:id,advisory_id: self.state.adviserData.uuid})
                axios.delete('/advisory/student',{data: {student_id:id,advisory_id: self.state.adviserData.uuid}}).then(function (response) {
                    // handle success
                    // console.log(response);
                        if( typeof(response.status) != "undefined" && response.status == "201" ) {
                            let data = typeof(response.data) != "undefined" && typeof(response.data)!="undefined"?response.data:{};
                            if(data.status == "success") {
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
                                        self.getAllData();
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

    saveStudent() {
        let self = this;

        let selected_student = $("#studentselection").val(); 

        let select_student_id = self.state.studentsList.find( e => `${e.last_name}, ${e.first_name}`==selected_student).id;
        let advisory_id = self.state.adviserData.uuid;


        // console.log(selected_student,select_student_id);
        // return;
        if(selected_student != "" && typeof(select_student_id) != "undefined" && typeof(advisory_id) != "undefined") { 
            // Swal.fire({
            //     title: "You select " + selected_student.toLocaleUpperCase() + " and please click to continue to save", 
            //     showCancelButton: true,
            //     allowOutsideClick: false,
            //     allowEscapeKey: false,
            //     confirmButtonText: "Continue", 
            //     icon: "warning",
            //     showLoaderOnConfirm: true, 
            //     closeOnClickOutside: false,  
            //     dangerMode: true,
            // }).then((result) => {
            //     // console.log("result",result)
            //     if(result.isConfirmed) {
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
                        advisory_id,
                        select_student_id
                    };
                    // console.log(datas);
                    axios.post('/teacher/advisory/student/add',datas).then( async function (response) {
                        // handle success
                        // console.log(response);
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
                                            $("#studentModel").modal('hide');
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
                                        title: selected_student.toLocaleUpperCase() + " is ready added", 
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
            //     } else if(result.isDismissed) {

            //     }
            //     return false
            // });
        } else {
            
            if(selected_student == "") {
                $("#studentselection-alert").removeAttr('class');
                $("#studentselection-alert").html('Required Field');
                $("#studentselection-alert").addClass('d-block invalid-feedback');
            }
        }
    }
    
    render() {
        return <DashboardLayout title="Student" user={this.props.auth.user} ><div className="noselect">
            <div className="app-content-header"> 
                <div className="container-fluid"> 
                    <div className="row">
                    <div className="col-sm-6"><h3 className="mb-0"><i className="nav-icon bi bi-door-open-fill"></i> Advisory Details</h3></div>
                    <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-end">
                            <li className="breadcrumb-item"><Link href="/admin/dashboard">Dashboard</Link></li>
                            <li className="breadcrumb-item"><Link href="/admin/dashboard/advisory">Advisory</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Details</li>
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

                                    <div className="row mb-2">
                                        <div className="col-lg-10">
                                            <h3 className="mb-0">
                                                <i className="nav-icon bi bi-bookmark"></i> 
                                                Class Name: <strong className="badge bg bg-primary">{(this.state.classDetails.length>0)?this.state.classDetails[0].section_name:""}</strong>
                                            </h3>
                                            <div className="col-lg-12"> 
                                                STRAND: {(this.state.classDetails.length>0)?this.state.classDetails[0].strands:""} 
                                            </div>
                                            <div className="col-lg-12"> 
                                                TRACK: {(this.state.classDetails.length>0)?this.state.classDetails[0].track:""} 
                                            </div>
                                        </div>
                                        <div className="col-lg-2">

                                            <div className="col-lg-12"> 
                                                    Level: {(this.state.classDetails.length>0)?this.state.classDetails[0].level:""} 
                                            </div>
                                            <div className="col-lg-12"> 
                                                    Grade: {(this.state.classDetails.length>0&&this.state.schoolyeargrades.length>0)?this.state.schoolyeargrades.find(e => e.id==Number(this.state.classDetails[0].grade)).year_grade:""} 
                                            </div>
                                            <div className="col-lg-12"> 
                                                    SY: {(this.state.classDetails.length>0)?this.state.classDetails[0].school_year:""} 
                                            </div>
                                            <div className="col-lg-12">
                                                Adviser: {this.state.adviser}
                                            </div>

                                        </div>
                                    </div> 
                                    <div className="">
                                        <ul className="nav nav-tabs" id="custom-tabs" role="tablist">
                                            <li className="nav-item">
                                                <a className="nav-link active" id="student_list" data-toggle="pill" href="#page_student_list" role="tab" aria-controls="custom-tabs-three-home" aria-selected="true">Student List</a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link" id="schedule_list" data-toggle="pill" href="#page_schedule_list" role="tab" aria-controls="custom-tabs-three-profile" aria-selected="false">Schedules</a>
                                            </li> 
                                        </ul>
                                    </div>
                                </div>
                                <div className="card-body p-0"> 

                                    <div className="tab-content" id="custom-tabs-three-tabContent">
                                        <div className="tab-pane fade active show" id="page_student_list" role="tabpanel" aria-labelledby="custom-tabs-three-home-tab">
                                            <div className="clearfix col-lg-12">
                                                <button className="btn btn-primary col-lg-1 mr-1 float-right m-2" title="Add Student" onClick={() => {
                                                    $("#studentModel").modal('show')
                                                }} > <i className="bi bi-person-plus-fill"></i> Add</button>   
                                            </div>
                                            <ReactTable
                                                key={"react-tables"}
                                                className={"table table-bordered table-striped "}
                                                data={this.state.student_list} 
                                                columns={this.state.columns_student}
                                            />

                                        </div>
                                        <div className="tab-pane fade" id="page_schedule_list" role="tabpanel" aria-labelledby="custom-tabs-three-profile-tab">
                                            <div className="col-lg-12 clearfix ml-5 mr-5 mt-2 mb-2">
                                                <div className="float-right mr-5">
                                                    <button className="btn btn-primary mr-1" onClick={() => {
                                                        this.loadSched("monday");
                                                    }}>Monday</button>
                                                    <button className="btn btn-primary mr-1" onClick={() => {
                                                        this.loadSched("tuesday");
                                                    }}>Tuesday</button>
                                                    <button className="btn btn-primary mr-1" onClick={() => {
                                                        this.loadSched("wednesday");
                                                    }}>Wednesday</button>
                                                    <button className="btn btn-primary mr-1" onClick={() => {
                                                        this.loadSched("thursday");
                                                    }}>Thursday</button>
                                                    <button className="btn btn-primary mr-1" onClick={() => {
                                                        this.loadSched("friday");
                                                    }}>Friday</button>
                                                    <button className="btn btn-info mr-1" onClick={() => {
                                                        this.loadSched("all");
                                                    }}>View All</button>
                                                </div>
                                            </div>
                                            {this.state.overAllSchedule==false?<ReactTable
                                                key={"react-tables"}
                                                className={"table table-bordered table-striped "}
                                                data={this.state.data} 
                                                columns={this.state.columns}
                                                defaultPageSize={15}
                                                loading={this.state.loading} 
                                            />:<ReactTable
                                                key={"react-tables"}
                                                className={"table table-bordered table-striped "}
                                                data={this.state.data} 
                                                columns={this.state.columns_all}
                                                defaultPageSize={15}
                                                loading={this.state.loading} 
                                            />}
                                        </div> 
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            
            {/* <datalist id="selectStudent"> 
                <EachMethod of={this.state.studentsList} render={(element,index) => {
                    if(this.state.studentsEnrolled.length>0 && this.state.studentsEnrolled.some(e=>e.uuid==element.uuid)) {
                        return <option >{`${element.last_name}, ${element.first_name}`}</option>
                    }
                }} />
            </datalist> */}

            <div className="modal fade" tabIndex="-1" role="dialog" id="studentModel" aria-hidden="true" data-bs-backdrop="static">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title fs-5">Add Student</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"> 
                        </button>
                    </div>
                    <div className="modal-body">
                        
                        <div className="card-body"> 
                            <div className="row g-3"> 
                                
                                <div className="col-md-12">
                                    <label htmlFor="studentselection" className="form-label">Student</label>
                                    {/* <input type="text" className="form-control" list="selectStudent"  id="studentselection" defaultValue="" required="" onChange={(e) => {  $("#studentselection-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({studentselection: e.target.value})}}  /> */}
                                    <select className="form-select" id="studentselection" required="" onChange={(e) => {  $("#studentselection-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({studentselection: e.target.value})}}  >
                                        <option disabled >Choose...</option>
                                        <option></option>
                                        <EachMethod of={this.state.studentsList} render={(element,index) => {
                                            if(this.state.studentsEnrolled.length>0 && this.state.studentsEnrolled.some(e=>e.uuid==element.uuid)) {
                                                return <option >{`${element.last_name}, ${element.first_name}`}</option>
                                            }
                                        }} />
                                    </select>
                                    <div id="studentselection-alert" className="invalid-feedback">Please select a valid state.</div>
                                </div> 

                            </div> 
                        </div>

                    </div>
                    <div className="modal-footer"> 
                        <button className="btn btn-success float-right mr-1" onClick={() =>{ this.saveStudent() }}> <i className="bi bi-save"></i> Add</button>   
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                    </div>
                </div>
            </div>

        </div>
    </DashboardLayout>}
}
