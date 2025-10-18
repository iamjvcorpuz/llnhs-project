import React,{ Component } from "react";
import { Head, Link } from '@inertiajs/react';
import { EachMethod } from '@/Components/EachMethod';
import swal from 'sweetalert';
import Swal from 'sweetalert2';

import ReactTable from "@/Components/ReactTable"; 

import DashboardLayout from '@/Layouts/DashboardLayout';

import QRCode from 'qrcode';

document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener('hide.bs.modal', function (event) {
        if (document.activeElement) {
            document.activeElement.blur();
        }
    });
});
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
                    accessor: 'id',
                    Header: 'No.', 
                    width: 70,
                    className: "center"
                }, 
                {
                    id: "teacher",
                    Header: 'Teacher',  
                    width: 200,
                    accessor: 'teacher_fullname',
                    filterable: true,
                    className: ""
                },
                {
                    id: "section",
                    Header: 'Section/Room',  
                    accessor: 'section_name', 
                    filterable: true,
                    width: 200,
                },
                {
                    id: "year_level",
                    Header: 'Grade Level',  
                    filterable: true,
                    width: 200,
                    accessor: 'year_level'
                },  
                {
                    id: "action",
                    Header: 'Action',  
                    width: 150,
                    accessor: 'status',
                    className: "center",
                    Cell:  ({row}) => { 
                        let temp = this.state.class.find(e=>e.id==String(row.original.school_sections_id));  
                       return <>                       
                        <button className="btn btn-danger btn-block btn-sm col-12 mb-1" onClick={()=>{this.deleteAdvisory(row.original.id);}} > <i className="bi bi-person-fill-x"></i> Remove</button>    
                        <button className="btn btn-info btn-block btn-sm col-12 mb-1" onClick={() => { this.viewData(row.original); }}> <i className="bi bi-pen"></i> Edit</button> 
                        <Link href={`/admin/class/advisory/details/${typeof(temp)!="undefined"&&typeof(temp.qr_code)!="undefined"?temp.qr_code:"null"}/${row.original.qrcode}`} className="btn btn-primary btn-block btn-sm col-12 mb-1" > <i className="bi bi-pen"></i> Details</Link> 
                        {(typeof(row.original.qrcode)!="undefined"&&row.original.qrcode!=null)?<button className="btn btn-success btn-block btn-sm col-12 mb-1" onClick={ async ()=>{ 
                            if(typeof(temp)!="undefined"&&typeof(temp.qr_code)!="undefined") {
                                if(typeof(row.original.qrcode)!="undefined"&&row.original.qrcode!=null) {
                                    await this.generateQR(row.original.qrcode,() => {
                                        console.log(row.original)
                                        let room_no  = "";
                                        try {
                                            room_no  = row.original.classroom;
                                        } catch (error) {
                                            
                                        }
                                        this.setState({
                                            room_name: row.original.section_name,
                                            room_number: room_no,
                                            grade_level: row.original.year_level,
                                            teacher_fullname: row.original.teacher_fullname
                                        })
                                        $('#qrcode').modal('show');

                                    }); 
                                }                                
                            }
                        }}> <i className="bi bi-qr-code"></i> QR</button>:null}
                       </>            
                    }
                }
            ],
            track: this.props.track,
            strand: this.props.strand,
            selectedData: {},
            qr_code: "",
            qr_code_data: "",
            room_name: "",
            room_number: "",
            teacher_fullname: "",
            grade_level: ""
        }
        this._isMounted = false;
        // this.saveData = this.getAllRequiredData.bind(this);
        this.saveData = this.saveData.bind(this);
        this.deleteAdvisory = this.deleteAdvisory.bind(this);
        this.getAllData = this.getAllData.bind(this);
        this.viewData = this.viewData.bind(this);
        this.updateData = this.updateData.bind(this);
        this.generateQR = this.generateQR.bind(this);
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
                        track: data.track,
                        strand: data.strand,
                        class: data.class
                    });
                }
            }
        });
        // data: this.props.advisory,
        // subjects: this.props.subjects, 
        // teachers: this.props.teacher,
        // advisoryList: this.props.advisory,
        // sectionListTemp: this.props.sections,
        // sectionList: [],
        // yeargrade: this.props.schoolyeargrades,
        // class: this.props.class,
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

    saveData() {
        let self = this;
        // console.log($("#teacher").val());
        // console.log($("#yearlevel").val()); 
        // console.log($("#sectionname").val());
        // console.log($("#subject").val());
        let teacher_name = $("#teacher").val();
        let teacher = "";
        let yearlevel = $("#yearlevel").val();
        let year_level =  $("#yearlevel").val();//self.state.sectionList.find(e => e.id==$("#yearlevel").val()).year_grade;
        let grade = "";//self.state.class.find(ee => ee.id==year_level).grade;
        let section_name = $("#sectionname").val();
        let section = $("#classts").val();//classts name from school_sections_id 
        // let section = self.state.sectionList.find(e => e.section_name==section_name).id;
        let schoolyear = $("#schoolyear").val();
        let subject = $("#subject").val();

        try {
            teacher = self.state.teachers.find(e=>(e.last_name + ', ' + e.first_name)==teacher_name).id;
        } catch (error) {
            
        }
        try {
            grade = self.state.class.find(ee => ee.grade_id==year_level).grade;
        } catch (error) {
            console.log("error",error)
        }

        console.log({ 
            teacher_id: teacher,
            teacher_name: teacher_name,
            year_level: year_level,
            grade: grade,
            school_sections_id: section,
            section_name: section_name,
            schoolyear: schoolyear,
            subject_id: subject
        })

        if(teacher != "" && yearlevel != "" && section != "" && schoolyear != "" ) {
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
                        grade: grade,
                        school_sections_id: section,
                        section_name: section_name,
                        schoolyear: schoolyear,
                        subject_id: subject
                    };
                    // console.log(datas);
                    axios.post('/advisory',datas).then( async function (response) {
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
                                            $("#teacher").val('');
                                            $("#yearlevel").val(''); 
                                            $("#sectionname").val('');
                                            $("#subject").val('');
                                            $("#classts").val('');
                                            $("#schoolyear").val('');
                                            $("#flsh_strand").val('');
                                            $("#flsh_track").val('');
                                            $("#newAdvisory").modal('hide');
                                            self.getAllData();
                                        }
                                    });
                                } else if(data.status == "section_taken") { 
                                    Swal.fire({  
                                        title: "Selected room is already taken", 
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
                                } else if(data.status == "teacher_taken") { 
                                    Swal.fire({  
                                        title: "Selected teacher is already have a advisory", 
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
                                        title: "Selected advisory is already taken", 
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
                                } else if(data.status == "section_taken") { 
                                    Swal.fire({  
                                        title: "Selected room is already taken", 
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
                                } else if(data.status == "teacher_taken") { 
                                    Swal.fire({  
                                        title: "Selected teacher is already have a advisory", 
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

    viewData(val) {
        // console.log("val",val);
        let self = this; 
        self.setState({selectedData: val});
        $("#eteacher").val(val.teacher_fullname); 
        $("#eyearlevel").val(val.year_level);
        // $("#eyearlevel").val();//self.state.sectionList.find(e => e.id==$("#yearlevel").val()).year_grade;
        // let grade = "";//self.state.class.find(ee => ee.id==year_level).grade;
        // $("#esectionname").val(self.state.sectionList.find(e => e.section_name==val.school_sections_id));
        let classts =  this.state.class.filter(ee => ee.grade==val.year_level)[0];
        // console.log("classts",classts,this.state.class);
        $("#eclassts").val(classts.id);//classts name from school_sections_id 
        $("#eyearlevel").val(classts.level);
        $("#eyearlevel").val(classts.grade_id);
        $("#eschoolyear").val(classts.school_year); 
        $("#eflsh_track").val(classts.track); 
        $("#eflsh_strand").val(classts.strands); 
        $("#esectionname").val(classts.section_name); 
        // let section = self.state.sectionList.find(e => e.section_name==section_name).id;
        $("#eschoolyear").val(val.school_year);
        // $("#esubject").val();
        $("#updateAdvisory").modal('show');
    }

    async generateQR (text,callback) {
        let self = this;
        try {
            let sgv = await QRCode.toDataURL(text, { errorCorrectionLevel: 'H' ,width: 500 });
            self.setState({qr_code: text, qr_code_data: sgv},() => {
                callback();
            });
        } catch (err) {
        console.error(err)
        }
    }

    updateData() {
        let self = this; 
        let teacher_name = $("#eteacher").val();
        let teacher = "";
        let yearlevel = $("#eyearlevel").val();
        let year_level =  $("#eyearlevel").val();//self.state.sectionList.find(e => e.id==$("#yearlevel").val()).year_grade;
        let grade = "";//self.state.class.find(ee => ee.id==year_level).grade;
        let section_name = $("#esectionname").val();
        let section = $("#eclassts").val();//classts name from school_sections_id 
        // let section = self.state.sectionList.find(e => e.section_name==section_name).id;
        let schoolyear = $("#eschoolyear").val();
        let subject = $("#esubject").val();

        try {
            teacher = self.state.teachers.find(e=>(e.last_name + ', ' + e.first_name)==teacher_name).id;
        } catch (error) {
            
        }
        try {
            grade = self.state.class.find(ee => ee.grade_id==year_level).grade;
        } catch (error) {
            console.log("error",error)
        }

        console.log({ 
            teacher_id: teacher,
            teacher_name: teacher_name,
            year_level: year_level,
            grade: grade,
            school_sections_id: section,
            section_name: section_name,
            schoolyear: schoolyear,
            subject_id: subject
        })

        if(teacher != "" && yearlevel != "" && section != "" && schoolyear != "" ) {
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
                        id: self.state.selectedData.id,
                        teacher_id: teacher,
                        teacher_name: teacher_name,
                        year_level: year_level,
                        grade: grade,
                        school_sections_id: section,
                        section_name: section_name,
                        schoolyear: schoolyear,
                        subject_id: subject
                    };
                    // console.log(datas);
                    axios.post('/advisory/update',datas).then( async function (response) {
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
                                            $("#eteacher").val('');
                                            $("#eyearlevel").val(''); 
                                            $("#esectionname").val('');
                                            $("#esubject").val('');
                                            $("#eclassts").val('');
                                            $("#eschoolyear").val('');
                                            $("#eflsh_strand").val('');
                                            $("#eflsh_track").val('');
                                            $("#updateAdvisory").modal('hide');
                                            self.getAllData();
                                        }
                                    });
                                } else if(data.status == "section_taken") { 
                                    Swal.fire({  
                                        title: "Selected room is already taken", 
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
                                } else if(data.status == "teacher_taken") { 
                                    Swal.fire({  
                                        title: "Selected teacher is already have a advisory", 
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
                                if(data.status == "data_not_exist") { 
                                    Swal.fire({  
                                        title: "Selected advisory is not exist", 
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
                                } else if(data.status == "section_taken") { 
                                    Swal.fire({  
                                        title: "Selected room is already taken", 
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
                                } else if(data.status == "teacher_taken") { 
                                    Swal.fire({  
                                        title: "Selected teacher is already have a advisory", 
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
        return <DashboardLayout title="Subject" user={this.props.auth.user}>
            <div className="app-content-header"> 
                <div className="container-fluid"> 
                    <div className="row">
                    <div className="col-sm-6"><h3 className="mb-0"><i className="nav-icon bi bi-book-half"></i> Teacher's Advisory</h3></div>
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
                                    <h3 className="card-title  mt-2"> <i className="bi bi-person-lines-fill"></i> List</h3> 
                                    {/* <Link className="btn btn-primary float-right mr-1" href="/admin/dashboard/advisory/new" > <i className="bi bi-person-plus-fill"></i> Add</Link>   */}
                                    <button className="btn btn-primary float-right mr-1" onClick={() => {
                                        this.setState({sectionList: this.state.sectionListTemp.filter(ee => ee.year_grade_id==1)})  
                                        $("#newAdvisory").modal('show');
                                    }} > <i className="bi bi-plus"></i> Add</button>  
                                </div>
                                <div className="card-body p-0">
                                    <ReactTable
                                        key={"react-tables"}
                                        className={"table table-bordered table-striped "}
                                        data={this.state.data} 
                                        columns={this.state.columns}
                                        getTrProps={(original) => {
                                            return {
                                                onDoubleClick: (e) => { 
                                                    let temp = this.state.class.find(e=>e.id==String(original.school_sections_id)); 
                                                    if(typeof(temp) != "undefined") {
                                                        window.location.replace(`/admin/class/advisory/details/${temp.qr_code}/${original.qrcode}`)
                                                    }
                                                    // 
                                                }
                                            };
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <datalist id="selectedTeacher">
                <EachMethod of={this.state.teachers} render={(element,index) => {
                    if(this.state.data.some(e=>Number(e.teacher_id)==element.uuid)===false) {
                        return <option >{`${element.last_name}, ${element.first_name}`}</option>
                    }
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

            <div className="modal fade" tabIndex="-1" role="dialog" id="newAdvisory" aria-hidden="false" aria-modal="true" data-bs-backdrop="static">
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
                                    <input type="search" className="form-control" list="selectedTeacher" id="teacher" defaultValue="" required="" onChange={(e) => {  $("#teacher-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({selectedTeacher: e.target.value})}}  />
                                    <div id="teacher-alert" className="invalid-feedback">Please select a valid state.</div>
                                </div>
                                <div className="col-md-12">
                                    <label htmlFor="classts" className="form-label">Classroom</label>                                            
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

                                        <option disabled >--Select Classroom--</option>
                                        <option value="" ></option>
                                        <EachMethod of={this.state.class} render={(element,index) => {
                                            if(this.state.advisoryList.length>0&&this.state.advisoryList.some(e=>e.school_sections_id==element.uuid)==false) {
                                                return <option value={`${element.uuid}`} >{`${element.section_name} (Room:${element.classroom},Grade: ${element.grade})`}   </option>    
                                            }                                            
                                        }} />
                                    </select>
                                    <div id="classts-alert" className="invalid-feedback">Please select a valid state.</div>
                                </div>
                                <div className="col-md-12">
                                    <label htmlFor="yearlevel" className="form-label">Grade</label>                                            
                                    {/* <input type="text" className="form-control" list="selectedYearLevel" id="yearlevel" defaultValue="" required=""   /> */}

                                    <select name="yearlevel" id="yearlevel" className="form-control" disabled="disabled" aria-readonly onChange={(e) => { 
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
                                <div className="col-md-12 d-none">
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

                            </div> 
                        </div>

                    </div>
                    <div className="modal-footer"> 
                        <button className="btn btn-success float-right mr-1" onClick={() =>{ this.saveData(); }}> <i className="bi bi-save"></i> Save</button>   
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" tabIndex="-1" role="dialog" id="updateAdvisory" aria-hidden="true" data-bs-backdrop="static">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title fs-5">Edit Advisory</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"> 
                        </button>
                    </div>
                    <div className="modal-body">
                        
                        <div className="card-body"> 
                            <div className="row g-3"> 
                                
                                <div className="col-md-12">
                                    <label htmlFor="eteacher" className="form-label">Teacher</label>
                                    <input type="search" className="form-control" list="selectedTeacher" id="eteacher" defaultValue="" required="" onChange={(e) => {  $("#teacher-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({selectedTeacher: e.target.value})}}  />
                                    <div id="teacher-alert" className="invalid-feedback">Please select a valid state.</div>
                                </div>
                                <div className="col-md-12">
                                    <label htmlFor="classts" className="form-label">Classroom</label>                                            
                                    {/* <input type="text" className="form-control" list="selectedYearLevel" id="classts" defaultValue="" required=""   /> */}

                                    <select name="classts" id="eclassts" className="form-control" onChange={(e) => { 
                                         $("#teacher-alert").removeAttr('class').addClass('invalid-feedback'); 
                                         $('#esection').val(""); 
                                         if(e.target.value != "") { 
                                            let data = this.state.class.filter(ee => ee.id==e.target.value)[0]
                                            $("#eyearlevel").val(data.level);
                                            $("#eyearlevel").val(data.grade_id);
                                            $("#eschoolyear").val(data.school_year); 
                                            $("#eflsh_track").val(data.track); 
                                            $("#eflsh_strand").val(data.strands); 
                                            $("#esectionname").val(data.section_name); 
                                            // this.setState({selectedYearLevel: e.target.value,sectionList: this.state.sectionListTemp.filter(ee => ee.year_grade_id==e.target.value)})  
                                         }
                                         }}>

                                        <option disabled >--Select Classroom--</option>
                                        <option value="" ></option>
                                        <EachMethod of={this.state.class} render={(element,index) => {
                                            return <option value={`${element.uuid}`} >{`${element.section_name} (Room:${element.classroom},Grade: ${element.grade})`}   </option>
                                        }} />
                                    </select>
                                    <div id="classts-alert" className="invalid-feedback">Please select a valid state.</div>
                                </div>
                                <div className="col-md-12">
                                    <label htmlFor="yearlevel" className="form-label">Grade</label>                                            
                                    {/* <input type="text" className="form-control" list="selectedYearLevel" id="yearlevel" defaultValue="" required=""   /> */}

                                    <select name="eyearlevel" id="eyearlevel" className="form-control"  aria-readonly onChange={(e) => { 
                                         $("#teacher-alert").removeAttr('class').addClass('invalid-feedback'); 
                                         $('#esection').val("");
                                        //  console.log(e.target.value)
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
                                <label htmlFor="esectionname" className="form-label">Section Name</label>
                                <input type="text" className="form-control" id="esectionname" defaultValue="" required="" onChange={(e) => {  $("#sectionname-alert").removeAttr('class').addClass('invalid-feedback'); }}  />
                                <div id="sectionname-alert" className="invalid-feedback">Please select a valid state.</div>
                            </div>
                            <div className="col-md-12">
                                <label htmlFor="eschoolyear" className="form-label">School Year</label>
                                <input type="text" className="form-control" list="selectedSY" id="eschoolyear" defaultValue="" required="" onChange={(e) => {  $("#schoolyear-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({selectedSY: e.target.value})}}  />
                                <div id="schoolyear-alert" className="invalid-feedback">Please select a valid state.</div>
                            </div>
                            <div className="col-md-12">
                                <label htmlFor="flsh_track" className="form-label">Track</label>
                                {/* <input type="text" className="form-control" id="flsh_track" defaultValue="" required="" onChange={(e) => { $("#flsh_track-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({flsh_track: e.target.value})}}  /> */}
                                <select name="eflsh_track" id="eflsh_track" className="form-control"  onChange={(e) => { $("#flsh_track-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({flsh_track: e.target.value})}} >
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
                                <select name="eflsh_strand" id="eflsh_strand" className="form-control" onChange={(e) => { $("#flsh_strand-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({flsh_strand: e.target.value})}}>
                                    <option value=""></option>
                                        <EachMethod of={this.state.strand} render={(element,index) => {
                                            return <option >{`${element.name} ${(element.acronyms!=""?"("+element.acronyms+")":"")}`}</option>
                                        }} />
                                </select>
                                <div id="flsh_strand-alert" className="valid-feedback">Looks good!</div>
                            </div>
                            <div className="col-md-12 d-none">
                                <label htmlFor="esubject" className="form-label">Subject</label>
                                <select className="form-select" id="esubject" required="" onChange={(e) => {  $("#subject-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({selectedSubject: e.target.value})}}  >
                                    <option disabled >Choose...</option>
                                    <option></option>
                                    <EachMethod of={this.state.subjects} render={(element,index) => {
                                        return <option value={element.id}>{element.subject_name}</option>
                                    }} />
                                </select>
                                <div id="subject-alert" className="invalid-feedback">Please select a valid state.</div>
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
            
            <div className="modal fade" tabIndex="-1" role="dialog" id="qrcode" aria-hidden="false" data-bs-backdrop="static">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title fs-5">QR</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"> 
                        </button>
                    </div>
                    <div className="modal-body">
                        
                        <div className="card-body"> 
                            <div className="row g-3"> 
                                <div className="my-qr-code ">
                                    <div className="my-qr-code-content">
                                        <center>
                                            <img src={this.state.qr_code_data}  className="mx-auto" /> 
                                        </center>
                                        <center className="center">
                                            <strong>
                                            {this.state.grade_level.toLocaleUpperCase()}
                                            </strong>
                                            <br />
                                            <strong>
                                            {/* Room No. : {this.state.room_number.toLocaleUpperCase()} */}
                                            {this.state.room_name.toLocaleUpperCase()}
                                            </strong>
                                            <br />
                                            <strong>
                                            Adviser : {this.state.teacher_fullname.toLocaleUpperCase()}
                                            </strong>
                                        </center>
                                    </div>
                                </div>
                            </div> 
                        </div>

                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" onClick={() => {
                            let w=window.open();
                            w.document.write($('.my-qr-code').html());
                            w.print();
                            w.close();
                        }} ><i className="bi bi-printer"></i> Print</button>
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    }
}