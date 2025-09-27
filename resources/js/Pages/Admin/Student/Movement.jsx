import React,{ Component } from "react";  
import { Link } from '@inertiajs/react'; 
import { EachMethod } from '@/Components/EachMethod'
import { nextInLineYearGrade } from '@/Components/commonFunctions'
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


export default class Movement extends Component {
    constructor(props) {
		super(props);
        this.state = {
            photoupload: "",
            photobase64: "",
            photobase64final: "",
            photobase64finalParent: "",
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
            data_list: [],
            schoolRegistry: this.props.schoolRegistry,
            school_sy: this.props.sy,
            yeargrade: this.props.schoolyeargrades,
            readOnly_: true,
            activity_data: [],
            activity_columns: [ 
                {
                    Header: 'School Year',
                    accessor: 'sy',
                    className: "center",
                    width: 100,
                },
                {
                    Header: 'Grade Level',
                    accessor: 'grade_level',
                    className: "center"
                },
                {
                    Header: 'Track',
                    accessor: 'track',
                    className: "center"
                },
                {
                    Header: 'Strand',
                    accessor: 'strand',
                    className: "center"
                },
                {
                    Header: 'Status',
                    accessor: 'status',
                    className: "center",
                    Cell: ({row}) => { 
                        if(row.original.repeat_grade_level=='1'){
                            return <span className="badge bg-primary">ACTIVE/REPEAT</span>      
                        } else  if(row.original.status=='active'){
                            return <span className="badge bg-primary">ACTIVE</span>
                        } else  if(row.original.status=='drop'){
                            return <span className="badge bg-danger">Drop Out</span>
                        } else  if(row.original.status=='transfer_out'){
                            return <span className="badge bg-danger">Transfer Out</span>
                        }
                    }
                },
                {
                    Header: 'Action',
                    accessor: 'id',
                    className: "center",
                    Cell: ({row}) => { 
                        if(row.original.status=='active'){
                            return <>                       
                            {/* <button className="btn btn-danger btn-block btn-sm col-12 mb-1"> <i className="bi bi-person-fill-x"></i> Remove</button> */}
                            <button className="btn btn-danger btn-block btn-sm col-12 mb-1" onClick={() => {
                                this.dropStudent();
                            }} >Drop Out</button>
                            <button className="btn btn-danger btn-block btn-sm col-12 mb-1" onClick={() => {
                                this.transferOutStudent();
                            }}>Transfer Out</button>
                           </>      
                        } else {
                            return <></>
                        }
                    }
                }
            ],
            student_movement: [],
            sh_11_12_enable: false,
            selectedGradeLevel: "",
            flsh_semester_: "",
            flsh_track_: "",
            flsh_strand_: "",
            selectedQr: "",
            repeatGrade: false,
            transferee: false,
            data: typeof(this.props.studentsEnrolled)!="undefined"?this.props.studentsEnrolled:[],
            columns: [
                {
                    id: "qr",
                    accessor: 'lrn',
                    Header: 'QR Code',
                    filterable: true,
                    Cell: ({row}) => { 
                        return <QRCode value={row.original.lrn} size={256} style={{ height: "auto", maxWidth: "100%", width: "100%" }}  viewBox={`0 0 256 256`} onDoubleClick={() => {
                            window.open(`/qrcode?code=${row.original.lrn}`)
                        }} />             
                    }
                }, 
                {
                    id: "picture",
                    Header: 'Picture',  
                    accessor: 'photo',
                    Cell: ({row}) => { 
                       return <img className="" height={150} width={150}  onError={(e)=>{ 
                            e.target.src=(row.original.sex=="Male")?'/adminlte/dist/assets/img/avatar.png':'/adminlte/dist/assets/img/avatar-f.jpeg'; 
                       }} alt="Picture Error" src={`/profile/photo/student/${row.original.lrn}`} />
                    }
                }, 
                {
                    id: "lrn",
                    accessor: 'lrn',
                    Header: 'LRN NO.', 
                    maxWidth: 100,
                    filterable: true,
                },
                {
                    id: "fullname",
                    Header: 'Fullname', 
                    width: 800,
                    accessor: 'fullname',
                    filterable: true,
                },  
                {
                    id: "bdate",
                    Header: 'Age',  
                    width: 200,
                    accessor: 'bdate',
                    className: "center",
                    Cell: ({row}) => { 
                       return <>{typeof(row.original.bdate)!="undefined"?moment().diff(row.original.bdate, 'years',false):"None"}</>
                    },
                    filterable: true
                },  
                {
                    id: "gender",
                    Header: 'Gender',  
                    width: 200,
                    accessor: 'sex',
                    className: "center",
                    filterable: true,
                    filterInput: ({ filter, onChange }) => {
                        return  <select  onChange={event => onChange(event.target.value)} className="form-control" style={{ width: "100%" }}   value={filter ? filter.value : "all"} >
                            <option value="">All</option>  
                            <option >Male</option> 
                            <option >Female</option>
                        </select>   
                    }
                },  
                {
                    id: "level",
                    Header: 'Level',  
                    width: 200,
                    accessor: 'grade',
                    className: "center",
                    filterable: true,
                    filterInput: ({ filter, onChange }) => {
                        return  <select  onChange={event => onChange(event.target.value)} className="form-control" style={{ width: "100%" }}   value={filter ? filter.value : "all"} >
                            <option value="">All</option> 
                            <option value="null">None</option> 
                            <option >Grade 7</option>
                            <option >Grade 8</option> 
                            <option >Grade 9</option> 
                            <option >Grade 10</option> 
                            <option >Grade 11</option> 
                            <option >Grade 12</option> 
                        </select>   
                    }
                },  
                {
                    id: "section",
                    Header: 'Section',  
                    width: 250,
                    accessor: 'section',
                    className: "center",
                    filterable: true,
                    filterInput: ({ filter, onChange }) => {
                        return  <select  onChange={event => onChange(event.target.value)} id="sectionfilter" className="form-control" style={{ width: "100%" }}   value={filter ? filter.value : "all"} >
                            {this.state.sectionsFilter}
                        </select>   
                    }
                }
            ],
            loading: false
        }
        this.webCam = React.createRef(); 
        this.updateCrop = this.updateCrop.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.dropStudent = this.dropStudent.bind(this);
        this.transferOutStudent = this.transferOutStudent.bind(this);
        this._isMounted = false;
    }

