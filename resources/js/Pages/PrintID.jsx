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
            track_strand: "ACAD-STEM",
            grade: "10",
            section: "MOLAVE",
            sy: "2025-2026",
            guardianname:"LIZA MARCOS",
            relationship: "Mother",
            guardiancontact: "09758955082",
            address: "MATINA DAVAO CITY",
            list: []
        }
        $('body').attr('class', '');
        this.singleId = this.singleId.bind(this);
        console.log(this.props)
    }
    componentDidMount() {
        $("#frame1").height(window.innerHeight - 8);
        const urlParams = new URLSearchParams(window.location.search);
        const stamp = urlParams.get('id');
        // console.log(stamp)
        if(stamp!=null) {
            this.setState({
                code:stamp
            });
        }

        this.setState({
            code: this.props.data.student.qr_code,
            lrn: this.props.data.student.lrn,
            picture: this.props.data.student.picture_base64,
            fullname1: this.props.data.student.first_name + " " + this.props.data.student.middle_name,
            lastname: this.props.data.student.last_name,
            track_strand: this.props.data.student.flsh_track + "-" + this.props.data.student.flsh_strand,
            grade: this.props.data.grade,
            section: this.props.data.section,
            sy: this.props.data.sy,
            guardianname: this.props.data.guardian[0].first_name + " " + this.props.data.guardian[0].middle_name + " " + this.props.data.guardian[0].last_name,
            relationship: this.props.data.guardian[0].relationship,
            guardiancontact: this.props.data.guardian[0].phone_number,
            address: this.props.data.guardian[0].current_address
        },() => {
            this.singleId();
        });

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
        let sgv = "";
        const doc = new jsPDF({});
        // const width = doc.getPageWidth();
        const width = 210.1;         
        doc.addImage("/images/id/front.png", "PNG", 5, 5, 81, 130);
        doc.addImage("/images/id/back.png", "PNG", 87, 5, 81, 130);
        if(this.state.picture != "") {
            doc.addImage(this.state.picture, "PNG", 9, 30, 38, 36);
        }
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
        $('#frame1').attr('src',doc.output("datauristring")); 
        $("#frame1").height(window.innerHeight - 8);
        // $('#frame1').attr('src',doc.output("datauristring") + '#view=Fit&toolbar=0'); 

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
        $('#frame1').attr('src',doc.output("datauristring")); 
        // $('#frame1').attr('src',doc.output("datauristring") + '#view=Fit&toolbar=0'); 

    }
    
    render() {
        return <div className="" >
            <iframe
                id="frame1"
                src="#view=FitH&toolbar=0"
                width="100%"
                height="100%"
            ></iframe>
    </div>}
}
