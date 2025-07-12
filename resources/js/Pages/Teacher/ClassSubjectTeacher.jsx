import React,{ Component } from "react";
import { Link } from '@inertiajs/react';
import { EachMethod } from '@/Components/EachMethod'
import swal from 'sweetalert';
import Swal from 'sweetalert2';

import ReactTable from "@/Components/ReactTable"; 

import DashboardLayout from '@/Layouts/DashboardLayout';


export default class ClassSubjectTeacher extends Component {
    constructor(props) {
		super(props);
        this.state = {            
            data: [],
            subjects: this.props.subjects, 
            teachers: this.props.teacher,
            advisoryList: this.props.advisory,
            sectionListTemp: this.props.sections,
            sectionList: [],
            yeargrade: this.props.schoolyeargrades,
            class: this.props.class,
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
                    accessor: 'index',
                    Header: 'No.', 
                    width: 70,
                    className: "center"
                },
                {
                    id: "section",
                    Header: 'Section',  
                    accessor: 'section_name', 
                    width: 200,
                },
                {
                    id: "subject_name",
                    Header: 'Subject',  
                    accessor: 'subject_name', 
                    width: 200,
                },
                {
                    id: "year_level",
                    Header: 'Grade Level',  
                    width: 200,
                    accessor: 'grade'
                },
                {
                    id: "room",
                    Header: 'Room No.',  
                    width: 100,
                    className: "center",
                    accessor: 'classroom_number'
                },
                {
                    id: "time",
                    Header: 'Time',  
                    width: 180,
                    className: "center",
                    accessor: 'index',
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
                        {row.original.time_start} - {row.original.time_end} <br />
                        {(schedule_day.length>0)?schedule_day.toString().replaceAll(',',' - '):""}
                       </>            
                    }
                },
                {
                    id: "Action",
                    Header: 'Action',  
                    width: 150,
                    accessor: 'index',
                    className: "center",
                    Cell: ({row}) => { 
                       return <>
                        <Link href={`/teacher/class/seat/${row.original.class_id}/${row.original.id}`} className="btn btn-info btn-block btn-sm col-12"> <i className="bi bi-diagram-2-fill"></i> Seating</Link> 
                        <Link href={`/teacher/class/final/grading/${row.original.class_id}/${row.original.id}`} className="btn btn-success btn-block btn-sm col-12 mt-1" > <i className="bi bi-card-checklist"></i> Final Grades </Link> 
                       </>            
                    }
                }
            ],
            track: this.props.track,
            strand: this.props.strand,
            time_start: "",
            time_end: ""
        }

        this.delete = this.delete.bind(this);
        this.saveData = this.saveData.bind(this);
        this.updateData = this.updateData.bind(this);
        this.selectSubject = this.selectData.bind(this);
        this.getAllData = this.getAllData.bind(this);
        console.log(this.props);
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
        axios.get('/teacher/class/subjects').then(function (response) {
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
                        yeargrade: data.schoolyeargrades,
                        data: data.class_teaching,
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
        let teacher = $("#teacher").val(); 
        let teacher_id = "";
        let time_start = $("#time_start").val(); 
        let time_end = $("#time_end").val(); 
        let description = $("#description").val(); 
        let classts = $("#classts").val(); 
        let yearlevel = $("#yearlevel").val(); 
        let subject = $("#subject").val(); 
        let subject_name = this.state.subjects.find( e => e.id == $("#subject").val()).subject_name; 
        let grade = $("#yearlevel").val(); 
        let classroom = $("#classroom").val(); 
        let schoolyear = $("#schoolyear").val();
        let flsh_track = $("#flsh_track").val();
        let flsh_strand = $("#flsh_strand").val();  
        let section_name = $("#sectionname").val();  
        let monday = $("#monday").is(':checked');  
        let tuesday = $("#tuesday").is(':checked');  
        let wednesday = $("#wednesday").is(':checked');  
        let thursday = $("#thursday").is(':checked');  
        let friday = $("#friday").is(':checked');  
        let saturday = $("#saturday").is(':checked');  
        let sunday = $("#sunday").is(':checked');  


        try {
            teacher_id = self.state.teachers.find(e=>`${e.last_name}, ${e.first_name}`== teacher).id;
        } catch (error) {
            
        }
        // console.log({ 
        //     teacher_id,
        //     teacher,
        //     time_start,
        //     time_end,
        //     description,
        //     subject,
        //     subject_name,
        //     classts,
        //     yearlevel,
        //     grade,
        //     classroom,
        //     schoolyear,
        //     flsh_track,
        //     flsh_strand,
        //     section_name,
        //     monday,
        //     tuesday,
        //     wednesday,
        //     thursday,
        //     friday,
        //     saturday,
        //     sunday
        // })

        if(time_start != "" && time_end != "" && description != "" && classts != "" && subject != "" && yearlevel != "" && grade != "" && classroom != "" && schoolyear != ""&& flsh_track != ""&& flsh_strand != "" ) { 
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
                        teacher_id,
                        teacher,
                        time_start,
                        time_end,
                        description,
                        subject,
                        subject_name,
                        classts,
                        yearlevel,
                        grade,
                        classroom,
                        schoolyear,
                        flsh_track,
                        flsh_strand,
                        section_name,
                        monday,
                        tuesday,
                        wednesday,
                        thursday,
                        friday,
                        saturday,
                        sunday
                    };
                    // console.log(datas);
                    axios.post('/class/subject/teacher',datas).then( async function (response) {
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
                                            
                                            $("#monday").prop('checked', false);  
                                            $("#tuesday").prop('checked', false);  
                                            $("#wednesday").prop('checked', false);  
                                            $("#thursday").prop('checked', false);  
                                            $("#friday").prop('checked', false);  
                                            $("#saturday").prop('checked', false);  
                                            $("#sunday").prop('checked', false);  
                                            
                                            $("#teacher").val('');
                                            $("#time_start").val('');
                                            $("#time_end").val('');
                                            $("#description").val('');
                                            $("#subject").val('');
                                            $("#yearlevel").val('');
                                            $("#grade").val('');
                                            $("#classroom").val('');
                                            $("#schoolyear").val(''); 
                                            $("#flsh_track").val(''); 
                                            $("#flsh_strand").val(''); 
                                            $("#sectionname").val(""); 
                                            $("#newClassTeaching").modal('hide');
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
                    axios.post('/class/subject/teacher/update',datas).then( async function (response) {
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
                // console.log(id)
                axios.delete('/class/subject/teacher',{data: {id:id}}).then(function (response) {
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
        return <DashboardLayout title="Class Subject" user={this.props.auth.user} ><div className="noselect">
            <div className="app-content-header"> 
                <div className="container-fluid"> 
                    <div className="row">
                    <div className="col-sm-6"><h3 className="mb-0"><i className="nav-icon bi bi-microsoft-teams"></i> Class Subjects</h3></div>
                    <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-end">
                            <li className="breadcrumb-item"><Link href="/admin/dashboard">Dashboard</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Class Subjects</li>
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
                                    <h3 className="card-title"> <i className="bi bi-microsoft-teams"></i> Class Subject List</h3> 
                                    
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

        <div className="modal fade" tabIndex="-1" role="dialog" id="newClassTeaching" aria-hidden="true" data-bs-backdrop="static">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title fs-5">New Teaching Class</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"> 
                        </button>
                    </div>
                    <div className="modal-body">
                        
                        <div className="card-body"> 
                            <div className="row g-3"> 
                                
                                <div className="col-md-6">
                                    <label htmlFor="time_start" className="form-label">Time Start</label>
                                    <input type="time" className="form-control"id="time_start" defaultValue="08:00" min={"08:00"} required="" onChange={(e) => { console.log(e.target.value); this.setState({time_start:e.target.value}); $("#time_start-alert").removeAttr('class').addClass('invalid-feedback');}}  />
                                    <div id="time_start-alert" className="invalid-feedback">Please select a valid state.</div>
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="time_end" className="form-label">Time End</label>
                                    <input type="time" className="form-control" id="time_end" min={this.state.time_start} defaultValue={this.state.time_start} required="" onChange={(e) => {  $("#time_end-alert").removeAttr('class').addClass('invalid-feedback');}}  />
                                    <div id="time_end-alert" className="invalid-feedback">Please select a valid state.</div>
                                </div>
                                <div className="col-md-12">
                                    <div className="row">
                                        <div className="col-md-2">
                                            <div className="form-check">
                                                <input className="form-check-input" id="monday" type="checkbox" />
                                                <label className="form-check-label">Monday</label>
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="form-check">
                                                <input className="form-check-input" id="tuesday" type="checkbox" />
                                                <label className="form-check-label">Tuesday</label>
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="form-check">
                                                <input className="form-check-input" id="wednesday" type="checkbox" />
                                                <label className="form-check-label">Wednesday</label>
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="form-check">
                                                <input className="form-check-input" id="thursday" type="checkbox" />
                                                <label className="form-check-label">Thursday</label>
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="form-check">
                                                <input className="form-check-input" id="friday" type="checkbox" />
                                                <label className="form-check-label">Friday</label>
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="form-check">
                                                <input className="form-check-input" id="saturday" type="checkbox" />
                                                <label className="form-check-label">Saturday</label>
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="form-check">
                                                <input className="form-check-input" id="sunday" type="checkbox" />
                                                <label className="form-check-label">Sunday</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <input type="text" className="form-control"  id="description" defaultValue="" required="" onChange={(e) => {  $("#description-alert").removeAttr('class').addClass('invalid-feedback');}}  />
                                    <div id="description-alert" className="invalid-feedback">Please select a valid state.</div>
                                </div>
                                
                                <div className="col-md-12">
                                    <label htmlFor="subject" className="form-label">Subject</label>
                                    <select className="form-select" id="subject" required="" onChange={(e) => {  $("#subject-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({selectedSubject: e.target.value})}}  >
                                        <option disabled >Choose...</option>
                                        <option></option>
                                        <EachMethod of={this.state.subjects} render={(element,index) => {
                                            return <option value={element.id}>{element.subject_name}</option>
                                        }} />
                                    </select>
                                    <div id="subject-alert" className="invalid-feedback">Please select a valid state.</div>
                                </div>
                                
                                <div className="col-md-12">
                                    <label htmlFor="teacher" className="form-label">Teacher</label>
                                    <input type="text" className="form-control" list="selectedTeacher" id="teacher" defaultValue="" required="" onChange={(e) => {  $("#teacher-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({selectedTeacher: e.target.value})}}  />
                                    <div id="teacher-alert" className="invalid-feedback">Please select a valid state.</div>
                                </div>
                                <div className="col-md-12">
                                    <label htmlFor="classts" className="form-label">Class Name</label>                                            
                                    {/* <input type="text" className="form-control" list="selectedYearLevel" id="classts" defaultValue="" required=""   /> */}

                                    <select name="classts" id="classts" className="form-control" onChange={(e) => { 
                                         $("#teacher-alert").removeAttr('class').addClass('invalid-feedback'); 
                                         $('#section').val(""); 
                                         if(e.target.value != "") { 
                                            let data = this.state.class.filter(ee => ee.id==e.target.value)[0]
                                            $("#yearlevel").val(data.level);
                                            $("#yearlevel").val(data.grade_id);
                                            $("#schoolyear").val(data.school_year); 
                                            $("#flsh_track").val(data.track); 
                                            $("#flsh_strand").val(data.strands); 
                                            $("#sectionname").val(data.section_name); 
                                            // this.setState({selectedYearLevel: e.target.value,sectionList: this.state.sectionListTemp.filter(ee => ee.year_grade_id==e.target.value)})  
                                         }
                                         }}>

                                        <option disabled >--Select Section--</option>
                                        <option value="" ></option>
                                        <EachMethod of={this.state.class} render={(element,index) => {
                                            return <option value={`${element.id}`} >{`${element.section_name} (Room:${element.classroom})`}   </option>
                                        }} />
                                    </select>
                                    <div id="classts-alert" className="invalid-feedback">Please select a valid state.</div>
                                </div>
                                <div className="col-md-12">
                                    <label htmlFor="yearlevel" className="form-label">Grade</label>                                            
                                    {/* <input type="text" className="form-control" list="selectedYearLevel" id="yearlevel" defaultValue="" required=""   /> */}

                                    <select name="yearlevel" id="yearlevel" className="form-control"  aria-readonly onChange={(e) => { 
                                         $("#teacher-alert").removeAttr('class').addClass('invalid-feedback'); 
                                         $('#section').val("");
                                         console.log(e.target.value)
                                         if(e.target.value != "") {
                                            // this.setState({selectedYearLevel: e.target.value,sectionList: this.state.sectionListTemp.filter(ee => ee.year_grade_id==e.target.value)})  
                                         }
                                         }}>
                                         <option disabled >--Select Grade--</option>
                                         <option value="" ></option>
                                        <EachMethod of={this.state.yeargrade} render={(element,index) => {
                                            return <option value={`${element.id}`} >{`${element.year_grade}`}</option>
                                        }} />
                                    </select>
                                    <div id="yearlevel-alert" className="invalid-feedback">Please select a valid state.</div>
                                </div>
                                {/* <div className="col-md-12">
                                    <label htmlFor="section" className="form-label">Class Section</label>
                                    <input type="text" className="form-control" list="selectedSection" id="section" defaultValue="" required="" onChange={(e) => {  $("#section-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({selectedSection: e.target.value})}}  />
                                    <div id="section-alert" className="invalid-feedback">Please select a valid state.</div>
                                </div> */}
   
                                <div className="col-md-12">
                                    <label htmlFor="sectionname" className="form-label">Section Name</label>
                                    <input type="text" className="form-control" id="sectionname" defaultValue="" required="" onChange={(e) => {  $("#sectionname-alert").removeAttr('class').addClass('invalid-feedback'); }}  />
                                    <div id="sectionname-alert" className="invalid-feedback">Please select a valid state.</div>
                                </div>
                                <div className="col-md-12">
                                    <label htmlFor="schoolyear" className="form-label">School Year</label>
                                    <input type="text" className="form-control" list="selectedSY" id="schoolyear" defaultValue="" required="" onChange={(e) => {  $("#schoolyear-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({selectedSY: e.target.value})}}  />
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

    </DashboardLayout>}
}
