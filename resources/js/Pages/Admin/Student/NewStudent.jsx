import React,{ Component } from "react";  
import { Link } from '@inertiajs/react'; 
import { EachMethod } from '@/Components/EachMethod'
import swal from 'sweetalert';
import Swal from 'sweetalert2';
import moment from 'moment';
import Select from 'react-select'

import ReactTable from "@/Components/ReactTable"; 
import DashboardLayout from '@/Layouts/DashboardLayout';
import QRCode from "react-qr-code";
import Webcam from "react-webcam";
import { ImageCrop } from '@/Components/ImageCrop';
import axios from 'axios';

export default class NewStudent extends Component {
    constructor(props) {
		super(props);
        this.state = {
            yeargrade: this.props.schoolyeargrades,
            photoupload: "",
            photobase64: "",
            photobase64final: "",
            uuid: "",
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
            is_ip: "",
            ip_specify: "",
            is_4ps_benficiary: "",
            sp4_id: "",
            is_disability: "",
            type_disability: "",
            type2_disability: "",
            type_others_disability: "",
            cd_hno: "",
            cd_sn: "",
            cd_barangay: "",
            cd_mc: "",
            cd_province: "",
            cd_country: "",
            cd_zip: "",
            is_pa_same_cd: "",
            pa_hno: "",
            pa_sn: "",
            pa_barangay: "",
            pa_mc: "",
            pa_province: "",
            pa_country: "",
            pa_zip: "",
            lglc: "",
            lsyc: "",
            lsa: "",
            lsa_school_id: "",
            flsh_semester: "",
            flsh_track: "",
            flsh_strand: "",
            ldm_applied: "",
            filedata: null,
            filedataName: "",
            filetype: "",
            filetype_: "",
            cameraOn: false,
            parent_data: this.props.parents,
            parent_columns: [
                {
                    id: "no",
                    accessor: 'no',
                    Header: 'No.', 
                    width: 50,
                    className: "center"
                },  
                {
                    id: "fullname",
                    Header: 'Fullname', 
                    width: 800,
                    accessor: 'fullname'
                }, 
                {
                    id: "section",
                    Header: 'No. Section',  
                    width: 200,
                    accessor: 'section'
                },  
                {
                    id: "Status",
                    Header: 'Status',  
                    width: 200,
                    accessor: 'status',
                    className: "center"
                },
                {
                    id: "Action",
                    Header: 'Status',  
                    width: 200,
                    accessor: 'status',
                    className: "center",
                    Cell: ({row}) => { 
                       return <>                       
                        <button className="btn btn-danger btn-block btn-sm col-12 mb-1"> <i className="bi bi-person-fill-x"></i> Remove</button>    
                        <button className="btn btn-info btn-block btn-sm col-12"> <i className="bi bi-pen"></i> Edit</button> 
                       </>            
                    }
                }
            ],
            selectOptions: [],
            selected_quardians: "",
            relationship: "",
            added_guardians: [],
            bdate_max: moment(new Date()).subtract('years',3).format('YYYY-MM-DD'),
            track: this.props.track,
            strand: this.props.strand
        }
        this.webCam = React.createRef(); 
        this.updateCrop = this.updateCrop.bind(this);
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;
        console.log(this);
        let so = []
        this.props.parents.forEach(element => {
            so.push({ value: element.uuid, label: `${element.last_name}, ${element.first_name} ${element.middle_name}` })
        });
        this.setState({
            selectOptions: so
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

    getParentList() {

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
        if(self.state.lrn != "" && self.state.first_name != "" && self.state.middle_name != "" && self.state.last_name != "" && self.state.sex != "" && self.state.bdate != ""&& self.state.psa_cert_no != "") {
            if($('#invalidCheck').prop('checked') == false) {
                $("#invalidCheck-alert").removeAttr('class'); 
                $("#invalidCheck-alert").addClass('d-block invalid-feedback');
                // alert('Please check agree to all fields are correct');
                swal({
                    title: "Please check agree if all fields are correct",
                    icon: 'info'
                })
                $("html, body").animate({ scrollTop: $(document).height()-$(window).height() });
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
                        qr_code: self.state.lrn,
                        psa_cert_no:self.state.psa_cert_no,
                        first_name:self.state.first_name,
                        last_name:self.state.last_name,
                        middle_name:self.state.middle_name,
                        extension_name:self.state.extension_name,
                        bdate:self.state.bdate,
                        status: "active",
                        picture_base64:self.state.photobase64final,
                        lrn:self.state.lrn,
                        sex:self.state.sex,                        
                        is_ip: self.state.is_ip,
                        ip_specify: self.state.ip_specify,
                        is_4ps_benficiary: self.state.is_4ps_benficiary,
                        '4pa_id': self.state.sp4_id,
                        is_disability: self.state.is_disability,
                        type_disability: self.state.type_disability,
                        type2_disability: self.state.type2_disability,
                        type_others_disability: self.state.type_others_disability,
                        cd_hno: self.state.cd_hno,
                        cd_sn: self.state.cd_sn,
                        cd_barangay: self.state.cd_barangay,
                        cd_mc: self.state.cd_mc,
                        cd_province: self.state.cd_province,
                        cd_country: self.state.cd_country,
                        cd_zip: self.state.cd_zip,
                        is_pa_same_cd: self.state.is_pa_same_cd,
                        pa_hno: self.state.pa_hno,
                        pa_sn: self.state.pa_sn,
                        pa_barangay: self.state.pa_barangay,
                        pa_mc: self.state.pa_mc,
                        pa_province: self.state.pa_province,
                        pa_country: self.state.pa_country,
                        pa_zip: self.state.pa_zip,
                        lglc: self.state.lglc,
                        lsyc: self.state.lsyc,
                        lsa: self.state.lsa,
                        lsa_school_id: self.state.lsa_school_id,            
                        flsh_semester: self.state.flsh_semester,
                        flsh_track: self.state.flsh_track,
                        flsh_strand: self.state.flsh_strand,            
                        ldm_applied: self.state.ldm_applied,
                        parents: self.state.selected_quardians,// self.state.added_guardians
                        relationship: self.state.relationship
                    };
                    // console.log(datas);
                    axios.post('/student',datas).then(function (response) {
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
                                    // console.log(typeof(data.data)!="undefined",data.data.length>0)
                                    if(typeof(data.data)!="undefined"&&data.data.length>0) {
                                        data.data.forEach((val,i,arr) => {
                                            console.log(val)
                                            if(val.field=='lrn') {
                                                $("#lrn-alert").removeAttr('class');
                                                $("#lrn-alert").html('LRN is already exist');
                                                $("#lrn-alert").addClass('d-block invalid-feedback');
                                            } else if(val.field=='first_name') {
                                                $("#first-name-alert").removeAttr('class');
                                                $("#first-name-alert").html('First is already exist');
                                                $("#first-name-alert").addClass('d-block invalid-feedback');
                                            } else if(val.field=='last_name') {
                                                $("#last-name-alert").removeAttr('class');
                                                $("#last-name-alert").html('Last is already exist');
                                                $("#last-name-alert").addClass('d-block invalid-feedback');
                                            } else if(val.field=='middle_name') {
                                                $("#middle-name-alert").removeAttr('class');
                                                $("#middle-name-alert").html('Middle is already exist');
                                                $("#middle-name-alert").addClass('d-block invalid-feedback');
                                            }
                                        });
                                    }
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
                } else if(result.isDismissed) {

                }
                return false
            });            
        } else {
            if(self.state.lrn == "") {
                $("#lrn-alert").removeAttr('class');
                $("#lrn-alert").html('Required Field');
                $("#lrn-alert").addClass('d-block invalid-feedback');
            }
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
            if(self.state.psa_cert_no == "") {
                $("#psa-alert").removeAttr('class');
                $("#psa-alert").html('Required Field');
                $("#psa-alert").addClass('d-block invalid-feedback');
            }
        }
    }
    
    render() {
        return <DashboardLayout title="New Student" user={this.props.auth.user} ><div className="noselect">
            <div className="app-content-header"> 
                <div className="container-fluid"> 
                    <div className="row">
                        <div className="col-sm-6 "><h3 className="mb-0"><i className="nav-icon bi bi-person-lines-fill"></i> Student</h3></div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-end">
                                <li className="breadcrumb-item"><Link href="/admin/dashboard">Dashboard</Link></li>
                                <li className="breadcrumb-item"><Link href="/admin/dashboard/student">Student</Link></li>
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
                                    <h3 className="card-title mt-2"> <i className="bi bi-person"></i>New Account</h3>
                                    <Link href="/admin/dashboard/student" id="cancel" className="btn btn-danger float-right"> <i className="bi bi-person-fill-x"></i> Cancel</Link>
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
                                                <span className="input-group-text btn btn-primary" htmlFor="inputGroupFile02" onClick={() => { this.setState({cameraOn: true}); $("#camerapanel").modal('show') }} ><i className="bi bi-camera"></i></span>
                                                <span className="input-group-text btn btn-danger" htmlFor="inputGroupFile02" onClick={() => { this.setState({photobase64final: ""}); }} ><i className="bi bi-trash"></i></span>
                                            </div> 
                                        </div> 
                                        <div className="col-md-4 d-flex flex-column justify-content-end">
                                            <label htmlFor="lrn" className="form-label ">Learner Reference No.</label>
                                            <input type="text" className="form-control" id="lrn" defaultValue="" required="" onChange={(e) => {
                                                $("#lrn-alert").removeAttr('class').addClass('invalid-feedback'); 
                                                this.setState({lrn: e.target.value})}} />
                                            <span id="lrn-alert" className="valid-feedback">Looks good!</span>
                                        </div> 
                                        <div className="col-md-4 d-flex flex-column justify-content-end">
                                            <QRCode value={this.state.lrn} size={256} style={{ height: "170px", maxWidth: "100%", width: "100%" }}  viewBox={`0 0 256 256`} />   
                                            <label htmlFor="first_name" className="form-label">PSA Cert. No.</label>
                                            <input type="text" className="form-control" id="first_name" defaultValue="" required="" onChange={(e) => { $("#psa-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({psa_cert_no: e.target.value})}}  />
                                            <div id="psa-alert" className="valid-feedback">Looks good!</div>
                                        </div> 
                                        <div className="col-md-4">
                                            <label htmlFor="first_name" className="form-label">First name</label>
                                            <input type="text" className="form-control" id="first_name" defaultValue="" required="" onChange={(e) => { $("#first-name-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({first_name: e.target.value})}}  />
                                            <div id="first-name-alert" className="valid-feedback">Looks good!</div>
                                        </div> 
                                        <div className="col-md-3">
                                            <label htmlFor="middle_name" className="form-label">Middle name</label>
                                            <input type="text" className="form-control" id="middle_name" defaultValue="" required="" onChange={(e) => {  $("#middle-name-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({middle_name: e.target.value})}}  />
                                            <div id="middle-name-alert" className="valid-feedback">Looks good!</div>
                                        </div> 
                                        <div className="col-md-3">
                                            <label htmlFor="last_name" className="form-label">Last name</label>
                                            <input type="text" className="form-control" id="last_name" defaultValue="" required="" onChange={(e) => { $("#last-name-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({last_name: e.target.value})}}  />
                                            <div id="last-name-alert" className="valid-feedback">Looks good!</div>
                                        </div> 
                                        <div className="col-md-2">
                                            <label htmlFor="extension_name" className="form-label">Extension name</label>
                                            <select className="form-select" id="extension_name" required="" defaultValue="" onChange={(e) => {  $("#extension-name-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({extension_name: e.target.value})}}  >
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
                                            <select className="form-select" id="gender" required="" defaultValue="" onChange={(e) => { $("#sex-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({sex: e.target.value})}} >
                                                <option disabled>Choose...</option>
                                                <option></option>
                                                <option>Male</option>
                                                <option>Female</option>
                                            </select>
                                            <div id="sex-alert" className="invalid-feedback">Please select a valid state.</div>
                                        </div>
                                        <div className="col-md-3">
                                            <label htmlFor="bdate" className="form-label">Birth Date</label>
                                            <input type="date" className="form-control" id="bdate" max={this.state.bdate_max} required="" onChange={(e) => {  $("#bdate-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({bdate: e.target.value})}}  />
                                            <div id="bdate-alert" className="valid-feedback">Looks good!</div>
                                        </div> 
                                    </div> 
                                    <hr />
                                    <div className="row g-3">
                                        <div className="col-md-4 form-group">
                                            <label htmlFor="first_name" className="form-label">Belonging to any Indigenous Peoples (IP) Community/Indigenous Cultural Community?</label>
                                            <div className="form-group clearfix">
                                                <div className="icheck-primary d-inline pr-2">
                                                    <input type="radio" id="isips1" name="isip" onChange={() => { $('#isips_specify').removeAttr('disabled'); this.setState({is_ip: true}); }} />
                                                    <label htmlFor="isips1">
                                                        Yes
                                                    </label>
                                                </div>
                                                <div className="icheck-primary d-inline">
                                                    <input type="radio" id="isips2" name="isip" onChange={() => { $('#isips_specify').attr('disabled','disabled' ); this.setState({is_ip: false}); }}  />
                                                    <label htmlFor="isips2">
                                                        No
                                                    </label>
                                                </div> 
                                            </div>
                                            {/* <input type="text" className="form-control" id="first_name" defaultValue="" required="" onChange={(e) => { $("#first-name-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({first_name: e.target.value})}}  /> */}
                                            <div id="isips1-alert" className="valid-feedback">Looks good!</div>
                                        </div> 
                                        <div className="col-md-8">
                                            <label htmlFor="isipsif" className="form-label">If Yes, please specify:</label>
                                            <input type="text" className="form-control" id="isips_specify" disabled defaultValue="" required="" onChange={(e) => { $("#isips-s-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({ip_specify: e.target.value})}}  />
                                            <div id="isips-s-alert" className="valid-feedback">Looks good!</div>
                                        </div> 
                                    </div>
                                    <hr />
                                    <div className="row g-3">
                                        <div className="col-md-4 form-group">
                                            <label htmlFor="is4ps" className="form-label">Is your family a beneficiary of 4Ps?</label>
                                            <div className="form-group clearfix">
                                                <div className="icheck-primary d-inline pr-2">
                                                    <input type="radio" id="isb4p1" name="isb4ps" onChange={() => { $('#isb4ps_specify').removeAttr('disabled'); this.setState({is_4ps_benficiary: true}); }} />
                                                    <label htmlFor="isb4p1">
                                                        Yes
                                                    </label>
                                                </div>
                                                <div className="icheck-primary d-inline">
                                                    <input type="radio" id="isb4p2" name="isb4ps" onChange={() => { $('#isb4ps_specify').attr('disabled','disabled' ); this.setState({is_4ps_benficiary: false}); }}  />
                                                    <label htmlFor="isb4p2">
                                                        No
                                                    </label>
                                                </div> 
                                            </div>
                                            {/* <input type="text" className="form-control" id="first_name" defaultValue="" required="" onChange={(e) => { $("#first-name-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({first_name: e.target.value})}}  /> */}
                                            <div id="isips1-alert" className="valid-feedback">Looks good!</div>
                                        </div> 
                                        <div className="col-md-8">
                                            <label htmlFor="isb4psf" className="form-label">If Yes, write the 4Ps Household ID Number below</label>
                                            <input type="text" className="form-control" id="isb4ps_specify" disabled defaultValue="" required="" onChange={(e) => { $("#isb4ps_specify-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({sp4_id: e.target.value})}}  />
                                            <div id="isb4ps_specify-s-alert" className="valid-feedback">Looks good!</div>
                                        </div> 
                                    </div>
                                    <hr />
                                    <div className="row g-3">
                                        <div className="col-md-4 form-group">
                                            <label htmlFor="is4ps" className="form-label">Is the child a Learner with Disability?</label>
                                            <div className="form-group clearfix">
                                                <div className="icheck-primary d-inline pr-2">
                                                    <input type="radio" id="isdisability1" name="isdisability" onChange={() => { $('#disa').removeAttr('disabled'); this.setState({is_disability:true}); }} />
                                                    <label htmlFor="isdisability1">
                                                        Yes
                                                    </label>
                                                </div>
                                                <div className="icheck-primary d-inline">
                                                    <input type="radio" id="isdisability2" name="isdisability" onChange={() => { $('#disa').attr('disabled',"disabled"); this.setState({is_disability:false}); }} />
                                                    <label htmlFor="isdisability2">
                                                        No
                                                    </label>
                                                </div> 
                                            </div>
                                            {/* <input type="text" className="form-control" id="first_name" defaultValue="" required="" onChange={(e) => { $("#first-name-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({first_name: e.target.value})}}  /> */}
                                            <div id="isips1-alert" className="valid-feedback">Looks good!</div>
                                        </div> 
                                        <div className="col-md-8 row">
                                            <fieldset name="disa" id="disa" disabled>
                                                <div className="d-flex flex-wrap">
                                                    <div className="col-md-4">
                                                        <div className="form-group clearfix">
                                                            <div className="icheck-primary d-inline">
                                                                <input type="checkbox" className="mb-1" id="cld_visual_impairment" />
                                                                <label htmlFor="cld_visual_impairment" className="ml-1">
                                                                    Visual Impairment
                                                                </label>
                                                            </div>
                                                            <ul className="mb-0">
                                                                <li>
                                                                    <div className="icheck-primary d-inline">
                                                                        <input type="checkbox" className="mb-1" id="cld_blind" />
                                                                        <label htmlFor="cld_blind" className="ml-1">
                                                                        blind
                                                                        </label>
                                                                    </div>
                                                                </li>
                                                                <li>
                                                                    <div className="icheck-primary d-inline">
                                                                        <input type="checkbox" className="mb-1" id="cld_low_vision" />
                                                                        <label htmlFor="cld_low_vision" className="ml-1">
                                                                        low vision
                                                                        </label>
                                                                    </div>
                                                                </li>
                                                            </ul>
                                                        </div>

                                                        <div className="form-group clearfix">
                                                            <div className="icheck-primary d-inline">
                                                                <input type="checkbox" className="mb-1" id="cld_multiple_disorder" />
                                                                <label htmlFor="cld_multiple_disorder" className="ml-1">
                                                                Multiple Disorder
                                                                </label>
                                                            </div> 
                                                        </div>
                                                        <div className="form-group clearfix">
                                                            <div className="icheck-primary d-inline">
                                                                <input type="checkbox" className="mb-1" id="cld_hearing_impaorment" />
                                                                <label htmlFor="cld_hearing_impaorment" className="ml-1">
                                                                Hearing Impairment
                                                                </label>
                                                            </div> 
                                                        </div>
                                                    </div> 
                                                    <div className="col-md-4">
                                                        <div className="form-group clearfix">
                                                            <div className="icheck-primary d-inline">
                                                                <input type="checkbox" className="mb-1" id="cld_asd" />
                                                                <label htmlFor="cld_asd" className="ml-1">
                                                                Autism Spectrum Disorder
                                                                </label>
                                                            </div> 
                                                        </div>
                                                        <div className="form-group clearfix">
                                                            <div className="icheck-primary d-inline">
                                                                <input type="checkbox" className="mb-1" id="cld_sld" />
                                                                <label htmlFor="cld_sld" className="ml-1">
                                                                Speech/Language Disorder
                                                                </label>
                                                            </div> 
                                                        </div>
                                                        <div className="form-group clearfix">
                                                            <div className="icheck-primary d-inline">
                                                                <input type="checkbox" className="mb-1" id="cld_ld" />
                                                                <label htmlFor="cld_ld" className="ml-1">
                                                                Learning Disability
                                                                </label>
                                                            </div> 
                                                        </div>
                                                        <div className="form-group clearfix">
                                                            <div className="icheck-primary d-inline">
                                                                <input type="checkbox" className="mb-1" id="cld_ebd" />
                                                                <label htmlFor="cld_ebd" className="ml-1 fs-7">
                                                                Emotional- Behavioral Disorder
                                                                </label>
                                                            </div> 
                                                        </div>
                                                        <div className="form-group clearfix">
                                                            <div className="icheck-primary d-inline">
                                                                <input type="checkbox" className="mb-1" id="cld_cp" />
                                                                <label htmlFor="cld_cp" className="ml-1">
                                                                Cerebral Palsy
                                                                </label>
                                                            </div> 
                                                        </div>
                                                    </div> 
                                                    <div className="col-md-4">
                                                        <div className="form-group clearfix">
                                                            <div className="icheck-primary d-inline">
                                                                <input type="checkbox" className="mb-1" id="cld_id" />
                                                                <label htmlFor="cld_id" className="ml-1 fs-7">
                                                                intellectual Disability
                                                                </label>
                                                            </div> 
                                                        </div>
                                                        <div className="form-group clearfix">
                                                            <div className="icheck-primary d-inline">
                                                                <input type="checkbox" className="mb-1" id="cld_oph" />
                                                                <label htmlFor="cld_oph" className="ml-1 fs-7">
                                                                Orthopedic/Physical Handicap
                                                                </label>
                                                            </div> 
                                                        </div>
                                                        <div className="form-group clearfix">
                                                            <div className="icheck-primary d-inline">
                                                                <input type="checkbox" className="mb-7" id="cld_shp_cd" />
                                                                <label htmlFor="cld_shp_cd" className="ml-1 fs-7 text-wrap">
                                                                Special Health Problem / <br /> Chronic Disease
                                                                </label>
                                                            </div> 
                                                            <ul className="mb-0">
                                                                <li>
                                                                    <div className="icheck-primary d-inline">
                                                                        <input type="checkbox" className="mb-1" id="cld_cancer" />
                                                                        <label htmlFor="cld_cancer" className="ml-1">
                                                                        Cancer
                                                                        </label>
                                                                    </div>
                                                                </li> 
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                    </div>                                                
                                                </div>
                                            </fieldset>
                                        </div>

                                    </div>
                                    <hr />
                                    <h5 className="badge fs-5 bg-primary  d-block">Current Address</h5>
                                    <div className="row g-3">
                                        <div className="col-md-4">
                                            <label htmlFor="ca_hn" className="form-label">House No.</label>
                                            <input type="text" className="form-control" id="ca_hn" defaultValue="" required="" onChange={(e) => { $("#ca_hn-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({cd_hno: e.target.value})}}  />
                                            <div id="ca_hn-alert" className="valid-feedback">Looks good!</div>
                                        </div> 
                                        <div className="col-md-4">
                                            <label htmlFor="ca_sn" className="form-label">Sitio/Street Name</label>
                                            <input type="text" className="form-control" id="ca_sn" defaultValue="" required="" onChange={(e) => { $("#ca_sn-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({cd_sn: e.target.value})}}  />
                                            <div id="ca_sn-alert" className="valid-feedback">Looks good!</div>
                                        </div> 
                                        <div className="col-md-4">
                                            <label htmlFor="ca_barangay" className="form-label">Barangay</label>
                                            <input type="text" className="form-control" id="ca_barangay" defaultValue="" required="" onChange={(e) => { $("#ca_barangay-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({cd_barangay: e.target.value})}}  />
                                            <div id="ca_barangay-alert" className="valid-feedback">Looks good!</div>
                                        </div> 
                                        <div className="col-md-4">
                                            <label htmlFor="ca_mc" className="form-label">Municipality/City</label>
                                            <input type="text" className="form-control" id="ca_mc" defaultValue="" required="" onChange={(e) => { $("#ca_mc-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({cd_mc: e.target.value})}}  />
                                            <div id="ca_mc-alert" className="valid-feedback">Looks good!</div>
                                        </div> 
                                        <div className="col-md-4">
                                            <label htmlFor="ca_province" className="form-label">Province</label>
                                            <input type="text" className="form-control" id="ca_province" defaultValue="" required="" onChange={(e) => { $("#ca_province-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({cd_province: e.target.value})}}  />
                                            <div id="ca_province-alert" className="valid-feedback">Looks good!</div>
                                        </div> 
                                        <div className="col-md-4">
                                            <label htmlFor="ca_country" className="form-label">Country</label>
                                            <input type="text" className="form-control" id="ca_country" defaultValue="Philippines" required="" onChange={(e) => { $("#ca_country-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({cd_country: e.target.value})}}  />
                                            <div id="ca_country-alert" className="valid-feedback">Looks good!</div>
                                        </div> 
                                        <div className="col-md-4">
                                            <label htmlFor="ca_zip" className="form-label">Zip Code</label>
                                            <input type="text" className="form-control" id="ca_zip" defaultValue="" required="" onChange={(e) => { $("#ca_zip-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({cd_zip: e.target.value})}}  />
                                            <div id="ca_zip-alert" className="valid-feedback">Looks good!</div>
                                        </div> 
                                    </div>
                                    <hr />
                                    <div className="col-lg-12">
                                        <h5 className="badge fs-5 bg-primary  d-block">Permanent Address</h5>
                                        <div className="col-md-4 form-group">
                                            <div className="form-inline clearfix">
                                            <label htmlFor="is4ps" className="form-label pr-5">Same with your Current Address?</label>
                                                <div className="icheck-primary d-inline pr-2">
                                                    <input type="radio" id="issamecd1" name="issamecd" onChange={() => { $('#fspa').attr('disabled',"disabled"); this.setState({is_pa_same_cd: true}); }}/>
                                                    <label htmlFor="issamecd1">
                                                        Yes
                                                    </label>
                                                </div>
                                                <div className="icheck-primary d-inline">
                                                    <input type="radio" id="issamecd2" name="issamecd" onChange={() => { $('#fspa').removeAttr('disabled'); this.setState({is_pa_same_cd: true}); }}/>
                                                    <label htmlFor="issamecd2">
                                                        No
                                                    </label>
                                                </div> 
                                            </div>
                                            {/* <input type="text" className="form-control" id="first_name" defaultValue="" required="" onChange={(e) => { $("#first-name-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({first_name: e.target.value})}}  /> */}
                                            <div id="isips1-alert" className="valid-feedback">Looks good!</div>
                                        </div> 
                                        <fieldset name="pa" id="fspa" disabled>
                                            <div className="row g-3" >
                                                <div className="col-md-4">
                                                    <label htmlFor="ca_hn" className="form-label">House No.</label>
                                                    <input type="text" className="form-control" id="pa_hn" defaultValue="" required="" onChange={(e) => { $("#ca_hn-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({pa_hno: e.target.value})}}  />
                                                    <div id="pa_hn-alert" className="valid-feedback">Looks good!</div>
                                                </div> 
                                                <div className="col-md-4">
                                                    <label htmlFor="ca_hn" className="form-label">Sitio/Street Name</label>
                                                    <input type="text" className="form-control" id="pa_sn" defaultValue="" required="" onChange={(e) => { $("#pa_sn-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({pa_sn: e.target.value})}}  />
                                                    <div id="pa_sn-alert" className="valid-feedback">Looks good!</div>
                                                </div> 
                                                <div className="col-md-4">
                                                    <label htmlFor="pa_barangay" className="form-label">Barangay</label>
                                                    <input type="text" className="form-control" id="pa_barangay" defaultValue="" required="" onChange={(e) => { $("#pa_barangy-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({pa_barangay: e.target.value})}}  />
                                                    <div id="pa_barangay-alert" className="valid-feedback">Looks good!</div>
                                                </div> 
                                                <div className="col-md-4">
                                                    <label htmlFor="pa_mc" className="form-label">Municipality/City</label>
                                                    <input type="text" className="form-control" id="pa_mc" defaultValue="" required="" onChange={(e) => { $("#pa_mc-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({pa_mc: e.target.value})}}  />
                                                    <div id="pa_mc-alert" className="valid-feedback">Looks good!</div>
                                                </div> 
                                                <div className="col-md-4">
                                                    <label htmlFor="ca_hn" className="form-label">Province</label>
                                                    <input type="text" className="form-control" id="pa_province" defaultValue="" required="" onChange={(e) => { $("#pa_province-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({pa_province: e.target.value})}}  />
                                                    <div id="pa_province-alert" className="valid-feedback">Looks good!</div>
                                                </div> 
                                                <div className="col-md-4">
                                                    <label htmlFor="ca_hn" className="form-label">Country</label>
                                                    <input type="text" className="form-control" id="ca_hn" defaultValue="" required="" onChange={(e) => { $("#pa_country-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({pa_country: e.target.value})}}  />
                                                    <div id="pa_country-alert" className="valid-feedback">Looks good!</div>
                                                </div> 
                                                <div className="col-md-4">
                                                    <label htmlFor="ca_hn" className="form-label">Zip Code</label>
                                                    <input type="text" className="form-control" id="pa_zip" defaultValue="" required="" onChange={(e) => { $("#pa_zip-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({pa_zip: e.target.value})}}  />
                                                    <div id="pa_zip-alert" className="valid-feedback">Looks good!</div>
                                                </div> 
                                            </div>
                                        </fieldset>                                        
                                    </div>
                                    <div className="col-lg-12">
                                        <hr />
                                        <h5 className="badge fs-5 bg-primary  d-block">For Returning Learner (Balik-Aral) and Those Who will Transfer/Move In</h5>
                                        <div className="row g-3" >
                                            <div className="col-md-6">
                                                <label htmlFor="lglv" className="form-label">Last Grade Level Completed</label>
                                                <input type="text" className="form-control" id="lglv" defaultValue="" required="" onChange={(e) => { $("#lglv-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({lglc: e.target.value})}}  />
                                                <div id="lglv-alert" className="valid-feedback">Looks good!</div>
                                            </div> 
                                            <div className="col-md-6">
                                                <label htmlFor="lsyc" className="form-label">Last School Year Completed</label>
                                                <input type="text" className="form-control" id="lsyc" defaultValue="" required="" onChange={(e) => { $("#lsyc-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({lsyc: e.target.value})}}  />
                                                <div id="lsyc-alert" className="valid-feedback">Looks good!</div>
                                            </div> 
                                            <div className="col-md-6">
                                                <label htmlFor="lsa" className="form-label">Last School Attended</label>
                                                <input type="text" className="form-control" id="lsa" defaultValue="" required="" onChange={(e) => { $("#lsa-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({lsa: e.target.value})}}  />
                                                <div id="lsa-alert" className="valid-feedback">Looks good!</div>
                                            </div> 
                                            <div className="col-md-6">
                                                <label htmlFor="lsa_school_id" className="form-label">School ID</label>
                                                <input type="text" className="form-control" id="lsa_school_id" defaultValue="" required="" onChange={(e) => { $("#lsa_school_id-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({lsa_school_id: e.target.value})}}  />
                                                <div id="lsa_school_id-alert" className="valid-feedback">Looks good!</div>
                                            </div> 
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <hr />
                                        <h5 className="badge fs-5 bg-primary d-block">For Learners in Senior High School</h5>
                                        <div className="row g-3" >
                                            <div className="col-md-12">
                                                <div className="form-inline clearfix">
                                                    <label htmlFor="ca_hn" className="form-label pr-5">Semester</label>
                                                    
                                                    <div className="icheck-primary d-inline pr-5">
                                                        <input type="radio" id="flsh_semester1" name="flsh_semester" onChange={() => { this.setState({flsh_semester: "1st"}); }} />
                                                        <label htmlFor="flsh_semester1" className="pl-2">
                                                            1st
                                                        </label>
                                                    </div>
                                                    <div className="icheck-primary d-inline">
                                                        <input type="radio" id="flsh_semester2" name="flsh_semester" onChange={() => { this.setState({flsh_semester: "2nd"}); }} />
                                                        <label htmlFor="flsh_semester2" className="pl-2">
                                                            2nd
                                                        </label>
                                                    </div>                                                     
                                                </div>

                                                <div id="flsh_semester-alert" className="valid-feedback">Looks good!</div>
                                            </div> 
                                            <div className="col-md-6">
                                                <label htmlFor="flsh_track" className="form-label">Track</label>
                                                {/* <input type="text" className="form-control" id="flsh_track" defaultValue="" required="" onChange={(e) => { $("#flsh_track-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({flsh_track: e.target.value})}}  /> */}
                                                <select name="flsh_track" id="flsh_track" className="form-control"  onChange={(e) => { $("#flsh_track-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({flsh_track: e.target.value})}} >
                                                    <option value=""></option>
                                                        <EachMethod of={this.state.track} render={(element,index) => {
                                                            return <option value={`${element.name}`} >{`${element.name} ${(element.acronyms!=""?"("+element.acronyms+")":"")}`}</option>
                                                        }} />
                                                </select>
                                                <div id="flsh_track-alert" className="valid-feedback">Looks good!</div>
                                            </div> 
                                            <div className="col-md-6">
                                                <label htmlFor="flsh_strand" className="form-label">Strand</label>
                                                {/* <input type="text" className="form-control" id="flsh_strand" defaultValue="" required="" onChange={(e) => { $("#flsh_strand-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({flsh_strand: e.target.value})}}  /> */}
                                                <select name="flsh_strand" id="flsh_strand" className="form-control" onChange={(e) => { $("#flsh_strand-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({flsh_strand: e.target.value})}}>
                                                    <option value=""></option>
                                                        <EachMethod of={this.state.strand} render={(element,index) => {
                                                            return <option value={`${element.name}`} >{`${element.name} ${(element.acronyms!=""?"("+element.acronyms+")":"")}`}</option>
                                                        }} />
                                                </select>
                                                <div id="flsh_strand-alert" className="valid-feedback">Looks good!</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <hr />
                                        <div className="col-lg-12">
                                            <p className="badge fs-5 bg-primary text-wrap text-start">If school will implement other distance learning modalities aside from face-to-face instruction, what would you prefer for your child?</p>
                                        </div>
                                        <h4>Choose all that apply:</h4>
                                        <div className="row g-3" >
                                            <div className="col-md-3">                                                
                                                <div className="form-group clearfix">
                                                    <div className="icheck-primary d-inline">
                                                        <input type="checkbox" className="mb-1" id="ldm_modular_print" />
                                                        <label htmlFor="checkboxPrimary1" className="ml-1">
                                                        Modular (Print)
                                                        </label>
                                                    </div> 
                                                </div>
                                                <div id="pa_hn-alert" className="valid-feedback">Looks good!</div>
                                            </div>
                                            <div className="col-md-3">                                                
                                                <div className="form-group clearfix">
                                                    <div className="icheck-primary d-inline">
                                                        <input type="checkbox" className="mb-1" id="ldm_modular_digital" />
                                                        <label htmlFor="checkboxPrimary1" className="ml-1">
                                                        Modular (Digital)
                                                        </label>
                                                    </div> 
                                                </div>
                                                <div id="pa_hn-alert" className="valid-feedback">Looks good!</div>
                                            </div>
                                            <div className="col-md-3">                                                
                                                <div className="form-group clearfix">
                                                    <div className="icheck-primary d-inline">
                                                        <input type="checkbox" className="mb-1" id="ldm_online" />
                                                        <label htmlFor="checkboxPrimary1" className="ml-1">
                                                        Online
                                                        </label>
                                                    </div> 
                                                </div>
                                                <div id="pa_hn-alert" className="valid-feedback">Looks good!</div>
                                            </div>
                                            <div className="col-md-3">                                                
                                                <div className="form-group clearfix">
                                                    <div className="icheck-primary d-inline">
                                                        <input type="checkbox" className="mb-1" id="ldm_education_television" />
                                                        <label htmlFor="checkboxPrimary1" className="ml-1">
                                                        Educational Television
                                                        </label>
                                                    </div> 
                                                </div>
                                                <div id="pa_hn-alert" className="valid-feedback">Looks good!</div>
                                            </div>
                                            <div className="col-md-3">                                                
                                                <div className="form-group clearfix">
                                                    <div className="icheck-primary d-inline">
                                                        <input type="checkbox" className="mb-1" id="ldm_radio" />
                                                        <label htmlFor="checkboxPrimary1" className="ml-1">
                                                        Radio-Based Instruction
                                                        </label>
                                                    </div> 
                                                </div>
                                                <div id="pa_hn-alert" className="valid-feedback">Looks good!</div>
                                            </div>
                                            <div className="col-md-3">                                                
                                                <div className="form-group clearfix">
                                                    <div className="icheck-primary d-inline">
                                                        <input type="checkbox" className="mb-1" id="ldm_homeschooling" />
                                                        <label htmlFor="checkboxPrimary1" className="ml-1">
                                                        Homeschooling
                                                        </label>
                                                    </div> 
                                                </div>
                                                <div id="pa_hn-alert" className="valid-feedback">Looks good!</div>
                                            </div>
                                            <div className="col-md-3">                                                
                                                <div className="form-group clearfix">
                                                    <div className="icheck-primary d-inline">
                                                        <input type="checkbox" className="mb-1" id="ldm_blended" />
                                                        <label htmlFor="checkboxPrimary1" className="ml-1">
                                                        Blended
                                                        </label>
                                                    </div> 
                                                </div>
                                                <div id="pa_hn-alert" className="valid-feedback">Looks good!</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <hr />
                                        <h5 className="badge fs-5 bg-primary text-start d-block">Parents / Guardians</h5>
                                        <div className="row">
                                            <EachMethod of={this.state.added_guardians} render={(element,index) => {
                                                return  <div className="input-group ">
                                                    <div className="input-group-prepend col-lg-4">
                                                        <div htmlFor="lglv" className="input-group-text">{`${element.last_name}, ${element.first_name}`}</div>
                                                    </div> 
                                                    <button className="btn btn-danger" onClick={() => {
                                                        let a = this.state.added_guardians;
                                                        let temp = [];
                                                        a.forEach((element_,i,arr) => {
                                                            if(element_.id != element.id) {
                                                                temp.push(element);
                                                            }
                                                            if((i + 1) == arr.length) {
                                                                this.setState({added_guardians: temp});
                                                            }
                                                        });
                                                    }} >Remove</button>
                                                </div>
                                            }} />
                                            <div className="col-lg-5">
                                                <label htmlFor="relationship" className="form-label">Relationship</label>
                                                <input type="text" className="form-control" id="relationship" defaultValue={this.state.relationship} required="" onChange={(e) => { $("#relationship-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({relationship: e.target.value})}}  />
                                                <div id="relationship-alert" className="valid-feedback">Looks good!</div>
                                            </div> 
                                        </div>
                                        <div className="row" >
                                            <div className={`${(this.state.added_guardians.length>0)?'form-inline col-lg-6 pt-2':'form-inline col-lg-6'}`}>
                                                <div className="input-group">
                                                    <div className="input-group-prepend">
                                                        <div htmlFor="lglv" className="input-group-text">Parent / Guardian : </div>
                                                    </div>
                                                    <Select  placeholder="Select" required="" className="col-6" id="guardians"  options={this.state.selectOptions} onChange={(e) => {this.setState({selected_quardians: e.value})}} />
                                                    {/* <input type="text" list="parentslist" className="form-control col-2" id="guardians" maxLength={12} defaultValue="" placeholder="Select Parent" required="" /> */}
                                                    <button className="btn btn-primary" onClick={() => {
                                                        let temp_numbers = this.state.added_guardians; 
                                                        if(temp_numbers.length == 0) {
                                                            if(this.state.selected_quardians != "" && temp_numbers.some(e => e.id == this.state.selected_quardians) == false) {
                                                                temp_numbers.push(this.state.parent_data.find(e=>e.id==this.state.selected_quardians));
                                                                this.setState({added_guardians: temp_numbers});
                                                            } else if(this.state.selected_quardians != "" ){
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
                                                        } else {
                                                            Swal.fire({  
                                                                title: "Sorry already added, Only one parent can be select", 
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
                                    <div className="col-lg-12 mt-3">
                                        <div className="form-check float-right">
                                            <input className="form-check-input" type="checkbox" defaultValue="" id="invalidCheck" />
                                            <label className="form-check-label" htmlFor="invalidCheck">
                                            Confirm all fields are correct.
                                            </label>
                                            <div id="invalidCheck-alert" className="invalid-feedback">You must agree before submitting.</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <Link href="/admin/dashboard/student" id="cancel" className="btn btn-danger float-right"> <i className="bi bi-person-fill-x"></i> Cancel</Link>
                                    <button className="btn btn-success float-right mr-1" onClick={() =>{ this.saveData() }}> <i className="bi bi-person-plus-fill"></i> Save</button>  
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            
            <datalist id="parentslist">
                <EachMethod of={this.state.parent_data} render={(element,index) => {
                    return <option >{`${element.last_name}, ${element.first_name}`}</option>
                }} />
            </datalist>
            
            <datalist id="selectedYearLevel">
                <EachMethod of={this.state.yeargrade} render={(element,index) => {
                    return <option >{`${element.year_grade}`}</option>
                }} />
            </datalist>

            <datalist id="selectedSY">
                <option >2025 - 2026</option>
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
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => { this.setState({cameraOn: false});}}>Close</button>
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
        </DashboardLayout>
    }
}