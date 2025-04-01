import React,{ Component } from "react";
import { Link } from '@inertiajs/react';
import { EachMethod } from '@/Components/EachMethod'
import swal from 'sweetalert';
import Swal from 'sweetalert2';

import ReactTable from "@/Components/ReactTable"; 

import DashboardLayout from '@/Layouts/DashboardLayout';


export default class ProgramsCurricular extends Component {
    constructor(props) {
		super(props);
        this.state = {            
            track_data: this.props.track,
            selectedtrack: {},
            track_columns: [
                {
                    id: "no",
                    accessor: 'index',
                    Header: 'No.', 
                    width: 20,
                    className: "center"
                },
                {
                    id: "name",
                    accessor: 'name',
                    Header: 'Name', 
                    maxWidth: 800,
                },
                {
                    id: "acronyms",
                    Header: 'Acronyms', 
                    width: 200,
                    accessor: 'acronyms'
                },   
                {
                    id: "description",
                    Header: 'Description',  
                    width: 200,
                    accessor: 'description'
                },
                {
                    id: "action",
                    Header: 'Action',  
                    width: 80,
                    accessor: 'index',
                    className: "center",
                    Cell: ({row}) => { 
                       return <>                       
                        <button className="btn btn-danger btn-block btn-sm col-12 mb-1" onClick={()=>{this.delete('track',row.original.id);}}> <i className="bi bi-person-fill-x"></i> Remove</button>    
                        <button onClick={() => { this.selectTrack(row.original); }} className="btn btn-primary btn-block btn-sm col-12 mb-1"> <i className="bi bi-pen"></i> Edit</button>  
                       </>            
                    }
                }
            ],
            strands_data: this.props.strand,
            selectedStrand: {},
            strands_columns: [
                {
                    id: "no",
                    accessor: 'index',
                    Header: 'No.', 
                    width: 20,
                    className: "center"
                },
                {
                    id: "name",
                    accessor: 'name',
                    Header: 'Name', 
                    maxWidth: 800,
                },
                {
                    id: "acronyms",
                    Header: 'Acronyms', 
                    width: 200,
                    accessor: 'acronyms'
                },   
                {
                    id: "description",
                    Header: 'Description',  
                    width: 200,
                    accessor: 'description'
                },
                {
                    id: "action",
                    Header: 'Action',  
                    width: 80,
                    accessor: 'index',
                    className: "center",
                    Cell: ({row}) => { 
                       return <>                       
                        <button className="btn btn-danger btn-block btn-sm col-12 mb-1" onClick={()=>{this.delete('strand',row.original.id);}}> <i className="bi bi-person-fill-x"></i> Remove</button>    
                        <button onClick={() => { this.selectStrand(row.original); }} className="btn btn-primary btn-block btn-sm col-12 mb-1"> <i className="bi bi-pen"></i> Edit</button>  
                       </>            
                    }
                }
            ]
        }
        console.log(this.props);
        this.saveTrack = this.saveTrack.bind(this);
        this.delete = this.delete.bind(this);
        this.selectTrack = this.selectTrack.bind(this);
        this.selectStrand = this.selectStrand.bind(this);
    }
    componentDidMount() {

    }

    loadData() {
        let self = this;
        axios.get('/programs/curricular').then(function (response) {
            console.log(response);
            if( typeof(response.status) != "undefined" && response.status == "200" ) {
                let data = typeof(response.data) != "undefined" && typeof(response.data)!="undefined"?response.data:{};
                if(Object.keys(data).length>0) {
                    self.setState({
                        track_data: data.track, 
                        strands_data: data.strand
                    });
                    
                }
            }
        });
    }

    selectTrack(val) {
        console.log("selectTrack",val);
        this.setState({
            selectedtrack: val
        },() => {
            $("#utname").val(val.name);
            $("#utacronym").val(val.acronyms);
            $("#utdescription").val(val.description);
            $("#updatetrack").modal('show');
        });
    }
    selectStrand(val) {
        this.setState({
            selectedStrand: val
        },() => {
            $("#usname").val(val.name);
            $("#usacronym").val(val.acronyms);
            $("#usdescription").val(val.description);
            $("#updatestrand").modal('show');
        });
    }

