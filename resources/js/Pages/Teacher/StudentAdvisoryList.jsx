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

export default class StudentAdvisoryList extends Component {
    constructor(props) {
		super(props);
        this.state = {
            data: this.props.students,
            columns: [
                {
                    id: "no",
                    accessor: 'no',
                    Header: 'No.', 
                    width: 100,
                    className: "center"
                }, 
                {
                    id: "picture",
                    Header: 'Picture',  
                    accessor: 'photo',
                    Cell: ({row}) => { 
                       return <img className="" height={150} width={150}  onError={(e)=>{ 
                            e.target.src=(row.original.sex=="Male")?'/adminlte/dist/assets/img/avatar.png':'/adminlte/dist/assets/img/avatar-f.jpeg'; 
                       }} alt="Picture Error" src={(row.original.photo!=null&&row.original.photo!="")?row.original.photo:(row.original.sex=="Male")?'/adminlte/dist/assets/img/avatar.png':'/adminlte/dist/assets/img/avatar-f.jpeg'} />
                    }
                }, 
                {
                    id: "lrn",
                    accessor: 'lrn',
                    Header: 'LRN NO.', 
                    maxWidth: 100,
                },
                {
                    id: "fullname",
                    Header: 'Fullname', 
                    width: 800,
                    accessor: 'fullname'
                }, 
                {
                    id: "action",
                    Header: 'Action',  
                    width: 200,
                    accessor: 'fullname',
                    className: "center",
                    Cell: ({row}) => { 
                       return <>                       
                        <button className="btn btn-danger btn-block btn-sm col-12 mb-1" onClick={()=>{this.deleteStudent(row.original.id);}}> <i className="bi bi-person-fill-x"></i> Remove</button>
                       </>            
                    }
                }
            ],
            studentsList: this.props.studentsList,
            yeargrade: this.props.schoolyeargrades,
            class: this.props.class,
            advisoryList: this.props.advisory,
            sectionListTemp: this.props.sections,
            track: this.props.track,
            strand: this.props.strand,
            advisory: (typeof(this.props.advisory)!="undefined"&&this.props.advisory.length>0)?this.props.advisory[0]:{},
        }
        this._isMounted = false;
        this.loadStudentList = this.loadStudentList.bind(this);
        this.deleteStudent = this.deleteStudent.bind(this);
        this.getAllData = this.getAllData.bind(this);
        this.saveStudent = this.saveStudent.bind(this);
        
        console.log(this.props)
    }
    
    componentDidMount() {
        this._isMounted = true;
        // this.loadStudentList();
        // console.log(this)
        // let list  = [];
        // for (let index = 0; index < 10; index++) {

        //     list.push({
        //         no: index + 1,
        //         photo: "",
        //         lrn: '00000000000000000000',
        //         fullname: "Student " + index,
        //         level: " Grade " + index,
        //         section: "Section "  + index,
        //         status: "Active"
        //     })
            
        // }
        // this.setState({data: list});
        this.getAllData();
    }

    getAllData() {
        let self = this;
        axios.get('/teacher/advisory/student/' + this.props.code).then(function (response) {
            // console.log(response);
            if( typeof(response.status) != "undefined" && response.status == "200" ) {
                let data = typeof(response.data) != "undefined" && typeof(response.data)!="undefined"?response.data:{};
                if(Object.keys(data).length>0) {
                    self.setState({
                        data: data.students,
                        studentList: data.studentList, 
                        class: data.class,
                        advisoryList: data.advisory,
                        sectionListTemp: data.sections,
                        sectionList: data.schoolyeargrades,
                        yeargrade: data.schoolyeargrades,
                        track: data.track,
                        strand: data.strand,
                        studentsList: data.studentsList,
                        advisory: (typeof(data.advisory)!="undefined"&&data.advisory.length>0)?data.advisory[0]:{},
                    });
                    
                }
            }
        });
    }

