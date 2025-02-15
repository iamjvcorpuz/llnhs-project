import React,{ Component } from "react";
import { Head, Link } from '@inertiajs/react';
import { EachMethod } from '@/Components/EachMethod';
import swal from 'sweetalert';
import Swal from 'sweetalert2';

import ReactTable from "@/Components/ReactTable"; 

import DashboardLayout from '@/Layouts/DashboardLayout';


export default class Teacher extends Component {
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
                    Cell: ({row}) => { 
                       return <img className="" height={150} width={150}  onError={(e)=>{ 
                        e.target.src=(row.original.sex=="Male")?'/adminlte/dist/assets/img/avatar.png':'/adminlte/dist/assets/img/avatar-f.jpeg'; 
                   }} alt="Picture Error" src={row.original.photo} />          
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
            ]            
        }

        this._isMounted = false;
        this.loadStudentList = this.loadStudentList.bind(this);
    }
    componentDidMount() {
        this._isMounted = true;
        this.loadStudentList();
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
        this.loadStudentList();
    }

    loadStudentList() {
        let list  = []; 
        let self = this;
        axios.get('/teacher').then(function (response) {
          // handle success
          console.log(response)
            if( typeof(response.status) != "undefined" && response.status == "200" ) {
                let data = typeof(response.data) != "undefined" && typeof(response.data.data)!="undefined"?response.data.data:[];
                data.forEach((element,index,arr) => {
                        list.push({
                            no: index + 1,
                            photo: element.picture_base64,
                            lrn: element.lrn,
                            fullname: `${element.last_name}, ${element.first_name} ${(element.extension_name!=null)?element.extension_name:''} ${element.middle_name}`.toLocaleUpperCase(),
                            level: "None",
                            section: "None",
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

    render() {
        return <DashboardLayout title="Teacher" >
            <div className="app-content-header"> 
                <div className="container-fluid"> 
                    <div className="row">
                    <div className="col-sm-6"><h3 className="mb-0"><i className="nav-icon bi bi-person-lines-fill"></i> Teacher</h3></div>
                    <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-end">
                            <li className="breadcrumb-item"><Link href="/admin/dashboard">Dashboard</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Teacher</li>
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
                                    <h3 className="card-title"> <i className="bi bi-person"></i> Teacher List</h3> 
                                    <Link className="btn btn-primary float-right mr-1" href="/admin/dashboard/teacher/new" > <i className="bi bi-person-plus-fill"></i> Add</Link>    
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