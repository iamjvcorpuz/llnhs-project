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


export default class AssignSeats extends Component {
    constructor(props) {
		super(props);
        this.state = {
            id: (typeof(this.props.class_teaching)!="undefined"&&this.props.class_teaching.length>0)?this.props.class_teaching[0].id:"",
            class_id: (typeof(this.props.class_teaching)!="undefined"&&this.props.class_teaching.length>0)?this.props.class_teaching[0].class_id:"",
            subject_id: (typeof(this.props.class_teaching)!="undefined"&&this.props.class_teaching.length>0)?this.props.class_teaching[0].subject_id:"",
            table_row: (typeof(this.props.assign_class_teaching)!="undefined"&&this.props.assign_class_teaching.length>0)?Number(this.props.assign_class_teaching[0].number_rows):6,
            table_column: (typeof(this.props.assign_class_teaching)!="undefined"&&this.props.assign_class_teaching.length>0)?Number(this.props.assign_class_teaching[0].number_columns):6,
            table_count: 0,
            seats: [],
            studentsListTemp: (typeof(this.props.students)!="undefined"&&this.props.students.length>0)?this.props.students:[],
            studentsList: [],
            class_assign_seats: [],
            studentselection: "",
            selectSeat: 0,
            existing_class_id: "",
            existing_class: (typeof(this.props.assign_class_seats)!="undefined"&&this.props.assign_class_seats.length>0)?this.props.assign_class_seats:[],
            existing_class_assigned: (typeof(this.props.assign_class_seats_assigned)!="undefined"&&this.props.assign_class_seats_assigned.length>0)?this.props.assign_class_seats_assigned:[]
        }
        console.log(this.props);
        this.saveData = this.saveData.bind(this);
        this.addStudent = this.addStudent.bind(this);
        this.loadExistingData = this.loadExistingData.bind(this);
        this.loadExistingAssignedData = this.loadExistingAssignedData.bind(this);
    }

    componentDidMount() {
        let self = this;
        this.studentList();
        this.assignedStudentList();
    }
    
    loadExistingData() {
        let self = this; 
        this.setState({
            existing_class_id: (typeof(this.state.existing_class)!="undefined"&&this.state.existing_class.length>0)?this.state.existing_class[0].class_teaching_id:6,
            table_row: (typeof(this.state.existing_class)!="undefined"&&this.state.existing_class.length>0)?this.state.existing_class[0].number_rows:6,
            table_column: (typeof(this.state.existing_class)!="undefined"&&this.state.existing_class.length>0)?this.state.existing_class[0].number_columns:6,
        },() => {
            $("#seat_row").val(self.state.table_row);  
            $("#seat_column").val(self.state.table_column); 
            Swal.fire({
                title: "Do you want to also use existing assigned seats?", 
                showCancelButton: true,
                allowOutsideClick: false,
                allowEscapeKey: false,
                confirmButtonText: "Yes", 
                icon: "warning",
                showLoaderOnConfirm: true, 
                closeOnClickOutside: false,  
                dangerMode: true,
            }).then( async (result) => {
                self.loadExistingAssignedData();
            });
        });
    }
    
    loadExistingAssignedData() {
        let self = this;
        let remapStudentList = [];
        if(this.state.existing_class_assigned.length>0) {
            this.state.existing_class_assigned.forEach((element,i,arr) => { 
                if(self.state.studentsListTemp.some(e=>Number(e.student_id)===Number(element.student_id)) === true && element.classrooms_seats_id===self.state.existing_class_id ) {
                    let temp = self.state.studentsListTemp.find(e=>e.student_id==element.student_id) ;
                    remapStudentList.push({
                        ...element,
                        ...temp,
                        seat_number: Number(element.seat_number)
                    });
                }
                if((i + 1) == arr.length) { 
                    self.setState({seats: remapStudentList}); 
                }
            });            
        }
    }

