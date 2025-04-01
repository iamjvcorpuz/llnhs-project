import React,{ Component } from "react";
import { Head } from '@inertiajs/react';
// import { EachMethod } from '@/Components/EachMethod'
import swal from 'sweetalert';
import Swal from 'sweetalert2';
import ApexCharts from 'apexcharts'

// import DashboardLayout from '@/Layouts/DashboardLayout';
import DashboardLayout from '../../Layouts/DashboardLayout';

export default class Dashboard extends Component {
    constructor(props) {
		super(props);
        this.state = {
            subjects: this.props.subjects,
            teachers: this.props.teacher,
            advisoryList: this.props.advisory,    
            student: this.props.student,
            todayAttendance: [],
            sections: this.props.sections
        }
        // console.log(this.props);
        if(this.props.auth.user.user_type!="Guardian") {
            if(this.props.auth.user.user_type == "Admin") {
                window.location.href = "/admin/dashboard";
            } else if(this.props.auth.user.user_type == "Teacher") {
                window.location.href = "/teacher/dashboard";
            } else if(this.props.auth.user.user_type == "Student") {
                window.location.href = "/student/dashboard";
            } 
            // else if(this.props.auth.user.user_type == "Guardian") {
            //     window.location.href = "/teacher/dashboard";
            // }
        }
    }

    componentDidMount() {
        const sales_chart_options = {
            series: [
              {
                name: 'Beign Present',
                data: [0],
              },
              {
                name: 'Beign Absent',
                data: [0],
              },
            ],
            chart: {
              height: 300,
              type: 'area',
              toolbar: {
                show: false,
              },
            },
            legend: {
              show: false,
            },
            colors: ['#0d6efd', '#20c997'],
            dataLabels: {
              enabled: false,
            },
            stroke: {
              curve: 'smooth',
            },
            xaxis: {
              type: 'datetime',
              categories: [
                '2023-01-01',
                '2023-02-01',
                '2023-03-01',
                '2023-04-01',
                '2023-05-01',
                '2023-06-01',
                '2023-07-01',
              ],
            },
            tooltip: {
              x: {
                format: 'MMMM yyyy',
              },
            },
          };
    
          const sales_chart = new ApexCharts(
            document.querySelector('#revenue-chart'),
            sales_chart_options,
          );
          sales_chart.render();
    }

    render() {
        return <DashboardLayout title="Dashboard" user={this.props.auth.user}>
            <div className="app-content-header"> 
                <div className="container-fluid"> 
                    <div className="row">
                    <div className="col-sm-6"><h3 className="mb-0"><i className="nav-icon bi bi-speedometer"></i> Dashboard</h3></div>
                    <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-end">
                        <li className="breadcrumb-item"><a href="#">Home</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Dashboard</li>
                        </ol>
                    </div>
                    </div> 
                </div> 
            </div>
            <div className="app-content">
                <div className="container-fluid">

                    <div className="row">


                        <div className="col-lg-3 col-6"> 
                            <div className="small-box text-bg-primary">
                                <div className="inner">
                                    <h3>{this.state.todayAttendance.length}</h3>
                                    <p>Today Attendance</p>
                                </div>
                                <svg 
                                    className="small-box-icon"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"> 

                                        <g id="SVGRepo_iconCarrier"> <path d="M3 9H21M7 3V5M17 3V5M6 12H8M11 12H13M16 12H18M6 15H8M11 15H13M16 15H18M6 18H8M11 18H13M16 18H18M6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z" stroke="#000000" strokeWidth="2" strokeLinecap="round"/> </g>

                                </svg>
                            </div> 
                        </div>

                        <div className="col-lg-3 col-6"> 
                            <div className="small-box text-bg-primary">
                            <div className="inner">
                                <h3>{this.state.student.length}</h3>
                                <p>My Students</p>
                            </div>
                            <svg
                                className="small-box-icon"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                            >
                            <path   d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z"></path>
                            </svg> 
                            </div> 
                        </div>

                    </div>
                    
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card mb-4">
                                <div className="card-header"><h3 className="card-title">Attendance Chart</h3></div>
                                <div className="card-body"><div id="revenue-chart"></div></div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </DashboardLayout>
    }
}