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

import { Pagination , AlertSound,sortTimeDESC} from '@/Components/commonFunctions'; 


export default class StudentVerifier extends Component {
    constructor(props) {
		super(props);
        this.state = {
            student_id: this.props.auth.user.user_id,
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
                    accessor: 'id',
                    Header: 'No.', 
                    width: 50,
                    className: "center",
                    Cell: ({row}) => { 
                        console.log(row)
                       return <>     </>            
                    }
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
                    accessor: 'id',
                    Header: 'No.', 
                    width: 50,
                    className: "center",
                    Cell: ({row}) => { 
                       return <> {(row.index + 1)}</>            
                    }
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
            notFound: false
        }
        // console.log(this.props); 
        this.getAttendanceLogs = this.getAttendanceLogs.bind(this);
    }

    componentDidMount() {
        let self = this;
        try {
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
                _strand: typeof(_strand)!="undefined"&&_strand!=null?_strand.acronyms:"",
                sy: (this.props.getSchoolStats!=null&&this.props.getSchoolStats.length>0)?this.props.getSchoolStats[0].sy:"",
            });            
        } catch (error) {
            self.setState({notFound: true})
        }


        // this.attendancePieRender(0,0);
        // this.getAttendanceLogs();
    }

    attendancePieRender(present,absent) {

    }

    getAttendanceLogs() {
        let self = this;
        let date = moment(new Date()).format("YYYY-MM-DD")
        axios.post('/attendance/all/time/logs',{id:self.state.student_id,type: 'student'}).then(function (response) {
            console.log(response)
            if( typeof(response.status) != "undefined" && response.status == "200" ) {
                let data = typeof(response.data) != "undefined" && typeof(response.data.data)!="undefined"?response.data.data:[];
                if(typeof(response.data)!="undefined"&&response.data.status == "success") {
                    let absent = data.filter(e=>e.status==""&&e.mode=="absent").length;
                    let present = data.filter(e=>e.status=="class_present"&&e.mode=="IN").length;
                    console.log("absent",absent);
                    console.log("present",present);
                    self.attendancePieRender(present,absent);

                    self.setState({attendance_data: data.sort(sortTimeDESC)},() => {  });
                }
            }
        });
    }

    render() {
        return <>
        <div className="noselect">
            <div className="app-content-header"> 
                <div className="container-fluid"> 
                    <div className="row"> 
                        <div className="col-lg-12 d-flex justify-content-center">
                            {this.state.notFound==false?<div className="card card-widget widget-user shadow col-lg-6 mt-5 mb-5"> 
                                <div className="widget-user-header bg-info">
                                    {/* <h3 className="widget-user-username">{this.state.fullname}</h3> */}
                                    <div className="row">
                                        <div className="col">
                                            <center>
                                                <img src="/images/ic_launcher.png" alt="AdminLTE Logo" className="" height={100} width={100} />
                                            </center>
                                        </div>
                                        <div className="col">
                                            <center>
                                                <img src="/images/deped-d.png" alt="AdminLTE Logo" className="" height={100} width={100} />
                                            </center>
                                        </div>
                                    </div>
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
                                        <div className="col-sm-12">
                                            <div className="description-block">
                                            <h3 className="widget-user-username">{this.state.fullname}</h3>
                                            </div>                                    
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="description-block">
                                                <h5 className="description-header">{this.state.level}  {this.state.grade_level}</h5>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="description-block">
                                                <h5 className="description-header"> SY: {this.state.sy}</h5>
                                            </div>
                                        </div>
                                        {this.state._track!=""?<div className="col-sm-3 border-right">
                                            <div className="description-block">
                                                <h5 className="description-header">{this.state._track}</h5>
                                                <span className="description-text">TRACK</span>
                                            </div> 
                                        </div>:null} 
                                        {this.state._strand!=""?<div className="col-sm-3">
                                            <div className="description-block">
                                            <h5 className="description-header">{this.state._strand}</h5>
                                            <span className="description-text">STRAND</span>
                                            </div> 
                                        </div>:null} 
                                    </div> 
                                </div>
                            </div>:<div className="">
                            <section class="content">
                                <div class="error-page">
                                    <h2 class="headline text-warning"> 404</h2>

                                    <div class="error-content">
                                    <h3><i class="fas fa-exclamation-triangle text-warning"></i> Oops! Page not found.</h3>

                                    <p>
                                        We could not find the page you were looking for.
                                    </p> 
                                    </div> 
                                </div> 
                                </section>
                            </div>}
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
        </>
    }
}
