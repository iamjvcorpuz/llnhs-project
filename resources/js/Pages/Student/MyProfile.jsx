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


export default class MyProfile extends Component {
    constructor(props) {
		super(props);
        // fullname: "Nina Mcintire",
        // grade_level: "Grade 7",
        // level: "Junior",
        // section: "Section 1",
        // _track: "ACAD",
        // _strand: "STEM",
        this.state = {
            fullname: "",
            grade_level: "",
            level: "",
            section: "",
            _track: "",
            _strand: "",
            photoupload: "",
            photobase64: "",
            photobase64final: "",
            id: "",
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
            added_guardians: [],
            bdate_max: moment(new Date()).subtract('years',3).format('YYYY-MM-DD'),
            track: this.props.track,
            strand: this.props.strand,
            attendance_data: [],
            attendance_columns: [
                {
                    id: "no",
                    accessor: 'no',
                    Header: 'No.', 
                    width: 50,
                    className: "center"
                },  
                {
                    Header: 'Time',
                    accessor: 'time',
                    className: "center"
                },
                {
                    Header: 'Date',
                    accessor: 'date',
                    className: "center"
                },
                {
                    Header: 'Mode',
                    accessor: 'mode',
                    className: "center"
                },
                {
                    Header: 'Terminal',
                    accessor: 'terminal',
                    className: "center"
                }
            ],
            activity_data: [],
            activity_columns: [
                {
                    id: "no",
                    accessor: 'no',
                    Header: 'No.', 
                    width: 50,
                    className: "center"
                },  
                {
                    Header: 'Date Time',
                    accessor: 'date',
                    className: "center",
                    width: 100,
                },
                {
                    Header: 'Logs',
                    accessor: 'time',
                    className: "center"
                }
            ],
        }
        console.log(this.props); 
    }
    componentDidMount() {

        $('#tabs a').on('click', function (event) {
            event.preventDefault()
            $(this).tab('show')
        })

        let selected_quardians = "";
        let so = []
        this.props.parents.forEach(element => {
            so.push({ value: element.id, label: `${element.last_name}, ${element.first_name} ${element.middle_name}` })
        });
        let t = (this.props.getSchoolStats!=null&&this.props.getSchoolStats.length>0)?this.props.getSchoolStats[0].track:"";
        let s = (this.props.getSchoolStats!=null&&this.props.getSchoolStats.length>0)?this.props.getSchoolStats[0].strand:"";
        
        let _track = (this.props.track.length>0)?this.props.track.find((e) => `${e.name} (${e.acronyms})` === t):"";
        let _strand = (this.props.strand.length>0)?this.props.strand.find((e) => `${e.name} (${e.acronyms})` === s):""; 
        this.setState({
            selectOptions: so,
            photobase64final: (this.props.student.picture_base64!=null)?this.props.student.picture_base64:'/adminlte/dist/assets/img/avatar.png',
            ...this.props.student,
            added_guardians:this.props.guardians,
            selected_quardians: (this.props.guardians!=null&&this.props.guardians.length>0)?this.props.guardians[0].id:"",
            relationship: (this.props.guardians!=null&&this.props.guardians.length>0)?this.props.guardians[0].relationship:"",
            fullname: this.props.student.first_name + " " + this.props.student.last_name,
            grade_level: (this.props.getSchoolStats!=null&&this.props.getSchoolStats.length>0)?this.props.getSchoolStats[0].grade:"",
            level: (this.props.getSchoolStats!=null&&this.props.getSchoolStats.length>0)?this.props.getSchoolStats[0].grade_level:"",
            section: (this.props.getSchoolStats!=null&&this.props.getSchoolStats.length>0)?this.props.getSchoolStats[0].section:"",
            _track:  typeof(_track)!="undefined"&&_track!=null?_track.acronyms:"",
            _strand: typeof(_strand)!="undefined"&&_strand!=null?_strand.acronyms:""
        });

        const pie_chart_options = {
            series: [12, 2,2],
            chart: {
              type: "donut",
              height: "240vh",
            },
            labels: ["No. of Present", "No. of Absences", "No. of Tardy"],
            dataLabels: {
              enabled: false,
            },
            colors: [
              "#0d6efd",
              "#f85555",
              "#d63384",
            ],
          };
    
          const pie_chart = new ApexCharts(
            document.querySelector("#pie-chart"),
            pie_chart_options,
          );
          pie_chart.render();
    }
    render() {
        return <DashboardLayout title="Profile" user={this.props.auth.user} ><div className="noselect">
            <div className="app-content-header"> 
                <div className="container-fluid"> 
                    <div className="row"> 
                        <div className="col-lg-12">
                            <div className="card card-widget widget-user shadow"> 
                                <div className="widget-user-header bg-info">
                                    <h3 className="widget-user-username">{this.state.fullname}</h3>
                                    <h5 className="widget-user-desc">{this.state.level} &amp; {this.state.grade_level}</h5>
                                </div>
                                <div className="widget-user-image">
                                    <img className="img-circle elevation-2" src={this.state.photobase64final!=""?this.state.photobase64final:"/adminlte/dist/assets/img/avatar.png"}
                                                    ref={t=> this.upload_view_image = t}
                                                    onError={(e)=>{ 
                                                        this.upload_view_image.src='/adminlte/dist/assets/img/avatar.png'; 
                                                    }} alt="User Avatar" />
                                </div>
                                <div className="card-footer">
                                    <div className="row">
                                        <div className="col-sm-3 border-right">
                                            <div className="description-block">
                                                <h5 className="description-header">{this.state.section}</h5>
                                                <span className="description-text">Section</span>
                                            </div> 
                                        </div> 
                                        <div className="col-sm-3 border-right">
                                            <div className="description-block">
                                                <h5 className="description-header">{this.state.grade_level}</h5>
                                                <span className="description-text">Grade</span>
                                            </div> 
                                        </div> 
                                        <div className="col-sm-3 border-right">
                                            <div className="description-block">
                                                <h5 className="description-header">{this.state._track}</h5>
                                                <span className="description-text">TRACK</span>
                                            </div> 
                                        </div> 
                                        <div className="col-sm-3">
                                            <div className="description-block">
                                            <h5 className="description-header">{this.state._strand}</h5>
                                            <span className="description-text">STRAND</span>
                                            </div> 
                                        </div> 
                                    </div> 
                                </div>
                            </div>
                        </div>

                    </div> 
                </div> 
            </div>

            <div className="app-content">
                <div className="container-fluid">
                    
                    <div className="row">
                        <div className="col-lg-12">


                            <div className="card-header p-2" >
                                <ul id="tabs" className="nav nav-pills" role="tablist">
                                    <li className="nav-item"><a className="nav-link active" href="#profiles" data-toggle="tab">Profile</a></li>
                                    <li className="nav-item"><a className="nav-link " href="#attendance" data-toggle="tab">Attendance</a></li>
                                    <li className="nav-item"><a className="nav-link " href="#activity" data-toggle="tab">Activity Logs</a></li> 
                                </ul>
                            </div>
                            <div className="tab-content">
                                <div className="tab-pane active" id="profiles">
                                    <div className="card mb-4">
                                        <div className="card-header">
                                            <h3 className="card-title"> <i className="bi bi-card-list"></i> Details</h3> 
                                        </div>
                                        <div className="card-body"> 
                                        <hr />
                                            <div className="row g-3">
                                                <div className="col-md-4 form-group">
                                                    <label htmlFor="first_name" className="form-label">Belonging to any Indigenous Peoples (IP) Community/Indigenous Cultural Community?</label>
                                                    <div className="form-group clearfix">
                                                        <div className="icheck-primary d-inline pr-2">
                                                            <input type="radio" id="isips1" name="isip" checked={this.state.is_ip==1?true:false} onChange={() => { $('#isips_specify').removeAttr('disabled'); this.setState({is_ip: true}); }} />
                                                            <label htmlFor="isips1">
                                                                Yes
                                                            </label>
                                                        </div>
                                                        <div className="icheck-primary d-inline">
                                                            <input type="radio" id="isips2" name="isip" checked={this.state.is_ip==0?true:false} onChange={() => { $('#isips_specify').attr('disabled','disabled' ); this.setState({is_ip: false}); }}  />
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
                                                    <input type="text" className="form-control" id="isips_specify" disabled defaultValue={this.state.ip_specify} required="" onChange={(e) => { $("#isips-s-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({ip_specify: e.target.value})}}  />
                                                    <div id="isips-s-alert" className="valid-feedback">Looks good!</div>
                                                </div> 
                                            </div>
                                            <hr />
                                            <div className="row g-3">
                                                <div className="col-md-4 form-group">
                                                    <label htmlFor="is4ps" className="form-label">Is your family a beneficiary of 4Ps?</label>
                                                    <div className="form-group clearfix">
                                                        <div className="icheck-primary d-inline pr-2">
                                                            <input type="radio" id="isb4p1" name="isb4ps"  checked={this.state.is_4ps_benficiary==1?true:false} onChange={() => { $('#isb4ps_specify').removeAttr('disabled'); this.setState({is_4ps_benficiary: true}); }} />
                                                            <label htmlFor="isb4p1">
                                                                Yes
                                                            </label>
                                                        </div>
                                                        <div className="icheck-primary d-inline">
                                                            <input type="radio" id="isb4p2" name="isb4ps"checked={this.state.is_4ps_benficiary==0?true:false}  onChange={() => { $('#isb4ps_specify').attr('disabled','disabled' ); this.setState({is_4ps_benficiary: false}); }}  />
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
                                                    <input type="text" className="form-control" id="isb4ps_specify" disabled defaultValue={this.state.sp4_id} required="" onChange={(e) => { $("#isb4ps_specify-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({sp4_id: e.target.value})}}  />
                                                    <div id="isb4ps_specify-s-alert" className="valid-feedback">Looks good!</div>
                                                </div> 
                                            </div>
                                            <hr />
                                            <div className="row g-3">
                                                <div className="col-md-4 form-group">
                                                    <label htmlFor="is4ps" className="form-label">Is the child a Learner with Disability?</label>
                                                    <div className="form-group clearfix">
                                                        <div className="icheck-primary d-inline pr-2">
                                                            <input type="radio" id="isdisability1" name="isdisability" checked={this.state.is_disability==1?true:false}  onChange={() => { $('#disa').removeAttr('disabled'); this.setState({is_disability:true}); }} />
                                                            <label htmlFor="isdisability1">
                                                                Yes
                                                            </label>
                                                        </div>
                                                        <div className="icheck-primary d-inline">
                                                            <input type="radio" id="isdisability2" name="isdisability"checked={this.state.is_disability==0?true:false}  onChange={() => { $('#disa').attr('disabled',"disabled"); this.setState({is_disability:false}); }} />
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
                                                    <input type="text" className="form-control" id="ca_hn" defaultValue={this.state.cd_hno} required="" onChange={(e) => { $("#ca_hn-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({cd_hno: e.target.value})}}  />
                                                    <div id="ca_hn-alert" className="valid-feedback">Looks good!</div>
                                                </div> 
                                                <div className="col-md-4">
                                                    <label htmlFor="ca_sn" className="form-label">Sitio/Street Name</label>
                                                    <input type="text" className="form-control" id="ca_sn" defaultValue={this.state.cd_sn} required="" onChange={(e) => { $("#ca_sn-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({cd_sn: e.target.value})}}  />
                                                    <div id="ca_sn-alert" className="valid-feedback">Looks good!</div>
                                                </div> 
                                                <div className="col-md-4">
                                                    <label htmlFor="ca_barangay" className="form-label">Barangay</label>
                                                    <input type="text" className="form-control" id="ca_barangay" defaultValue={this.state.cd_barangay} required="" onChange={(e) => { $("#ca_barangay-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({cd_barangay: e.target.value})}}  />
                                                    <div id="ca_barangay-alert" className="valid-feedback">Looks good!</div>
                                                </div> 
                                                <div className="col-md-4">
                                                    <label htmlFor="ca_mc" className="form-label">Municipality/City</label>
                                                    <input type="text" className="form-control" id="ca_mc" defaultValue={this.state.cd_mc} required="" onChange={(e) => { $("#ca_mc-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({cd_mc: e.target.value})}}  />
                                                    <div id="ca_mc-alert" className="valid-feedback">Looks good!</div>
                                                </div> 
                                                <div className="col-md-4">
                                                    <label htmlFor="ca_province" className="form-label">Province</label>
                                                    <input type="text" className="form-control" id="ca_province" defaultValue={this.state.cd_province} required="" onChange={(e) => { $("#ca_province-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({cd_province: e.target.value})}}  />
                                                    <div id="ca_province-alert" className="valid-feedback">Looks good!</div>
                                                </div> 
                                                <div className="col-md-4">
                                                    <label htmlFor="ca_country" className="form-label">Country</label>
                                                    <input type="text" className="form-control" id="ca_country" defaultValue="Philippines" required="" onChange={(e) => { $("#ca_country-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({cd_country: e.target.value})}}  />
                                                    <div id="ca_country-alert" className="valid-feedback">Looks good!</div>
                                                </div> 
                                                <div className="col-md-4">
                                                    <label htmlFor="ca_zip" className="form-label">Zip Code</label>
                                                    <input type="text" className="form-control" id="ca_zip" defaultValue={this.state.cd_zip} required="" onChange={(e) => { $("#ca_zip-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({cd_zip: e.target.value})}}  />
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
                                                            <input type="radio" id="issamecd1" name="issamecd" checked={this.state.is_pa_same_cd==1?true:false} onChange={() => { $('#fspa').attr('disabled',"disabled"); this.setState({is_pa_same_cd: true}); }}/>
                                                            <label htmlFor="issamecd1">
                                                                Yes
                                                            </label>
                                                        </div>
                                                        <div className="icheck-primary d-inline">
                                                            <input type="radio" id="issamecd2" name="issamecd" checked={this.state.is_pa_same_cd==0?true:false}  onChange={() => { $('#fspa').removeAttr('disabled'); this.setState({is_pa_same_cd: true}); }}/>
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
                                                            <input type="text" className="form-control" id="pa_hn" defaultValue={this.state.pa_hno} required="" onChange={(e) => { $("#ca_hn-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({pa_hno: e.target.value})}}  />
                                                            <div id="pa_hn-alert" className="valid-feedback">Looks good!</div>
                                                        </div> 
                                                        <div className="col-md-4">
                                                            <label htmlFor="ca_hn" className="form-label">Sitio/Street Name</label>
                                                            <input type="text" className="form-control" id="pa_sn" defaultValue={this.state.pa_sn} required="" onChange={(e) => { $("#pa_sn-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({pa_sn: e.target.value})}}  />
                                                            <div id="pa_sn-alert" className="valid-feedback">Looks good!</div>
                                                        </div> 
                                                        <div className="col-md-4">
                                                            <label htmlFor="pa_barangay" className="form-label">Barangay</label>
                                                            <input type="text" className="form-control" id="pa_barangay" defaultValue={this.state.pa_barangay} required="" onChange={(e) => { $("#pa_barangy-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({pa_barangay: e.target.value})}}  />
                                                            <div id="pa_barangay-alert" className="valid-feedback">Looks good!</div>
                                                        </div> 
                                                        <div className="col-md-4">
                                                            <label htmlFor="pa_mc" className="form-label">Municipality/City</label>
                                                            <input type="text" className="form-control" id="pa_mc" defaultValue={this.state.pa_mc} required="" onChange={(e) => { $("#pa_mc-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({pa_mc: e.target.value})}}  />
                                                            <div id="pa_mc-alert" className="valid-feedback">Looks good!</div>
                                                        </div> 
                                                        <div className="col-md-4">
                                                            <label htmlFor="ca_hn" className="form-label">Province</label>
                                                            <input type="text" className="form-control" id="pa_province" defaultValue={this.state.pa_province} required="" onChange={(e) => { $("#pa_province-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({pa_province: e.target.value})}}  />
                                                            <div id="pa_province-alert" className="valid-feedback">Looks good!</div>
                                                        </div> 
                                                        <div className="col-md-4">
                                                            <label htmlFor="ca_hn" className="form-label">Country</label>
                                                            <input type="text" className="form-control" id="ca_hn" defaultValue={this.state.pa_country} required="" onChange={(e) => { $("#pa_country-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({pa_country: e.target.value})}}  />
                                                            <div id="pa_country-alert" className="valid-feedback">Looks good!</div>
                                                        </div> 
                                                        <div className="col-md-4">
                                                            <label htmlFor="ca_hn" className="form-label">Zip Code</label>
                                                            <input type="text" className="form-control" id="pa_zip" defaultValue={this.state.pa_zip} required="" onChange={(e) => { $("#pa_zip-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({pa_zip: e.target.value})}}  />
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
                                                                <input type="radio" id="flsh_semester1" name="flsh_semester" checked={this.state.is_pa_same_cd=='1st'?true:false}  onChange={() => { this.setState({flsh_semester: "1st"}); }} />
                                                                <label htmlFor="flsh_semester1" className="pl-2">
                                                                    1st
                                                                </label>
                                                            </div>
                                                            <div className="icheck-primary d-inline">
                                                                <input type="radio" id="flsh_semester2" name="flsh_semester"checked={this.state.is_pa_same_cd=='2nd'?true:false} onChange={() => { this.setState({flsh_semester: "2nd"}); }} />
                                                                <label htmlFor="flsh_semester2" className="pl-2">
                                                                    2nd
                                                                </label>
                                                            </div>                                                     
                                                        </div>

                                                        <div id="flsh_semester-alert" className="valid-feedback">Looks good!</div>
                                                    </div> 
                                                    {/* <div className="col-md-6">
                                                        <label htmlFor="flsh_track" className="form-label">Track</label>
                                                        <input type="text" className="form-control" id="flsh_track" defaultValue={this.state.flsh_track} required="" onChange={(e) => { $("#flsh_track-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({flsh_track: e.target.value})}}  />
                                                        <div id="flsh_track-alert" className="valid-feedback">Looks good!</div>
                                                    </div> 
                                                    <div className="col-md-6">
                                                        <label htmlFor="flsh_strand" className="form-label">Strand</label>
                                                        <input type="text" className="form-control" id="flsh_strand" defaultValue={this.state.flsh_strand} required="" onChange={(e) => { $("#flsh_strand-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({flsh_strand: e.target.value})}}  />
                                                        <div id="flsh_strand-alert" className="valid-feedback">Looks good!</div>
                                                    </div> */}

                                                    <div className="col-md-6">
                                                        <label htmlFor="flsh_track" className="form-label">Track</label>
                                                        {/* <input type="text" className="form-control" id="flsh_track" defaultValue="" required="" onChange={(e) => { $("#flsh_track-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({flsh_track: e.target.value})}}  /> */}
                                                        <select name="flsh_track" id="flsh_track" className="form-control" value={this.state.flsh_track} onChange={(e) => { $("#flsh_track-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({flsh_track: e.target.value})}} >
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
                                                        <select name="flsh_strand" id="flsh_strand" className="form-control" value={this.state.flsh_strand} onChange={(e) => { $("#flsh_strand-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({flsh_strand: e.target.value})}}>
                                                            <option value=""></option>
                                                                <EachMethod of={this.state.strand} render={(element,index) => {
                                                                    return <option value={`${element.name}`}>{`${element.name} ${(element.acronyms!=""?"("+element.acronyms+")":"")}`}</option>
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
                                                                <div htmlFor="lglv" className="label">{`${element.last_name}, ${element.first_name} (${this.state.relationship})`}</div>
                                                            </div>  
                                                        </div>
                                                    }} /> 
                                                </div> 
                                            </div> 



                                        </div>
                                    </div>
                                </div>

                                <div className="tab-pane " id="attendance">
                                    <div className="col-lg-12">
                                        <div className="card mb-4">
                                            <div className="card-header">
                                                Attendance
                                            </div>
                                            <div className="card-body">
                                                <div  id="pie-chart"></div>
                                            </div>

                                        </div>
                                        <div className="card">

                                            <ReactTable
                                                key={"react-tables"}
                                                className={"table table-bordered table-striped "}
                                                data={this.state.attendance_data} 
                                                columns={this.state.attendance_columns}
                                                showHeader={true}
                                                showPagenation={false}
                                                defaultPageSize={5}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="tab-pane " id="activity">
                                    <div className="card">
                                        <ReactTable
                                            key={"react-tables"}
                                            className={"table table-bordered table-striped "}
                                            data={this.state.activity_data} 
                                            columns={this.state.activity_columns}
                                            showHeader={true}
                                            showPagenation={false}
                                            defaultPageSize={5}
                                        />
                                    </div>                                    
                                </div> 
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
    </DashboardLayout>}
}