    loadStudentList() {
        let list  = []; 
        let self = this;
        axios.get('/student').then(function (response) {
          // handle success
        //   console.log(response)
            if( typeof(response.status) != "undefined" && response.status == "200" ) {
                let data = typeof(response.data) != "undefined" && typeof(response.data.data)!="undefined"?response.data.data:[];
                data.forEach((element,index,arr) => {
                    if(element.status != "remove") {
                        list.push({
                            no: index + 1,
                            id: element.id,
                            photo: element.picture_base64,
                            lrn: element.lrn,
                            fullname: `${element.last_name}, ${element.first_name} ${(element.extension_name!=null)?element.extension_name:''} ${element.middle_name}`.toLocaleUpperCase(),
                            level: "None",
                            section: "None",
                            sex: element.sex,
                            status: element.status
                        });
                    }
                    if((index + 1) == arr.length) {
                        self.setState({data: list});
                    }                    
                });
                // console.log(data);
            }
        }).catch(function (error) {
          // handle error
        //   console.log(error);
        }).finally(function () {
          // always executed
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
                axios.delete('/teacher/advisory/student',{data: {id:id}}).then(function (response) {
                    // handle success
                    // console.log(response);
                        if( typeof(response.status) != "undefined" && response.status == "201" ) {
                            let data = typeof(response.data) != "undefined" && typeof(response.data)!="undefined"?response.data:{};
                            if(data.status ="sucess") {
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
                            if(data.status ="data_not_exist") { 
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
        let advisory_id = self.state.advisory.id;


        console.log(selected_student,select_student_id);
        // return;
        if(selected_student != "" && typeof(select_student_id) != "undefined" && typeof(advisory_id) != "undefined") { 
            Swal.fire({
                title: "You select " + selected_student.toLocaleUpperCase() + " and please click to continue to save", 
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
                        advisory_id,
                        select_student_id
                    };
                    console.log(datas);
                    axios.post('/teacher/advisory/student/add',datas).then( async function (response) {
                        // handle success
                        console.log(response);
                            if( typeof(response.status) != "undefined" && response.status == "201" ) {
                                let data = typeof(response.data) != "undefined" && typeof(response.data)!="undefined"?response.data:{};
                                if(data.status ="sucess") {
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
                                if(data.status ="data_exist") { 
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
                      })
                } else if(result.isDismissed) {

                }
                return false
            });            
        } else {
            
            if(selected_student == "") {
                $("#studentselection-alert").removeAttr('class');
                $("#studentselection-alert").html('Required Field');
                $("#studentselection-alert").addClass('d-block invalid-feedback');
            }
        }
    }

    render() { 
        return <DashboardLayout title="Student" user={this.props.auth.user}>
            <div className="app-content-header"> 
                <div className="container-fluid"> 
                    <div className="row">
                    <div className="col-sm-6"><h3 className="mb-0"><i className="nav-icon bi bi-person-lines-fill"></i> Student</h3></div>
                    <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-end">
                            <li className="breadcrumb-item"><i className="bi bi-speedometer mr-2"></i><Link href="/admin/dashboard">Dashboard</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Student</li>
                        </ol>
                    </div>
                    </div> 
                </div> 
            </div>

            <div className="app-content">
                <div className="container-fluid">
                    <div className="row"> 
                        <div className="col-md-6">
                            <label htmlFor="yearlevel" className="form-label">Grade</label>                                            
                            {/* <input type="text" className="form-control" list="selectedYearLevel" id="yearlevel" defaultValue="" required=""   /> */}

                            <select name="yearlevel" id="yearlevel" className="form-control" value={this.state.yeargrade.find( e => e.year_grade==this.state.advisory.year_level).id} aria-readonly onChange={(e) => {  }}>
                                <option disabled >--Select Grade--</option>
                                <option value="" ></option>
                                <EachMethod of={this.state.yeargrade} render={(element,index) => {
                                    return <option value={`${element.id}`} >{`${element.year_grade}`}</option>
                                }} />
                            </select>
                            <div id="yearlevel-alert" className="invalid-feedback">Please select a valid state.</div>
                        </div> 

                        <div className="col-md-6">
                            <label htmlFor="sectionname" className="form-label">Section Name</label>
                            <input type="text" className="form-control" id="sectionname" defaultValue={this.state.advisory.section_name} required="" onChange={(e) => {  $("#sectionname-alert").removeAttr('class').addClass('invalid-feedback'); }}  />
                            <div id="sectionname-alert" className="invalid-feedback">Please select a valid state.</div>
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="schoolyear" className="form-label">School Year</label>
                            <input type="text" className="form-control" list="selectedSY" id="schoolyear" defaultValue={this.state.advisory.school_year} required="" onChange={(e) => {  $("#schoolyear-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({selectedSY: e.target.value})}}  />
                            <div id="schoolyear-alert" className="invalid-feedback">Please select a valid state.</div>
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="flsh_track" className="form-label">Track</label>
                            {/* <input type="text" className="form-control" id="flsh_track" defaultValue="" required="" onChange={(e) => { $("#flsh_track-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({flsh_track: e.target.value})}}  /> */}
                            <select name="flsh_track" id="flsh_track" className="form-control" defaultValue={this.state.advisory.track} onChange={(e) => { $("#flsh_track-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({flsh_track: e.target.value})}} >
                                <option value=""></option>
                                    <EachMethod of={this.state.track} render={(element,index) => {
                                        return <option >{`${element.name} ${(element.acronyms!=""?"("+element.acronyms+")":"")}`}</option>
                                    }} />
                            </select>
                            <div id="flsh_track-alert" className="valid-feedback">Looks good!</div>
                        </div> 
                        <div className="col-md-6">
                            <label htmlFor="flsh_strand" className="form-label">Strand</label>
                            {/* <input type="text" className="form-control" id="flsh_strand" defaultValue="" required="" onChange={(e) => { $("#flsh_strand-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({flsh_strand: e.target.value})}}  /> */}
                            <select name="flsh_strand" id="flsh_strand" className="form-control" defaultValue={this.state.advisory.strands}  onChange={(e) => { $("#flsh_strand-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({flsh_strand: e.target.value})}}>
                                <option value=""></option>
                                    <EachMethod of={this.state.strand} render={(element,index) => {
                                        return <option >{`${element.name} ${(element.acronyms!=""?"("+element.acronyms+")":"")}`}</option>
                                    }} />
                            </select>
                            <div id="flsh_strand-alert" className="valid-feedback">Looks good!</div>
                        </div>                
                    </div>
                    <br />
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card mb-4">
                                <div className="card-header">
                                    <div className="row d-flex">
                                        <div className="col-lg-2 me-auto">
                                            <h3 className="card-title mt-2 "> <i className="bi bi-person"></i> Student List</h3>
                                        </div>                                        
                                        <div className="col-lg-4">
                                            <div className="input-group">
                                                <span  className="input-group-text">School Year</span>
                                                <select  className="form-select" id="gender" required="" defaultValue="" >
                                                    <option disabled>Choose...</option>
                                                    <option>All</option>
                                                    <option>2021-2022</option>
                                                    <option>2022-2023</option>
                                                    <option>2023-2024</option>
                                                    <option>2024-2025</option>
                                                    <option>2025-2026</option>
                                                </select>
                                            </div> 
                                        </div>

                                        <button className="btn btn-primary col-lg-1 mr-1" onClick={() => {
                                            $("#studentModel").modal('show')
                                        }} > <i className="bi bi-person-plus-fill"></i> Add</button>    
                                    </div>
                                    
                                </div>
                                <div className="card-body">
                                <ReactTable
                                    key={"react-tables"}
                                    className={"table table-bordered table-striped "}
                                    data={this.state.data} 
                                    columns={this.state.columns}
                                    showHeader={true}
                                    showPagenation={true}
                                    defaultPageSize={5}
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

            <datalist id="selectStudent"> 
                <EachMethod of={this.state.studentsList} render={(element,index) => {
                    return <option >{`${element.last_name}, ${element.first_name}`}</option>
                }} />
            </datalist>

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
                                    <input type="text" className="form-control" list="selectStudent"  id="studentselection" defaultValue="" required="" onChange={(e) => {  $("#studentselection-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({studentselection: e.target.value})}}  />
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
        </DashboardLayout>
    }
}