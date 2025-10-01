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

export default class PrintIDEmployees extends Component {
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
            student_list: this.props.data, 
            noPhotoList: [],
            noGuardianList: [],
            selected: [],
            ready: false
        }
        $('body').attr('class', '');
        this.multiple = this.multiple.bind(this);
        this.generateQRCODES = this.generateQRCODES.bind(this);
        // console.log(this.props);
    }

    componentDidMount() {
        let self = this;
        $("#frame1").height(0); 
        Swal.fire({
            title: "Generating ID. Please wait.", 
            html: '<div id="progress-bar-container"><div id="progress-bar" style="width: 0%;"></div></div><p id="percentage-text">0%</p>',
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
                const progressBarContainer = document.getElementById('progress-bar-container');
                const progressBar = document.getElementById('progress-bar');
                const percentageText = document.getElementById('percentage-text');
    
                if (progressBarContainer) {
                    progressBarContainer.style.width = '100%';
                    progressBarContainer.style.height = '10px';
                    progressBarContainer.style.backgroundColor = '#f0f0f0';
                    progressBarContainer.style.borderRadius = '5px';
                    progressBarContainer.style.overflow = 'hidden';
                    progressBarContainer.style.marginBottom = '10px';
                }
                if (progressBar) {
                    progressBar.style.height = '100%';
                    progressBar.style.backgroundColor = '#4CAF50'; // Green color for progress
                    progressBar.style.transition = 'width 0.3s ease-in-out';
                }
            }
        });
        const urlParams = new URLSearchParams(window.location.search);
        const page = urlParams.get('selected'); 
        // console.log(page)
        this.setState({
            selected: (typeof(page)!="undefined"&&page!=null&&page!="")?page.split(","):[]
        },() => { 
            if(self.state.selected.length>0) {
                let temp = [];
                self.props.data.forEach((element,i,arr) => {
                    if(self.state.selected.includes(element.qr_code)) {
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
                // console.log(self.state.student_list);
                this.updateLoadingProgress(100);
                this.multiple();
            });
        }, 2000);
    }

    updateLoadingProgress(percentage) {
        const progressBar = document.getElementById('progress-bar');
        const percentageText = document.getElementById('percentage-text');

        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }
        if (percentageText) {
            percentageText.textContent = `${percentage}%`;
        }
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

        let loops = (i,arr) => new Promise( async (resolve,reject) => {
            let val = arr[i];
            let fullname1 = val.first_name + " " + (typeof(val.middle_name)!="undefined"&&val.middle_name!=""?(`${val.middle_name.charAt(0)}.`) : "") + " " + val.last_name; 
            const percentage = Math.round((i / self.state.student_list.length) * 100);
            this.updateLoadingProgress(percentage);
            await loadImageURL(`/profile/photo/employee/${val.uuid}`,async (eee) => {
                await generateQR(val.qr_code, async (e) => {
                    student_list.push({...val,fullname:fullname1,gen_qr: e,picture: eee}); 
                    if((i + 1) == arr.length) { 
                        self.setState({student_list: student_list},() => {
                            resolve();
                            return;
                        });
                    } else {
                        await loops(i + 1,arr);
                        resolve();
                    }
                });
            }); 
        });

        loops(0,this.state.student_list).then((e) => {
            callback();
        });

    }
    
    async multiple() {
        try {
            let self = this;
            let sgv = "";
            const doc = new jsPDF({orientation:"landscape"});

            let loop_count = 1;
            let loop_row = 1;
            let x = 0;
            let y = 0;
            // console.log(doc);
            // console.log("Total: ",this.state.student_list.length);
            // console.log("data: ",this.state.student_list);
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
            // console.log("PAGE: ",countPage);
            this.state.student_list.forEach(async (val,i,arr) => {
                
                let code = val.qr_code, 
                    picture = val.picture,
                    fullname = val.fullname,  
                    fullname1 = val.first_name + " " + ((typeof(val.middle_name)!="undefined"&&val.middle_name!="")?val.middle_name.charAt(0) + ".":""),
                    lastname = val.last_name,
                    type = val.employee_type.toLocaleUpperCase(),
                    econtact = val.emergency_contact_number!=null?val.emergency_contact_number:"";
                
                if(loop_count == 1) {
                    loop_count++;
                    doc.addImage("/images/id-teacher-front.png", "PNG", 5, 10, 88, 54);
                    doc.addImage("/images/id-teacher-back.png", "PNG", 95, 10, 88, 54);
                    // await generateQR(lrn,7.7, 57, 18, 18);
                    doc.addImage(val.gen_qr,72, 26, 20, 21); 
                    if(picture != "") {
                        doc.addImage(picture, "PNG", 6.7, 24.3, 23.6, 24.7);
                    } else {
                        noPhotoList.push({sname: fullname, id: val.uuid}); 
                    }
                    doc.setFont("helvetica", "bold");
                    doc.setTextColor(255, 255, 255);
                    doc.setFontSize(11);
                    doc.text(code.toLocaleUpperCase(), 7, 55,{align:'left',color: "white"});
                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(11);
                    if(fullname1.length >= 11) {
                        doc.setFontSize(8);
                    }
                    doc.text(fullname1.toLocaleUpperCase(), 32, 43,{align:'left',maxWidth: 50});
                    doc.setFont("helvetica", "bold"); 
                    doc.setFontSize(15);
        
                    let fname_y = 38;// 89 nextline 83 ang defaul
                    // max 14 for the size of 15
                    if(lastname.length >= 9) {
                        doc.setFontSize(10);
                        fname_y = 64;
                    }
                    if(lastname.length > 13) {
                        doc.setFontSize(7); 
                    }
                    doc.text(lastname.toLocaleUpperCase() , 32, fname_y,{align:'left',maxWidth: 50});

                    doc.setTextColor(9,72,164);
                    doc.setFont("helvetica", "bold");
                    doc.setFontSize(14);
                    doc.text(type.toLocaleUpperCase(), 68, 56,{align:'center',maxWidth: 50});
        
                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(12);
                    doc.text(econtact, 139, 40,{align:'center',maxWidth: 45});
                } else if(loop_count == 2) {
                    loop_count++;
                    doc.addImage("/images/id-teacher-front.png", "PNG", 5, 67, 88, 54);
                    doc.addImage("/images/id-teacher-back.png", "PNG", 95, 67, 88, 54);
                    // await generateQR(lrn,7.7, 57, 18, 18);
                    doc.addImage(val.gen_qr,72, 83, 20, 21); 
                    if(picture != "") {
                        doc.addImage(picture, "PNG", 6.7, 24.3 + 57, 23.6, 24.7);
                    } else {
                        noPhotoList.push({sname: fullname, id: val.uuid}); 
                    }
                    doc.setFont("helvetica", "bold");
                    doc.setTextColor(255, 255, 255);
                    doc.setFontSize(11);
                    doc.text(code.toLocaleUpperCase(), 7, 55 + 57,{align:'left',color: "white"});
                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(11);
                    if(fullname1.length >= 11) {
                        doc.setFontSize(8);
                    }
                    doc.text(fullname1.toLocaleUpperCase(), 32, 43 + 57,{align:'left',maxWidth: 50});
                    doc.setFont("helvetica", "bold"); 
                    doc.setFontSize(15);
        
                    let fname_y = 38 + 57;// 89 nextline 83 ang defaul
                    // max 14 for the size of 15
                    if(lastname.length >= 9) {
                        doc.setFontSize(10);
                        fname_y = 64 + 57;
                    }
                    if(lastname.length > 13) {
                        doc.setFontSize(7); 
                    }
                    doc.text(lastname.toLocaleUpperCase() , 32, fname_y,{align:'left',maxWidth: 50});

                    doc.setTextColor(9,72,164);
                    doc.setFont("helvetica", "bold");
                    doc.setFontSize(14);
                    doc.text(type.toLocaleUpperCase(), 68, 56 + 57,{align:'center',maxWidth: 50});
        
                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(12);
                    doc.text(econtact, 139, 40 + 57,{align:'center',maxWidth: 45});

                } else if(loop_count == 3) {
                    loop_count++;
                    doc.addImage("/images/id-teacher-front.png", "PNG", 5, 124, 88, 54);
                    doc.addImage("/images/id-teacher-back.png", "PNG", 95, 124, 88, 54);
                    // await generateQR(lrn,7.7, 57, 18, 18);
                    doc.addImage(val.gen_qr,72, 140, 20, 21); 
                    if(picture != "") {
                        doc.addImage(picture, "PNG", 6.7, 24.3 + 114, 23.6, 24.7);
                    } else {
                        noPhotoList.push({sname: fullname, id: val.uuid}); 
                    }
                    doc.setFont("helvetica", "bold");
                    doc.setTextColor(255, 255, 255);
                    doc.setFontSize(11);
                    doc.text(code.toLocaleUpperCase(), 7, 55 + 114,{align:'left',color: "white"});
                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(11);
                    if(fullname1.length >= 11) {
                        doc.setFontSize(8);
                    }
                    doc.text(fullname1.toLocaleUpperCase(), 32, 43 + 114,{align:'left',maxWidth: 50});
                    doc.setFont("helvetica", "bold"); 
                    doc.setFontSize(15);
        
                    let fname_y = 38 + 114;// 89 nextline 83 ang defaul
                    // max 14 for the size of 15
                    if(lastname.length >= 9) {
                        doc.setFontSize(10);
                        fname_y = 64 + 114;
                    }
                    if(lastname.length > 13) {
                        doc.setFontSize(7); 
                    }
                    doc.text(lastname.toLocaleUpperCase() , 32, fname_y,{align:'left',maxWidth: 50});

                    doc.setTextColor(9,72,164);
                    doc.setFont("helvetica", "bold");
                    doc.setFontSize(14);
                    doc.text(type.toLocaleUpperCase(), 68, 56 + 114,{align:'center',maxWidth: 50});
        
                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(12);
                    doc.text(econtact, 139, 40 + 114,{align:'center',maxWidth: 45});
                }
                if((i + 1) != arr.length) {

                    if(loop_count==4) {
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
                            listmessage+=`<li class="list-group-item"><a target="_blank" href="/admin/dashboard/employee/update/${element.id}" >${element.sname} ${others}</a></li>`
                        }); 
                    }
                    if(self.state.noGuardianList.length>0) {
                        listmessage+=`<li class="list-group-item">${self.state.noGuardianList.length} student has no guardian.</li>`
                    }

                    Swal.fire({  
                        title: "List of employee has no Photo" ,
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
