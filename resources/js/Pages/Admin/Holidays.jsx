import React,{ Component } from "react";
import { Link } from '@inertiajs/react';
import { EachMethod } from '@/Components/EachMethod'
import swal from 'sweetalert';
import Swal from 'sweetalert2';

import ReactTable from "@/Components/ReactTable"; 

import DashboardLayout from '@/Layouts/DashboardLayout';


export default class Holidays extends Component {
    constructor(props) {
		super(props);
        this.state = {
            data: this.props.holidays,
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
                    id: "type",
                    Header: 'Holiday Type',  
                    accessor: 'type',
                    className: "center",
                    width: 126,
                }, 
                {
                    id: "event",
                    Header: 'Event', 
                    width: 126,
                    accessor: 'event_name'
                }, 
                {
                    id: "date",
                    Header: 'Date',  
                    width: 100,
                    accessor: 'date',
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
                            $("#uholidayType").val('');
                            $("#uevent_name").val('');
                            $("#udate").val('');
                            $("#utime_start").val('');
                            $("#utime_end").val(''); 
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
        };
        console.log(this.props)
        this.delete = this.delete.bind(this);
        this.selectSubject = this.selectSubject.bind(this);
        this.getAllData = this.getAllData.bind(this);

    }
    componentDidMount() {
        this.getAllData();
    }
    
    selectSubject(data) {        
        $("#uholidayType").val(data.type);
        $("#uevent_name").val(data.event_name);
        $("#udate").val(data.date);
        $("#utime_start").val(data.time_start);
        $("#utime_end").val(data.time_end); 
        $("#udescription").val(data.description);
        // $('#updateHoliday').modal('show');

        this.setState({selectedData:data},() => {
            $("#updateHoliday").modal('show');
        }); 
    }

