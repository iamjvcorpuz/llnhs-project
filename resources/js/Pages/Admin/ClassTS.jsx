import React,{ Component } from "react";
import { Link } from '@inertiajs/react';
import { EachMethod } from '@/Components/EachMethod'
import swal from 'sweetalert';
import Swal from 'sweetalert2';

import ReactTable from "@/Components/ReactTable"; 

import DashboardLayout from '@/Layouts/DashboardLayout';


export default class ClassTS extends Component {
    constructor(props) {
		super(props);
        this.state = { 
            classroom_temp: this.props.classroom, 
            classroom: [],
            subjects: this.props.subjects, 
            teachers: this.props.teacher,
            advisoryList: this.props.advisory,
            sectionListTemp: this.props.sections,
            sectionList: [],
            yeargrade_temp: this.props.schoolyeargrades,
            yeargrade: [],
            data: this.props.class,
            data_users: [],
            columns: [
                {
                    id: "no",
                    accessor: 'index',
                    Header: 'No.', 
                    width: 50,
                    className: "center"
                }, 
                {
                    id: "level",
                    Header: 'Level',  
                    accessor: 'level',
                    className: "center",
                    width: 126,
                }, 
                {
                    id: "grade",
                    Header: 'Grade', 
                    width: 126,
                    accessor: 'grade'
                }, 
                {
                    id: "classroom",
                    Header: 'Classroom No.',  
                    width: 100,
                    accessor: 'classroom',
                    className: "center"
                },   
                {
                    id: "section",
                    Header: 'Section Name',  
                    width: 300,
                    accessor: 'section_name',
                    className: "center"
                },   
                {
                    id: "track",
                    Header: 'TRACK',  
                    width: 300,
                    accessor: 'track',
                    className: "center"
                },   
                {
                    id: "strand",
                    Header: 'STRAND',  
                    width: 300,
                    accessor: 'strands',
                    className: "center"
                },   
                {
                    id: "schoolyear",
                    Header: 'School Year',  
                    width: 300,
                    accessor: 'school_year',
                    className: "center"
                },   
                {
                    id: "action",
                    Header: 'Action',  
                    width: 130, 
                    accessor: 'index',
                    className: "center",
                    Cell: ({row}) => { 
                       return <>
                       <button className="btn btn-danger btn-block btn-sm col-12 mb-1" onClick={()=>{this.delete(row.original.id);}}> <i className="bi bi-person-fill-x"></i> Remove</button>    
                       <button onClick={()=>{
                            $("#uyearlevel").val('');
                            $("#ugrade").val('');
                            $("#uclassroom").val('');
                            $("#uschoolyear").val(''); 
                            $("#uflsh_track").val(''); 
                            $("#uflsh_strand").val(''); 
                            $("#usectionname").val(''); 
                            this.selectData(row.original);
                        }} className="btn btn-primary btn-block btn-sm col-12 mb-1"> <i className="bi bi-pen"></i> Edit</button>  
                       </>            
                    }
                }
            ],
            id: "",
            room_no: "",
            floor_no: "",
            building_no: "",
            description: "",
            selectedData: {},
            track: this.props.track,
            strand: this.props.strand
        }
        console.log(this.props)
        this.delete = this.delete.bind(this);
        this.saveData = this.saveData.bind(this);
        this.updateData = this.updateData.bind(this);
        this.selectSubject = this.selectData.bind(this);
        this.getAllData = this.getAllData.bind(this);

    }

    componentDidMount() {
        this.getAllData();
        if(this.state.data.length>0) {
            this.setState({
                classroom: this.state.classroom_temp.filter(e => this.state.data.some( ee => ee.classroom_id==e.id)?false:true)
            });
        }
    }
    
