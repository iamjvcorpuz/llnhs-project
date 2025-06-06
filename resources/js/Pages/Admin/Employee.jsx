import React,{ Component } from "react";
import { Head, Link } from '@inertiajs/react';
import { EachMethod } from '@/Components/EachMethod';
import swal from 'sweetalert';
import Swal from 'sweetalert2';

import ReactTable from "@/Components/ReactTable"; 

import DashboardLayout from '@/Layouts/DashboardLayout';


export default class Employee extends Component {
    constructor(props) {
		super(props);
        this.state = {
            data: [],
            columns: [
                {
                    id: "no",
                    accessor: 'no',
                    Header: 'No.', 
                    width: 50,
                    className: "center"
                }, 
                {
                    id: "picture",
                    Header: 'Picture',  
                    accessor: 'photo',
                    className: "center",
                    width: 126,
                    Cell: ({row}) => { 
                       return <img className="" height={100} width={100}  onError={(e)=>{ 
                        e.target.src=(row.original.sex=="Male")?'/adminlte/dist/assets/img/avatar.png':'/adminlte/dist/assets/img/avatar-f.jpeg'; 
                   }} alt="Picture Error" src={(row.original.photo!=null&&row.original.photo!="")?row.original.photo:(row.original.sex=="Male")?'/adminlte/dist/assets/img/avatar.png':'/adminlte/dist/assets/img/avatar-f.jpeg'} />
                    },
                }, 
                {
                    id: "fullname",
                    Header: 'Fullname', 
                    width: 800,
                    accessor: 'fullname'
                }, 
                {
                    id: "section",
                    Header: 'Type',  
                    width: 100,
                    accessor: 'employee_type',
                    className: "center"
                },  
                {
                    id: "Status",
                    Header: 'Status',  
                    width: 100,
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
                       <button className="btn btn-danger btn-block btn-sm col-12 mb-1" onClick={()=>{this.deleteTeacher(row.original.id);}}> <i className="bi bi-person-fill-x"></i> Remove</button>
                       <Link href={`/admin/dashboard/employee/update/${row.original.id}`} className="btn btn-primary btn-block btn-sm col-12 mb-1"> <i className="bi bi-pen"></i> Edit</Link> 
                       {/* <button className="btn btn-info btn-block btn-sm col-12 mb-1" onClick={()=>{ }}> <i className="bi bi-printer"></i> Print ID</button>     */}
                       </>            
                    }
                }
            ]            
        }

        this._isMounted = false;
        this.loadTeachertList = this.loadTeachertList.bind(this);
        this.deleteTeacher = this.deleteTeacher.bind(this);
    }
    componentDidMount() {
        this._isMounted = true;
        this.loadTeachertList();
        // let list  = [];
        // for (let index = 0; index < 10; index++) {

        //     list.push({
        //         no: index + 1, 
        //         photo:"",
        //         fullname: "Teacher " + index, 
        //         section: index,
        //         status: "Active"
        //     })
            
        // }
        // this.setState({data: list});
        // this.loadStudentList();
    }

    loadTeachertList() {
        let list  = []; 
        let self = this;
        axios.get('/employee').then(function (response) {
          // handle success
          console.log(response)
            if( typeof(response.status) != "undefined" && response.status == "200" ) {
                let data = typeof(response.data) != "undefined" && typeof(response.data.data)!="undefined"?response.data.data:[];
                data.forEach((element,index,arr) => {
                        list.push({
                            id: element.id,
                            employee_type: element.employee_type,
                            no: index + 1,
                            photo: element.picture_base64,
                            lrn: element.lrn,
                            fullname: `${element.last_name}, ${element.first_name} ${(element.extension_name!=null)?element.extension_name:''} ${element.middle_name}`.toLocaleUpperCase(),
                            level: "None",
                            section: element.total_advisory,
                            sex: element.sex,
                            status: element.status
                        })
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

    deleteTeacher(id) {
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
                axios.delete('/employee',{data: {id:id}}).then(function (response) {
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
        return <DashboardLayout title="Employee" user={this.props.auth.user}>
            <div className="app-content-header"> 
                <div className="container-fluid"> 
                    <div className="row">
                    <div className="col-sm-6"><h3 className="mb-0"><i className="nav-icon bi bi-person-lines-fill"></i> Employee List</h3></div>
                    <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-end">
                            <li className="breadcrumb-item"><i className="bi bi-speedometer mr-2"></i><Link href="/admin/dashboard">Dashboard</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Employee</li>
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
                                    <h3 className="card-title  mt-2"> <i className="bi bi-person"></i> Teacher List</h3> 
                                    <Link className="btn btn-primary float-right mr-1" href="/admin/dashboard/employee/new" > <i className="bi bi-person-plus-fill"></i> Add</Link>    
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
        </DashboardLayout>
    }
}