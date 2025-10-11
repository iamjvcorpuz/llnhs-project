import React,{ Component } from "react";
import { Head, Link } from '@inertiajs/react';
import { EachMethod } from '@/Components/EachMethod'
import swal from 'sweetalert';
import Swal from 'sweetalert2';
import DashboardLayout from '@/Layouts/DashboardLayout';
import ReactTable from "@/Components/ReactTable"; 


export default class Users extends Component {
    constructor(props) {
		super(props);
        this.state = {
            data: this.props.user_list,
            data_users: [],
            columns: [
                {
                    id: "no",
                    accessor: 'index',
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
                    accessor: 'fullname',
                    filterable: true,
                }, 
                {
                    id: "type",
                    Header: 'User Type',  
                    width: 100,
                    accessor: 'user_role',
                    className: "center",
                    filterable: true
                },   
                {
                    id: "action",
                    Header: 'Action',  
                    width: 200, 
                    accessor: 'user_role',
                    className: "center",
                    Cell: ({row}) => { 
                       return <>
                       <button className="btn btn-danger btn-block btn-sm col-12 mb-1" onClick={()=>{this.deleteUsers(row.original.id);}}> <i className="bi bi-person-fill-x"></i> Remove</button>    
                       <button className="btn btn-primary btn-block btn-sm col-12 mb-1" onClick={() => {
                        $("#resetPassword").modal('show');
                        $("#username").val('');
                        this.selectedAccounts(row.original);
                       }}> <i className="bi bi-pen"></i> Reset Password</button>  
                       </>            
                    }
                }
            ],
            selectedAccount: {}       
        }

        this.selectedAccounts = this.selectedAccounts.bind(this);
        this.loadData = this.loadData.bind(this);
        this.saveNewAuthData = this.saveNewAuthData.bind(this);
        this.saveAuthData = this.saveAuthData.bind(this);

        // console.log(this.props)
    }

    componentDidMount() {
        this.loadData();
        // this.getAllUsers();
    }

    getAllUsers() {
        //this.props.data
        let user_list = [];
        if(typeof(this.props.data.teacher)!="undefined") {
            this.props.data.teacher.forEach(element => {
                user_list.push({
                    ...element,
                    user_type: 'teacher'
                });
            });
        }
        if(typeof(this.props.data.student)!="undefined") {
            this.props.data.student.forEach(element => {
                user_list.push({
                    ...element,
                    user_type: 'student'
                });
            });
        }
        if(typeof(this.props.data.guardians)!="undefined") {
            this.props.data.guardians.forEach(element => {
                user_list.push({
                    ...element,
                    user_type: 'guardians'
                });
            });
        }
        this.setState({
            data_users: user_list
        })
    }

    selectedAccounts(val) {
        console.log(val);
        $("#username").val(val.username);
        this.setState({
            selectedAccount: val
        })
    }

    loadData() {
        let self = this;
        axios.get('/user/accounts').then(function (response) {
            console.log(response);
            if( typeof(response.status) != "undefined" && response.status == "200" ) {
                let data = typeof(response.data) != "undefined" && typeof(response.data)!="undefined"?response.data:{};
                if(Object.keys(data).length>0) {
                    self.setState({
                        data: data.data, 
                    });
                    
                }
            }
        });
    }

