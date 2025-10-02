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

export default class IDSEmployee extends Component {
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
                    className: "center",
                    Cell: ({ row }) => {
                        return (
                            <div className="transform translate-y-[5px]">
                                <input
                                    type="checkbox"
                                    // checked={row.getIsSelected()}
                                    name={`item-${row.original.uuid}`} // update here 
                                    onChange={(e) => this.selectedID(e.target.checked,row.original.qr_code)}
                                />
                            </div>
                        )
                    }
                },
                {
                    id: "qr",
                    accessor: 'qr_code',
                    Header: 'QR Code',
                    Cell: ({row}) => { 
                        return <QRCode value={row.original.qr_code} size={106} style={{ height: "auto", maxWidth: "100%", width: "100%" }}  viewBox={`0 0 256 256`} onDoubleClick={() => {
                            window.open(`/qrcode?code=${row.original.qr_code}`)
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
                       }} alt="Picture Error" src={`/profile/photo/employee/${row.original.uuid}`} />
                    }
                }, 
                {
                    id: "lrn",
                    accessor: 'lrn',
                    Header: 'LRN NO.', 
                    filterable: true,
                    maxWidth: 100,
                },
                {
                    id: "fullname",
                    Header: 'Fullname', 
                    width: 800,
                    filterable: true,
                    accessor: 'fullname'
                },  
                {
                    id: "type",
                    Header: 'Type',  
                    width: 200,
                    filterable: false,
                    accessor: 'employee_type'
                },
                {
                    id: "Status",
                    Header: 'Status',  
                    width: 200,
                    filterable: true,
                    accessor: 'status',
                    className: "center"
                },
                {
                    id: "Action",
                    Header: 'Action',  
                    width: 200,
                    accessor: 'status',
                    className: "center",
                    Cell: ({row}) => { 
                       return <>
                        <a target="_blank" href={`/employee/${row.original.uuid}/print/id`} className="btn btn-info btn-block btn-sm col-12 mb-1" onClick={()=>{ }}> <i className="bi bi-printer"></i> Print ID</a>    
                       </>            
                    }
                }
            ],
            selectedIDs:[]
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
        axios.get('/employee').then(function (response) {
          // handle success
        //   console.log(response)
            if( typeof(response.status) != "undefined" && response.status == "200" ) {
                let data = typeof(response.data) != "undefined" && typeof(response.data.data)!="undefined"?response.data.data:[];
                data.forEach((element,index,arr) => {
                    if(element.status != "remove") {
                        list.push({
                            no: index + 1,
                            uuid: element.uuid, 
                            id: element.id,
                            photo: element.picture_base64,
                            qr_code: element.qr_code,
                            fullname: `${element.last_name}, ${element.first_name} ${(element.extension_name!=null)?element.extension_name:''} ${element.middle_name}`.toLocaleUpperCase(),
                            employee_type: element.employee_type,
                            section: element.section,
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

    selectedID(val,lrn) {
        // console.log(val,lrn);
        let selectedIDs = [...this.state.selectedIDs];
        if(val == true) {
            selectedIDs.push(lrn);
        } else if(val == false) {
            selectedIDs.splice(selectedIDs.findIndex(e=>e==lrn), 1);
        }
        this.setState({selectedIDs:selectedIDs},()=>{
            // console.log(this.state.selectedIDs);
        })
    }

    render() { 
        return <DashboardLayout title="Employee ID" user={this.props.auth.user}>
            <div className="app-content-header"> 
                <div className="container-fluid"> 
                    <div className="row">
                    <div className="col-sm-6"><h3 className="mb-0"><i className="nav-icon bi bi-person-lines-fill"></i> Student ID</h3></div>
                    <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-end">
                            <li className="breadcrumb-item"><i className="bi bi-speedometer mr-2"></i><Link href="/admin/dashboard">Dashboard</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Student ID</li>
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
                                        
                                        <a href="/admin/employee/print/ids" target="_blank" className="btn btn-primary col-lg-2 mr-1"> <i className="bi bi-printer"></i> Print All </a>
                                        {(this.state.selectedIDs.length>0)?<a href={`/admin/employee/print/ids?selected=${encodeURI(this.state.selectedIDs.toLocaleString())}`} target="_blank" className="btn btn-primary col-lg-2 mr-1"> <i className="bi bi-printer"></i> Print Selected </a>:null}
                                    </div>
                                    
                                </div>
                                <div className="card-body p-0">
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