    selectData(data) {
        let self = this;
        console.log(data);
        if(data.level == "Junior") {
            let temp = self.state.yeargrade_temp.filter(e =>  e.year_grade=="Grade 7"||e.year_grade=="Grade 8" );
            self.setState({
                yeargrade: temp
            })
        } else {                                            
            let temp = self.state.yeargrade_temp.filter(e => e.year_grade=="Grade 9"||e.year_grade=="Grade 10"||e.year_grade=="Grade 11"||e.year_grade=="Grade 12");
            self.setState({
                yeargrade: temp
            })
        }
        $("#uyearlevel").val(data.level);
        $("#ugrade").val(data.grade_id);
        $("#uschoolyear").val(data.school_year); 
        $("#uflsh_track").val(data.track); 
        $("#uflsh_strand").val(data.strands); 
        $("#sectionname").val(data.description); 
        this.setState({selectedData:data, classroom: this.state.classroom_temp},() => {
            $("#updateClass").modal('show');
            setTimeout(() => {
                // $("#uyearlevel").val(data.level);
                $("#ugrade").val(data.grade_id); 
                $("#uclassroom").val(data.classroom_id);
                $("#uschoolyear").val(data.school_year); 
                $("#uflsh_track").val(data.track); 
                $("#uflsh_strand").val(data.strands);  
                $("#sectionname").val(data.description); 
            }, 1000);
        }); 
    }

    getAllData() {
        let self = this;
        axios.get('/tsclass').then(function (response) {
            console.log(response);
            if( typeof(response.status) != "undefined" && response.status == "200" ) {
                let data = typeof(response.data) != "undefined" && typeof(response.data)!="undefined"?response.data:{};
                if(Object.keys(data).length>0) {
                    self.setState({
                        classroom_temp: data.classroom, 
                        classroom: [],
                        subjects: data.subjects, 
                        teachers: data.teacher,
                        advisoryList: data.advisory,
                        sectionListTemp: data.sections,
                        sectionList: [],
                        yeargrade_temp: data.schoolyeargrades,
                        yeargrade: [],
                        data: data.class,
                    },() => {
                        if(self.state.data.length>0) {
                            self.setState({
                                classroom: self.state.classroom_temp.filter(e => self.state.data.some( ee => ee.classroom_id==e.id)?false:true)
                            });
                        }
                    });
                } else {
                    self.setState({
                        data: [] 
                    });
                }
            }
        });
    }