    saveTrack() {
        let self = this; 
        let tname = $("#tname").val();
        let tacronym = $("#tacronym").val();
        let tdescription = $("#tdescription").val();

        if(tname != "" && tacronym != "" && tdescription != "") {
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
                        name: tname,
                        acronym: tacronym,
                        description: tdescription,
                        type: "track"
                    };
                    // console.log(datas);
                    axios.post('/programs/curricular',datas).then( async function (response) {
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
                                            $("#addtrack").modal('hide');
                                            $("#tname").val('');
                                            $("#tatacronymc").val('');
                                            $("#tdescription").val(''); 
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
            if(tname == "") {
                $("#tname-alert").removeAttr('class');
                $("#tname-alert").html('Required Field');
                $("#tname-alert").addClass('d-block invalid-feedback');
            }
            if(tacronym == "") {
                $("#tacronym-alert").removeAttr('class');
                $("#tacronym-alert").html('Required Field');
                $("#tacronym-alert").addClass('d-block invalid-feedback');
            }
            if(tdescription == "") {
                $("#tdescription-alert").removeAttr('class');
                $("#tdescription-alert").html('Required Field');
                $("#tdescription-alert").addClass('d-block invalid-feedback');
            }
        }
    }

    saveStrand() {
        let self = this; 
        let tname = $("#sname").val();
        let tacronym = $("#sacronym").val();
        let tdescription = $("#sdescription").val();

        if(tname != "" && tacronym != "" && tdescription != "") {
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
                        name: tname,
                        acronym: tacronym,
                        description: tdescription,
                        type: "strand"
                    };
                    // console.log(datas);
                    axios.post('/programs/curricular',datas).then( async function (response) {
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
                                            $("#addstrand").modal('hide');
                                            $("#sname").val('');
                                            $("#satacronymc").val('');
                                            $("#sdescription").val(''); 
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
            if(tname == "") {
                $("#sname-alert").removeAttr('class');
                $("#sname-alert").html('Required Field');
                $("#sname-alert").addClass('d-block invalid-feedback');
            }
            if(tacronym == "") {
                $("#sacronym-alert").removeAttr('class');
                $("#sacronym-alert").html('Required Field');
                $("#sacronym-alert").addClass('d-block invalid-feedback');
            }
            if(tdescription == "") {
                $("#sdescription-alert").removeAttr('class');
                $("#sdescription-alert").html('Required Field');
                $("#sdescription-alert").addClass('d-block invalid-feedback');
            }
        }
    }

    updateTrack() {
        let self = this; 
        let tname = $("#utname").val();
        let tacronym = $("#utacronym").val();
        let tdescription = $("#utdescription").val();

        if(tname != "" && tacronym != "" && tdescription != "") {
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
                        id: self.state.selectedtrack.id,
                        name: tname,
                        acronym: tacronym,
                        description: tdescription,
                        type: "track"
                    }; 
                    axios.post('/programs/curricular/update',datas).then( async function (response) {
                        // handle success
                        console.log(response);
                            if( typeof(response.status) != "undefined" && response.status == "201" ) {
                                let data = typeof(response.data) != "undefined" && typeof(response.data)!="undefined"?response.data:{};
                                if(data.status ="sucess") {
                                    Swal.fire({  
                                        title: "Successfuly Update!", 
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
                                            $("#updatetrack").modal('hide');
                                            $("#utname").val('');
                                            $("#utatacronymc").val('');
                                            $("#utdescription").val(''); 
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
            if(tname == "") {
                $("#tname-alert").removeAttr('class');
                $("#tname-alert").html('Required Field');
                $("#tname-alert").addClass('d-block invalid-feedback');
            }
            if(tacronym == "") {
                $("#tacronym-alert").removeAttr('class');
                $("#tacronym-alert").html('Required Field');
                $("#tacronym-alert").addClass('d-block invalid-feedback');
            }
            if(tdescription == "") {
                $("#tdescription-alert").removeAttr('class');
                $("#tdescription-alert").html('Required Field');
                $("#tdescription-alert").addClass('d-block invalid-feedback');
            }
        }
    }

    updateStrand() {
        let self = this; 
        let tname = $("#usname").val();
        let tacronym = $("#usacronym").val();
        let tdescription = $("#usdescription").val();

        if(tname != "" && tacronym != "" && tdescription != "") {
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
                        id: self.state.selectedStrand.id,
                        name: tname,
                        acronym: tacronym,
                        description: tdescription,
                        type: "strand"
                    }; 
                    console.log(datas);
                    axios.post('/programs/curricular/update',datas).then( async function (response) {
                        // handle success
                        console.log(response);
                            if( typeof(response.status) != "undefined" && response.status == "201" ) {
                                let data = typeof(response.data) != "undefined" && typeof(response.data)!="undefined"?response.data:{};
                                if(data.status ="sucess") {
                                    Swal.fire({  
                                        title: "Successfuly Update!", 
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
                                            $("#updatestrand").modal('hide');
                                            $("#usname").val('');
                                            $("#usatacronymc").val('');
                                            $("#usdescription").val(''); 
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
            if(tname == "") {
                $("#usname-alert").removeAttr('class');
                $("#usname-alert").html('Required Field');
                $("#usname-alert").addClass('d-block invalid-feedback');
            }
            if(tacronym == "") {
                $("#usacronym-alert").removeAttr('class');
                $("#usacronym-alert").html('Required Field');
                $("#usacronym-alert").addClass('d-block invalid-feedback');
            }
            if(tdescription == "") {
                $("#usdescription-alert").removeAttr('class');
                $("#usdescription-alert").html('Required Field');
                $("#usdescription-alert").addClass('d-block invalid-feedback');
            }
        }
    }

    delete(types,id) {
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
                axios.delete('/programs/curricular',{data: {id:id,type:types}}).then(function (response) {
                    // handle success
                    console.log(response);
                        if( typeof(response.status) != "undefined" && response.status == "201" ) {
                            let data = typeof(response.data) != "undefined" && typeof(response.data)!="undefined"?response.data:{};
                            if(data.status ="sucess") {

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
                    <div className="col-sm-8"><h3 className="mb-0"><i className="nav-icon bi bi-person-lines-fill"></i> Programs and Curricular (Track and Strands) </h3></div>
                    <div className="col-sm-4">
                        <ol className="breadcrumb float-sm-end">
                            <li className="breadcrumb-item"><Link href="/admin/dashboard">Dashboard</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Programs and Curricular</li>
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
                                        $("#addtrack").modal('show')
                                    }} > <i className="bi bi-person-plus-fill"></i> Add</button>    
                                </div>
                                <div className="card-body p-0"> 
                                    <ReactTable
                                        key={"react-tables"}
                                        className={"table table-bordered table-striped "}
                                        data={this.state.track_data} 
                                        columns={this.state.track_columns}
                                    />
                                </div>
                            </div>                            
                        </div>
                        <div className="col-lg-12">
                            <div className="card mb-4">
                                <div className="card-header">
                                    <h3 className="card-title"> <i className="bi bi-list-th"></i> Strand</h3> 
                                    <button className="btn btn-primary float-right mr-1" onClick={() => {
                                        $("#addstrand").modal('show')
                                    }} > <i className="bi bi-person-plus-fill"></i> Add</button>    
                                </div>
                                <div className="card-body p-0"> 
                                    <ReactTable
                                        key={"react-tables"}
                                        className={"table table-bordered table-striped "}
                                        data={this.state.strands_data} 
                                        columns={this.state.strands_columns}
                                    />
                                </div>
                            </div>                            
                        </div>
                    </div>

                </div>
            </div>
            
        </div>

        <div className="modal fade" tabIndex="-1" role="dialog" id="addtrack" aria-hidden="true" data-bs-backdrop="static">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title fs-5">New TRACK</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"> 
                    </button>
                </div>
                <div className="modal-body">
                    
                    <div className="card-body"> 
                        <div className="row g-3">                            
                            <div className="col-md-12">
                                <label htmlFor="tname" className="form-label">Name</label>
                                <input type="text" className="form-control" id="tname" defaultValue="" required="" onChange={(e) => {  }}  />
                                <div id="tname-alert" className="invalid-feedback">Please select a valid state.</div>
                            </div>
                            <div className="col-md-12">
                                <label htmlFor="tacronym" className="form-label">Acronym</label>
                                <input type="text" className="form-control"  id="tacronym" defaultValue="" required="" onChange={(e) => {  }}  />
                                <div id="tacronym-alert" className="invalid-feedback">Please select a valid state.</div>
                            </div>
                            <div className="col-md-12">
                                <label htmlFor="tdescription" className="form-label">Description</label>
                                <textarea type="text" className="form-control"  id="tdescription" defaultValue="" required="" onChange={(e) => {  }}  ></textarea>
                                <div id="tdescription-alert" className="invalid-feedback">Please select a valid state.</div>
                            </div>
                        </div> 
                    </div>

                </div>
                <div className="modal-footer"> 
                    <button className="btn btn-success float-right mr-1" onClick={() =>{ this.saveTrack() }}> <i className="bi bi-save"></i> Save</button>   
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
                </div>
            </div>
        </div>
        <div className="modal fade" tabIndex="-1" role="dialog" id="updatetrack" aria-hidden="true" data-bs-backdrop="static">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title fs-5">Update TRACK</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"> 
                    </button>
                </div>
                <div className="modal-body">
                    
                    <div className="card-body"> 
                        <div className="row g-3">                            
                            <div className="col-md-12">
                                <label htmlFor="utname" className="form-label">Name</label>
                                <input type="text" className="form-control" id="utname" defaultValue="" required="" onChange={(e) => {  }}  />
                                <div id="utname-alert" className="invalid-feedback">Please select a valid state.</div>
                            </div>
                            <div className="col-md-12">
                                <label htmlFor="utacronym" className="form-label">Acronym</label>
                                <input type="text" className="form-control"  id="utacronym" defaultValue="" required="" onChange={(e) => {  }}  />
                                <div id="utacronym-alert" className="invalid-feedback">Please select a valid state.</div>
                            </div>
                            <div className="col-md-12">
                                <label htmlFor="utdescription" className="form-label">Description</label>
                                <textarea type="text" className="form-control"  id="utdescription" defaultValue="" required="" onChange={(e) => {  }}  ></textarea>
                                <div id="utdescription-alert" className="invalid-feedback">Please select a valid state.</div>
                            </div>
                        </div> 
                    </div>

                </div>
                <div className="modal-footer"> 
                    <button className="btn btn-success float-right mr-1" onClick={() =>{ this.updateTrack() }}> <i className="bi bi-save"></i> Save</button>   
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
                </div>
            </div>
        </div>


        <div className="modal fade" tabIndex="-1" role="dialog" id="addstrand" aria-hidden="true" data-bs-backdrop="static">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title fs-5">New STRAND</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"> 
                    </button>
                </div>
                <div className="modal-body">
                    
                    <div className="card-body"> 
                        <div className="row g-3">                            
                            <div className="col-md-12">
                                <label htmlFor="sname" className="form-label">Name</label>
                                <input type="text" className="form-control" id="sname" defaultValue="" required="" onChange={(e) => {  }}  />
                                <div id="sname-alert" className="invalid-feedback">Please select a valid state.</div>
                            </div>
                            <div className="col-md-12">
                                <label htmlFor="sacronym" className="form-label">Acronym</label>
                                <input type="text" className="form-control"  id="sacronym" defaultValue="" required="" onChange={(e) => {  }}  />
                                <div id="sacronym-alert" className="invalid-feedback">Please select a valid state.</div>
                            </div>
                            <div className="col-md-12">
                                <label htmlFor="sdescription" className="form-label">Description</label>
                                <textarea type="text" className="form-control"  id="sdescription" defaultValue="" required="" onChange={(e) => {  }}  ></textarea>
                                <div id="sdescription-alert" className="invalid-feedback">Please select a valid state.</div>
                            </div>
                        </div> 
                    </div>

                </div>
                <div className="modal-footer"> 
                    <button className="btn btn-success float-right mr-1" onClick={() =>{ this.saveStrand() }}> <i className="bi bi-save"></i> Save</button>   
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
                </div>
            </div>
        </div>
        <div className="modal fade" tabIndex="-1" role="dialog" id="updatestrand" aria-hidden="true" data-bs-backdrop="static">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title fs-5">Update STRAND</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"> 
                    </button>
                </div>
                <div className="modal-body">
                    
                    <div className="card-body"> 
                        <div className="row g-3">                            
                            <div className="col-md-12">
                                <label htmlFor="usname" className="form-label">Name</label>
                                <input type="text" className="form-control" id="usname" defaultValue="" required="" onChange={(e) => {  }}  />
                                <div id="usname-alert" className="invalid-feedback">Please select a valid state.</div>
                            </div>
                            <div className="col-md-12">
                                <label htmlFor="usacronym" className="form-label">Acronym</label>
                                <input type="text" className="form-control"  id="usacronym" defaultValue="" required="" onChange={(e) => {  }}  />
                                <div id="usacronym-alert" className="invalid-feedback">Please select a valid state.</div>
                            </div>
                            <div className="col-md-12">
                                <label htmlFor="usdescription" className="form-label">Description</label>
                                <textarea type="text" className="form-control"  id="usdescription" defaultValue="" required="" onChange={(e) => {  }}  ></textarea>
                                <div id="usdescription-alert" className="invalid-feedback">Please select a valid state.</div>
                            </div>
                        </div> 
                    </div>

                </div>
                <div className="modal-footer"> 
                    <button className="btn btn-success float-right mr-1" onClick={() =>{ this.updateStrand() }}> <i className="bi bi-save"></i> Save</button>   
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
                </div>
            </div>
        </div>
    </DashboardLayout>}
}
