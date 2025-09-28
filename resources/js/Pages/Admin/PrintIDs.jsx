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

export default class PrintIDs extends Component {
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
            student_list: this.props.data.student,
            guardian: this.props.data.guardian,
            strand: this.props.data.strand,
            track: this.props.data.track,
            noPhotoList: [],
            noGuardianList: [],
            selected: [],
            ready: false
        }
        $('body').attr('class', '');
        this.multiple = this.multiple.bind(this);
        this.generateQRCODES = this.generateQRCODES.bind(this);
        console.log(this.props)
    }

    componentDidMount() {
        let self = this;
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
        const urlParams = new URLSearchParams(window.location.search);
        const page = urlParams.get('selected'); 
        this.setState({
            selected: (typeof(page)!="undefined"&&page!=null&&page!="")?page.split(","):[]
        },() => { 
            if(self.state.selected.length>0) {
                let temp = [];
                self.props.data.student.forEach((element,i,arr) => {
                    if(self.state.selected.includes(element.lrn)) {
                        temp.push(element);
                    }
                    if((i+1) == arr.length) { 
                        self.setState({
                            student_list: temp
                        });
                    }
                });
            }
        });
        setTimeout( async () => {
            this.generateQRCODES(() => {
                this.multiple();
            });
        }, 2000);
    }
    
    generateQRCODES(callback) {
        let student_list = [];
        let noGuardianList = [];
        let self = this;
        const generateQR = async (text,callback_) => {
            try {
                callback_(await QRCode.toDataURL(text, { errorCorrectionLevel: 'H',margin: 1  }));                
            } catch (err) {
                console.error(err);
                callback_("");
            }
        }
        const generateQRV = async (text,callback_)  => {
            try {
                callback_(await QRCode.toDataURL(text, { errorCorrectionLevel: 'H',margin: 1 }));
            } catch (err) {
                callback_("");
            }
        }
        const loadImageURL = async (url,callback_) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous'; // Important for cross-origin images
            img.src = url;

            img.onload = function() {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                const imageData = canvas.toDataURL('image/png'); // or 'image/jpeg'
                callback_(imageData)
            };
        
            img.onerror = function() {
                callback_("")
            };

        }

        this.state.student_list.forEach(async(val,i,arr) => {
            let fullname1 = val.first_name + " " + val.middle_name;
            let guardian_data = self.state.guardian.find(e=>e.student_id==val.student_id);
            if(typeof(guardian_data)!="undefined") {
                await loadImageURL(`/profile/photo/student/${val.lrn}`,async (eee) => {
                    await generateQR(val.lrn, async (e) => {
                        await generateQRV(this.state.vurl + "/" + val.uuid,async (ee) => {
                            student_list.push({...val,gen_qr: e,vurl: ee,picture: eee});
                            if((i + 1) == arr.length) {
                                self.setState({student_list: student_list,noGuardianList:noGuardianList},() => {
                                    callback();
                                });
                            }
                        });
                    });
                });                
            } else {
                noGuardianList.push({sname: fullname1, id: val.student_id});
                if((i + 1) == arr.length) {
                    self.setState({student_list: student_list,noGuardianList:noGuardianList},() => {
                        callback();
                    });
                }
            }

        });

    }
    
    async multiple() {
        try {
            let self = this;
            let sgv = "";
            const doc = new jsPDF({orientation:"landscape"});
            // const width = doc.getPageWidth(); 
            // let height = 20;
            // let width = 20;
            // // 1 row id 1
            // doc.addImage("/images/id/front.png", "PNG", 5, 10, 54, 88);
            // doc.addImage("/images/id/back.png", "PNG", 60, 10, 54, 88);
            // // 1 row id 2
            // doc.addImage("/images/id/front.png", "PNG", 120, 10, 54, 88);
            // doc.addImage("/images/id/back.png", "PNG", 175, 10, 54, 88);
            // // 2 row id 1
            // doc.addImage("/images/id/front.png", "PNG", 5, 106, 54, 88);
            // doc.addImage("/images/id/back.png", "PNG", 60, 106, 54, 88);
            // // 2 row id 2
            // doc.addImage("/images/id/front.png", "PNG", 120, 106, 54, 88);
            // doc.addImage("/images/id/back.png", "PNG", 175, 106, 54, 88);

            const generateQR = async (text,x,y,h,w) => {
                try {
                    sgv = await QRCode.toDataURL(text, { errorCorrectionLevel: 'H',margin: 1  });
                    doc.addImage(sgv, x,y,h,w);
                } catch (err) {
                    console.error(err)
                }
            }

            const loadImageURL = async (url,callback_) => {
                const img = new Image();
                img.crossOrigin = 'Anonymous'; // Important for cross-origin images
                img.src = url;

                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    const imageData = canvas.toDataURL('image/png'); // or 'image/jpeg'
                    callback_(imageData)
                };
            
                img.onerror = function() {
                    callback_("")
                };

            }
            let loop_count = 1;
            let loop_row = 1;
            let x = 0;
            let y = 0;
            // console.log(doc);
            // console.log("val",val);
            let noPhotoList = [];
            let countPage = 1;
            this.state.student_list.forEach(async(val,i,arr) => {
                loop_count++;
                if(loop_count==4) {
                    if((i + 1) != arr.length) {
                        doc.addPage();
                    }
                    loop_count=1;
                }
            });

            loop_count = 1;
            doc.setPage(countPage);
            console.log("PAGE: ",countPage);
            this.state.student_list.forEach(async (val,i,arr) => {
                // if(loop_count==5) {
                //     countPage++; 
                //     console.log("PAGE: ",countPage);
                //     doc.setPage(countPage);
                // }
                let track_ = self.state.track.find(e => e.name == val.flsh_track);
                let strand_ = self.state.strand.find(e => e.name == val.flsh_strand);
                let track = typeof(track_)!="undefined"?track_.acronyms:"";
                let strand = typeof(strand_)!="undefined"?strand_.acronyms:"";
                let guardian_data = self.state.guardian.find(e=>e.student_id==val.student_id);
                let code = val.qr_code,
                    lrn = val.lrn,
                    picture = val.picture,
                    fullname1 = val.first_name + " " + val.middle_name,
                    lastname = val.last_name,
                    track_strand = (track!=""||track!="")?track + "-" + strand:"", 
                    guardianname = guardian_data.first_name + " " + guardian_data.middle_name + " " + guardian_data.last_name,
                    relationship = guardian_data.relationship,
                    guardiancontact = guardian_data.phone_number,
                    address = guardian_data.current_address,
                    grade = val.grade,
                    level = val.grade_level,
                    section = val.section,
                    _track =  val.flsh_track,
                    _strand = val.flsh_strand,
                    sy = val.sy;
                let vurl = "";
                
                if(relationship == null) {
                    relationship = "";
                }
                if(guardiancontact == null) {
                    guardiancontact = "";
                }
                if(guardianname == null) {
                    guardianname = "";
                }
                if(track_strand == null) {
                    track_strand = "";
                }
                if(address == null) {
                    address = "";
                }
                if(grade == null) {
                    grade = "";
                }
                if(loop_count == 1) {
                    loop_count++;
                    doc.addImage("/images/id/front.png", "PNG", 5, 10, 54, 88);
                    doc.addImage("/images/id/back.png", "PNG", 60, 10, 54, 88);
                    // await generateQR(lrn,7.7, 57, 18, 18);
                    doc.addImage(val.gen_qr,7.7, 57, 18, 18);
                    // doc.addImage(val.vurl, 95, 79, 18, 18); 
                    if(val.vurl != "") {
                        doc.addImage(val.vurl, 95, 79, 18, 18);
                    }
                    if(picture != "") {
                        doc.addImage(picture, "PNG", 7.5, 26.5, 26, 25);
                    } else {
                        noPhotoList.push({sname: fullname1, id: val.student_id});
                        // self.setState({noPhotoList: noPhotoList});
                    }
                    doc.setFont("helvetica", "bold");
                    doc.setTextColor(255, 255, 255);
                    doc.setFontSize(11);
                    doc.text(lrn.toLocaleUpperCase(), 17, 55,{align:'left',color: "white"});
                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(11);
                    if(fullname1.length >= 11) {
                        doc.setFontSize(8);
                    }
                    doc.text(fullname1.toLocaleUpperCase(), 28, 60,{align:'left',maxWidth: 50});
                    doc.setFont("helvetica", "bold"); 
                    doc.setFontSize(15);
        
                    let fname_y = 66;// 89 nextline 83 ang defaul
                    if(fullname1.length >= 18) {
                        fname_y = 68;
                    }
                    // max 14 for the size of 15
                    if(lastname.length >= 9) {
                        doc.setFontSize(10);
                        fname_y = 64;
                    }
                    if(lastname.length > 13) {
                        doc.setFontSize(7); 
                    }
                    doc.text(lastname.toLocaleUpperCase() , 28, fname_y,{align:'left',maxWidth: 50});
                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(9);
                    doc.text(track_strand.toLocaleUpperCase(), 28, 72,{align:'left',maxWidth: 50});
        
                    doc.setFont("helvetica", "bold");
                    doc.setFontSize(7);
                    doc.text(grade.toLocaleUpperCase() + "-" + section.toLocaleUpperCase(), 76, 30,{align:'center',maxWidth: 45});
                    doc.text(sy.toLocaleUpperCase(), 94, 30,{align:'left',maxWidth: 50});

                    doc.setTextColor(9,72,164);
                    doc.setFontSize(11);
                    doc.text(level.toLocaleUpperCase() , 28.5, 89.7,{align:'right',maxWidth: 50});
                    doc.setTextColor(255, 255, 255);

                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(8);
                    doc.text(guardianname.toLocaleUpperCase(), 63, 43.5,{align:'left',maxWidth: 80});
                    doc.text(relationship.toLocaleUpperCase(), 63, 46,{align:'left',maxWidth: 50});
                    doc.text(guardiancontact.toLocaleUpperCase(), 63, 49,{align:'left',maxWidth: 70});
                    if(address.length >= 13) {
                        doc.setFontSize(6); 
                    }
                    doc.text(address.toLocaleUpperCase(), 63, 52,{align:'left',maxWidth: 50});
                    
                } else if(loop_count == 2) {
                    loop_count++;
                    doc.addImage("/images/id/front.png", "PNG", 120, 10, 54, 88);
                    doc.addImage("/images/id/back.png", "PNG", 175, 10, 54, 88);
                    // await generateQR(lrn,122.5, 57, 18, 18);
                    doc.addImage(val.gen_qr,122.5, 57, 18, 18);

                    if(val.vurl != "") {
                        doc.addImage(val.vurl, 210, 79, 18, 18);
                    }

                    if(picture != "") {
                        doc.addImage(picture, "PNG", 122.4, 26.5, 26, 25); 
                    } else {
                        noPhotoList.push({sname: fullname1, id: val.student_id});
                        // self.setState({noPhotoList: noPhotoList}); 
                    }
                    doc.setFont("helvetica", "bold");
                    doc.setTextColor(255, 255, 255);
                    doc.setFontSize(11);
                    doc.text(lrn.toLocaleUpperCase(), 132, 55,{align:'left',color: "white"});
                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(11);
                    fullname1 = fullname1 + "a"; 
                    if(fullname1.length >= 11) {
                        doc.setFontSize(8);
                    }
                    doc.text(fullname1.toLocaleUpperCase() , 143, 60,{align:'left',maxWidth: 50});
                    doc.setFont("helvetica", "bold"); 
                    doc.setFontSize(15);
        
                    let fname_y = 66;// 89 nextline 83 ang defaul
                    if(fullname1.length >= 11) {
                        fname_y = 68;
                    }
                    // max 14 for the size of 15
                    if(lastname.length >= 9) {
                        doc.setFontSize(10);
                        fname_y = 64;
                    }
                    if(lastname.length >= 13) {
                        doc.setFontSize(7); 
                    }
                    doc.text(lastname.toLocaleUpperCase() , 143, fname_y,{align:'left',maxWidth: 50});
                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(8);
                    doc.text(track_strand.toLocaleUpperCase(), 143, 72,{align:'left',maxWidth: 50});
        
                    doc.setFont("helvetica", "bold");
                    doc.setFontSize(7);
                    doc.text(grade.toLocaleUpperCase() + "-" + section.toLocaleUpperCase(), 76, 30,{align:'center',maxWidth: 45});
                    doc.text(sy.toLocaleUpperCase(), 94, 30,{align:'left',maxWidth: 50});
                    
                    doc.setTextColor(9,72,164);
                    doc.setFontSize(11);
                    doc.text(level.toLocaleUpperCase() , 143.5, 89.7,{align:'right',maxWidth: 50});
                    doc.setTextColor(255, 255, 255);
        
                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(8);
                    doc.text(guardianname.toLocaleUpperCase(), 177, 43.5,{align:'left',maxWidth: 80});
                    doc.text(relationship.toLocaleUpperCase(), 177, 46,{align:'left',maxWidth: 50});
                    doc.text(guardiancontact.toLocaleUpperCase(), 177, 49,{align:'left',maxWidth: 70});
                    if(address.length > 13) {
                        doc.setFontSize(6); 
                    }
                    doc.text(address.toLocaleUpperCase(), 177, 52,{align:'left',maxWidth: 50});
                } else if(loop_count == 3) {
                    loop_count++;
                    doc.addImage("/images/id/front.png", "PNG", 5, 106, 54, 88);
                    doc.addImage("/images/id/back.png", "PNG", 60, 106, 54, 88);
                    // await generateQR(lrn,7.7, 153, 18, 18);
                    doc.addImage(val.gen_qr,7.7, 153, 18, 18);
                    if(val.vurl != "") {
                        doc.addImage(val.vurl, 95, 175, 18, 18);
                    }
                    if(picture != "") {
                        doc.addImage(picture, "PNG", 7.5, 122.5, 26, 25);
                    } else {
                        noPhotoList.push({sname: fullname1, id: val.student_id});
                        // self.setState({noPhotoList: noPhotoList});
                    }
                    doc.setFont("helvetica", "bold");
                    doc.setTextColor(255, 255, 255);
                    doc.setFontSize(11);
                    doc.text(lrn.toLocaleUpperCase(), 17, 151,{align:'left',color: "white"});
                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(11);
                    if(fullname1.length >= 11) {
                        doc.setFontSize(8);
                    }
                    doc.text(fullname1.toLocaleUpperCase(), 28, 156,{align:'left',maxWidth: 50});
                    doc.setFont("helvetica", "bold"); 
                    doc.setFontSize(15);
        
                    let fname_y = 161;// 89 nextline 83 ang defaul
                    if(fullname1.length >= 18) {
                        fname_y = 165;
                    }
                    // max 14 for the size of 15
                    if(lastname.length >= 9) {
                        doc.setFontSize(10);
                        fname_y = 161;
                    }
                    if(lastname.length >= 13) {
                        doc.setFontSize(7); 
                    }
                    doc.text(lastname.toLocaleUpperCase() , 28, fname_y,{align:'left',maxWidth: 50});
                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(9);
                    doc.text(track_strand.toLocaleUpperCase(), 28, 168,{align:'left',maxWidth: 50});
        
                    doc.setFont("helvetica", "bold");
                    doc.setFontSize(7);
                    doc.text(grade.toLocaleUpperCase() + "-" + section.toLocaleUpperCase(), 76, 126,{align:'center',maxWidth: 45});
                    doc.text(sy.toLocaleUpperCase(), 94, 126,{align:'left',maxWidth: 50});
        
                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(8);
                    doc.text(guardianname.toLocaleUpperCase(), 63, 139.5,{align:'left',maxWidth: 80});
                    doc.text(relationship.toLocaleUpperCase(), 63, 142,{align:'left',maxWidth: 50});
                    doc.text(guardiancontact.toLocaleUpperCase(), 63, 145,{align:'left',maxWidth: 70});
                    if(address.length > 13) {
                        doc.setFontSize(6); 
                    }
                    doc.text(address.toLocaleUpperCase(), 63, 148,{align:'left',maxWidth: 50});
                } else if(loop_count == 4) {
                    loop_count++;
                    loop_row++;
                    doc.addImage("/images/id/front.png", "PNG", 120, 106, 54, 88);
                    doc.addImage("/images/id/back.png", "PNG", 175, 106, 54, 88);
                    // await generateQR(lrn,122.5, 153, 18, 18);
                    doc.addImage(val.gen_qr,122.5, 153, 18, 18);
                    if(val.vurl != "") {
                        doc.addImage(val.vurl, 210, 175, 18, 18);
                    }
                    if(picture != "") {
                        doc.addImage(picture, "PNG", 122.4, 122.5, 26, 25);
                    } else {
                        noPhotoList.push({sname: fullname1, id: val.student_id});
                        
                    }
                    doc.setFont("helvetica", "bold");
                    doc.setTextColor(255, 255, 255);
                    doc.setFontSize(11);
                    doc.text(lrn.toLocaleUpperCase(), 132, 151,{align:'left',color: "white"});
                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(11);
                    if(fullname1.length >= 11) {
                        doc.setFontSize(8);
                    }
                    doc.text(fullname1.toLocaleUpperCase(), 143, 156,{align:'left',maxWidth: 50});
                    doc.setFont("helvetica", "bold"); 
                    doc.setFontSize(15);
        
                    let fname_y = 161;// 89 nextline 83 ang defaul
                    if(fullname1.length >= 18) {
                        fname_y = 165;
                    }
                    // max 14 for the size of 15
                    if(lastname.length >= 9) {
                        doc.setFontSize(10);
                        fname_y = 161;
                    }
                    if(lastname.length >= 13) {
                        doc.setFontSize(7); 
                    }
                    doc.text(lastname.toLocaleUpperCase() , 143, fname_y,{align:'left',maxWidth: 50});
                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(8);
                    doc.text(track_strand.toLocaleUpperCase(), 143, 168,{align:'left',maxWidth: 50});
        
                    doc.setFont("helvetica", "bold");
                    doc.setFontSize(7);
                    doc.text(grade.toLocaleUpperCase() + "-" + section.toLocaleUpperCase(), 76, 126,{align:'center',maxWidth: 45});
                    doc.text(sy.toLocaleUpperCase(), 94, 126,{align:'left',maxWidth: 50});
        
                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(8);
                    doc.text(guardianname.toLocaleUpperCase(), 177, 139.5,{align:'left',maxWidth: 80});
                    doc.text(relationship.toLocaleUpperCase(), 177, 142,{align:'left',maxWidth: 50});
                    doc.text(guardiancontact.toLocaleUpperCase(), 177, 145,{align:'left',maxWidth: 70});
                    if(address.length > 13) {
                        doc.setFontSize(6); 
                    }
                    doc.text(address.toLocaleUpperCase(), 177, 148,{align:'left',maxWidth: 50});
                }
                if((i + 1) != arr.length) {

                    if(loop_count==5) {
                        countPage++; 
                        console.log("PAGE: ",countPage);
                        doc.setPage(countPage);
                        loop_count=1;
                    }

                }
            });

            // console.log(doc.output().length >= 1000000,doc.output().length)
            setTimeout(() => {
                // console.log("No Photo",noPhotoList);
                self.setState({noPhotoList: noPhotoList});
                $("#frame1").height(window.innerHeight - 8); 
                Swal.close(); 
                $('#frame1').attr('src',doc.output("bloburl"));  
                // }
                if(noPhotoList.length>0) {
                    let listmessage = "";
                    
                    if(Object.keys(noPhotoList).length> 0) {
                        noPhotoList.forEach(element => {
                            let others = "";
                            // if(this.state.noGuardianList.length > 0 && ) {

                            // }
                            listmessage+=`<li class="list-group-item"><a target="_blank" href="/admin/dashboard/student/update/${element.id}" >${element.sname} ${others}</a></li>`
                        }); 
                    }

                    Swal.fire({  
                        title: "List of student has no Photo" ,
                        html:`<ul class="list-group" >${listmessage}</ul>`, 
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
                }
            }, 1000);

                
        } catch (error) {
            console.log(error)
            Swal.fire({
                title: "Cannot continue because data is not sufficient or has error", 
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
        return <div className="" > 
            <iframe
                id="frame1"
                width="100%"
                height="100%"
                className="">
            </iframe>
    </div>}
}
