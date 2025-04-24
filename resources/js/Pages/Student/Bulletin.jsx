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

                            <div class="post">
                              <div class="user-block">
                                <img class="img-circle img-bordered-sm" src="/adminlte/dist/assets/img/avatar.png" alt="user image" />
                                <span class="username">
                                  <a href="#">Jonathan Burke Jr.</a>
                                  <a href="#" class="float-right btn-tool"><i class="fas fa-times"></i></a>
                                </span>
                                <span class="description">Shared publicly - 7:30 PM today</span>
                              </div> 
                              <p>
                                Lorem ipsum represents a long-held tradition for designers,
                                typographers and the like. Some people hate it and argue for
                                its demise, but others ignore the hate as they create awesome
                                tools to help create filler text for everyone from bacon lovers
                                to Charlie Sheen fans.
                              </p>

                              <p>
                                <a href="#" class="link-black text-sm mr-2"><i class="fas fa-share mr-1"></i> Share</a>
                                <a href="#" class="link-black text-sm"><i class="far fa-thumbs-up mr-1"></i> Like</a>
                                <span class="float-right">
                                  <a href="#" class="link-black text-sm">
                                    <i class="far fa-comments mr-1"></i> Comments (5)
                                  </a>
                                </span>
                              </p>

                              <input class="form-control form-control-sm" type="text" placeholder="Type a comment" />
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