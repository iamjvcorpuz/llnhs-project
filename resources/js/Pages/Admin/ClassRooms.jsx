import React,{ Component } from "react";
import { Link } from '@inertiajs/react';
import { EachMethod } from '@/Components/EachMethod'
import swal from 'sweetalert';
import Swal from 'sweetalert2';

import ReactTable from "@/Components/ReactTable"; 

import DashboardLayout from '@/Layouts/DashboardLayout';


export default class ClassRooms extends Component {
    constructor(props) {
		super(props);
        this.state = {
            data: this.props.classroom,
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
                    id: "room",
                    Header: 'Room',  
                    accessor: 'room_number',
                    className: "center",
                    width: 126,
                }, 
                {
                    id: "floor",
                    Header: 'Floor', 
                    width: 126,
                    accessor: 'floor_number'
                }, 
                {
                    id: "building",
                    Header: 'Building No.',  
                    width: 100,
                    accessor: 'building_no',
                    className: "center"
                },   
                {
                    id: "description",
                    Header: 'Description',  
                    width: 300,
                    accessor: 'description',
                    className: "center"
                },   
                {
                    id: "action",
                    Header: 'Action',  
                    width: 100, 
                    accessor: 'index',
                    className: "center",
                    Cell: ({row}) => { 
                       return <>
                       <button className="btn btn-danger btn-block btn-sm col-12 mb-1" onClick={()=>{this.delete(row.original.id);}}> <i className="bi bi-person-fill-x"></i> Remove</button>    
                       <button onClick={()=>{ 
                            $("#uroom").val('');
                            $("#ufloor").val('');
                            $("#ubuilding").val('');
                            $("#udescription").val(''); 
                            this.selectSubject(row.original);
                        }} className="btn btn-primary btn-block btn-sm col-12 mb-1"> <i className="bi bi-pen"></i> Edit</button>  
                       </>            
                    }
                }
            ],
            id: "",
            room_no: "",
            floor_no: "",
            building_no: "",
            description: "",
            selectedData: {}
        }
        console.log(this.props)
        this.delete = this.delete.bind(this);
        this.selectSubject = this.selectSubject.bind(this);
        this.getAllData = this.getAllData.bind(this);
    }
    componentDidMount() {
        this.getAllData();
    }
    
    selectSubject(data) {
        $("#uroom").val(data.room_number);
        $("#ufloor").val(data.floor_number);
        $("#ubuilding").val(data.building_no);
        $("#udescription").val(data.description); 
        this.setState({selectedData:data},() => {
            $("#updateClassroom").modal('show');
        }); 
    }

    getAllData() {
        let self = this;
        axios.get('/classroom').then(function (response) {
            console.log(response);
            if( typeof(response.status) != "undefined" && response.status == "200" ) {
                let data = typeof(response.data) != "undefined" && typeof(response.data)!="undefined"?response.data:{};
                if(Object.keys(data).length>0) {
                    self.setState({
                        data: data, 
                    });
                } else {
                    self.setState({
                        data: [] 
                    });
                }
            }
        });
    }

    saveData() {
        let self = this; 
        let room = $("#room").val(); 
        let floor = $("#floor").val(); 
        let building = $("#building").val(); 
        let description = $("#description").val();  


        if(room != "" ) { 
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
                        rooom_no: room,
                        floor_no: floor,
                        building_no: building,
                        description: description,
                    };
                    console.log(datas);
                    axios.post('/classroom',datas).then( async function (response) {
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
                                            $("#newClassRoom").modal('hide');
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
        let room = $("#uroom").val(); 
        let floor = $("#ufloor").val(); 
        let building = $("#ubuilding").val(); 
        let description = $("#udescription").val();  


        if(room != "" ) { 
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
                        id: self.state.selectedData.id,
                        rooom_no: room,
                        floor_no: floor,
                        building_no: building,
                        description: description,
                    };
                    // console.log(datas);
                    axios.post('/classroom/update',datas).then( async function (response) {
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
                                            $("#updateClassroom").modal('hide');
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
    
    delete(id) {
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
                axios.delete('/classroom',{data: {id:id}}).then(function (response) {
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
        return <DashboardLayout title="Classrooms" user={this.props.auth.user} ><div className="noselect">
            <div className="app-content-header"> 
                <div className="container-fluid"> 
                    <div className="row">
                    <div className="col-sm-6"><h3 className="mb-0"><i className="nav-icon bi bi-person-lines-fill"></i> Classroom</h3></div>
                    <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-end">
                            <li className="breadcrumb-item"><Link href="/admin/dashboard">Dashboard</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Classroom</li>
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
                                    <h3 className="card-title"> <i className="bi bi-door-open"></i> Classroom List</h3> 
                                    <button className="btn btn-primary float-right mr-1" onClick={() => {

                                        $("#room").val('');
                                        $("#floor").val('');
                                        $("#building").val('');
                                        $("#description").val(''); 

                                        $('#newClassRoom').modal('show');
                                    }}> <i className="bi bi-person-plus-fill"></i> Add</button>    
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
            
        </div>

        <div className="modal fade" tabIndex="-1" role="dialog" id="newClassRoom" aria-hidden="true" data-bs-backdrop="static">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title fs-5">Create Classroom</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"> 
                    </button>
                </div>
                <div className="modal-body">
                    
                    <div className="card-body"> 
                        <div className="row g-3"> 
                            
                            <div className="col-md-12">
                                <label htmlFor="room" className="form-label">Room</label>
                                <input type="text" className="form-control" id="room" defaultValue="" required="" onChange={(e) => {  $("#subject-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({room: e.target.value})}}  />
                                <div id="room-alert" className="invalid-feedback">Please select a valid state.</div>
                            </div>
                            <div className="col-md-12">
                                <label htmlFor="floor" className="form-label">Floor</label>
                                <input type="text" className="form-control" id="floor" defaultValue="" required="" onChange={(e) => {  $("#floor-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({floor_no: e.target.value})}}  />
                                <div id="floor-alert" className="invalid-feedback">Please select a valid state.</div>
                            </div>
                            <div className="col-md-12">
                                <label htmlFor="building" className="form-label">Building No.</label>
                                <input type="text" className="form-control" id="building" defaultValue="" required="" onChange={(e) => {  $("#building-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({building_no: e.target.value})}}  />
                                <div id="building-alert" className="invalid-feedback">Please select a valid state.</div>
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
        <div className="modal fade" tabIndex="-1" role="dialog" id="updateClassroom" aria-hidden="true" data-bs-backdrop="static">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title fs-5">Create Classroom</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"> 
                    </button>
                </div>
                <div className="modal-body">
                    
                    <div className="card-body"> 
                        <div className="row g-3"> 
                            
                            <div className="col-md-12">
                                <label htmlFor="uroom" className="form-label">Room</label>
                                <input type="text" className="form-control" id="uroom" defaultValue="" required="" onChange={(e) => {  $("#uroom-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({room: e.target.value})}}  />
                                <div id="uroom-alert" className="invalid-feedback">Please select a valid state.</div>
                            </div>
                            <div className="col-md-12">
                                <label htmlFor="ufloor" className="form-label">Floor</label>
                                <input type="text" className="form-control" id="ufloor" defaultValue="" required="" onChange={(e) => {  $("#ufloor-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({floor_no: e.target.value})}}  />
                                <div id="ufloor-alert" className="invalid-feedback">Please select a valid state.</div>
                            </div>
                            <div className="col-md-12">
                                <label htmlFor="ubuilding" className="form-label">Building No.</label>
                                <input type="text" className="form-control" id="ubuilding" defaultValue="" required="" onChange={(e) => {  $("#ubuilding-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({building_no: e.target.value})}}  />
                                <div id="ubuilding-alert" className="invalid-feedback">Please select a valid state.</div>
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
                    <button className="btn btn-success float-right mr-1" onClick={() =>{ this.updateData() }}> <i className="bi bi-save"></i> Update</button>   
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
                </div>
            </div>
        </div>
    </DashboardLayout>}
}
