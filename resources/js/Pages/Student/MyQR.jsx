import React,{ Component } from "react";
import { Link } from '@inertiajs/react';
import { EachMethod } from '@/Components/EachMethod'
import swal from 'sweetalert';
import Swal from 'sweetalert2';

// import QRCode from "react-qr-code";
import ReactTable from "@/Components/ReactTable"; 

import DashboardLayout from '@/Layouts/DashboardLayout';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; 
import QRCode from 'qrcode';

export default class MyQR extends Component {
    constructor(props) {
		super(props);
        this.state = {
            qrcode: "",
            code: "",
            lrn: "",
            picture: "",
            fullname1: "",
            lastname: "",
            track_strand: "",
            grade: "",
            section: "",
            sy: "",
            guardianname:"",
            relationship: "",
            guardiancontact: "",
            address: "",
            list: []
        }
        // $('body').attr('class', '');
        this.singleId = this.singleId.bind(this);
        console.log(this.props)
    }

    componentDidMount() {
        // $("#frame1").height(window.innerHeight - 8);
        // const urlParams = new URLSearchParams(window.location.search);
        // const stamp = urlParams.get('id');
        // // console.log(stamp)
        // if(stamp!=null) {
        //     this.setState({
        //         code:stamp
        //     });
        // }
        // console.log({
        //     code: this.props.data.student.qr_code,
        //     lrn: this.props.data.student.lrn,
        //     picture: this.props.data.student.picture_base64,
        //     fullname1: this.props.data.student.first_name + " " + this.props.data.student.middle_name,
        //     lastname: this.props.data.student.last_name,
        //     track_strand: this.props.data.student.flsh_track + "-" + this.props.data.student.flsh_strand,
        //     grade: this.props.data.grade,
        //     section: this.props.data.section,
        //     sy: this.props.data.sy,
        //     guardianname: this.props.data.guardian[0].first_name + " " + this.props.data.guardian[0].middle_name + " " + this.props.data.guardian[0].last_name,
        //     relationship: this.props.data.guardian[0].relationship,
        //     guardiancontact: this.props.data.guardian[0].phone_number,
        //     address: this.props.data.guardian[0].current_address
        // })
        // console.log(this.props.data.track.find(e => e.name == this.props.data.student.flsh_track))
        try {
            let track = typeof(this.props.data.track.filter(e => e.name == this.props.data.student.flsh_track).acronyms)!="undefined"?this.props.data.track.filter(e => e.name == this.props.data.student.flsh_track).acronyms:"";
            let strand = typeof(this.props.data.strand.filter(e => e.name == this.props.data.student.flsh_strand).acronyms)!="undefined"?this.props.data.strand.filter(e => e.name == this.props.data.student.flsh_strand).acronyms:"";

            let t = (this.props.data.getSchoolStats!=null&&this.props.data.getSchoolStats.length>0)?this.props.data.getSchoolStats[0].track:"";
            let s = (this.props.data.getSchoolStats!=null&&this.props.data.getSchoolStats.length>0)?this.props.data.getSchoolStats[0].strand:"";
            
            let _track = (this.props.data.track.length>0)?this.props.data.track.find((e) => `${e.name} (${e.acronyms})` === t):"";
            let _strand = (this.props.data.strand.length>0)?this.props.data.strand.find((e) => `${e.name} (${e.acronyms})` === s):""; 

            this.setState({
                code: this.props.data.student.qr_code,
                lrn: this.props.data.student.lrn,
                picture: this.props.data.student.picture_base64,
                fullname1: this.props.data.student.first_name + " " + this.props.data.student.middle_name,
                lastname: this.props.data.student.last_name,
                track_strand: track + "-" + strand,
                // grade: this.props.data.grade,
                // section: this.props.data.section,
                guardianname: this.props.data.guardian[0].first_name + " " + this.props.data.guardian[0].middle_name + " " + this.props.data.guardian[0].last_name,
                relationship: this.props.data.guardian[0].relationship,
                guardiancontact: this.props.data.guardian[0].phone_number,
                address: this.props.data.guardian[0].current_address,
                grade: (this.props.data.getSchoolStats!=null&&this.props.data.getSchoolStats.length>0)?this.props.data.getSchoolStats[0].grade:"",
                level: (this.props.data.getSchoolStats!=null&&this.props.data.getSchoolStats.length>0)?this.props.data.getSchoolStats[0].grade_level:"",
                section: (this.props.data.getSchoolStats!=null&&this.props.data.getSchoolStats.length>0)?this.props.data.getSchoolStats[0].section:"",
                _track:  typeof(_track)!="undefined"&&_track!=null?_track.acronyms:"",
                _strand: typeof(_strand)!="undefined"&&_strand!=null?_strand.acronyms:"",
                sy: (this.props.data.getSchoolStats!=null&&this.props.data.getSchoolStats.length>0)?this.props.data.getSchoolStats[0].sy:"",
            },() => {
                this.singleId();
            });            
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: "Cannot continue because info is not completed", 
                showCancelButton: true,
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                confirmButtonText: "Download", 
                cancelButtonText: "Close",
                icon: "error",
                showLoaderOnConfirm: false, 
                closeOnClickOutside: false,  
                dangerMode: true,
            }).then((result) => { 
                // if(result.isConfirmed) {
                    // window.close();
                // }
            });
        }


        // let list = [];
        // let i = 0;
        // let lo = setInterval(() => {
        //     let tem = {
        //         code: this.props.data.qr_code,
        //         lrn: this.props.data.lrn,
        //         picture: this.props.data.picture_base64,
        //         fullname1: this.props.data.first_name + " " + this.props.data.middle_name,
        //         lastname: this.props.data.last_name,
        //         track_strand: "ACAD-STEM",
        //         grade: "10",
        //         section: "MOLAVE",
        //         sy: "2025-2026",
        //         guardianname:"José Protacio Rizal",
        //         relationship: "Mother",
        //         guardiancontact: "09758955082",
        //         address: "B-10 L-16 SOUTHVILLA HEIGHTS 2 CATALUNAN GRANDE DAVAO CITY"
        //     }
        //     list.push(tem);

        //     if(list.length == 10) {
        //         clearInterval(lo);
        //         this.setState({
        //             list: tem
        //         },() => {
        //             this.multipleId();
        //         });

        //     }
        // }, 1000);
    }
    
    async singleId() {
        try {
            let self = this;
            let sgv = "";
            // const doc = new jsPDF({});
            // // const width = doc.getPageWidth();
            // const width = 210.1;         
            // doc.addImage("/images/id/front.png", "PNG", 5, 5, 81, 130);
            // doc.addImage("/images/id/back.png", "PNG", 87, 5, 81, 130);
            // if(this.state.picture != "") {
            //     doc.addImage(this.state.picture, "PNG", 9, 30, 38, 36);
            // }
            const generateQR = async text => {
                try {
                    sgv = await QRCode.toDataURL(text, { errorCorrectionLevel: 'H' ,width: 500 });
                    self.setState({ qrcode: sgv})
                    // console.log(sgv)
                    // doc.addSvgAsImage( sgv , 87, 5, 20, 20);
                    // doc.addImage(sgv, 8, 74, 30, 27);
                } catch (err) {
                console.error(err)
                }
            }
            await generateQR(this.state.lrn);
        } catch (error) {
            console.log(error)
            Swal.fire({
                title: "Cannot continue because info is not completed", 
                showCancelButton: true,
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                confirmButtonText: "Download", 
                cancelButtonText: "Close",
                icon: "error",
                showLoaderOnConfirm: false, 
                closeOnClickOutside: false,  
                dangerMode: true,
            }).then((result) => { 
                // if(result.isConfirmed) {
                    
                // }
                // window.close();
            });
        }
    }

    browser_check_preview(){ // check para disable ang preview
		let isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

		// Firefox 1.0+
		let isFirefox = typeof InstallTrigger !== 'undefined';

		// Safari 3.0+ "[object HTMLElementConstructor]" 
		let isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

		// Internet Explorer 6-11
		let isIE = /*@cc_on!@*/false || !!document.documentMode;

		// Edge 20+
		let isEdge = !isIE && !!window.StyleMedia;

		// Chrome 1 - 71
		let isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

		// Blink engine detection
		let isBlink = (isChrome || isOpera) && !!window.CSS;
		if(isOpera){
			return 0;
		} else if(isFirefox){			
			return 1;
		} else if(isSafari){			
			return 1;
		} else if(isIE){			
			return 0;
		} else if(isEdge){			
			return 0;
		} else if(isChrome){			
			return 0;
		} else if(isBlink){			
			return 0;
		} else {
			return 0;
		}
	}
    
    render() {
        return <DashboardLayout title="ID" user={this.props.auth.user} profile={this.props.auth.profile}><div className="noselect">  
            <div className="my-qr-code ">
                <div className="my-qr-code-content">
                    <div className="center">
                        <strong>
                        {this.state.fullname1.toLocaleUpperCase()}
                        </strong>
                    </div>
                    <img src={this.state.qrcode}  className="mx-auto" /> 
                </div>
            </div>
    </div></DashboardLayout>}
}