    saveNewAuthData() {
        let self = this; 
        let username = $("#nusername").val();
        let password = $("#npassword").val();

        if(username != "" && password != "") {
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
                    let fullname = `${self.state.selectedAccount.first_name} ${self.state.selectedAccount.last_name}`;
                    let datas =  { 
                        ...self.state.selectedAccount,
                        id: self.state.selectedAccount.id,
                        user_type: self.state.selectedAccount.user_type,
                        user_role_id: self.state.selectedAccount.user_type,
                        fullname: fullname,
                        username: username,
                        password: password
                    };
                    console.log(datas);
                    axios.post('/user/accounts/auth',datas).then( async function (response) {
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
                                            // window.location.reload();
                                            $("#NewPassword").modal('hide');
                                            $("#utype").val('');
                                            $("#teacher").val('');
                                            $("#nusername").val('');
                                            $("#npassword").val('');
                                            self.loadData();
                                            self.setState({
                                                selectedAccount: {},
                                            })
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
            
            if(username == "") {
                $("#nusername-alert").removeAttr('class');
                $("#nusername-alert").html('Required Field');
                $("#nusername-alert").addClass('d-block invalid-feedback');
            }
            if(password == "") {
                $("#npassword-alert").removeAttr('class');
                $("#npassword-alert").html('Required Field');
                $("#npassword-alert").addClass('d-block invalid-feedback');
            }
        }
    }

    saveAuthData() {
        let self = this; 
        let username = $("#username").val();
        let password = $("#password").val();

        if(username != "" && password != "") {
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
                        ...self.state.selectedAccount,
                        update_username: username,
                        update_password: password
                    };
                    console.log(datas);
                    axios.post('/user/update/auth',datas).then( async function (response) {
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
                                            // window.location.reload();
                                            $("#resetPassword").modal('hide');
                                            $("#username").val('');
                                            $("#password").val('');
                                            self.loadData();
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
                                if(data.status ="data_exist") { 
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
            
            if(username == "") {
                $("#username-alert").removeAttr('class');
                $("#username-alert").html('Required Field');
                $("#username-alert").addClass('d-block invalid-feedback');
            }
            if(password == "") {
                $("#password-alert").removeAttr('class');
                $("#password-alert").html('Required Field');
                $("#password-alert").addClass('d-block invalid-feedback');
            }
        }
    }

    deleteUsers(id) {
        console.log("deleteUsers",id);
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
                axios.delete('/user/accounts',{data: {id:id}}).then(function (response) {
                    // handle success
                    // console.log(response);
                        if( typeof(response.status) != "undefined" && response.status == "201" ) {
                            let data = typeof(response.data) != "undefined" && typeof(response.data)!="undefined"?response.data:{};
                            if(data.status == "success") {

                                self.loadData();

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
        return <DashboardLayout title="User" user={this.props.auth.user}>
            <div className="app-content-header"> 
                <div className="container-fluid"> 
                    <div className="row">
                    <div className="col-sm-6"><h3 className="mb-0"><i className="nav-icon bi bi-person-gear"></i> Users Accounts</h3></div>
                    <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-end">
                            <li className="breadcrumb-item"><i className="bi bi-speedometer mr-2"></i><Link href="/admin/dashboard">Dashboard</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Users</li>
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
                                    <h3 className="card-title  mt-2"> <i className="bi bi-person"></i> Users List</h3> 
                                    <button className="btn btn-primary float-right mr-1" onClick={() => { $("#NewPassword").modal('show') }} > <i className="bi bi-person-plus-fill"></i> Add</button>    
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

            <div className="modal fade" tabIndex="-1" role="dialog" id="resetPassword" aria-hidden="true" data-bs-backdrop="static">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title fs-5">Reset Password</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"> 
                        </button>
                    </div>
                    <div className="modal-body">
                        
                        <div className="card-body"> 
                            <div className="row g-3"> 
                                
                            <div className="col-md-12">
                                    <label htmlFor="username" className="form-label">Username</label>
                                    <input type="text" className="form-control" id="username" defaultValue="" required="" onChange={(e) => {  }}  />
                                    <div id="username-alert" className="invalid-feedback">Please select a valid state.</div>
                                </div>
                                <div className="col-md-12">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input type="password" className="form-control"  id="password" defaultValue="" required="" onChange={(e) => {  }}  />
                                    <div id="password-alert" className="invalid-feedback">Please select a valid state.</div>
                                </div>

                            </div> 
                        </div>

                    </div>
                    <div className="modal-footer"> 
                        <button className="btn btn-success float-right mr-1" onClick={() =>{ this.saveAuthData() }}> <i className="bi bi-save"></i> Save</button>   
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" tabIndex="-1" role="dialog" id="NewPassword" aria-hidden="true" data-bs-backdrop="static">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title fs-5">Set Password</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"> 
                        </button>
                    </div>
                    <div className="modal-body">
                        
                        <div className="card-body"> 
                            <div className="row g-3"> 
                                <div className="col-md-12">
                                    <label htmlFor="teacher" className="form-label">User</label>
                                    <input type="text" className="form-control" list="selectedUser" id="teacher" defaultValue="" required="" onChange={(e) => {  
                                        $("#teacher-alert").removeAttr('class').addClass('invalid-feedback'); 
                                        // console.log(e.target.value);
                                        // console.log(this.state.data_users.length,this.state.data_users.find( ee => `${ee.last_name}, ${ee.first_name}`== e.target.value));
                                        let a = this.state.data_users.find( ee => `${ee.last_name}, ${ee.first_name}`== e.target.value);
                                        if(a != null && typeof(a.user_type)!="undefined") {
                                            $('#utype').val(a.user_type.toUpperCase());
                                            this.setState({selectedAccount: a});
                                        } else if(e.target.value == "") {
                                            $('#utype').val("");
                                            this.setState({selectedAccount: {}});
                                        }
                                    }}  />
                                    <div id="teacher-alert" className="invalid-feedback">Please select a valid state.</div>
                                </div>
                                <div className="col-md-12">
                                    <label htmlFor="username" className="form-label">Type</label>
                                    <input type="text" className="form-control" id="utype" defaultValue="" required="" onChange={(e) => {  }}  />
                                    <div id="type-alert" className="invalid-feedback">Please select a valid state.</div>
                                </div>
                                <div className="col-md-12">
                                    <label htmlFor="username" className="form-label">Username</label>
                                    <input type="text" className="form-control" id="nusername" defaultValue="" required="" onChange={(e) => {  }}  />
                                    <div id="nusername-alert" className="invalid-feedback">Please select a valid state.</div>
                                </div>
                                <div className="col-md-12">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input type="password" className="form-control"  id="npassword" defaultValue="" required="" onChange={(e) => {  }}  />
                                    <div id="npassword-alert" className="invalid-feedback">Please select a valid state.</div>
                                </div>
                            </div> 
                        </div>

                    </div>
                    <div className="modal-footer"> 
                        <button className="btn btn-success float-right mr-1" onClick={() =>{ this.saveNewAuthData() }}> <i className="bi bi-save"></i> Save</button>   
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                    </div>
                </div>
            </div>
            <datalist id="selectedUser">
                <EachMethod of={this.state.data_users} render={(element,index) => {
                    return <option value={`${element.last_name}, ${element.first_name}`} >{`${element.user_type}`}</option>
                }} />
            </datalist>
        </DashboardLayout>
    }
}