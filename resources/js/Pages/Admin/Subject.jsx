import React,{ Component } from "react";
import { Link } from '@inertiajs/react';
import { EachMethod } from '@/Components/EachMethod'
import swal from 'sweetalert';
import Swal from 'sweetalert2';

import ReactTable from "@/Components/ReactTable"; 

import DashboardLayout from '@/Layouts/DashboardLayout';


export default class NewStudent extends Component {
    constructor(props) {
		super(props);
        this.state = {            
            data: [],
            columns: [
                {
                    id: "index",
                    accessor: 'index',
                    Header: 'No.', 
                    width: 50,
                    className: "center"
                },
                {
                    id: "subject_name",
                    accessor: 'subject_name',
                    Header: 'Subject Name', 
                    maxWidth: 800,
                },
                {
                    id: "description",
                    Header: 'Decription', 
                    width: 200,
                    accessor: 'description'
                },
                {
                    id: "action",
                    Header: 'Status',  
                    width: 80,
                    accessor: 'index',
                    className: "center",
                    Cell: ({row}) => { 
                       return <>                       
                        <button className="btn btn-danger btn-block btn-sm col-12 mb-1" onClick={()=>{this.deleteSubject(row.original.id);}}> <i className="bi bi-person-fill-x"></i> Remove</button>    
                        <button onClick={()=>{ this.selectSubject(row.original); }} className="btn btn-primary btn-block btn-sm col-12 mb-1"> <i className="bi bi-pen"></i> Edit</button>  
                       </>            
                    }
                }
            ],
            selectedSubject: {}
        }
        this.deleteSubject = this.deleteSubject.bind(this);
        this.selectSubject = this.selectSubject.bind(this);
        this._isMounted = false;
    }
    componentDidMount() {
        this._isMounted = true;
        this.setState({
            data: this.props.subjects
        });
        // this.getAllData();
    }
    selectSubject(data) {
        $("#usubject").val(data.subject_name);
        $("#udescription").val(data.description); 
        this.setState({selectedSubject:data},() => {
            $("#updateSubject").modal('show');
        }); 
    }

    getAllData() {
        let self = this;
        axios.get('/subject').then(function (response) {
            console.log(response);
            if( typeof(response.status) != "undefined" && response.status == "200" ) {
                let data = typeof(response.data) != "undefined" && typeof(response.data)!="undefined"?response.data:{};
                if(Object.keys(data).length>0) {
                    self.setState({
                        data: data, 
                    });
                }
            }
        });
    }