    saveData() {
        let self = this; 
        let yearlevel = $("#yearlevel").val(); 
        let grade = $("#grade").val(); 
        let classroom = $("#classroom").val(); 
        let schoolyear = $("#schoolyear").val();
        let flsh_track = $("#flsh_track").val();
        let flsh_strand = $("#flsh_strand").val();  
        let section_name = $("#sectionname").val();  
        

        if(yearlevel != "" && grade != "" && classroom != "" && schoolyear != ""&& flsh_track != ""&& flsh_strand != "" ) { 
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
                        yearlevel,
                        grade,
                        classroom,
                        schoolyear,
                        flsh_track,
                        flsh_strand,
                        section_name
                    };
                    console.log(datas);
                    axios.post('/tsclass',datas).then( async function (response) {
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
                                            $("#yearlevel").val('');
                                            $("#grade").val('');
                                            $("#classroom").val('');
                                            $("#schoolyear").val(''); 
                                            $("#flsh_track").val(''); 
                                            $("#flsh_strand").val(''); 
                                            $("#sectionname").val(""); 
                                            $("#newClass").modal('hide');
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
            if(subject_name == "") {
                $("#subject_name-alert").removeAttr('class');
                $("#subject_name-alert").html('Required Field');
                $("#subject_name-alert").addClass('d-block invalid-feedback');
            }
            if(description == "") {
                $("#description-alert").removeAttr('class');
                $("#description-alert").html('Required Field');
                $("#description-alert").addClass('d-block invalid-feedback');
            }
        }
    }

    updateData() {
        let self = this;  
        let yearlevel = $("#uyearlevel").val(); 
        let grade = $("#ugrade").val(); 
        let classroom = $("#uclassroom").val(); 
        let schoolyear = $("#uschoolyear").val();
        let flsh_track = $("#uflsh_track").val();
        let flsh_strand = $("#uflsh_strand").val();  
        let section_name = $("#usectionname").val();  


        if(yearlevel != "" && grade != "" && classroom != "" && schoolyear != ""&& flsh_track != ""&& flsh_strand != "" ) { 
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
                        id: self.state.selectedData.id,
                        yearlevel,
                        grade,
                        classroom,
                        schoolyear,
                        flsh_track,
                        flsh_strand,
                        section_name
                    };
                    // console.log(datas);
                    axios.post('/tsclass/update',datas).then( async function (response) {
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
                                            $("#updateClass").modal('hide');
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
            if(subject_name == "") {
                $("#usubject_name-alert").removeAttr('class');
                $("#usubject_name-alert").html('Required Field');
                $("#usubject_name-alert").addClass('d-block invalid-feedback');
            }
            if(description == "") {
                $("#udescription-alert").removeAttr('class');
                $("#udescription-alert").html('Required Field');
                $("#udescription-alert").addClass('d-block invalid-feedback');
            }
        }
    }
    
    delete(id) {
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
                console.log(id)
                axios.delete('/tsclass',{data: {id:id}}).then(function (response) {
                    // handle success
                    console.log(response);
                        if( typeof(response.status) != "undefined" && response.status == "201" ) {
                            let data = typeof(response.data) != "undefined" && typeof(response.data)!="undefined"?response.data:{};
                            if(data.status ="sucess") {

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

    render() {
        return <DashboardLayout title="Student" user={this.props.auth.user} ><div className="noselect">
            <div className="app-content-header"> 
                <div className="container-fluid"> 
                    <div className="row">
                    <div className="col-sm-6"><h3 className="mb-0"><i className="nav-icon bi bi-people-fill"></i> Class</h3></div>
                    <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-end">
                            <li className="breadcrumb-item"><Link href="/admin/dashboard">Dashboard</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Class</li>
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
                                    <h3 className="card-title"> <i className="bi bi-people-fill"></i> Class List</h3>
                                    <button className="btn btn-primary float-right mr-1" onClick={() => {

                                        // $("#room").val('');
                                        // $("#floor").val('');
                                        // $("#building").val('');
                                        // $("#description").val(''); 
                                        this.setState({
                                            classroom: this.state.classroom_temp.filter(e => this.state.data.some( ee => ee.classroom_id==e.id)?false:true)
                                        });
                                        $('#newClass').modal('show');
                                    }}> <i className="bi bi-plus"></i> Add</button>    
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
            
        </div>

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


        <datalist id="selectedYearLevel">
            <option >Grade 7</option>
            <option >Grade 8</option>
            <option >Grade 9</option>
            <option >Grade 10</option>
            <option >Grade 11</option>
            <option >Grade 12</option>
        </datalist>
        
        <div className="modal fade" tabIndex="-1" role="dialog" id="newClass" aria-hidden="true" data-bs-backdrop="static">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title fs-5">New Class</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"> 
                        </button>
                    </div>
                    <div className="modal-body">
                        
                        <div className="card-body"> 
                            <div className="row g-3"> 
                                <div className="col-md-12">
                                    <label htmlFor="yearlevel" className="form-label">Level</label>                                            
                                    {/* <input type="text" className="form-control" list="selectedYearLevel" id="yearlevel" defaultValue="" required=""   /> */}

                                    <select name="yearlevel" id="yearlevel" className="form-control" onChange={(e) => { 
                                        //  $("#teacher-alert").removeAttr('class').addClass('invalid-feedback'); 
                                        //  $('#section').val("");
                                        //  console.log(e.target.value)
                                         if(e.target.value != "") {
                                            this.setState({selectedLevel: e.target.value})  
                                         }
                                         if(e.target.value == "Junior") {
                                            let temp = this.state.yeargrade_temp.filter(e =>  e.year_grade=="Grade 7"||e.year_grade=="Grade 8" );
                                            this.setState({
                                                yeargrade: temp
                                            })
                                        } else {                                            
                                            let temp = this.state.yeargrade_temp.filter(e => e.year_grade=="Grade 9"||e.year_grade=="Grade 10"||e.year_grade=="Grade 11"||e.year_grade=="Grade 12");
                                            this.setState({
                                                yeargrade: temp
                                            })
                                        }
                                         }}>
                                         <option disabled >--Select Level--</option>
                                         <option value="" ></option>
                                        <option >Junior</option>
                                        <option >Senior</option>
                                    </select>
                                    <div id="yearlevel-alert" className="invalid-feedback">Please select a valid state.</div>
                                </div>
                                <div className="col-md-12">
                                    <label htmlFor="grade" className="form-label">Grade</label>                                            
                                    {/* <input type="text" className="form-control" list="selectedYearLevel" id="yearlevel" defaultValue="" required=""   /> */}

                                    <select name="grade" id="grade" className="form-control" onChange={(e) => { 
                                         $("#grade-alert").removeAttr('class').addClass('invalid-feedback'); 
                                         if(e.target.value != "") {
                                            this.setState({selectedGrade: e.target.value})  
                                         }
                                         }}>
                                         <option disabled >--Select Grade--</option>
                                         <option value="" ></option>
                                        <EachMethod of={this.state.yeargrade} render={(element,index) => {
                                            return <option value={`${element.id}`} >{`${element.year_grade}`}</option>
                                        }} />
                                    </select>
                                    <div id="grade-alert" className="invalid-feedback">Please select a valid state.</div>
                                </div>
                                <div className="col-md-12">
                                    <label htmlFor="section" className="form-label">Classroom No.</label>
                                    {/* <input type="text" className="form-control" list="selectedSection" id="classroom" defaultValue="" required="" onChange={(e) => {  $("#teacher-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({selectedSection: e.target.value})}}  /> */}
                                    <select name="classroom" id="classroom" className="form-control" onChange={(e) => { 
                                         $("#grade-alert").removeAttr('class').addClass('invalid-feedback'); 
                                         if(e.target.value != "") {
                                            this.setState({selectedClassroom: e.target.value})  
                                         }
                                         }}>
                                        <option disabled >--Select Classroom--</option>
                                        <option value="" ></option>
                                        <EachMethod of={this.state.classroom} render={(element,index) => {
                                            return <option value={`${element.id}`} >{`${element.room_number}`}</option>
                                        }} />
                                    </select>
                                    <div id="section-alert" className="invalid-feedback">Please select a valid state.</div>
                                </div>
                                <div className="col-md-12">
                                    <label htmlFor="sectionname" className="form-label">Section Name</label>
                                    <input type="text" className="form-control" id="sectionname" defaultValue="" required="" onChange={(e) => {  $("#sectionname-alert").removeAttr('class').addClass('invalid-feedback'); }}  />
                                    <div id="sectionname-alert" className="invalid-feedback">Please select a valid state.</div>
                                </div>

                                <div className="col-md-12">
                                    <label htmlFor="schoolyear" className="form-label">School Year</label>
                                    <input type="text" className="form-control" list="selectedSY" id="schoolyear" defaultValue="" required="" onChange={(e) => {  $("#teacher-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({selectedSY: e.target.value})}}  />
                                    <div id="schoolyear-alert" className="invalid-feedback">Please select a valid state.</div>
                                </div>

                                <div className="col-md-12">
                                    <label htmlFor="flsh_track" className="form-label">Track</label>
                                    {/* <input type="text" className="form-control" id="flsh_track" defaultValue="" required="" onChange={(e) => { $("#flsh_track-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({flsh_track: e.target.value})}}  /> */}
                                    <select name="flsh_track" id="flsh_track" className="form-control"  onChange={(e) => { $("#flsh_track-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({flsh_track: e.target.value})}} >
                                        <option value=""></option>
                                            <EachMethod of={this.state.track} render={(element,index) => {
                                                return <option >{`${element.name} ${(element.acronyms!=""?"("+element.acronyms+")":"")}`}</option>
                                            }} />
                                    </select>
                                    <div id="flsh_track-alert" className="valid-feedback">Looks good!</div>
                                </div> 
                                <div className="col-md-12">
                                    <label htmlFor="flsh_strand" className="form-label">Strand</label>
                                    {/* <input type="text" className="form-control" id="flsh_strand" defaultValue="" required="" onChange={(e) => { $("#flsh_strand-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({flsh_strand: e.target.value})}}  /> */}
                                    <select name="flsh_strand" id="flsh_strand" className="form-control" onChange={(e) => { $("#flsh_strand-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({flsh_strand: e.target.value})}}>
                                        <option value=""></option>
                                            <EachMethod of={this.state.strand} render={(element,index) => {
                                                return <option >{`${element.name} ${(element.acronyms!=""?"("+element.acronyms+")":"")}`}</option>
                                            }} />
                                    </select>
                                    <div id="flsh_strand-alert" className="valid-feedback">Looks good!</div>
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

        <div className="modal fade" tabIndex="-1" role="dialog" id="updateClass" aria-hidden="true" data-bs-backdrop="static">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title fs-5">Update Class</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"> 
                    </button>
                </div>
                <div className="modal-body">
                    
                    <div className="card-body"> 
                        <div className="row g-3"> 
                            <div className="col-md-12">
                                <label htmlFor="yearlevel" className="form-label">Level</label>                                            
                                {/* <input type="text" className="form-control" list="selectedYearLevel" id="yearlevel" defaultValue="" required=""   /> */}

                                <select name="uyearlevel" id="uyearlevel" className="form-control" onChange={(e) => { 
                                    //  $("#teacher-alert").removeAttr('class').addClass('invalid-feedback'); 
                                    //  $('#section').val("");
                                    //  console.log(e.target.value)
                                        if(e.target.value != "") {
                                            this.setState({selectedLevel: e.target.value})  
                                        }
                                        if(e.target.value == "Junior") {
                                            let temp = this.state.yeargrade_temp.filter(e =>  e.year_grade=="Grade 7"||e.year_grade=="Grade 8" );
                                            this.setState({
                                                yeargrade: temp
                                            })
                                        } else {                                            
                                            let temp = this.state.yeargrade_temp.filter(e => e.year_grade=="Grade 9"||e.year_grade=="Grade 10"||e.year_grade=="Grade 11"||e.year_grade=="Grade 12");
                                            this.setState({
                                                yeargrade: temp
                                            })
                                        }
                                        }}>
                                        <option disabled >--Select Level--</option>
                                        <option value="" ></option>
                                    <option >Junior</option>
                                    <option >Senior</option>
                                </select>
                                <div id="uyearlevel-alert" className="invalid-feedback">Please select a valid state.</div>
                            </div>
                            <div className="col-md-12">
                                <label htmlFor="ugrade" className="form-label">Grade</label>                                            
                                {/* <input type="text" className="form-control" list="selectedYearLevel" id="yearlevel" defaultValue="" required=""   /> */}

                                <select name="ugrade" id="ugrade" className="form-control" onChange={(e) => { 
                                        $("#grade-alert").removeAttr('class').addClass('invalid-feedback'); 
                                        if(e.target.value != "") {
                                        this.setState({selectedGrade: e.target.value})  
                                        }
                                        }}>
                                        <option disabled >--Select Grade--</option>
                                        <option value="" ></option>
                                    <EachMethod of={this.state.yeargrade} render={(element,index) => {
                                        return <option value={`${element.id}`} >{`${element.year_grade}`}</option>
                                    }} />
                                </select>
                                <div id="ugrade-alert" className="invalid-feedback">Please select a valid state.</div>
                            </div>
                            <div className="col-md-12">
                                <label htmlFor="uclassroom" className="form-label">Classroom</label>
                                {/* <input type="text" className="form-control" list="selectedSection" id="classroom" defaultValue="" required="" onChange={(e) => {  $("#teacher-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({selectedSection: e.target.value})}}  /> */}
                                <select name="uclassroom" id="uclassroom" className="form-control" onChange={(e) => { 
                                        $("#grade-alert").removeAttr('class').addClass('invalid-feedback'); 
                                        if(e.target.value != "") {
                                        this.setState({selectedClassroom: e.target.value})  
                                        }
                                        }}>
                                    <option disabled >--Select Classroom--</option>
                                    <option value="" ></option>
                                    <EachMethod of={this.state.classroom} render={(element,index) => {
                                        return <option value={`${element.id}`} >{`${element.room_number}`}</option>
                                    }} />
                                </select>
                                <div id="uclassroom-alert" className="invalid-feedback">Please select a valid state.</div>
                            </div>
                            <div className="col-md-12">
                                <label htmlFor="usectionname" className="form-label">Section Name</label>
                                <input type="text" className="form-control" id="usectionname" defaultValue="" required="" onChange={(e) => {  $("#usectionname-alert").removeAttr('class').addClass('invalid-feedback'); }}  />
                                <div id="usectionname-alert" className="invalid-feedback">Please select a valid state.</div>
                            </div>
                            <div className="col-md-12">
                                <label htmlFor="uschoolyear" className="form-label">School Year</label>
                                <input type="text" className="form-control" list="selectedSY" id="uschoolyear" defaultValue="" required="" onChange={(e) => {  $("#uschoolyear-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({selectedSY: e.target.value})}}  />
                                <div id="uschoolyear-alert" className="invalid-feedback">Please select a valid state.</div>
                            </div>

                            <div className="col-md-12">
                                <label htmlFor="uflsh_track" className="form-label">Track</label>
                                {/* <input type="text" className="form-control" id="flsh_track" defaultValue="" required="" onChange={(e) => { $("#flsh_track-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({flsh_track: e.target.value})}}  /> */}
                                <select name="uflsh_track" id="uflsh_track" className="form-control"  onChange={(e) => { $("#uflsh_track-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({flsh_track: e.target.value})}} >
                                    <option value=""></option>
                                        <EachMethod of={this.state.track} render={(element,index) => {
                                            return <option >{`${element.name} ${(element.acronyms!=""?"("+element.acronyms+")":"")}`}</option>
                                        }} />
                                </select>
                                <div id="uflsh_track-alert" className="valid-feedback">Looks good!</div>
                            </div> 
                            <div className="col-md-12">
                                <label htmlFor="uflsh_strand" className="form-label">Strand</label>
                                {/* <input type="text" className="form-control" id="flsh_strand" defaultValue="" required="" onChange={(e) => { $("#flsh_strand-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({flsh_strand: e.target.value})}}  /> */}
                                <select name="uflsh_strand" id="uflsh_strand" className="form-control" onChange={(e) => { $("#uflsh_strand-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({flsh_strand: e.target.value})}}>
                                    <option value=""></option>
                                        <EachMethod of={this.state.strand} render={(element,index) => {
                                            return <option >{`${element.name} ${(element.acronyms!=""?"("+element.acronyms+")":"")}`}</option>
                                        }} />
                                </select>
                                <div id="uflsh_strand-alert" className="valid-feedback">Looks good!</div>
                            </div>

                        </div> 
                    </div>

                </div>
                <div className="modal-footer"> 
                    <button className="btn btn-success float-right mr-1" onClick={() =>{ this.updateData() }}> <i className="bi bi-save"></i> Update</button>   
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
                </div>
            </div>
        </div>
    </DashboardLayout>}
}
