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


export default class EditEmployee extends Component {
    constructor(props) {
		super(props);
        this.state = {
            photoupload: "",
            photobase64: "",
            photobase64final: "",
            id: "",
            teacher_id: "",
            lrn: "",
            psa_cert_no: "",
            qr_code: "",
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
            employee_type: "",
            bdate_max: moment(new Date()).subtract('years',15).format('YYYY-MM-DD'),
            EB_list: this.props.EB_list,
            EB_column:[ 
                {
                    id: "level",
                    Header: 'Level',  
                    width: 200,
                    accessor: 'level', 
                    className: ""
                },
                {
                    id: "nameofschool",
                    Header: 'School',  
                    accessor: 'name_of_school',  
                    width: 200,
                },
                {
                    id: "education",
                    Header: 'Educational Attainment',   
                    width: 200,
                    accessor: 'basic_edu_degree_course'
                },
                {
                    id: "datefrom",
                    Header: 'Date From',   
                    width: 200,
                    accessor: 'period_from'
                },
                {
                    id: "dateto",
                    Header: 'Date To',   
                    width: 200,
                    accessor: 'period_to'
                },
                {
                    id: "units",
                    Header: 'Total Units',   
                    width: 200,
                    accessor: 'units'
                },
                {
                    id: "yrgraduated",
                    Header: 'Year Graduated',   
                    width: 200,
                    accessor: 'yr_graduated'
                },
                {
                    id: "ac_ah_recieve",
                    Header: 'Achievements',   
                    width: 200,
                    accessor: 'ac_ah_recieve'
                },
                {
                    id: "action",
                    Header: 'Action',  
                    width: 150,
                    accessor: 'id',
                    className: "center",
                    Cell:  ({row}) => { 
                       return <>                       
                        <button className="btn btn-danger btn-block btn-sm col-12 mb-1" onClick={()=>{this.removeEB(row.original.id);}} > <i className="bi bi-x"></i> Remove</button>
                       </>            
                    }
                }
            ],
            eb_achiev: "",
            eb_df: "",
            eb_dt: "",
            eb_ea: "",
            eb_level: "",
            eb_school: "",
            eb_yrg: "",
            eb_units: "",
            training_list: this.props.trainings,
            training_column: [
                {
                    id: "title",
                    Header: 'Title',  
                    accessor: 'title', 
                    filterable: false,
                    width: 200,
                },
                {
                    id: "experience",
                    Header: 'Experience',  
                    filterable: false,
                    width: 200,
                    accessor: 'experience'
                },
                {
                    id: "total_render",
                    Header: 'Total Render Hours',  
                    filterable: false,
                    width: 200,
                    accessor: 'total_render'
                },
                {
                    id: "date_from",
                    Header: 'Date From',  
                    filterable: false,
                    width: 200,
                    accessor: 'date_from'
                },
                {
                    id: "date_to",
                    Header: 'Date To',  
                    filterable: false,
                    width: 200,
                    accessor: 'date_to'
                },
                {
                    id: "action",
                    Header: 'Action',  
                    width: 110,
                    accessor: 'id',
                    className: "center",
                    Cell:  ({row}) => { 
                       return <>                       
                        <button className="btn btn-danger btn-block btn-sm col-12 mb-1" onClick={()=>{this.removeTraining(row.original.id);}} > <i className="bi bi-x"></i> Remove</button>
                       </>            
                    }
                }
            ],
            t_df: "",
            t_dt: "",
            t_expe: "",
            t_render: "",
            t_title: "",
        }
        this.webCam = React.createRef(); 
        this.updateCrop = this.updateCrop.bind(this);
        this.saveEB = this.saveEB.bind(this);
        this.removeEB = this.removeEB.bind(this);
        this.saveTraining = this.saveTraining.bind(this);
        this.removeTraining = this.removeTraining.bind(this);
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;
        console.log(this.props.employee.id)
        console.log(this.props)

        this.setState({
            photobase64final: (this.props.employee.picture_base64!=null)?this.props.employee.picture_base64:'/adminlte/dist/assets/img/avatar.png',
            ...this.props.employee,
            lrn: this.props.employee.qr_code,
            contact_list: this.props.contacts,
            teacher_id: this.props.employee.id,
        })

        // this.webCam.current.getScreenshot({width: 600, height: 300});
        // $("#fileuploadpanel").modal('show');
        // jQuery.noConflict();
        // console.log($("#fileuploadpanel"));
        // var modal = new bootstrap.Modal('#fileuploadpanel')
        // modal.show();  
        // $("#fileuploadpanel").on('shown.bs.modal', function () {
            
        // });
    }