    saveData() {
        let self = this; 
        let subject_name = $("#subject").val(); 
        let description = $("#description").val();  


        if(description != "" && subject_name != "" ) { 
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
                        subject_name: subject_name,
                        description: description,
                    };
                    console.log(datas);
                    axios.post('/subject',datas).then( async function (response) {
                        // handle success
                        console.log(response);
                            if( typeof(response.status) != "undefined" && response.status == "201" ) {
                                let data = typeof(response.data) != "undefined" && typeof(response.data)!="undefined"?response.data:{};
                                if(data.status ="sucess") {
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
                                            $("#newSubject").modal('hide');
                                            self.getAllData();
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
            if(subject_name == "") {
                $("#subject_name-alert").removeAttr('class');
                $("#subject_name-alert").html('Required Field');
                $("#subject_name-alert").addClass('d-block invalid-feedback');
            }
            if(description == "") {
                $("#description-alert").removeAttr('class');
                $("#description-alert").html('Required Field');
                $("#description-alert").addClass('d-block invalid-feedback');
            }
        }
    }

    updateData() {
        let self = this; 
        let subject_name = $("#usubject").val(); 
        let description = $("#udescription").val();  


        if(description != "" && subject_name != "" ) { 
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
                        id: self.state.selectedSubject.id,
                        subject_name: subject_name,
                        description: description,
                    };
                    console.log(datas);
                    axios.post('/subject/update',datas).then( async function (response) {
                        // handle success
                        console.log(response);
                            if( typeof(response.status) != "undefined" && response.status == "201" ) {
                                let data = typeof(response.data) != "undefined" && typeof(response.data)!="undefined"?response.data:{};
                                if(data.status ="sucess") {
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
                                            $("#updateSubject").modal('hide');
                                            self.getAllData();
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
            if(subject_name == "") {
                $("#usubject_name-alert").removeAttr('class');
                $("#usubject_name-alert").html('Required Field');
                $("#usubject_name-alert").addClass('d-block invalid-feedback');
            }
            if(description == "") {
                $("#udescription-alert").removeAttr('class');
                $("#udescription-alert").html('Required Field');
                $("#udescription-alert").addClass('d-block invalid-feedback');
            }
        }
    }
    
    deleteSubject(id) {
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
                console.log(id)
                axios.delete('/subject',{data: {id:id}}).then(function (response) {
                    // handle success
                    console.log(response);
                        if( typeof(response.status) != "undefined" && response.status == "201" ) {
                            let data = typeof(response.data) != "undefined" && typeof(response.data)!="undefined"?response.data:{};
                            if(data.status ="sucess") {

                                self.getAllData();
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
                            if(data.status ="data_not_exist") { 
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
        return <DashboardLayout title="Student" user={this.props.auth.user} ><div className="noselect">
            <div className="app-content-header"> 
                <div className="container-fluid"> 
                    <div className="row">
                    <div className="col-sm-6"><h3 className="mb-0"><i className="nav-icon bi bi-person-lines-fill"></i> Subjects</h3></div>
                    <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-end">
                            <li className="breadcrumb-item"><Link href="/admin/dashboard">Dashboard</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Subjects</li>
                        </ol>
                    </div>
                    </div> 
                </div> 
            </div>

            <div className="app-content">
                <div className="container-fluid">
                    
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card mb-4 ">
                                <div className="card-header">
                                    <h3 className="card-title"> <i className="bi bi-list-th"></i> Track</h3> 
                                    <button className="btn btn-primary float-right mr-1" onClick={() => {
                                        $('#newSubject').modal('show');
                                    }} > <i className="bi bi-person-plus-fill"></i> Add</button>    
                                </div>
                                <div className="card-body p-0"> 
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
        </div>



        <div className="modal fade" tabIndex="-1" role="dialog" id="newSubject" aria-hidden="true" data-bs-backdrop="static">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title fs-5">Added</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"> 
                    </button>
                </div>
                <div className="modal-body">
                    
                    <div className="card-body"> 
                        <div className="row g-3"> 
                            
                            <div className="col-md-12">
                                <label htmlFor="subject" className="form-label">Subject Name</label>
                                <input type="text" className="form-control" id="subject" defaultValue="" required="" onChange={(e) => {  $("#subject-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({subject: e.target.value})}}  />
                                <div id="subject-alert" className="invalid-feedback">Please select a valid state.</div>
                            </div>
                            <div className="col-md-12">
                                <label htmlFor="description" className="form-label">Description</label>
                                <textarea type="text" className="form-control" id="description" defaultValue="" required="" onChange={(e) => {  $("#description-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({description: e.target.value})}}  ></textarea>
                                <div id="description-alert" className="invalid-feedback">Please select a valid state.</div>
                            </div>

                        </div> 
                    </div>

                </div>
                <div className="modal-footer"> 
                    <button className="btn btn-success float-right mr-1" onClick={() =>{ this.saveData() }}> <i className="bi bi-save"></i> Save</button>   
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
                </div>
            </div>
        </div>

        <div className="modal fade" tabIndex="-1" role="dialog" id="updateSubject" aria-hidden="true" data-bs-backdrop="static">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title fs-5">Update Subject</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"> 
                    </button>
                </div>
                <div className="modal-body">
                    
                <div className="card-body"> 
                        <div className="row g-3"> 
                            
                            <div className="col-md-12">
                                <label htmlFor="usubject" className="form-label">Subject Name</label>
                                <input type="text" className="form-control" id="usubject" defaultValue="" required="" onChange={(e) => {  $("#usubject-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({subject: e.target.value})}}  />
                                <div id="usubject-alert" className="invalid-feedback">Please select a valid state.</div>
                            </div>
                            <div className="col-md-12">
                                <label htmlFor="udescription" className="form-label">Description</label>
                                <textarea type="text" className="form-control" id="udescription" defaultValue="" required="" onChange={(e) => {  $("#udescription-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({description: e.target.value})}}  ></textarea>
                                <div id="udescription-alert" className="invalid-feedback">Please select a valid state.</div>
                            </div>

                        </div> 
                    </div>

                </div>
                <div className="modal-footer"> 
                    <button className="btn btn-success float-right mr-1" onClick={() =>{ this.updateData() }}> <i className="bi bi-save"></i> Save</button>   
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
                </div>
            </div>
        </div>
    </DashboardLayout>}
}
