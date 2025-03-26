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
        console.log(this.props)
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


                        <div className="col-lg-3 col-6"> 
                            <div className="small-box text-bg-primary">
                            <div className="inner">
                                <h3>{this.state.sections.length}</h3>
                                <p>My Sections</p>
                            </div>
                            <svg
                                className="small-box-icon"
                                fill="currentColor"
                                viewBox="0 0 554 554"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                            >
                               <g>
                                    <g>
                                        <path d="M467.309,16.768H221.454c-6.128,0-11.095,4.967-11.095,11.095v86.451l12.305-7.64c3.131-1.945,6.475-3.257,9.884-3.978
                                            V38.958h223.665v160.016H232.549v-25.89l-22.19,13.778v23.208c0,6.128,4.967,11.095,11.095,11.095h245.855
                                            c6.127,0,11.095-4.967,11.095-11.095V27.863C478.404,21.735,473.436,16.768,467.309,16.768z"/>
                                    </g>
                                </g>
                                <g>
                                    <g>
                                        <path d="M306.001,78.356c-2.919-3.702-8.285-4.335-11.986-1.418l-38.217,30.133c3.649,2.385,6.85,5.58,9.301,9.527
                                            c0.695,1.117,1.298,2.266,1.834,3.431l37.651-29.687C308.286,87.424,308.92,82.057,306.001,78.356z"/>
                                    </g>
                                </g>
                                <g>
                                    <g>
                                        <circle cx="121.535" cy="31.935" r="31.935"/>
                                    </g>
                                </g>
                                <g>
                                    <g>
                                        <path d="M252.01,124.728c-4.489-7.229-13.987-9.451-21.218-4.963l-31.206,19.375c-0.13-25.879-0.061-12.145-0.144-28.811
                                            c-0.101-20.005-16.458-36.281-36.464-36.281h-15.159c-12.951,33.588-8.779,21.12-19.772,49.63l4.623-20.131
                                            c0.32-1.508,0.088-3.08-0.655-4.43l-6.264-11.393l5.559-10.109c0.829-1.508-0.264-3.356-1.985-3.356h-15.271
                                            c-1.72,0-2.815,1.848-1.985,3.356l5.57,10.13l-6.276,11.414c-0.728,1.325-0.966,2.865-0.672,4.347l4.005,20.172
                                            c-2.159-5.599-17.084-44.306-19.137-49.63H80.093c-20.005,0-36.363,16.275-36.464,36.281l-0.569,113.2
                                            c-0.042,8.51,6.821,15.443,15.331,15.486c0.027,0,0.052,0,0.079,0c8.473,0,15.364-6.848,15.406-15.331l0.569-113.2
                                            c0-0.018,0-0.036,0-0.053c0.024-1.68,1.399-3.026,3.079-3.013c1.68,0.012,3.034,1.378,3.034,3.058l0.007,160.381
                                            c14.106-0.6,27.176,4.488,36.981,13.423v-62.568h7.983v71.773c5.623,8.268,8.914,18.243,8.914,28.974
                                            c0,9.777-2.732,18.928-7.469,26.731c4.866,0.023,9.592,0.669,14.099,1.861c6.076-5.271,13.385-9.151,21.437-11.136
                                            c0-279.342-0.335-106.627-0.335-229.418c0-1.779,1.439-3.221,3.218-3.224c1.779-0.004,3.224,1.432,3.232,3.211
                                            c0.054,10.807,0.224,44.59,0.283,56.351c0.028,5.579,3.07,10.708,7.953,13.407c4.874,2.694,10.835,2.554,15.583-0.394
                                            l54.604-33.903C254.276,141.458,256.499,131.957,252.01,124.728z"/>
                                    </g>
                                </g>
                                <g>
                                    <g>
                                        <circle cx="429.221" cy="322.831" r="33.803"/>
                                    </g>
                                </g>
                                <g>
                                    <g>
                                        <path d="M511.459,405.811c-0.107-21.176-17.421-38.404-38.598-38.404c-9.137,0-76.583,0-84.781,0
                                            c3.637,7.068,5.704,15.069,5.704,23.55c0,9.005-2.405,18.413-7.5,26.782c18.904,0.764,35.468,10.91,45.149,25.897h40.579v-37.43
                                            c0-1.842,1.46-3.352,3.301-3.415s3.402,1.345,3.526,3.182c0,0,0,0.001,0,0.002l0.19,37.661h32.621L511.459,405.811z"/>
                                    </g>
                                </g>
                                <g>
                                    <g>
                                        <path d="M290.469,390.956c0-8.629,2.138-16.763,5.894-23.92c-22.009,0-47.852,0-75.267,0c3.472,6.939,5.437,14.756,5.437,23.029
                                            c0,9.721-2.73,18.926-7.469,26.731c15.558,0.074,29.912,6.538,40.283,17.267c10.054-9.822,23.759-15.914,38.836-15.995
                                            C292.948,409.616,290.469,400.126,290.469,390.956z"/>
                                    </g>
                                </g>
                                <g>
                                    <g>
                                        <path d="M264.819,288.655c-18.668,0-33.804,15.132-33.804,33.803c0,18.628,15.107,33.803,33.804,33.803
                                            c18.518,0,33.803-14.965,33.803-33.803C298.622,303.808,283.517,288.655,264.819,288.655z"/>
                                    </g>
                                </g>
                                <g>
                                    <g>
                                        <path d="M123.217,390.065c0-8.252,1.956-16.053,5.411-22.98c-1.457-0.072,4.672-0.049-89.485-0.049
                                            c-21.068,0-38.491,17.138-38.598,38.404l-0.192,38.196c14.907,0,17.906,0,32.621,0l0.191-38.031
                                            c0.01-1.884,1.541-3.402,3.423-3.397c1.882,0.006,3.404,1.532,3.404,3.414v38.014h45.727c9.855-15.754,26.8-25.646,45.243-26.406
                                            C125.956,409.168,123.217,399.865,123.217,390.065z"/>
                                    </g>
                                </g>
                                <g>
                                    <g>
                                        <path d="M82.786,288.655c-18.668,0-33.803,15.134-33.803,33.803c0,18.584,15.046,33.803,33.803,33.803
                                            c18.536,0,33.804-15.015,33.804-33.803C116.59,303.788,101.455,288.655,82.786,288.655z"/>
                                    </g>
                                </g>
                                <g>
                                    <g>
                                        <path d="M422.533,473.807c-0.105-21.178-17.42-38.406-38.597-38.406c-2.246,0-82.969,0-85.507,0
                                            c-21.176,0-39.601,17.227-39.708,38.404l-0.275-0.891c-0.105-21.092-17.341-38.404-38.597-38.404c-24.544,0-59.795,0-85.507,0
                                            c-21.176,0-39.601,17.227-39.708,38.404L94.442,512h32.621l0.191-38.922c0.008-1.622,1.327-2.93,2.948-2.926
                                            c1.621,0.004,2.932,1.32,2.932,2.941v38.908c19.121,0,68.483,0,86.392,0v-38.908c0-1.736,1.405-3.144,3.141-3.149
                                            c1.735-0.004,3.149,1.397,3.158,3.133l0.191,38.923c6.669,0,58.238,0,65.134,0l0.191-38.031c0,0,0-0.001,0-0.002
                                            c0.009-1.621,1.328-2.928,2.949-2.924c1.621,0.004,2.931,1.32,2.931,2.941v38.016c19.121,0,68.483,0,86.392,0v-38.016
                                            c0-1.736,1.405-3.144,3.141-3.149c1.735-0.004,3.149,1.397,3.158,3.133l0.191,38.031h32.621L422.533,473.807z"/>
                                    </g>
                                </g>
                                <g>
                                    <g>
                                        <circle cx="175.934" cy="389.933" r="34.198"/>
                                    </g>
                                </g>
                                <g>
                                    <g>
                                        <circle cx="342.07" cy="390.821" r="34.198"/>
                                    </g>
                                </g>
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