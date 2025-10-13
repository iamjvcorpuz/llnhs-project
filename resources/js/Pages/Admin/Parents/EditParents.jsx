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
import { type } from "jquery";


export default class EditParents extends Component {
    constructor(props) {
		super(props);
        this.state = {
            id: "",
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
            address: "",
            contact_list: [],
            filedata: null,
            filedataName: "",
            filetype: "",
            filetype_: "",
            cameraOn: false,
            bdate_max: moment(new Date()).subtract('years',15).format('YYYY-MM-DD'),
            data: [],
            columns: [
                {
                    id: "no",
                    accessor: 'index',
                    Header: 'No.', 
                    width: 50,
                    className: "center"
                },  
                {
                    id: "fullname",
                    Header: 'Fullname', 
                    width: 800,
                    accessor: 'fullname',
                    filterable: true
                }, 
                {
                    id: "Status",
                    Header: 'Status',  
                    width: 150,
                    accessor: 'status',
                    className: "center"
                },
                {
                    id: "action",
                    Header: 'Action',  
                    width: 200,
                    accessor: 'index',
                    className: "center",
                    Cell: ({row}) => { 
                       return <>                       
                        <button className="btn btn-primary btn-block btn-sm col-12 mb-1" onClick={()=>{ this.updateMessenger(row.original) }}> <i className="bi bi-plus"></i> Add</button>
                       </>            
                    }
                }
            ]    
        }
        this.webCam = React.createRef(); 
        this.updateCrop = this.updateCrop.bind(this);
        this.getFBList = this.getFBList.bind(this);
        this.fetchFBList = this.fetchFBList.bind(this);
        this.updateMessenger = this.updateMessenger.bind(this);
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;
        // console.log(this.props);
        this.setState({
            photobase64final: (this.props.parents.picture_base64!=null)?this.props.parents.picture_base64:'/adminlte/dist/assets/img/avatar.png',
            ...this.props.parents,
            lrn: this.props.parents.qr_code,
            contact_list: this.props.contacts,
            parents_id: this.props.parents.uuid,
            address: this.props.parents.current_address
        });
        this.getFBList();
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
                        id: self.state.id,
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
                        current_address: self.state.address,
                        contact_list: self.state.contact_list
                    };
                    console.log(datas);
                    axios.post('/parents/update',datas).then( async function (response) {
                        // handle success
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
                                        if(typeof(element.phone_number) != "undefined") {
                                            axios.post('/contacts',{
                                                type: null,
                                                student_id: null,
                                                teacher_id: null,
                                                guardian_id: response.data.data.id,
                                                phone_number: element.phone_number,
                                                telephone_number: element.phone_number
                                            }).then(function (response2) {
                                                if( typeof(response2.status) != "undefined" && response2.status == "201" ) {
    
                                                }
                                            })
                                        }
                                    });

