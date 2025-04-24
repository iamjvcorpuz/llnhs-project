import React,{ Component } from "react";
import { Head } from '@inertiajs/react';
import { EachMethod } from '@/Components/EachMethod'
import swal from 'sweetalert';
import Swal from 'sweetalert2';
import ApexCharts from 'apexcharts'

// import DashboardLayout from '@/Layouts/DashboardLayout';
import DashboardLayout from '../../Layouts/DashboardLayout';

export default class Dashboard extends Component {
    constructor(props) {
		super(props);
        this.state = {
          data: [{
            id: 1
          },{
            id: 1
          },{
            id: 1
          }]
        }
        // console.log(this.props);
        if(this.props.auth.user.user_type!="Guardian") {
            if(this.props.auth.user.user_type == "Admin") {
                window.location.href = "/admin/dashboard";
            } else if(this.props.auth.user.user_type == "Teacher") {
                window.location.href = "/teacher/dashboard";
            } else if(this.props.auth.user.user_type == "Student") {
                // window.location.href = "/student/dashboard";
            }  
        }
    }

    componentDidMount() {

    }

    render() {
        return <DashboardLayout title="Bulletin" user={this.props.auth.user} profile={this.props.auth.profile}>
            <div className="app-content-header"> 
                <div className="container-fluid"> 
                    <div className="row">
                    <div className="col-sm-6"><h3 className="mb-0"><i className="nav-icon bi bi-list-columns"></i> Bulletin</h3></div>
                    <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-end">
                        <li className="breadcrumb-item"><a href="#">Home</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Bulletin</li>
                        </ol>
                    </div>
                    </div> 
                </div> 
            </div>
            <div className="app-content">
                <div className="container-fluid"> 
                    
                    <div className="col-lg-12">
                      <EachMethod  of={(this.state.data.length>0)?this.state.data:[]} render={(element,index) => {
                        return <div className="col-lg-6 mb-2 mx-auto">
                          <div className="card p-2">

                            <div className="post">
                              <div className="user-block">
                                <img className="img-circle img-bordered-sm" src="/adminlte/dist/assets/img/avatar.png" alt="user image" />
                                <span className="username">
                                  <a href="#">Jonathan Burke Jr.</a>
                                  <a href="#" className="float-right btn-tool"><i className="fas fa-times"></i></a>
                                </span>
                                <span className="description">Shared publicly - 7:30 PM today</span>
                              </div> 
                              <p>
                                Lorem ipsum represents a long-held tradition for designers,
                                typographers and the like. Some people hate it and argue for
                                its demise, but others ignore the hate as they create awesome
                                tools to help create filler text for everyone from bacon lovers
                                to Charlie Sheen fans.
                              </p>

                              <p>
                                <a href="#" className="link-black text-sm mr-2"><i className="fas fa-share mr-1"></i> Share</a>
                                <a href="#" className="link-black text-sm"><i className="far fa-thumbs-up mr-1"></i> Like</a>
                                <span className="float-right">
                                  <a href="#" className="link-black text-sm">
                                    <i className="far fa-comments mr-1"></i> Comments (5)
                                  </a>
                                </span>
                              </p>

                              <input className="form-control form-control-sm" type="text" placeholder="Type a comment" />
                            </div>
                            
                          </div>
                        </div>
                      }} />
                    </div>

                </div>
            </div>
        </DashboardLayout>
    }
}