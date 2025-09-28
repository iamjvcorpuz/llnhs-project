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

export default class PrintID extends Component {
    constructor(props) {
		super(props);
        this.state = {
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
            list: [],
            vurl: ""
        }
        $('body').attr('class', '');
        this.singleId = this.singleId.bind(this);
        console.log(this.props);
    }

    componentDidMount() {
        $("#frame1").height(0);
        Swal.fire({
            title: "Generating ID. Please wait.", 
            showCancelButton: false,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonText: "Download", 
            cancelButtonText: "Close",
            icon: "info",
            showLoaderOnConfirm: false, 
            closeOnClickOutside: false,  
            dangerMode: true,
            didOpen: () => {
                Swal.showLoading();
            }
        });
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
            let track_ = this.props.data.track.find(e => e.name == this.props.data.student.flsh_track);
            let strand_ = this.props.data.strand.find(e => e.name == this.props.data.student.flsh_strand);
            let track = typeof(track_)!="undefined"?track_.acronyms:"";
            let strand = typeof(strand_)!="undefined"?strand_.acronyms:"";

            let t = (this.props.data.getSchoolStats!=null&&this.props.data.getSchoolStats.length>0)?this.props.data.getSchoolStats[0].track:"";
            let s = (this.props.data.getSchoolStats!=null&&this.props.data.getSchoolStats.length>0)?this.props.data.getSchoolStats[0].strand:"";
            
            let _track = (this.props.data.track.length>0)?this.props.data.track.find((e) => `${e.name} (${e.acronyms})` === t):"";
            let _strand = (this.props.data.strand.length>0)?this.props.data.strand.find((e) => `${e.name} (${e.acronyms})` === s):""; 

            this.setState({
                vurl: this.props.data.secret,
                code: this.props.data.student.qr_code,
                lrn: this.props.data.student.lrn,
                picture: this.props.data.student.picture_base64,
                fullname1: this.props.data.student.first_name + " " + this.props.data.student.middle_name,
                lastname: this.props.data.student.last_name,
                track_strand: (track!=""||track!="")?track + "-" + strand:"",
                // grade: this.props.data.grade,
                // section: this.props.data.section,
                // sy: this.props.data.sy,
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
                    window.close();
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
            const doc = new jsPDF({});
            // const width = doc.getPageWidth();
            const width = 210.1;         
            // doc.addImage("/images/id/front.png", "PNG", 5, 5, 81, 130);
            // doc.addImage("/images/id/back.png", "PNG", 87, 5, 81, 130);

            doc.addImage("/images/id/front.png", "PNG", 5, 10, 54, 88);
            doc.addImage("/images/id/back.png", "PNG", 60, 10, 54, 88);
            
            if(this.state.picture != "") {
                doc.addImage(this.state.picture, "PNG", 7.5, 26.5, 26, 25);
            }
            const generateQR = async text => {
                try {
                    sgv = await QRCode.toDataURL(text, { errorCorrectionLevel: 'H',margin: 1 });
                    // console.log(sgv)
                    // doc.addSvgAsImage( sgv , 87, 5, 20, 20);
                    doc.addImage(sgv, 7.7, 57, 18, 18);
                } catch (err) {
                console.error(err)
                }
            }
            const generateQRV = async text => {
                try {
                    sgv = await QRCode.toDataURL(text, { errorCorrectionLevel: 'H',margin: 1 });
                    // console.log(sgv)
                    // doc.addSvgAsImage( sgv , 87, 5, 20, 20);
                    doc.addImage(sgv, 95, 79, 18, 18);
                } catch (err) {
                console.error(err)
                }
            }
            await generateQR(this.state.lrn);
            await generateQRV(this.state.vurl);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(11);
            doc.text(this.state.lrn.toLocaleUpperCase(), 17, 55,{align:'left',color: "white"});
            doc.setFont("helvetica", "normal");
            doc.setFontSize(11);
            if(this.state.fullname1.length >= 11) {
                doc.setFontSize(8);
            }
            doc.text(this.state.fullname1.toLocaleUpperCase(), 28, 60,{align:'left',maxWidth: 50});
            doc.setFont("helvetica", "bold"); 
            doc.setFontSize(15);

            let fname_y = 66;// 89 nextline 83 ang defaul
            if(this.state.fullname1.length >= 18) {
                fname_y = 70;
            }
            // max 14 for the size of 15
            if(this.state.lastname.length >= 9) {
                doc.setFontSize(10);
                fname_y = 64;
            }
            if(this.state.lastname.length >= 13) {
                doc.setFontSize(7); 
            }
            doc.text(this.state.lastname.toLocaleUpperCase() , 28, fname_y,{align:'left',maxWidth: 50});
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.text(this.state.track_strand.toLocaleUpperCase(), 28, 73,{align:'left',maxWidth: 50});

            doc.setFont("helvetica", "bold");
            doc.setFontSize(7);
            doc.text(this.state.grade.toLocaleUpperCase() + "-" + this.state.section.toLocaleUpperCase(), 76, 30,{align:'center',maxWidth: 45});
            doc.text(this.state.sy.toLocaleUpperCase(), 94, 30,{align:'left',maxWidth: 50});

            doc.setTextColor(9,72,164);
            doc.setFontSize(11);
            doc.text(this.state.level.toLocaleUpperCase() , 28.5, 89.7,{align:'right',maxWidth: 50});
            doc.setTextColor(255, 255, 255);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.text(this.state.guardianname.toLocaleUpperCase(), 63, 43.5,{align:'left',maxWidth: 80});
            doc.text(this.state.relationship.toLocaleUpperCase(), 63, 46,{align:'left',maxWidth: 50});
            doc.text(this.state.guardiancontact.toLocaleUpperCase(), 63, 49,{align:'left',maxWidth: 70}); 
            if(this.state.address.length > 13) {
                doc.setFontSize(6); 
            }
            doc.text(this.state.address.toLocaleUpperCase(), 63, 52,{align:'left',maxWidth: 55});

            // $("#obj1").height(window.innerHeight - 8);
            $("#frame1").height(window.innerHeight - 8);
            // $('#frame1').attr('src',doc.output("datauristring") + '#view=Fit&toolbar=0'); 
            // console.log(doc.output().length >= 1000000,doc.output().length)
            setTimeout(() => {
                Swal.close();
                // if(!self.browser_check_preview() && doc.output().length >= 1000000){
                //     // alert('For Browser data limitation. This will save automaticaly.');
                //     Swal.fire({
                //         title: "For Browser data limitation. This will save automaticaly.", 
                //         showCancelButton: true,
                //         allowOutsideClick: false,
                //         allowEscapeKey: false,
                //         confirmButtonText: "Download", 
                //         icon: "warning",
                //         showLoaderOnConfirm: true, 
                //         closeOnClickOutside: false,  
                //         dangerMode: true,
                //     }).then((result) => { 
                //         if(result.isConfirmed) {
                //             doc.save(self.state.lastname +',' + self.state.fullname1 + '.pdf');
                //             setTimeout(() => {
                //                 window.close();
                //             }, 10000);
                //         } else {
                //             window.close();
                //         }
                //     });
                // } else { 
                //     // $('#obj1').attr('data',doc.output("datauristring"));
                    $('#frame1').attr('src',doc.output("bloburl"));  
                // }
            }, 1000);

                
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
                // console.log(result)
                // if(result.isConfirmed) {
                    
                // }
                window.close();
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

    async multipleId() {
        let sgv = "";
        const doc = new jsPDF({});
        // const width = doc.getPageWidth();
        const width = 210.1;         
        doc.addImage("/images/id/front.png", "PNG", 5, 5, 81, 130);
        doc.addImage("/images/id/back.png", "PNG", 87, 5, 81, 130);
        doc.addImage(this.state.picture, "PNG", 9, 30, 38, 36);
        const generateQR = async text => {
            try {
                sgv = await QRCode.toDataURL(text, { errorCorrectionLevel: 'H' });
                console.log(sgv)
                // doc.addSvgAsImage( sgv , 87, 5, 20, 20);
                doc.addImage(sgv, 8, 74, 30, 27);
            } catch (err) {
              console.error(err)
            }
        }
        this.state.list.forEach(element => {
            
        });
        await generateQR(this.state.lrn);

        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255);
        doc.text(this.state.lrn.toLocaleUpperCase(), 22, 72,{align:'left',color: "white"});
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text(this.state.fullname1.toLocaleUpperCase(), 39, 78,{align:'left',maxWidth: 50});
        doc.setFont("helvetica", "bold"); 
        doc.setFontSize(15);

        let fname_y = 83;// 89 nextline 83 ang defaul
        if(this.state.fullname1.length >= 18) {
            fname_y = 89;
        }
        // max 14 for the size of 15
        if(this.state.lastname.length < 14) {
            doc.setFontSize(20);
            fname_y = 85;
        }
        doc.text(this.state.lastname.toLocaleUpperCase() , 39, fname_y,{align:'left',maxWidth: 50});
        doc.setFont("helvetica", "normal");
        doc.setFontSize(15);
        doc.text(this.state.track_strand.toLocaleUpperCase(), 39, 96,{align:'left',maxWidth: 50});

        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text(this.state.grade.toLocaleUpperCase() + "-" + this.state.section.toLocaleUpperCase(), 109, 34,{align:'center',maxWidth: 45});
        doc.text(this.state.sy.toLocaleUpperCase(), 139, 34,{align:'left',maxWidth: 50});

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(this.state.guardianname.toLocaleUpperCase(), 90, 56,{align:'left',maxWidth: 80});
        doc.text(this.state.relationship.toLocaleUpperCase(), 90, 60,{align:'left',maxWidth: 50});
        doc.text(this.state.guardiancontact.toLocaleUpperCase(), 90, 64,{align:'left',maxWidth: 70});
        doc.text(this.state.address.toLocaleUpperCase(), 90, 68,{align:'left',maxWidth: 79});

        // $('#obj1').attr('data',doc.output("datauristring"));
        $('#frame1').attr('src',doc.output("bloburl")); 
        // $('#frame1').attr('src',doc.output("datauristring") + '#view=Fit&toolbar=0'); 

    }
    
    render() {
        return <div className="" >
        {/* <object
            id="obj1"
            type="application/pdf"
            width="100%"
            height="100">
        </object> */}
            <iframe
                id="frame1"
                src="#view=FitH&toolbar=0"
                width="100%"
                height="100%"
            ></iframe>
    </div>}
}