                                    Swal.fire({  
                                        title: "Successfuly save!", 
                                        showCancelButton: false,
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
                        if(error) {
                            // if(error.status == "422") {
                            //     Swal.fire({  
                            //         title: "Required Field Error", 
                            //         showCancelButton: false,
                            //         showConfirmButton: true,
                            //         allowOutsideClick: false,
                            //         allowEscapeKey: false, 
                            //         confirmButtonText: "Ok", 
                            //         icon: "error",
                            //         showLoaderOnConfirm: true, 
                            //         closeOnClickOutside: false,  
                            //         dangerMode: true,
                            //     });
                            // }
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
                            if(typeof(error.response.data.errors.current_address)!="undefined") {
                                $("#address-alert").removeAttr('class');
                                $("#address-alert").html('Required Field');
                                $("#address-alert").addClass('d-block invalid-feedback');
                            }

                            if(typeof(error.response.data.errors.first_name)!="undefined") {
                                $("#first-name-alert").removeAttr('class');
                                $("#first-name-alert").html('Required Field');
                                $("#first-name-alert").addClass('d-block invalid-feedback');
                            }

                            if(typeof(error.response.data.errors.middle_name)!="undefined") {
                                $("#middle-name-alert").removeAttr('class');
                                $("#middle-name-alert").html('Required Field');
                                $("#middle-name-alert").addClass('d-block invalid-feedback');
                            }

                            if(typeof(error.response.data.errors.last_name)!="undefined") {
                                $("#last-name-alert").removeAttr('class');
                                $("#last-name-alert").html('Required Field');
                                $("#last-name-alert").addClass('d-block invalid-feedback');
                            }

                            if(typeof(error.response.data.errors.bdate)!="undefined") {
                                $("#bdate-alert").removeAttr('class');
                                $("#bdate-alert").html('Required Field');
                                $("#bdate-alert").addClass('d-block invalid-feedback');
                            }

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
    
    getFBList() {
        let list  = []; 
        let self = this;
        axios.post('/messenger/recepient').then(function (response) {
          // handle success
        //   console.log(response)
            if( typeof(response.status) != "undefined" && response.status == "200" ) {
                let data = typeof(response.data) != "undefined" && typeof(response.data.data)!="undefined"?response.data.data:[];
                self.setState({data: data});
            }
        }).catch(function (error) {
          // handle error
        //   console.log(error);
        }).finally(function () {
          // always executed
        });
    }
    
    fetchFBList() {
        let list  = []; 
        let self = this;
        axios.post('/messenger/recepient/sync').then(function (response) {
          // handle success
        //   console.log(response)
            if( typeof(response.status) != "undefined" && response.status == "200" ) {
                let data = typeof(response.data) != "undefined" && typeof(response.data.data)!="undefined"?response.data.data:[];
                self.getFBList();
            }
        }).catch(function (error) {
          // handle error
        //   console.log(error);
        }).finally(function () {
          // always executed
        });
    }

    updateMessenger(val) {
        let self = this;
        // console.log(val,self.state.contact_list);
        try {
            if(self.state.contact_list.length>0) {
                let self = this;
                let datas =  {
                    dmode: typeof(val.dmode)!="undefined"?val.dmode:"update",
                    id: self.state.id,
                    messenger_name: val.fullname, 
                    messenger_id: val.fb_id,
                    messenger_email: val.email,
                    contact_id: self.state.contact_list[0].id, 
                    contact_list: self.state.contact_list
                };
                // console.log(datas);
                Swal.fire({
                    title: "To pair this messenger account to parent account click to continue to connect or pair", 
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
                        // Swal.close();
                        Swal.fire({  
                            title: 'Please wait.', 
                            html:'<i class="fa fa-times-circle-o"></i>&nbsp;&nbsp;Close',
                            showCancelButton: true,
                            showConfirmButton: false,
                            allowOutsideClick: false,
                            didOpen: () => {
                              Swal.showLoading();
                            }
                        });
                        axios.post('/parents/update/messenger',datas).then( async function (response) {
                            // handle success
                            // console.log(response);
                                if( typeof(response.status) != "undefined" && response.status == "201" ) {
                                    let data = typeof(response.data) != "undefined" && typeof(response.data)!="undefined"?response.data:{};
                                    if(data.status == "success") {
        
                                        Swal.fire({  
                                            title: "Successfuly save!", 
                                            showCancelButton: false,
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
                                                $('#fbmessenger').modal('hide');
                                                window.location.reload();
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
                        if(error) {
                            if(error.status == "422") {
                                Swal.fire({  
                                    title: "Required Field Error", 
                                    showCancelButton: false,
                                    showConfirmButton: true,
                                    allowOutsideClick: false,
                                    allowEscapeKey: false, 
                                    confirmButtonText: "Ok", 
                                    icon: "error",
                                    showLoaderOnConfirm: true, 
                                    closeOnClickOutside: false,  
                                    dangerMode: true,
                                });
                            }
        
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
                let contact_list = self.state.contact_list;
    
                if(contact_list.length==0) {
                    contact_list.push({
                        guardian_id: self.state.parents_id,
                        messenger_id: val.fb_id,
                        messenger_name: val.fullname,
                    })
                }
    
                self.setState({ 
                    messenger_name: val.fullname, 
                    messenger_id: val.fb_id,
                    messenger_email: val.email,
                    contact_list: contact_list
                });
                // console.log(contact_list)
                $('#fbmessenger').modal('hide');
            }
        } catch (error) {
            // console.log(error)
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
    }
    
    render() {
        return <DashboardLayout title="New Teacher" user={this.props.auth.user} ><div className="noselect">
            <div className="app-content-header"> 
                <div className="container-fluid"> 
                    <div className="row">
                    <div className="col-sm-6"><h3 className="mb-0"><i className="nav-icon bi bi-person-lines-fill"></i> Parents / Guardian</h3></div>
                    <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-end">
                            <li className="breadcrumb-item"><Link href="/admin/dashboard">Dashboard</Link></li>
                            <li className="breadcrumb-item"><Link href="/admin/dashboard/parents">Parents / Guardian</Link></li>
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
                                    <Link href="/admin/dashboard/parents" id="cancel" className="btn btn-danger float-right"> <i className="bi bi-person-fill-x"></i> Cancel</Link>
                                    <button className="btn btn-success float-right mr-1" onClick={() =>{ this.saveData() }}> <i className="bi bi-person-plus-fill"></i> Save</button>   
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
                                        <div className="col-md-8 d-flex flex-column justify-content-end">
                                            <QRCode value={this.state.lrn} size={256} style={{ height: "170px", maxWidth: "100%", width: "100%" }}  viewBox={`0 0 256 256`} />   
                                            <label htmlFor="lrn" className="form-label ">Identification Number</label>
                                            <input type="text" className="form-control" id="lrn" value={this.state.lrn} required="" onChange={(e) => {
                                                $("#lrn-alert").removeAttr('class').addClass('invalid-feedback'); 
                                                this.setState({lrn: e.target.value})}} />
                                            <span id="lrn-alert" className="valid-feedback">Looks good!</span>
                                        </div>
                                        <div className="col-md-3">
                                            <label htmlFor="first_name" className="form-label">First name</label>
                                            <input type="text" className="form-control" id="first_name" value={this.state.first_name} required="" onChange={(e) => { $("#first-name-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({first_name: e.target.value})}}  />
                                            <div id="first-name-alert" className="valid-feedback">Looks good!</div>
                                        </div> 
                                        <div className="col-md-3">
                                            <label htmlFor="middle_name" className="form-label">Middle name</label>
                                            <input type="text" className="form-control" id="middle_name" value={this.state.middle_name} required="" onChange={(e) => {  $("#middle-name-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({middle_name: e.target.value})}}  />
                                            <div id="middle-name-alert" className="valid-feedback">Looks good!</div>
                                        </div> 
                                        <div className="col-md-3">
                                            <label htmlFor="last_name" className="form-label">Last name</label>
                                            <input type="text" className="form-control" id="last_name" value={this.state.last_name} required="" onChange={(e) => { $("#last-name-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({last_name: e.target.value})}}  />
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
                                            <select className="form-select" id="gender" required="" value={this.state.sex} onChange={(e) => { $("#sex-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({sex: e.target.value})}} >
                                                <option disabled>Choose...</option>
                                                <option></option>
                                                <option>Male</option>
                                                <option>Female</option>
                                            </select>
                                            <div id="sex-alert" className="invalid-feedback">Please select a valid state.</div>
                                        </div>
                                        <div className="col-md-3">
                                            <label htmlFor="bdate" className="form-label">Birth Date</label>
                                            <input type="date" className="form-control" id="bdate" defaultValue={this.state.bdate} required=""  max={this.state.bdate_max} onChange={(e) => {  $("#bdate-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({bdate: e.target.value})}}  />
                                            <div id="bdate-alert" className="valid-feedback">Looks good!</div>
                                        </div> 
                                        <div className="col-md-4">
                                            <label htmlFor="bdate" className="form-label">Email</label>
                                            <input type="email" className="form-control" id="email" defaultValue={this.state.email} required="" onChange={(e) => {  $("#email-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({email: e.target.value})}}  />
                                            <div id="email-alert" className="valid-feedback">Looks good!</div>
                                        </div> 
                                        <div className="col-md-12">
                                            <label htmlFor="bdate" className="form-label">Current Address</label>
                                            <input type="text" className="form-control" id="address" defaultValue={this.state.current_address}  required="" onChange={(e) => {  $("#address-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({address: e.target.value})}}  />
                                            <div id="address-alert" className="valid-feedback">Looks good!</div>
                                        </div> 
                                    </div> 
                                    <div className="col-lg-12">
                                        <hr />
                                        <h5 className="badge fs-5 bg-primary text-start d-block">Contacts</h5>
                                        <div className="row">
                                            <EachMethod of={this.state.contact_list} render={(element,index) => {
                                                return  (element.phone_number!=null&&element.phone_number!="")?<div className="input-group ">
                                                    <div className="input-group-prepend col-lg-5">
                                                        <div htmlFor="lglv" className="input-group-text">{element.phone_number}</div>
                                                    </div> 
                                                    <button className="btn btn-danger" onClick={() => {
                                                    }} >Remove</button>
                                                </div>:null
                                            }} />
                                            <EachMethod of={this.state.contact_list} render={(element,index) => {
                                                return  (element.messenger_name!=""&&element.messenger_name!=null)?<div className="input-group ">
                                                    <div className="input-group-prepend col-lg-5">
                                                        <div htmlFor="lglv" className="input-group-text"><i className="bi bi-facebook"></i>&nbsp;{element.messenger_name}</div>
                                                    </div> 
                                                    <button className="btn btn-danger" onClick={() => {                                                        
                                                        this.updateMessenger({
                                                            fullname: "", 
                                                            fb_id: "",
                                                            email: "",
                                                            dmode: "remove"
                                                        });
                                                    }} >Remove</button>
                                                </div>:null
                                            }} />
                                        </div>
                                        <div className="row" >
                                            <div className={`${(this.state.contact_list.length>0)?'form-inline col-lg-6 pt-2':'form-inline col-lg-6'}`}>
                                                <div className="input-group">
                                                    <div className="input-group-prepend">
                                                        <div htmlFor="lglv" className="input-group-text">Phone Number : </div>
                                                    </div>
                                                    <input type="number" className="form-control" id="phonenumber" maxLength={12} defaultValue="" placeholder="09000000000" required="" />
                                                    <button className="btn btn-primary" onClick={() => {
                                                        let temp_numbers = this.state.contact_list;
                                                        let phonenumber = $("#phonenumber").val();
                                                        if(phonenumber != "" && temp_numbers.some(e => e.phone_number == phonenumber) == false) {
                                                            temp_numbers.push({  
                                                                id: null,
                                                                type: null,
                                                                student_id: null,
                                                                teacher_id: null,
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
                                                <br />
                                                <button className="btn btn-primary" onClick={() => {
                                                    $('#fbmessenger').modal('show');
                                                }}>Add Messenger</button>
                                            </div>  
                                        </div>
                                    </div>
                                    <div className="col-12 pt-3">
                                        <div className="form-check float-right">
                                            <br />
                                            <input className="form-check-input" type="checkbox" defaultValue="" id="invalidCheck" required="" />
                                            <label className="form-check-label" htmlFor="invalidCheck">
                                            Agree to all fields are correct
                                            </label>
                                            <div id="invalidCheck-alert" className="invalid-feedback">You must agree before submitting.</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer"> 
                                    <Link href="/admin/dashboard/parents" id="cancel" className="btn btn-danger float-right"> <i className="bi bi-person-fill-x"></i> Cancel</Link>
                                    <button className="btn btn-success float-right mr-1" onClick={() =>{ this.saveData() }}> <i className="bi bi-person-plus-fill"></i> Save</button>   
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
                        <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={() => {
                            this.setState({ 
                                cameraOn: false
                            });
                        }} aria-label="Close"> 
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

            <div className="modal fade" tabIndex="-1" role="dialog" id="fbmessenger" data-bs-backdrop="static">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title fs-5"><i className="bi bi-facebook"></i> Messenger</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={() => {
                            this.setState({ 
                                cameraOn: false
                            });
                        }} aria-label="Close"> 
                        </button>
                    </div>
                    <div className="modal-body p-0"> 

                    <ReactTable
                        key={"react-tables"}
                        className={"table table-bordered table-striped "}
                        data={this.state.data} 
                        columns={this.state.columns}
                    />
                    </div>
                    <div className="modal-footer"> 
                        <button type="button" className="btn btn-info" onClick={() => {
                            this.fetchFBList();
                        }} >Fetch </button>
                        <button type="button" className="btn btn-secondary" onClick={() => {
                            this.setState({ 
                                cameraOn: false
                            });
                        }} data-bs-dismiss="modal">Close</button>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    </DashboardLayout>}
}