    componentDidMount() {
        let self = this;
        this._isMounted = true;
        // console.log(this.props);
        let so = []
        let selected_quardians = "";
        this.props.parents.forEach(element => {
            so.push({ value: element.id, label: `${element.last_name}, ${element.first_name} ${element.middle_name}` })
        });
        
        this.setState({
            selectOptions: so,
            photobase64final: (this.props.student.picture_base64!=null)?this.props.student.picture_base64:'/adminlte/dist/assets/img/avatar.png',
            ...this.props.student,
            added_guardians:this.props.guardians,
            selected_quardians: (this.props.guardians!=null&&this.props.guardians.length>0)?this.props.guardians[0].id:"",
            relationship: (this.props.guardians!=null&&this.props.guardians.length>0)?this.props.guardians[0].relationship:"",
            data_list: this.props.student
        });

        let selected = $("#data-list" ).select2({
            theme: "bootstrap",
            selectionCssClass: 'form-control',
            containerCssClass: 'form-control',
            width: '100%'
        });
        
        $('#data-list').on('select2:select', function (e) { 
            var selectedData = e.params.data; 
            self.setState({
                selectedQr: selectedData.id,
                readOnly_: false,
                transferee: false
            },() => {
                self.fetchData();
            });
        });

        $('#tabs a').on('click', function (event) {
            event.preventDefault()
            $(this).tab('show')
        })
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

    dropStudent() {
        let self = this;
        if(self.state.id != "" && self.state.lrn != "") {
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
                        showCancelButton: false,
                        showConfirmButton: false,
                        allowOutsideClick: false,
                        didOpen: () => {
                          Swal.showLoading();
                        }
                    });
                    let datas =  {
                        id: self.state.id,
                        lrn: self.state.lrn
                    };
                    // console.log(datas);
                    axios.post('/admin/update/drop/student/movemet',datas).then(function (response) {
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
                                            document.getElementById("cancel").click();
                                        }
                                    });

                                } else {
                                    Swal.fire({  
                                        title: "Fail to drop student", 
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
        }
    }

    transferOutStudent() {
        let self = this;
        if(self.state.id != "" && self.state.lrn != "") {
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
                        showCancelButton: false,
                        showConfirmButton: false,
                        allowOutsideClick: false,
                        didOpen: () => {
                          Swal.showLoading();
                        }
                    });
                    let datas =  {
                        id: self.state.id,
                        lrn: self.state.lrn
                    };
                    // console.log(datas);
                    axios.post('/admin/update/transfer/out/student/movemet',datas).then(function (response) {
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
                                            document.getElementById("cancel").click();
                                        }
                                    });

                                } else {
                                    Swal.fire({  
                                        title: "Fail to drop student", 
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
        }
    }

    saveData() {
        let self = this;
        let repeater = $("#repeatGrade").is(':checked');
        let elglc = $("#elglc").find(":selected").val();
        let elsyc = $("#elsyc").val();
        let elsa = $("#elsa").val();
        let lesa_school_id = $("#lesa_school_id").val(); 
        if(this.state.schoolRegistry.school_year != "" && self.state.selectedQr != "" && this.state.selectedGradeLevel != "") {
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
                        showCancelButton: false,
                        showConfirmButton: false,
                        allowOutsideClick: false,
                        didOpen: () => {
                          Swal.showLoading();
                        }
                    });
                    let datas =  {
                        id: self.state.id,
                        lrn: self.state.lrn, 
                        school_year: self.state.schoolRegistry.school_year,
                        selectedQr: self.state.selectedQr,
                        selectedGradeLevel: self.state.selectedGradeLevel,
                        flsh_semester: self.state.flsh_semester_,
                        flsh_track: self.state.flsh_track_,
                        flsh_strand: self.state.flsh_strand_,
                        repeater: repeater,
                        elglc:elglc,
                        elsyc:elsyc,
                        elsa:elsa,
                        lesa_school_id:lesa_school_id,
                        transferee: self.state.transferee
                    };
                    console.log(datas);
                    axios.post('/admin/update/student/movemet',datas).then(function (response) {
                        // handle success
                        console.log(response);
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
                                            // if(val.field=='lrn') {
                                            //     $("#lrn-alert").removeAttr('class');
                                            //     $("#lrn-alert").html('LRN is already exist');
                                            //     $("#lrn-alert").addClass('d-block invalid-feedback');
                                            // } else if(val.field=='first_name') {
                                            //     $("#first-name-alert").removeAttr('class');
                                            //     $("#first-name-alert").html('First is already exist');
                                            //     $("#first-name-alert").addClass('d-block invalid-feedback');
                                            // } else if(val.field=='last_name') {
                                            //     $("#last-name-alert").removeAttr('class');
                                            //     $("#last-name-alert").html('Last is already exist');
                                            //     $("#last-name-alert").addClass('d-block invalid-feedback');
                                            // } else if(val.field=='middle_name') {
                                            //     $("#middle-name-alert").removeAttr('class');
                                            //     $("#middle-name-alert").html('Middle is already exist');
                                            //     $("#middle-name-alert").addClass('d-block invalid-feedback');
                                            // }
                                        });
                                    }
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
                    try {
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
                    } catch (error) {
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
            console.log("aw",self.state.selectedGradeLevel);
            if(self.state.schoolRegistry.school_year == "") {
                $("#sy-alert").removeAttr('class');
                $("#sy-alert").html('Required Field');
                $("#sy-alert").addClass('d-block invalid-feedback');
            }
            if(self.state.selectedQr == "") {
                $("#ss-alert").removeAttr('class');
                $("#ss-alert").html('Required Field');
                $("#ss-alert").addClass('d-block invalid-feedback');
            }
            if(self.state.selectedGradeLevel == "") {
                $("#gle-alert").removeAttr('class');
                $("#gle-alert").html('Required Field');
                $("#gle-alert").addClass('d-block invalid-feedback');
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

    fetchData() {
        let self = this;  
        self.setState({loading: true});
        axios.post(`/admin/dashboard/student/${self.state.selectedQr}`,{id:self.state.selectedQr}).then(function (response) {
            console.log(response);
            if( typeof(response.status) != "undefined" && response.status == "200" ) {
                let data = typeof(response.data) != "undefined" && typeof(response.data)!="undefined"?response.data:{};
                if(Object.keys(data).length>0) {
                    self.setState({
                        ...data.student,
                        added_guardians: data.guardians,
                        selected_quardians: (data.guardians!=null&&data.guardians.length>0)?data.guardians[0].id:"",
                        relationship: (data.guardians!=null&&data.guardians.length>0)?data.guardians[0].relationship:"",
                        photobase64final: (data.student.picture_base64!=null)?data.student.picture_base64:'/adminlte/dist/assets/img/avatar.png',
                        photobase64finalParent: (data.guardians.length>0&&data.guardians[0].picture_base64!=null)?data.guardians[0].picture_base64:'/adminlte/dist/assets/img/avatar.png',
                        loading: false,
                        student_movement: (data.student_movement.length>0&&data.student_movement!=null)?data.student_movement:[]
                    },() => {
                        console.log(data.student);
                    });
                }
            }
        }); 
    }
    
    render() {
        return <DashboardLayout title="New Student" user={this.props.auth.user} ><div className="noselect">
            <div className="app-content-header"> 
                <div className="container-fluid"> 
                    <div className="row">
                        <div className="col-sm-6 "><h3 className="mb-0"><i className="nav-icon bi bi-arrows-move"></i> Student Movement</h3></div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-end">
                                <li className="breadcrumb-item"><Link href="/admin/dashboard">Dashboard</Link></li>
                                <li className="breadcrumb-item"><Link href="/admin/dashboard/student">Student</Link></li>
                                <li className="breadcrumb-item active" aria-current="page">Movement</li>
                            </ol>
                        </div>
                    </div> 
                </div> 
            </div>

            <div className="app-content">
                <div className="container-fluid">                    
                    {this.state.loading?<div className="row">
                        <div className="loading-overlay">
                            <div id="loadingSpinner" className="loading-spinner d-flex justify-content-center align-items-center" >
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        </div>
                    </div>:null}
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card mb-4">
                                <div className="card-header">
                                    <h3 className="card-title mt-2"> <i className="bi bi-person"></i></h3>
                                    <Link href="/admin/student/movement" id="cancel" className="btn btn-danger float-right"> <i className="bi bi-person-fill-x"></i> Cancel</Link>
                                    <button className="btn btn-success float-right mr-1" onClick={() =>{ this.saveData() }}> <i className="bi bi-person-plus-fill"></i> Update</button>   
                                    <button className="btn btn-primary float-right mr-1" onClick={() =>{ $('#studentEnrolled').modal('show') }}> <i className="bi bi-person"></i> Show Enrolled</button>    
                                </div>
                                <div className="card-body"> 
                                    <div className="row g-3 mb-2">
                                        <div className="form-group">
                                            <label >Select Student</label>
                                            <select id="data-list" className="form-control form-block">
                                                <option></option> 
                                                <EachMethod of={this.state.data_list} render={(element,index) => {
                                                    return <option value={element.id} >{`${element.last_name}, ${element.first_name}`}</option>
                                                }} />
                                            </select>
                                            <div id="ss-alert" className="valid-feedback">Looks good!</div>
                                        </div>
                                    </div>
                                    <div className="row g-3 mb-2">
                                        <div className="col-md-2">
                                            <label htmlFor="first_name" className="form-label">School Year</label>
                                            <input type="text" className="form-control" id="sy" title="Ready Only" readOnly defaultValue={this.state.schoolRegistry.school_year} required="" onChange={(e) => { $("#sy-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({sy: e.target.value})}}  />
                                            <div id="sy-alert" className="valid-feedback">Looks good!</div>
                                        </div> 

                                        {/* <div className="col-md-3">
                                            <label htmlFor="middle_name" className="form-label">Grade level to Enroll</label>
                                            <input type="text" className="form-control" id="gle" defaultValue={this.state.gle} required="" onChange={(e) => {  $("#gle-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({gle: e.target.value})}}  />
                                            <div id="middle-name-alert" className="valid-feedback">Looks good!</div>
                                        </div>  */}
                                        
                                        <div className="col-md-3">
                                            <label htmlFor="gle" className="form-label">Promote To</label>                                            
                                            
                                            <select className="form-select" id="gle" required="" value={this.state.selectedGradeLevel} onChange={(e) => { $("#gle-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({selectedGradeLevel: e.target.value,sh_11_12_enable: (e.target.value=="Grade 11"||e.target.value=="Grade 12")?true:false})}} >
                                                <option disabled>Choose...</option>
                                                <option></option>
                                                <EachMethod of={this.state.yeargrade} render={(element,index) => {
                                                    console.log(nextInLineYearGrade(element.year_grade))
                                                    if(this.state.student_movement.length>0&&this.state.student_movement.some(e => nextInLineYearGrade(e.grade_level)==element.year_grade)) {
                                                        return <option >{`${element.year_grade}`}</option>
                                                    } else if(this.state.student_movement.length==0&&element.year_grade=="Grade 7") {
                                                        return <option >{`${element.year_grade}`}</option>
                                                    } else if(this.state.student_movement.length==0&&this.state.transferee==true) {
                                                        return <option >{`${element.year_grade}`}</option>
                                                    } else {
                                                        // return <option disabled >{`${element.year_grade}`}</option>
                                                    }
                                                }} />
                                            </select>
                                            <div id="gle-alert" className="valid-feedback">Looks good!</div>
                                        </div> 
                                        <div className="col-md-3">
                                            <div className="form-inline mt-4">
                                                <div className="icheck-primary d-inline pr-5">
                                                    <input type="checkbox" id="repeatGrade" name="repeatGrade" className="form-check-input"  />
                                                    <label htmlFor="repeatGrade" className="pl-2">
                                                        Repeat
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {(this.state.sh_11_12_enable==true)?<div className="row g-3">
                                        <div className="col-md-12 pt-2">
                                            <div className="form-inline">
                                                <label htmlFor="ca_hn" className="form-label pr-5">Semester</label>                                                
                                                <div className="icheck-primary d-inline pr-5">
                                                    <input type="radio" id="flsh_semester1_" name="flsh_semester_"  onChange={() => { this.setState({flsh_semester_: "1st"}); }} />
                                                    <label htmlFor="flsh_semester1_" className="pl-2">
                                                        1st
                                                    </label>
                                                </div>
                                                <div className="icheck-primary d-inline">
                                                    <input type="radio" id="flsh_semester2_" name="flsh_semester_"  onChange={() => { this.setState({flsh_semester_: "2nd"}); }} />
                                                    <label htmlFor="flsh_semester2_" className="pl-2">
                                                        2nd
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="flsh_track" className="form-label">Track</label>
                                            {/* <input type="text" className="form-control" id="flsh_track" defaultValue="" required="" onChange={(e) => { $("#flsh_track-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({flsh_track: e.target.value})}}  /> */}
                                            <select name="flsh_track" id="flsh_track" className="form-control"  onChange={(e) => { $("#flsh_track-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({flsh_track_: e.target.value})}} >
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
                                            <select name="flsh_strand" id="flsh_strand" className="form-control" onChange={(e) => { $("#flsh_strand-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({flsh_strand_: e.target.value})}}>
                                                <option value=""></option>
                                                    <EachMethod of={this.state.strand} render={(element,index) => {
                                                        return <option >{`${element.name} ${(element.acronyms!=""?"("+element.acronyms+")":"")}`}</option>
                                                    }} />
                                            </select>
                                            <div id="flsh_strand-alert" className="valid-feedback">Looks good!</div>
                                        </div>
                                    </div>:null}
                                    {(this.state.transferee===true)?<div className="col-lg-12">
                                        <hr />
                                        <div className="row g-3" >
                                            <div className="col-md-6">
                                                <label htmlFor="lglv" className="form-label">Last Grade Level Completed</label>
                                                <select className="form-select" id="elglc" required="" onChange={(e) => { $("#lglc-alert").removeAttr('class').addClass('invalid-feedback'); }} >
                                                    <option disabled>Choose...</option>
                                                    <option></option>
                                                    <EachMethod of={this.state.yeargrade} render={(element,index) => {
                                                        return <option >{`${element.year_grade}`}</option>
                                                    }} />
                                                </select>
                                                <div id="lglv-alert" className="valid-feedback">Looks good!</div>
                                            </div> 
                                            <div className="col-md-6">
                                                <label htmlFor="lsyc" className="form-label">Last School Year Completed</label>
                                                <input type="text" className="form-control" id="elsyc" placeholder="**** - ****" defaultValue={this.state.lsyc} required="" onChange={(e) => { $("#lsyc-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({lsyc: e.target.value})}}  />
                                                <div id="lsyc-alert" className="valid-feedback">Looks good!</div>
                                            </div> 
                                            <div className="col-md-6">
                                                <label htmlFor="lsa" className="form-label">Last School Attended</label>
                                                <input type="text" className="form-control" id="elsa" defaultValue={this.state.lsa} required="" onChange={(e) => { $("#lsa-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({lsa: e.target.value})}}  />
                                                <div id="lsa-alert" className="valid-feedback">Looks good!</div>
                                            </div> 
                                            <div className="col-md-6">
                                                <label htmlFor="lsa_school_id" className="form-label">School ID</label>
                                                <input type="text" className="form-control" id="lesa_school_id" defaultValue={this.state.lsa_school_id} required="" onChange={(e) => { $("#lsa_school_id-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({lsa_school_id: e.target.value})}}  />
                                                <div id="lsa_school_id-alert" className="valid-feedback">Looks good!</div>
                                            </div> 
                                        </div>
                                    </div>:null}
                                    <div className="row g-3 mt-2">
                                        <div className="col-md-12">
                                            <button className="btn btn-success" onClick={() => { this.setState({transferee: true})}}>Transfer/Move In</button>
                                        </div> 

                                        <div className="col-lg-12">
                                            <div className="form-check float-right">
                                                <input className="form-check-input" type="checkbox" defaultValue="" id="invalidCheck" />
                                                <label className="form-check-label" htmlFor="invalidCheck">
                                                Confirm all fields are correct.
                                                </label>
                                                <div id="invalidCheck-alert" className="invalid-feedback">You must agree before submitting.</div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <hr />
                                    
                                    <div className="p-2" >
                                        <ul id="tabs" className="nav nav-pills" role="tablist">
                                            <li className="nav-item"><a className="nav-link active" href="#history" data-toggle="tab">History</a></li> 
                                            <li className="nav-item"><a className={`nav-link  ${(this.state.lrn==""?'disabled':'')}`} href="#profiles" data-toggle="tab">Student Details</a></li>
                                        </ul>
                                    </div>
                                    <div className="tab-content">
                                        <div className="tab-pane active mt-2" id="history">
                                            <div className="card">
                                                <ReactTable
                                                    key={"react-tables"}
                                                    className={"table table-bordered table-striped "}
                                                    data={this.state.student_movement} 
                                                    columns={this.state.activity_columns}
                                                    showHeader={true}
                                                    showPagenation={false}
                                                    defaultPageSize={5}
                                                />
                                            </div>      
                                        </div>
                                        <div className="tab-pane mt-2" id="profiles">

                                            <div className="row g-3"> 
                                                <div className="col-md-4">
                                                    <div className="col-md-12">
                                                        <img className="photo-upload border_shadow" src={this.state.photobase64final!=""?this.state.photobase64final:"/adminlte/dist/assets/img/avatar.png"}
                                                        ref={t=> this.upload_view_image = t}
                                                        onError={(e)=>{ 
                                                            this.upload_view_image.src='/adminlte/dist/assets/img/avatar.png'; 
                                                        }} alt="Picture Error" />
                                                    </div> 
                                                </div> 
                                                <div className="col-md-4 d-flex flex-column justify-content-end">
                                                    <label htmlFor="lrn" className="form-label ">Learner Reference No.</label>
                                                    <input type="text" className="form-control" id="lrn" defaultValue={this.state.lrn} required="" onChange={(e) => {
                                                        $("#lrn-alert").removeAttr('class').addClass('invalid-feedback'); 
                                                        this.setState({lrn: e.target.value})}} />
                                                    <span id="lrn-alert" className="valid-feedback">Looks good!</span>
                                                </div> 
                                                <div className="col-md-4 d-flex flex-column justify-content-end">
                                                    <QRCode value={this.state.lrn} size={256} style={{ height: "170px", maxWidth: "100%", width: "100%" }}  viewBox={`0 0 256 256`} />   
                                                    <label htmlFor="first_name" className="form-label">PSA Cert. No.</label>
                                                    <input type="text" className="form-control" id="first_name" defaultValue={this.state.psa_cert_no} required="" onChange={(e) => { $("#psa-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({psa_cert_no: e.target.value})}}  />
                                                    <div id="psa-alert" className="valid-feedback">Looks good!</div>
                                                </div> 
                                                <div className="col-md-4">
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
                                                <div className="col-md-2">
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
                                                        <option >Male</option>
                                                        <option>Female</option>
                                                    </select>
                                                    <div id="sex-alert" className="invalid-feedback">Please select a valid state.</div>
                                                </div>
                                                <div className="col-md-3">
                                                    <label htmlFor="bdate" className="form-label">Birth Date</label>
                                                    <input type="date" className="form-control" id="bdate" max={this.state.bdate_max} value={this.state.bdate} required="" onChange={(e) => {  $("#bdate-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({bdate: e.target.value})}}  />
                                                    <div id="bdate-alert" className="valid-feedback">Looks good!</div>
                                                </div> 
                                            </div> 
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
                                                        <input type="text" className="form-control" id="lglv" defaultValue={this.state.lglc} required="" onChange={(e) => { $("#lglv-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({lglc: e.target.value})}}  />
                                                        <div id="lglv-alert" className="valid-feedback">Looks good!</div>
                                                    </div> 
                                                    <div className="col-md-6">
                                                        <label htmlFor="lsyc" className="form-label">Last School Year Completed</label>
                                                        <input type="text" className="form-control" id="lsyc" placeholder="**** - ****" defaultValue={this.state.lsyc} required="" onChange={(e) => { $("#lsyc-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({lsyc: e.target.value})}}  />
                                                        <div id="lsyc-alert" className="valid-feedback">Looks good!</div>
                                                    </div> 
                                                    <div className="col-md-6">
                                                        <label htmlFor="lsa" className="form-label">Last School Attended</label>
                                                        <input type="text" className="form-control" id="lsa" defaultValue={this.state.lsa} required="" onChange={(e) => { $("#lsa-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({lsa: e.target.value})}}  />
                                                        <div id="lsa-alert" className="valid-feedback">Looks good!</div>
                                                    </div> 
                                                    <div className="col-md-6">
                                                        <label htmlFor="lsa_school_id" className="form-label">School ID</label>
                                                        <input type="text" className="form-control" id="lsa_school_id" defaultValue={this.state.lsa_school_id} required="" onChange={(e) => { $("#lsa_school_id-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({lsa_school_id: e.target.value})}}  />
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
                                                        <select name="flsh_track" id="flsh_track" className="form-control" value={(this.state.flsh_track!=null)?this.state.flsh_track:""} onChange={(e) => { $("#flsh_track-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({flsh_track: e.target.value})}} >
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
                                                        <select name="flsh_strand" id="flsh_strand" className="form-control" value={this.state.flsh_strand!=null?this.state.flsh_strand:""} onChange={(e) => { $("#flsh_strand-alert").removeAttr('class').addClass('invalid-feedback');  this.setState({flsh_strand: e.target.value})}}>
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
                                                    <div className={`${(this.state.added_guardians!=null&&this.state.added_guardians.length>0)?'col-md-4':'hidden'}`}>
                                                        <div className="col-md-12">
                                                            <img className="photo-upload border_shadow" src={this.state.photobase64finalParent!=""?this.state.photobase64finalParent:"/adminlte/dist/assets/img/avatar.png"}
                                                            ref={t=> this.upload_view_image = t}
                                                            onError={(e)=>{ 
                                                                this.upload_view_image.src='/adminlte/dist/assets/img/avatar.png'; 
                                                            }} alt="Picture Error" />
                                                        </div> 
                                                    </div> 
                                                    <EachMethod of={this.state.added_guardians} render={(element,index) => {
                                                        return  <div className="input-group ">
                                                            <div className="input-group-prepend col-lg-4">
                                                                <div htmlFor="lglv" className="input-group-text">{`${element.last_name}, ${element.first_name}`}  (<i> {this.state.relationship}</i> ) </div>
                                                            </div>  
                                                        </div>
                                                    }} /> 
                                                </div>
                                            </div>                                             
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

            <div className="modal fade" tabIndex="-1" role="dialog" id="studentEnrolled" data-bs-backdrop="static">
                <div className="modal-dialog modal-fullscreen" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title fs-5">Enrolled Students</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"> 
                        </button>
                    </div>
                    <div className="modal-body p-0">                        
                        <ReactTable
                            key={"react-tables"}
                            className={"table table-bordered table-striped table-hover"}
                            data={this.state.data} 
                            columns={this.state.columns}
                            showHeader={true}
                            showPagenation={true}
                            loading={this.state.loading}
                            defaultPageSize={15}
                        />
                    </div>
                    <div className="modal-footer"> 
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                    </div>
                </div>
            </div>

        </div>
        </DashboardLayout>
    }
}