    studentList() {

        let self = this;
        let remapStudentList = [];
        this.state.studentsListTemp.forEach((element,i,arr) => {
            if(self.state.seats.length > 0) {
                if(self.state.seats.some(e=>e.student_id==element.student_id) === false) {
                    remapStudentList.push({
                        ...element
                    });
                }
            }
            if((i + 1) == arr.length) {
                self.setState({studentsList: remapStudentList});
                if(remapStudentList.length===0) {
                    self.setState({studentsList: self.state.studentsListTemp});
                }
            }
        });
    }

    assignedStudentList() {

        let self = this;
        let remapStudentList = [];
        if(this.props.assign_students.length>0) {
            this.props.assign_students.forEach((element,i,arr) => {
                if(self.state.studentsListTemp.some(e=>e.student_id===Number(element.student_id)) === true) {
                    let temp = self.state.studentsListTemp.find(e=>e.student_id==element.student_id) ;
                    remapStudentList.push({
                        ...element,
                        ...temp,
                        seat_number: Number(element.seat_number)
                    });
                }
                if((i + 1) == arr.length) {
                    self.setState({seats: remapStudentList});
                    self.studentList();
                }
            });            
        }

    }

    saveData() {
        let self = this; 
        let seat_row = $("#seat_row").val();  
        let seat_column = $("#seat_column").val(); 
        let seats = this.state.seats;
        //&& seats.length > 0
        if(seat_column != "" && seat_row != ""  ) { 
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
            }).then( async (result) => {
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
                        id: self.state.id,
                        subject_id: self.state.subject_id,
                        class_id: self.state.class_id,
                        number_rows: seat_row,
                        number_columns: seat_column,
                        seats,
                        total_students: []
                    };

                    // console.log(datas,self.state);
                    axios.post('/classroom/seating/update',datas).then( async function (response) { 
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
                                        $("#teacher").val('');
                                        $("#time_start").val('');
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
        } else if(seats.length == 0) {
            Swal.fire({  
                title: "No assigned seats", 
                showCancelButton: true,
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                cancelButtonText: "Ok",
                confirmButtonText: "Close",
                confirmButtonColor: "#DD6B55",
                icon: "error",
                showLoaderOnConfirm: true, 
                closeOnClickOutside: false,  
                dangerMode: true,
            });
        } else {
            if(seat_row == "") {
                $("#seat_row-alert").removeAttr('class');
                $("#seat_row-alert").html('Required Field');
                $("#seat_row-alert").addClass('d-block invalid-feedback');
            }
            if(seat_column == "") {
                $("#seat_column-alert").removeAttr('class');
                $("#seat_column-alert").html('Required Field');
                $("#seat_column-alert").addClass('d-block invalid-feedback');
            }
        }
    }
    
    addStudent() {
        let self = this;
        let d = this.state.seats;

        let selected_student = $("#studentselection").val(); 
        if(self.state.studentsListTemp.length>0) {
            if(selected_student != "") {
                let select_student_id = self.state.studentsList.find( e => `${e.last_name}, ${e.first_name}`==selected_student).id;
                let select_student = self.state.studentsList.find( e => `${e.last_name}, ${e.first_name}`==selected_student);
                
                d.push({
                    seat_number: Number(self.state.selectSeat),
                    ...select_student
                });
                self.setState({seats:d},() => {
                    self.studentList();
                })
                $("#studentModel").modal('hide');
                $("#studentselection").val(""); 
                // console.log(this.state.seats.find(e=>e.seat_number==2));
            } 
        } else {
            Swal.fire({  
                title: "No Student Added", 
                showCancelButton: true,
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                cancelButtonText: "Ok",
                confirmButtonText: "Close",
                confirmButtonColor: "#DD6B55",
                icon: "error",
                showLoaderOnConfirm: true, 
                closeOnClickOutside: false,  
                dangerMode: true,
            });
        }

    }

    removeStudent(num) {
        let self = this;
        let d = this.state.seats;
        let temp = []; 
        if(self.state.selectSeat != 0) {
            
            if(d.length>0) {
                d.forEach((element,i,arr) => { 
                    if(element.seat_number!==Number(self.state.selectSeat)) {
                        temp.push({
                            ...element
                        });
                    }
                    if((i+1)==arr.length) { 
                        self.setState({seats: temp},() => {
                            self.studentList();
                        })
                    }
                });
            } 
        } 
    }

    render() {
        return <DashboardLayout title="Student" user={this.props.auth.user} ><div className="noselect">
            <div className="app-content-header"> 
                <div className="container-fluid"> 
                    <div className="row">
                    <div className="col-sm-6"><h3 className="mb-0"><i className="nav-icon bi bi-person-lines-fill"></i> Class Seat</h3></div>
                    <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-end">
                            <li className="breadcrumb-item"><Link href="/admin/dashboard">Dashboard</Link></li>
                            <li className="breadcrumb-item"><Link href="/teacher/class/subject">Class Subjects</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Class Seat</li>
                        </ol>
                    </div>
                    </div> 
                </div> 
            </div>

            <div className="app-content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-2">
                            <label htmlFor="seat_row" className="form-label">Seat Rows</label>
                            <input type="number" min={0} max={10} className="form-control text-center" id="seat_row" defaultValue={this.state.table_row} onChange={(e) => this.setState({table_row: e.target.value})}  />
                            <div id="seat_row-alert" className="invalid-feedback">Please select a valid state.</div>
                        </div>
                        <div className="col-md-2">
                            <label htmlFor="seat_column" className="form-label">Seat Column</label>
                            <input type="number" min={0} max={10} className="form-control text-center" id="seat_column" defaultValue={this.state.table_column}  onChange={(e) => this.setState({table_column: e.target.value})} />
                            <div id="seat_column-alert" className="invalid-feedback">Please select a valid state.</div>
                        </div>
                        <div className="col-md-2">
                            <label htmlFor="seat_row" className="form-label">Total Student</label>
                            <input type="number" readOnly min={0} max={10} className="form-control text-center" id="seat_row" defaultValue={this.state.studentsListTemp.length} />
                            <div id="seat_row-alert" className="invalid-feedback">Please select a valid state.</div>
                        </div>
                        <div className="col-md-4 pt-3">
                            <button className="btn btn-primary btn-lg" onClick={() => { this.saveData(); }} >Update</button>
                        {(this.state.existing_class.length>0&&this.state.seats.length==0)?
                            <button className="btn btn-info btn-lg ml-1" onClick={() => { this.loadExistingData(); }} >Existing Assign</button>
                        :<></>}
                        </div>
                    </div>
                    <div className="float hands mt-2">                        
                        <div className="center hands-70 float-start">
                            <img className="transform -scale-x-100" src="/images/hands2.png" />
                            LEFT
                        </div>
                        <div className="center hands-70 float-end">
                            <img className="" src="/images/hands2.png" />
                            RIGHT
                        </div>
                    </div>
                    <div className="row"> 

                        <div className="mx-auto mt-5">
                            <div className="container text-center">
                                {Array.from({length: this.state.table_row}).map((v,a,arr1) => {
                                    let count = a*this.state.table_column;
                                    return  <div key={`seat_${a}`} className="row align-items-center">
                                        {Array.from({length: this.state.table_column}).map((v,b,arr2) => {
                                            count++;
                                            let count_=this.state.table_row*this.state.table_column-count;
                                            return  <div key={`seat_${a}_${b}`} className="col mt-3 mb-3">
                                                        <center>                                                
                                                            <div className="attendance_icons">
                                                                <img src="/images/student_chair.png" id={`col_${b}_row_${a}_chair`} className="student_chair" alt="" />
                                                                {(this.state.seats.length>0&&this.state.seats.find(e=>e.seat_number==(count_+1))!=undefined)?<img src="/adminlte/dist/assets/img/avatar.png" className="attendance_prof_img rounded-circle shadow auto-margin-lr" alt=""  />:null}
                                                                {/* <img src="/adminlte/dist/assets/img/avatar.png" className="attendance_prof_img rounded-circle shadow auto-margin-lr" alt=""  /> */}
                                                            </div>
                                                            {(this.state.seats.length>0&&this.state.seats.find(e=>e.seat_number==(count_+1))!=undefined)?<><label id={`col_${b}_row_${a}_name`} className="badge text-bg-success" title={this.state.seats.find(e=>e.seat_number==(count_+1)).fullname} >{this.state.seats.find(e=>e.seat_number==(count_+1)).last_name}</label><br /></>:<></>}
                                                            <label id={`col_${b}_row_${a}_count`} className="badge text-bg-primary" ># {count_+1}</label>
                                                            <div>
                                                            {(this.state.seats.length==0||this.state.seats.find(e=>e.seat_number===(count_+1))==undefined)?<button id={`bx_${count_+1}`} className="btn btn-xs btn-success" onClick={() => {
                                                                // $(`#col_${b}_row_${a}_chair`).removeClass('student_chair_absent');  
                                                                // $(`#col_${b}_row_${a}_chair`).addClass('student_chair_present');
                                                                if(this.state.studentsListTemp.length>0) {
                                                                    this.setState({
                                                                        selectSeat: count_+1
                                                                    });
                                                                    $("#studentModel").modal('show');
                                                                } else {
                                                                    Swal.fire({  
                                                                        title: "No student added to this class", 
                                                                        showCancelButton: true,
                                                                        showConfirmButton: false,
                                                                        allowOutsideClick: false,
                                                                        allowEscapeKey: false,
                                                                        cancelButtonText: "Ok",
                                                                        confirmButtonText: "Close",
                                                                        confirmButtonColor: "#DD6B55",
                                                                        icon: "error",
                                                                        showLoaderOnConfirm: true, 
                                                                        closeOnClickOutside: false,  
                                                                        dangerMode: true,
                                                                    });
                                                                }
                                                            }}><i className="bi bi-plus"></i></button>:null}
                                                            
                                                            {(this.state.seats.length>0&&this.state.seats.find(e=>e.seat_number===(count_+1))!=undefined)?<button id={`bx_${count_+1}`} className="btn btn-xs btn-danger" onClick={() => {
                                                                // $(`#col_${b}_row_${a}_chair`).removeClass('student_chair_present');
                                                                // $(`#col_${b}_row_${a}_chair`).addClass('student_chair_absent');
                                                                this.setState({
                                                                    selectSeat: count_+1
                                                                },() => {
                                                                    this.removeStudent(count_+1);
                                                                });
                                                            }}><i className="bi bi-x"></i></button>
                                                            :null}
                                                            </div>
                                                        </center>
                                                    </div>
                                        })}
                                    </div>
                                })}
                            </div>
                        </div>
                    </div>

                </div>
            </div>


            <datalist id="selectStudent"> 
                <EachMethod of={this.state.studentsList} render={(element,index) => {
                    return <option >{`${element.last_name}, ${element.first_name}`}</option>
                }} />
            </datalist>
            
            <div className="modal fade" tabIndex="-1" role="dialog" id="studentModel" aria-hidden="true" data-bs-backdrop="static">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title fs-5">Add Student {(this.state.selectSeat!=0)?<i className="fs-6">(Selected Seat # {this.state.selectSeat})</i>:<></>} </h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"> 
                        </button>
                    </div>
                    <div className="modal-body">
                        
                        <div className="card-body"> 
                            <div className="row g-3"> 
                                
                                <div className="col-md-12">
                                    <label htmlFor="studentselection" className="form-label">Student</label>
                                    <input type="text" className="form-control" list="selectStudent"  id="studentselection" defaultValue="" required="" onChange={(e) => {  $("#studentselection-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({studentselection: e.target.value})}}  />
                                    <div id="studentselection-alert" className="invalid-feedback">Please select a valid state.</div>
                                </div> 

                            </div> 
                        </div>

                    </div>
                    <div className="modal-footer"> 
                        <button className="btn btn-success float-right mr-1" onClick={() =>{ this.addStudent() }}> <i className="bi bi-save"></i> Add</button>   
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    </DashboardLayout>}
}
