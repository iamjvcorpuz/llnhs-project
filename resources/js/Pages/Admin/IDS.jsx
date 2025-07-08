import React,{ Component } from "react";
import { Head, Link } from '@inertiajs/react';
import { EachMethod } from '@/Components/EachMethod';
import swal from 'sweetalert';
import Swal from 'sweetalert2';
import axios from 'axios';
// import QRCode from 'qrcode';
import QRCode from "react-qr-code";
import ReactTable from "@/Components/ReactTable"; 

import DashboardLayout from '@/Layouts/DashboardLayout';
// const generateQR = async text => {
//     try {
//       console.log(await QRCode.toDataURL(text))
//     } catch (err) {
//       console.error(err)
//     }
//   }

export default class IDS extends Component {
    constructor(props) {
		super(props);
        this.state = {
            data: [],
            columns: [
                {
                    id: "no",
                    accessor: 'no',
                    Header: 'No.', 
                    width: 100,
                    className: "center"
                },
                {
                    id: "qr",
                    accessor: 'lrn',
                    Header: 'QR Code',   
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
                    id: "level",
                    Header: 'Level',  
                    width: 200,
                    accessor: 'level'
                },  
                {
                    id: "section",
                    Header: 'Section',  
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
                        <a target="_blank" href={`/student/${row.original.id}/print/id`} className="btn btn-info btn-block btn-sm col-12 mb-1" onClick={()=>{ }}> <i className="bi bi-printer"></i> Print ID</a>    
                       </>            
                    }
                }
            ]
        }
        this._isMounted = false;
        this.loadStudentList = this.loadStudentList.bind(this);
        this.deleteStudent = this.deleteStudent.bind(this);
    }
    
    componentDidMount() {
        this._isMounted = true;
        this.loadStudentList();
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
                axios.delete('/student',{data: {id:id}}).then(function (response) {
                    // handle success
                    // console.log(response);
                        if( typeof(response.status) != "undefined" && response.status == "201" ) {
                            let data = typeof(response.data) != "undefined" && typeof(response.data)!="undefined"?response.data:{};
                            if(data.status == "success") {
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
                            if(data.status == "data_not_exist") { 
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
                        <div className="col-lg-12">
                            <div className="card mb-4">
                                <div className="card-header">
                                    <div className="row">
                                        <div className="col-lg-2 me-auto">
                                            <h3 className="card-title mt-2 "> <i className="bi bi-person"></i> Student List</h3>
                                        </div>
                                          
                                        <a href="/admin/student/print/ids" target="_blank" className="btn btn-primary col-lg-2 mr-1"> <i className="bi bi-printer"></i> Print All </a>

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

        </DashboardLayout>
    }
}