    getBase64 = (file, callback) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
          callback(reader.result);
        };
        reader.onerror = function (error) {
          console.log("Error: ", error);
        };
    };
  

    onFileChange = (e) => {
        $('.progress-bar').css("width", '0%');
        if(e.target.files.length) {
            const { name, type } = e.target.files[0];
            // console.log(e.target.files[0]);
            let filetype = "pdf";
            if(type == "application/pdf") {
                filetype = "pdf";
            } else if(type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                filetype = "docs";
            } else if(type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                filetype = "docs";
            } else if(type == "image/png") {
                filetype = "image";
            } else if(type == "image/jpeg") {
                filetype = "image";
            }
            this.getBase64(e.target.files[0], (result) => {
              this.setState({
                photoupload: result,
                filedata: result,
                filedataName: name,
                filetype: type,
                filetype_: filetype
              });
            });
            $("#fileuploadpanel").modal('show');
        }
    };

    updateCrop(result) { 
        this.setState({
            photobase64final:result
        })
    }
    
    saveData() {
        let self = this;
        // console.log(self.state)
        if(self.state.first_name != "" && self.state.middle_name != "" && self.state.last_name != "" && self.state.sex != "" && self.state.bdate != ""&& self.state.lrn != "") {
            if($('#invalidCheck').prop('checked') == false) {
                $("#invalidCheck-alert").removeAttr('class'); 
                $("#invalidCheck-alert").addClass('d-block invalid-feedback');
                // alert('Please check aggree to all fields are correct');
                swal({
                    title: "Please check agree if all fields are correct",
                    icon: 'info'
                })
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
                        id: self.props.employee.uuid,
                        qr_code: self.state.lrn, 
                        first_name:self.state.first_name,
                        last_name:self.state.last_name,
                        middle_name:self.state.middle_name,
                        extension_name:self.state.extension_name,
                        bdate:self.state.bdate,
                        status: "active",
                        picture_base64:self.state.photobase64final,
                        email:self.state.email,
                        sex:self.state.sex,
                        contact_list: self.state.contact_list,
                        employee_type: self.state.employee_type,
                        EB_list: self.state.EB_list,
                        training_list: self.state.training_list
                    };
                    // console.log(datas);
                    axios.post('/employee/update',datas).then( async function (response) {
                        // handle success
                        console.log(response);
                            if( typeof(response.status) != "undefined" && response.status == "201" ) {
                                let data = typeof(response.data) != "undefined" && typeof(response.data)!="undefined"?response.data:{};
                                if(data.status == "success") {
                                    let phone_list = [];
                                    self.state.contact_list.forEach( async element => {
                                        // phone_list.push();
                                        // console.log({
                                        //     type: null,
                                        //     student_id: null,
                                        //     teacher_id: response.data.data.id,
                                        //     guardian_id: null,
                                        //     phone_number: element.phone_number,
                                        //     telephone_number: element.phone_number
                                        // })
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
                                        title: "Successfuly update!", 
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
                            }
                    }).catch(function (error) {
                    // handle error
                    console.log(error);
                    // Swal.fire({  
                    //     title: "Server Error", 
                    //     showCancelButton: true,
                    //     showConfirmButton: false,
                    //     allowOutsideClick: false,
                    //     allowEscapeKey: false,
                    //     cancelButtonText: "Ok",
                    //     confirmButtonText: "Continue",
                    //     confirmButtonColor: "#DD6B55",
                    //     icon: "error",
                    //     showLoaderOnConfirm: true, 
                    //     closeOnClickOutside: false,  
                    //     dangerMode: true,
                    // });
                    if( typeof(error.status) != "undefined" && error.status == "422" ) {
                        let data = typeof(error.response.data) != "undefined" && typeof(error.response.data)!="undefined"?error.response.data:{};
                        let listmessage = "";

                        if(Object.keys(data.errors).length> 0) {
                            Object.keys(data.errors).forEach(element => {
                                listmessage+=`<li class="list-group-item">${data.errors[element][0]}\n</li>`
                            });
                        }

                        Swal.fire({  
                            title: data.message ,
                            html:`<ul class="list-group" >${listmessage}</ul>`, 
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

    saveEB() {
        let self = this;
        let list = [];
        if(self.state.eb_level != "" && self.state.eb_school != "" && self.state.eb_ea != "" && self.state.eb_df != "" && self.state.eb_dt != "") {
            list.push({ 
                id: self.state.EB_list.length +1,
                level: self.state.eb_level,
                name_of_school: self.state.eb_school,
                basic_edu_degree_course: self.state.eb_ea,
                period_from: self.state.eb_df,
                period_to: self.state.eb_dt,
                units: self.state.eb_units,
                yr_graduated: self.state.eb_yrg,
                ac_ah_recieve: self.state.eb_achiev
            });
            self.setState({
                EB_list: [...self.state.EB_list,...list],
                eb_achiev: "",
                eb_df: "",
                eb_dt: "",
                eb_ea: "",
                eb_level: "",
                eb_school: "",
                eb_yrg: "",
                eb_units: "",
            });
            $('#eb_level').val('');
            $('#eb_achiev').val('');
            $('#eb_ea').val('');
            $('#eb_school').val('');
            $('#eb_units').val('');
            $('#eb_yrg').val('');
            $('#eb_df').val('');
            $('#eb_dt').val('');
        } else {
            if(self.state.eb_level == "") {
                $("#eb_level-alert").removeAttr('class');
                $("#eb_level-alert").html('Required Field');
                $("#eb_level-alert").addClass('d-block invalid-feedback');
            }
            if(self.state.eb_school == "") {
                $("#eb_school-alert").removeAttr('class');
                $("#eb_school-alert").html('Required Field');
                $("#eb_school-alert").addClass('d-block invalid-feedback');
            }
            if(self.state.eb_ea == "") {
                $("#eb_ea-alert").removeAttr('class');
                $("#eb_ea-alert").html('Required Field');
                $("#eb_ea-alert").addClass('d-block invalid-feedback');
            }
            if(self.state.eb_df == "") {
                $("#eb_df-alert").removeAttr('class');
                $("#eb_df-alert").html('Required Field');
                $("#eb_df-alert").addClass('d-block invalid-feedback');
            }
            if(self.state.eb_dt == "") {
                $("#eb_dt-alert").removeAttr('class');
                $("#eb_dt-alert").html('Required Field');
                $("#eb_dt-alert").addClass('d-block invalid-feedback');
            }
        }


    }

    removeEB(id) {
        let self = this;
        let lists = [];
        let i = 1;
        self.state.EB_list.forEach((val) => {
            if(val.id != id) {
                lists.push({ 
                    id: i,
                    level: val.level,
                    name_of_school: val.name_of_school,
                    basic_edu_degree_course: val.basic_edu_degree_course,
                    period_from: val.period_from,
                    period_to: val.period_to,
                    units: val.units,
                    yr_graduated: val.yr_graduated,
                    ac_ah_recieve: val.ac_ah_recieve
                });
                i++;                
            }
        });
        
        self.setState({
            EB_list: lists
        });   
    }
    
    saveTraining() {
        let self = this;
        let list = [];
        if(self.state.t_title != "" && self.state.t_expe != "" && self.state.t_render != "" && self.state.t_df != "" && self.state.t_dt != "") {
            list.push({ 
                id: self.state.training_list.length +1,
                title: self.state.t_title,
                experience: self.state.t_expe,
                total_render: self.state.t_render,
                date_from: self.state.t_df,
                date_to: self.state.t_dt
            });
            self.setState({
                training_list: [...self.state.training_list,...list],
                t_df: "",
                t_dt: "",
                t_expe: "",
                t_render: "",
                t_title: "",
            });
            $('#t_title').val('');
            $('#t_render').val('');
            $('#t_expe').val('');
            $('#t_df').val('');
            $('#t_dt').val('');
        } else {
            if(self.state.t_title == "") {
                $("#t_title-alert").removeAttr('class');
                $("#t_title-alert").html('Required Field');
                $("#t_title-alert").addClass('d-block invalid-feedback');
            }
            if(self.state.t_expe == "") {
                $("#t_expe-alert").removeAttr('class');
                $("#t_expe-alert").html('Required Field');
                $("#t_expe-alert").addClass('d-block invalid-feedback');
            }
            if(self.state.t_render == "") {
                $("#t_render-alert").removeAttr('class');
                $("#t_render-alert").html('Required Field');
                $("#t_render-alert").addClass('d-block invalid-feedback');
            }
            if(self.state.t_df == "") {
                $("#t_df-alert").removeAttr('class');
                $("#t_df-alert").html('Required Field');
                $("#t_df-alert").addClass('d-block invalid-feedback');
            }
            if(self.state.eb_dt == "") {
                $("#t_dt-alert").removeAttr('class');
                $("#t_dt-alert").html('Required Field');
                $("#t_dt-alert").addClass('d-block invalid-feedback');
            }
        }
    }


    removeTraining(id) {
        let self = this;
        let lists = [];
        let i = 1;
        self.state.training_list.forEach((val) => {
            if(val.id != id) {
                lists.push({ 
                    id: i,
                    title: val.title,
                    experience: val.experience,
                    total_render: val.total_render,
                    date_from: val.date_from,
                    date_to: val.date_to
                });
                i++;                
            }
        });
        
        self.setState({
            training_list: lists
        });   
    }
    render() {
        return <DashboardLayout title="New Teacher" user={this.props.auth.user} ><div className="noselect">
            <div className="app-content-header"> 
                <div className="container-fluid"> 
                    <div className="row">
                    <div className="col-sm-6"><h3 className="mb-0"><i className="nav-icon bi bi-person-lines-fill"></i> Employee</h3></div>
                    <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-end">
                            <li className="breadcrumb-item"><Link href="/admin/dashboard">Dashboard</Link></li>
                            <li className="breadcrumb-item"><Link href="/admin/dashboard/employee">Employee</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">New Account</li>
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
                                    <h3 className="card-title mt-2"> <i className="bi bi-person"></i> Update Account</h3>
                                    <Link href="/admin/dashboard/employee" id="cancel" className="btn btn-danger float-right"> <i className="bi bi-person-fill-x"></i> Cancel</Link>
                                    <button className="btn btn-success float-right mr-1" onClick={() =>{ this.saveData() }}> <i className="bi bi-person-plus-fill"></i> Update</button>   
                                </div>
                                <div className="card-body"> 
                                    <div className="row g-3"> 
                                        <div className="col-md-4">
                                            <div className="col-md-12">
                                                <img className="photo-upload border_shadow" src={this.state.photobase64final!=""?this.state.photobase64final:"/adminlte/dist/assets/img/avatar.png"}
                                                ref={t=> this.upload_view_image = t}
                                                onError={(e)=>{ 
                                                    this.upload_view_image.src='/adminlte/dist/assets/img/avatar.png'; 
                                                }} alt="Picture Error" />
                                            </div>
                                            <div className="input-group">
                                                <input type="file" className="form-control" id="inputGroupFile02" onChange={this.onFileChange}  />
                                                <span className="input-group-text" htmlFor="inputGroupFile02" onClick={() => { this.setState({cameraOn: true}); $("#camerapanel").modal('show') }} ><i className="bi bi-camera"></i></span>
                                            </div> 
                                        </div> 
                                        <div className="col-md-3 d-flex flex-column justify-content-end">
                                            <label htmlFor="employee_type" className="form-label">Employee Type</label>
                                            <select name="employee_type" className="form-control" required="" value={this.state.employee_type} id="employee_type" onChange={(e) => { $("#employee_type-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({ employee_type: e.target.value}) }}>
                                                <option disabled>-- Select Type --</option>
                                                <option value=""></option>
                                                <option value="Teacher">Teacher</option>
                                                <option value="Staff">Staff</option>
                                                <option value="Janitor">Janitor</option>
                                                <option value="Security Guard">Security Guard</option>
                                            </select>
                                            <div id="employee_type-alert" className="valid-feedback">Looks good!</div>
                                        </div> 
                                        <div className="col-md-5 d-flex flex-column justify-content-end">
                                            <QRCode value={this.state.lrn} size={256} style={{ height: "170px", maxWidth: "100%", width: "100%" }}  viewBox={`0 0 256 256`} />   
                                            <label htmlFor="lrn" className="form-label ">Identification Number</label>
                                            <input type="text" className="form-control" id="lrn" defaultValue={this.state.qr_code} required="" onChange={(e) => {
                                                $("#lrn-alert").removeAttr('class').addClass('invalid-feedback'); 
                                                this.setState({lrn: e.target.value})}} />
                                            <span id="lrn-alert" className="valid-feedback">Looks good!</span>
                                        </div>
                                        <div className="col-md-3">
                                            <label htmlFor="first_name" className="form-label">First name</label>
                                            <input type="text" className="form-control" id="first_name" defaultValue={this.state.first_name} required="" onChange={(e) => { $("#first-name-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({first_name: e.target.value})}}  />
                                            <div id="first-name-alert" className="valid-feedback">Looks good!</div>
                                        </div> 
                                        <div className="col-md-3">
                                            <label htmlFor="middle_name" className="form-label">Middle name</label>
                                            <input type="text" className="form-control" id="middle_name" defaultValue={this.state.middle_name} required="" onChange={(e) => {  $("#middle-name-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({middle_name: e.target.value})}}  />
                                            <div id="middle-name-alert" className="valid-feedback">Looks good!</div>
                                        </div> 
                                        <div className="col-md-3">
                                            <label htmlFor="last_name" className="form-label">Last name</label>
                                            <input type="text" className="form-control" id="last_name" defaultValue={this.state.last_name} required="" onChange={(e) => { $("#last-name-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({last_name: e.target.value})}}  />
                                            <div id="last-name-alert" className="valid-feedback">Looks good!</div>
                                        </div> 
                                        <div className="col-md-3">
                                            <label htmlFor="extension_name" className="form-label">Extension name</label>
                                            <select className="form-select" id="extension_name" required="" defaultValue={this.state.extension_name} onChange={(e) => {  $("#extension-name-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({extension_name: e.target.value})}}  >
                                                <option disabled>Choose...</option>
                                                <option></option>
                                                <option>Jr.</option>
                                                <option>Sr.</option>
                                                <option>II</option>
                                                <option>III</option>
                                                <option>VI</option>
                                                <option>V</option>
                                            </select>
                                            <div id="extension-name-alert" className="invalid-feedback">Please select a valid state.</div>
                                        </div>
                                        <div className="col-md-3">
                                            <label htmlFor="gender" className="form-label">Gender</label>
                                            <select className="form-select" id="gender" required=""  value={this.state.sex} onChange={(e) => { $("#sex-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({sex: e.target.value})}} >
                                                <option disabled>Choose...</option>
                                                <option></option>
                                                <option>Male</option>
                                                <option>Female</option>
                                            </select>
                                            <div id="sex-alert" className="invalid-feedback">Please select a valid state.</div>
                                        </div>
                                        <div className="col-md-3">
                                            <label htmlFor="bdate" className="form-label">Birth Date</label>
                                            <input type="date" className="form-control" id="bdate" defaultValue={this.state.bdate} required="" max={this.state.bdate_max} onChange={(e) => {  $("#bdate-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({bdate: e.target.value})}}  />
                                            <div id="bdate-alert" className="valid-feedback">Looks good!</div>
                                        </div> 
                                        <div className="col-md-4">
                                            <label htmlFor="bdate" className="form-label">Email</label>
                                            <input type="email" className="form-control" id="bdate" defaultValue={this.state.email} required="" onChange={(e) => {  $("#email-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({email: e.target.value})}}  />
                                            <div id="email-alert" className="valid-feedback">Looks good!</div>
                                        </div> 
                                    </div> 
                                    <div className="col-lg-12">
                                        <hr />
                                        <h5 className="badge fs-5 bg-primary text-start d-block">Contacts</h5>
                                        <div className="row">
                                            <EachMethod of={this.state.contact_list} render={(element,index) => {
                                                return  <div className="input-group ">
                                                    <div className="input-group-prepend col-lg-4">
                                                        <div htmlFor="lglv" className="input-group-text">{element.phone_number}</div>
                                                    </div> 
                                                    <button className="btn btn-danger" onClick={() => {
                                                        
                                                    }} >Remove</button>
                                                </div>                 
                                            }} />
                                        </div>
                                        <div className="row" >
                                            <div className={`${(this.state.contact_list.length>0)?'form-inline col-lg-6 pt-2':'form-inline col-lg-6'}`}>
                                                <div className="input-group">
                                                    <div className="input-group-prepend">
                                                        <div htmlFor="lglv" className="input-group-text">Phone Number : </div>
                                                    </div>
                                                    <input type="number" className="form-control col-2" id="phonenumber" maxLength={12} defaultValue="" placeholder="09000000000" required="" />
                                                    <button className="btn btn-primary" onClick={() => {
                                                        let temp_numbers = this.state.contact_list;
                                                        let phonenumber = $("#phonenumber").val();
                                                        if(phonenumber != "" && temp_numbers.some(e => e.phone_number == phonenumber) == false) {
                                                            temp_numbers.push({  
                                                                id: this.state.id,
                                                                type: null,
                                                                student_id: null,
                                                                teacher_id: this.state.teacher_id,
                                                                guardian_id: null,
                                                                phone_number: $("#phonenumber").val(),
                                                                telephone_number: null,
                                                                status: ""
                                                            });
                                                            this.setState({contact_list: temp_numbers});
                                                        } else if(phonenumber != "" ){
                                                            Swal.fire({  
                                                                title: "Sorry already added", 
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

                                                    }}>Add</button>
                                                </div>
                                            </div>  
                                        </div>
                                    </div>

                                    <div className="col-lg-12">
                                        <hr />
                                        <h5 className="badge fs-5 bg-primary text-start d-block">Education Background</h5> 
                                        <div className="row g-3">
                                            <div className="col-lg-12">
                                            <ReactTable
                                                key={"react-tables1"}
                                                className={"table table-bordered table-striped "}
                                                data={this.state.EB_list} 
                                                columns={this.state.EB_column} 
                                            />
                                            </div>
                                            <div className="col-md-4">
                                                <label htmlFor="eb_level" className="form-label">Level</label>
                                                <input type="text" className="form-control" id="eb_level" defaultValue="" required="" onChange={(e) => { $("#eb_level-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({eb_level: e.target.value})}}  />
                                                <div id="eb_level-alert" className="valid-feedback">Looks good!</div>
                                            </div> 
                                            <div className="col-md-4">
                                                <label htmlFor="eb_school" className="form-label">School</label>
                                                <input type="text" className="form-control" id="eb_school" defaultValue="" required="" onChange={(e) => { $("#eb_school-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({eb_school: e.target.value})}}  />
                                                <div id="eb_school-alert" className="valid-feedback">Looks good!</div>
                                            </div> 
                                            <div className="col-md-4">
                                                <label htmlFor="ca_barangay" className="form-label">Educational Attainment</label>
                                                <input type="text" className="form-control" id="eb_ea" defaultValue="" required="" onChange={(e) => { $("#eb_ea-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({eb_ea: e.target.value})}}  />
                                                <div id="eb_ea-alert" className="valid-feedback">Looks good!</div>
                                            </div> 
                                            <div className="col-md-4">
                                                <label htmlFor="ca_barangay" className="form-label">Date From</label>
                                                <input type="text" className="form-control" id="eb_df" defaultValue="" required="" onChange={(e) => { $("#eb_df-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({eb_df: e.target.value})}}  />
                                                <div id="eb_df-alert" className="valid-feedback">Looks good!</div>
                                            </div> 
                                            <div className="col-md-4">
                                                <label htmlFor="ca_barangay" className="form-label">Date To</label>
                                                <input type="text" className="form-control" id="eb_dt" defaultValue="" required="" onChange={(e) => { $("#eb_dt-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({eb_dt: e.target.value})}}  />
                                                <div id="eb_dt-alert" className="valid-feedback">Looks good!</div>
                                            </div> 
                                            <div className="col-md-4">
                                                <label htmlFor="ca_barangay" className="form-label">No. Units</label>
                                                <input type="text" className="form-control" id="eb_units" defaultValue="" required="" onChange={(e) => { $("#eb_units-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({eb_units: e.target.value})}}  />
                                                <div id="eb_units-alert" className="valid-feedback">Looks good!</div>
                                            </div> 
                                            <div className="col-md-4">
                                                <label htmlFor="ca_barangay" className="form-label">Year Graduated</label>
                                                <input type="text" className="form-control" id="eb_yrg" defaultValue="" required="" onChange={(e) => { $("#eb_yrg-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({eb_yrg: e.target.value})}}  />
                                                <div id="eb_yrg-alert" className="valid-feedback">Looks good!</div>
                                            </div> 
                                            <div className="col-md-4">
                                                <label htmlFor="ca_barangay" className="form-label">Scholarship/Academic Honors/Received</label>
                                                <input type="text" className="form-control" id="eb_achiev" defaultValue="" required="" onChange={(e) => { $("#eb_achiev-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({eb_achiev: e.target.value})}}  />
                                                <div id="eb_achiev-alert" className="valid-feedback">Looks good!</div>
                                            </div> 
                                        </div>
                                        <br />
                                        <div className="col-lg-12 clearfix">
                                            <button className="btn btn-success float-right" onClick={() => { 
                                                this.saveEB();
                                            }}> <i className="bi bi-plus"></i> Add</button>
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <hr />
                                        <h5 className="badge fs-5 bg-primary text-start d-block">Trainings</h5>
                                        <div className="row g-3">
                                            <div className="col-lg-12">
                                                <ReactTable
                                                    key={"react-tables2"}                                                
                                                    showHeader={true}
                                                    showPagenation={true}
                                                    className={"table table-bordered table-striped "}
                                                    data={this.state.training_list} 
                                                    columns={this.state.training_column}
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <label htmlFor="ca_hn" className="form-label">Title</label>
                                                <input type="text" className="form-control" id="t_title" defaultValue="" required="" onChange={(e) => { $("#t_title-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({t_title: e.target.value})}}  />
                                                <div id="t_title-alert" className="valid-feedback">Looks good!</div>
                                            </div> 
                                            <div className="col-md-4">
                                                <label htmlFor="ca_hn" className="form-label">Experience</label>
                                                <input type="text" className="form-control" id="t_expe" defaultValue="" required="" onChange={(e) => { $("#t_expe-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({t_expe: e.target.value})}}  />
                                                <div id="t_expe-alert" className="valid-feedback">Looks good!</div>
                                            </div> 
                                            <div className="col-md-4">
                                                <label htmlFor="ca_hn" className="form-label">Total Render</label>
                                                <input type="text" className="form-control" id="t_render" defaultValue="" required="" onChange={(e) => { $("#t_render-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({t_render: e.target.value})}}  />
                                                <div id="t_render-alert" className="valid-feedback">Looks good!</div>
                                            </div> 
                                            <div className="col-md-4">
                                                <label htmlFor="ca_hn" className="form-label">Date From</label>
                                                <input type="text" className="form-control" id="t_df" defaultValue="" required="" onChange={(e) => { $("#t_df-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({t_df: e.target.value})}}  />
                                                <div id="t_df-alert" className="valid-feedback">Looks good!</div>
                                            </div> 
                                            <div className="col-md-4">
                                                <label htmlFor="ca_hn" className="form-label">Date To</label>
                                                <input type="text" className="form-control" id="t_dt" defaultValue="" required="" onChange={(e) => { $("#t_dt-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({t_dt: e.target.value})}}  />
                                                <div id="t_dt-alert" className="valid-feedback">Looks good!</div>
                                            </div>
                                        </div>
                                        <br />
                                        <div className="col-lg-12 clearfix">
                                            <button className="btn btn-success float-right" onClick={() => { 
                                                this.saveTraining();
                                            }}><i className="bi bi-plus"></i>  Add</button>
                                        </div>
                                    </div>
                                    <div className="col-12 pt-3">
                                        <div className="form-check float-right">
                                            <br />
                                            <input className="form-check-input" type="checkbox" defaultValue="" id="invalidCheck" required="" />
                                            <label className="form-check-label" htmlFor="invalidCheck">
                                            Confirm all fields are correct.
                                            </label>
                                            <div id="invalidCheck-alert" className="invalid-feedback">You must agree before submitting.</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <Link href="/admin/dashboard/employee" id="cancel" className="btn btn-danger float-right"> <i className="bi bi-person-fill-x"></i> Cancel</Link>
                                    <button className="btn btn-success float-right mr-1" onClick={() =>{ this.saveData() }}> <i className="bi bi-person-plus-fill"></i> Update</button>   
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
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
                        <button type="button" className="btn-close"  onClick={() => {
                            this.setState({ 
                                cameraOn: false
                            });
                        }}data-bs-dismiss="modal" aria-label="Close"> 
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
                        <button type="button" className="btn btn-secondary" onClick={() => {
                            this.setState({ 
                                cameraOn: false
                            });
                        }} data-bs-dismiss="modal">Close</button>
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