    getAllData() {
        let self = this;
        axios.get('/holidays').then(function (response) {
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

        let holidayType = $("#holidayType").val();
        let event_name = $("#event_name").val();
        let date = $("#date").val();
        let time_start = $("#time_start").val();
        let time_end = $("#time_end").val(); 
        let description = $("#description").val();

        if( holidayType != "" && event_name != "" && date != "" ) { 
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
                        holidayType,
                        event_name,
                        date,
                        time_start,
                        time_end,
                        description
                    };
                    // console.log(datas);
                    axios.post('/holidays',datas).then( async function (response) {
                        // handle success
                        // console.log(response);
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
                                            $("#newHoliday").modal('hide');
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
            // let holidayType = $("#holidayType").val();
            // let event_name = $("#event_name").val();
            // let date = $("#date").val();
            // let time_start = $("#time_start").val();
            // let time_end = $("#time_end").val(); 
            // let description = $("#description").val();
            if(holidayType == "") {
                $("#subject_name-alert").removeAttr('class');
                $("#subject_name-alert").html('Required Field');
                $("#subject_name-alert").addClass('d-block invalid-feedback');
            }
            if(event_name == "") {
                $("#event_name-alert").removeAttr('class');
                $("#event_name-alert").html('Required Field');
                $("#event_name-alert").addClass('d-block invalid-feedback');
            }
            if(date == "") {
                $("#date-alert").removeAttr('class');
                $("#date-alert").html('Required Field');
                $("#date-alert").addClass('d-block invalid-feedback');
            }
        }
    }

    updateData() {
        let self = this;  
        let holidayType = $("#uholidayType").val();
        let event_name = $("#uevent_name").val();
        let date = $("#udate").val();
        let time_start = $("#utime_start").val();
        let time_end = $("#utime_end").val(); 
        let description = $("#udescription").val();

        if( holidayType != "" && event_name != "" && date != "" ) { 
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
                        holidayType,
                        event_name,
                        date,
                        time_start,
                        time_end,
                        description
                    };
                    console.log(datas);
                    axios.post('/holidays/update',datas).then( async function (response) {
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
                                            $("#updateHoliday").modal('hide');
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
            if(holidayType == "") {
                $("#usubject_name-alert").removeAttr('class');
                $("#usubject_name-alert").html('Required Field');
                $("#usubject_name-alert").addClass('d-block invalid-feedback');
            }
            if(event_name == "") {
                $("#uevent_name-alert").removeAttr('class');
                $("#uevent_name-alert").html('Required Field');
                $("#uevent_name-alert").addClass('d-block invalid-feedback');
            }
            if(date == "") {
                $("#udate-alert").removeAttr('class');
                $("#udate-alert").html('Required Field');
                $("#udate-alert").addClass('d-block invalid-feedback');
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
                axios.delete('/holidays',{data: {id:id}}).then(function (response) {
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
        return <DashboardLayout title="Holidays" user={this.props.auth.user} ><div className="noselect">
            <div className="app-content-header"> 
                <div className="container-fluid"> 
                    <div className="row">
                    <div className="col-sm-6"><h3 className="mb-0"><i className="nav-icon bi bi-calendar3"></i> Holidays</h3></div>
                    <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-end">
                            <li className="breadcrumb-item"><Link href="/admin/dashboard">Dashboard</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Holidays</li>
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
                                    <h3 className="card-title"> <i className="bi bi-calendar3"></i> Holidays List</h3> 
                                    <button className="btn btn-primary float-right mr-1" onClick={() => {
                                        $("#holidayType").val('');
                                        $("#event_name").val('');
                                        $("#date").val('');
                                        $("#time_start").val('');
                                        $("#time_end").val(''); 
                                        $("#description").val(''); 
                                        $('#newHoliday').modal('show');
                                    }}> <i className="bi bi-calendar"></i> Add</button>    
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

        <div className="modal fade" tabIndex="-1" role="dialog" id="newHoliday" aria-hidden="true" data-bs-backdrop="static">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title fs-5">Create Holidays</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"> 
                    </button>
                </div>
                <div className="modal-body">
                    
                    <div className="card-body"> 
                        <div className="row g-3"> 

                        <div className="col-md-12">
                                <label htmlFor="grade" className="form-label">Holiday Type</label>                                            
                                {/* <input type="text" className="form-control" list="selectedYearLevel" id="yearlevel" defaultValue="" required=""   /> */}

                                <select name="holidayType" id="holidayType" className="form-control" onChange={(e) => { 
                                    $("#holidayType-alert").removeAttr('class').addClass('invalid-feedback'); 
                                    if(e.target.value != "") {
                                    this.setState({selectedGrade: e.target.value})  
                                    }
                                    }}>
                                    <option disabled >--Select Type--</option>
                                    <option value="" ></option> 
                                    <option value="Regular" >Regular</option> 
                                    <option value="Special Non-Working" >Special Non-Working</option> 
                                    <option value="Special Working Holiday" >Special Working Holiday</option> 
                                    <option value="Other Considerations" ></option>
                                </select>
                                <div id="holidayType-alert" className="invalid-feedback">Please select a valid state.</div>
                            </div>
                            
                            <div className="col-md-12">
                                <label htmlFor="event_name" className="form-label">Event Name</label>
                                <input type="text" className="form-control" id="event_name" defaultValue="" required="" onChange={(e) => {  $("#event_name-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({room: e.target.value})}}  />
                                <div id="event_name-alert" className="invalid-feedback">Please select a valid state.</div>
                            </div>
                            
                            <div className="col-md-12">
                                <label htmlFor="date" className="form-label">Date</label>
                                <input type="date" className="form-control"id="date" defaultValue="08:00" min={"08:00"} required="" onChange={(e) => { console.log(e.target.value); this.setState({time_start:e.target.value}); $("#date-alert").removeAttr('class').addClass('invalid-feedback');}}  />
                                <div id="date-alert" className="invalid-feedback">Please select a valid state.</div>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="time_start" className="form-label">Time Start</label>
                                <input type="time" className="form-control"id="time_start" defaultValue="08:00" min={"08:00"} required="" onChange={(e) => { console.log(e.target.value); this.setState({time_start:e.target.value}); $("#time_start-alert").removeAttr('class').addClass('invalid-feedback');}}  />
                                <div id="time_start-alert" className="invalid-feedback">Please select a valid state.</div>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="time_end" className="form-label">Time End</label>
                                <input type="time" className="form-control" id="time_end" min={this.state.time_start} defaultValue="08:00" required="" onChange={(e) => {  $("#time_end-alert").removeAttr('class').addClass('invalid-feedback');}}  />
                                <div id="time_end-alert" className="invalid-feedback">Please select a valid state.</div>
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

        <div className="modal fade" tabIndex="-1" role="dialog" id="updateHoliday" aria-hidden="true" data-bs-backdrop="static">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title fs-5">Update Holidays</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"> 
                    </button>
                </div>
                <div className="modal-body">
                    
                    <div className="card-body"> 
                        <div className="row g-3"> 

                        <div className="col-md-12">
                                <label htmlFor="grade" className="form-label">Holiday Type</label>                                            
                                {/* <input type="text" className="form-control" list="selectedYearLevel" id="yearlevel" defaultValue="" required=""   /> */}

                                <select name="uholidayType" id="uholidayType" className="form-control" onChange={(e) => { 
                                    $("#uholidayType-alert").removeAttr('class').addClass('invalid-feedback'); 
                                    if(e.target.value != "") {
                                    this.setState({selectedGrade: e.target.value})  
                                    }
                                    }}>
                                    <option disabled >--Select Type--</option>
                                    <option value="" ></option> 
                                    <option value="Regular" >Regular</option> 
                                    <option value="Special Non-Working" >Special Non-Working</option> 
                                    <option value="Special Working Holiday" >Special Working Holiday</option> 
                                    <option value="Other Considerations" ></option>
                                </select>
                                <div id="uholidayType-alert" className="invalid-feedback">Please select a valid state.</div>
                            </div>
                            
                            <div className="col-md-12">
                                <label htmlFor="uevent_name" className="form-label">Event Name</label>
                                <input type="text" className="form-control" id="uevent_name" defaultValue="" required="" onChange={(e) => {  $("#uevent_name-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({room: e.target.value})}}  />
                                <div id="uevent_name-alert" className="invalid-feedback">Please select a valid state.</div>
                            </div>
                            
                            <div className="col-md-12">
                                <label htmlFor="udate" className="form-label">Date</label>
                                <input type="date" className="form-control" id="udate" defaultValue="08:00" min={"08:00"} required="" onChange={(e) => { console.log(e.target.value); this.setState({time_start:e.target.value}); $("#udate-alert").removeAttr('class').addClass('invalid-feedback');}}  />
                                <div id="udate-alert" className="invalid-feedback">Please select a valid state.</div>
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="utime_start" className="form-label">Time Start</label>
                                <input type="time" className="form-control" id="utime_start" defaultValue="08:00" min={"08:00"} required="" onChange={(e) => { console.log(e.target.value); this.setState({time_start:e.target.value}); $("#utime_start-alert").removeAttr('class').addClass('invalid-feedback');}}  />
                                <div id="utime_start-alert" className="invalid-feedback">Please select a valid state.</div>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="utime_end" className="form-label">Time End</label>
                                <input type="time" className="form-control" id="utime_end" min={this.state.time_start} defaultValue="08:00" required="" onChange={(e) => {  $("#utime_end-alert").removeAttr('class').addClass('invalid-feedback');}}  />
                                <div id="utime_end-alert" className="invalid-feedback">Please select a valid state.</div>
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
