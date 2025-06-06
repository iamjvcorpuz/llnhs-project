import React,{ Component } from "react";
import { Link } from '@inertiajs/react';
import { EachMethod } from '@/Components/EachMethod'
import swal from 'sweetalert';
import Swal from 'sweetalert2';

// import QRCode from "react-qr-code";
import ReactTable from "@/Components/ReactTable"; 

import DashboardLayout from '@/Layouts/DashboardLayout';
import jsPDF from 'jspdf';
// import 'jspdf-autotable'; 
import { autoTable } from 'jspdf-autotable';
import QRCode from 'qrcode';

export default class SF4 extends Component {
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
            list: []
        }
        $('body').attr('class', '');
        this.loadPDF = this.loadPDF.bind(this);
        console.log(this.props)
    }

    componentDidMount() { 
        this.loadPDF();
    }
    
    async loadPDF() {
        console.log("loading pdf")
        try {
            let self = this;
            let sgv = "";
            let temp_data = [];
            
            Array.from({length:5}).forEach((e,x) => {
                temp_data.push([
                    {
                        content: (x+1),
                        styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                    },
                    {
                        content:"",
                        styles: {halign: 'left',minWidth: 0,minCellHeight: 0,cellWidth:60,fontSize: 7}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                    },
                ]);
            });

            // total male
            temp_data.push([
                {
                    content: "",
                    styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                },
                {
                    content:"MALE | TOTAL  Per Day",
                    styles: {halign: 'left',minWidth: 0,minCellHeight: 0,cellWidth:60,fontSize: 7}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                },
            ]);
            Array.from({length:5}).forEach((e,x) => {
                temp_data.push([
                    {
                        content: (x+1),
                        styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                    },
                    {
                        content:"",
                        styles: {halign: 'left',minWidth: 0,minCellHeight: 0,cellWidth:60,fontSize: 7}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                    },
                ]);
            });
            // total Female
            temp_data.push([
                {
                    content: "",
                    styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                },
                {
                    content:"FEMALE | TOTAL  Per Day",
                    styles: {halign: 'left',minWidth: 0,minCellHeight: 0,cellWidth:60,fontSize: 7}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                },
            ]);
            // total overall
            temp_data.push([
                {
                    content: "",
                    styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                },
                {
                    content:"Combined TOTAL PER DAY",
                    styles: {halign: 'left',minWidth: 0,minCellHeight: 0,cellWidth:60,fontSize: 7}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                },
            ]);


            const doc = new jsPDF({orientation: 'l',format: 'letter',compressPdf:true});
            doc.addFont('/fonts/arial/ARIALNB.TTF','Arial Narrow Bold', "bold");
            doc.addFont('/fonts/arial/ArialMdm.ttf','Arial Medium', "normal");
            let pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
            let pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
            console.log(doc.getFontList());
            doc.addImage("/images/deped-d.png", "PNG", 5, 10, 24, 24);
            doc.setFont("Arial Medium", "normal"); 
            doc.setFontSize(15);
            doc.text('School Form 2 (SF2) Daily Attendance Report of Learners', pageWidth / 2, 15,{align:'center'});
            doc.setFont("arial", "italic"); 
            doc.setFontSize(8);
            doc.text('(This replaces Form 1, Form 2 & STS Form 4 - Absenteeism and Dropout Profile)', pageWidth / 2, 20,{align:'center'});
            doc.setFont("Arial Medium", "normal"); 
            doc.setFontSize(9);
            doc.text('School ID : ', 36.5, 26,{align:'left'});
            doc.text('School Year : ', 96, 26,{align:'left'});
            doc.text('Report for the Month of : ', 161, 26,{align:'left'});
            doc.text('Name of School : ', 28, 31,{align:'left'});
            doc.text('Grade Level : ', 176, 31,{align:'left'});
            doc.text('Section : ', 216, 31,{align:'left'});

            doc.setFontSize(8);
            autoTable(doc,{ 
                theme: 'plain',
                startY: 39,
                margin: 4,
                useCss: true,
                head: [[
                        {
                            content: "LEARNER'S Name\n(Last Name, First Name, Middle Name)",
                            colSpan: 2,
                            rowSpan: 3,
                            styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8,lineColor: 1,lineWidth: .01},
                        },
                        {
                            content: "(1st row for date)",
                            colSpan: 25,
                            rowSpan: 1,
                            styles: { halign: 'center', fontSize: 8,lineColor: 1,lineWidth: .01,cellPadding:2},
                        },
                        {
                            content: "Total for the\nMonth",
                            colSpan: 2,
                            rowSpan: 2,
                            styles: { halign: 'center', valign: 'middle',fontSize: 6,lineColor: 1,lineWidth: .01,cellWidth: 10},
                        },
                        {
                            content: "REMARKS (If DROPPED OUT, state reason, please refer to\nlegend number 2\nIf TRANSFERRED IN/OUT, write the name of School.)",
                            colSpan: 1,
                            rowSpan: 3,
                            styles: {  halign: 'center',valign: 'middle', fontSize: 6,lineColor: 1,lineWidth: .01,cellWidth: 60},
                        },
                ],[],[
                    {
                        content: "M",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "T",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "W",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "TH",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "F",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "M",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "T",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "W",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "TH",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "F",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "M",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "T",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "W",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "TH",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "F",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },{
                        content: "M",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "T",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "W",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "TH",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "F",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },{
                        content: "M",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "T",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "W",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "TH",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "F",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "ABSENT",
                        styles: { halign: 'center', valign: 'middle',fontSize: 4,minCellHeight: 0,fontStyle: 'normal',cellWidth:10},
                    },
                    {
                        content: "TARDY",
                        styles: { halign: 'center', valign: 'middle',fontSize: 4,minCellHeight: 0,fontStyle: 'normal',cellWidth:10},
                    }
                ]],
                headStyles: {lineColor: 1,lineWidth: .01,minCellHeight: 0,cellPadding: 0},
                styles: { fontSize: 8, lineColor: 1,lineWidth: .01},
                body: temp_data,
                didDrawCell: function (data) {
                    if (data.column.index == 0 && data.row.index < 5 && data.row.section === 'body') { // data.row.index >= 2 && 
                        console.log(data)
                        // data.cell.styles.cellWidth = 12;
                        // data.row.raw[0].styles.width = 12;
                        // autoTable(doc,{
                        //     startY: data.cell.y + 2,
                        //     margin: { left: data.cell.x + 2 },
                        //     tableWidth: data.cell.width - 4,
                        //     styles: {
                        //       maxCellHeight: 4,
                        //     },
                        //     columns: [
                        //       { dataKey: 'id', header: 'ID' },
                        //       { dataKey: 'name', header: 'Name' },
                        //       { dataKey: 'expenses', header: 'Sum' },
                        //     ],
                        //     body: bodyRows(),
                        // })
                    }
                }
            });
            let t1y = doc.internal.getNumberOfPages();
            // const startY = doc.lastAutoTable.finalY + 2;
            const startY = 12;
            doc.addPage({orientation: 'l',format: 'letter',compressPdf:true});
            // -------------------------------------
            doc.setFont("Arial Narrow Bold", "bold");
            doc.text('GUIDELINES: ', 5, startY + 2,{align:'left'});
            doc.setFont("Helvetica",""); 
            doc.setFontSize(6);
            doc.text("1. The attendance shall be accomplished daily. Refer to the codes for checking learners' attendance.", 5, startY + 5,{align:'left'});
            doc.text("2. Dates shall be written in the columns after Learner's Name.", 5, startY + 8,{align:'left'});
            doc.text("3. To compute the following:", 5, startY + 11,{align:'left'});
            doc.text("a. Percentage of Enrolment =", 8, startY + 16,{align:'left'});
            doc.text("b. Average Daily Attendance =", 8, startY + 20,{align:'left'});
            doc.text("c. Percentage of Attendance for the month =", 8, startY + 25,{align:'left'});
            doc.text("4. Every end of the month, the class adviser will submit this form to the office of the principal for recording of summary table into\nSchool Form 4. Once signed by the principal, this form should be returned to the adviser.", 5, startY + 32,{align:'left'});
            doc.text("5. The adviser will provide neccessary interventions including but not limited to home visitation to learner/s who were absent for 5\nconsecutive days and/or those at risk of dropping out.", 5, startY + 37,{align:'left'});
            doc.text("6. Attendance performance of learners will be reflected in Form 137 and Form 138 every grading period.\n   * Beginning of School Year cut-off report is every 1st Friday of the School Year", 5, startY + 42,{align:'left'});
            
            
            doc.text("Registered Learners as of end of the month", 70, startY + 13,{align:'left'});
            doc.text("Enrolment as of 1st Friday of the school year", 70, startY + 16,{align:'left'});
            doc.line(69, startY + 14, 114, startY + 14);

            doc.text("Total Daily Attendance", 80, startY + 18.5,{align:'left'});
            doc.text("Number of School Days in reporting month", 70, startY + 21,{align:'left'});
            doc.line(69, startY + 19, 114, startY + 19);


            doc.text("Average daily attendance", 78.5, startY + 24,{align:'left'});
            doc.text("Number of School Days in reporting month", 70, startY + 27,{align:'left'});
            doc.line(69, startY + 24.5, 114, startY + 24.5);


            doc.text("X 100", 116, startY + 15,{align:'left'});
            doc.text("X 100", 116, startY + 25,{align:'left'});
            
            doc.rect(130, startY , 55, 70);
            console.log("startY",startY,t1y);
            autoTable(doc,{ 
                theme: 'plain',
                startY: startY,
                margin: {
                    left: 189.5,
                }, 
                // styles: {halign:"right"},
                head: [[
                        {
                            content: "Month: ", 
                            rowSpan: 2,
                            styles: { halign: 'left',minCellHeight: 0, fontSize: 6,lineColor: 1,lineWidth: .01,cellWidth: 22}
                        },
                        {
                            content: "No. of Days of\nClasses:", 
                            rowSpan: 2,
                            styles: { halign: 'left',minCellHeight: 0, fontSize: 6,lineColor: 1,lineWidth: .01,cellWidth: 22}
                        },
                        {
                            content: "Summary",
                            colSpan: 3,
                            rowSpan: 1,
                            styles: { halign: 'center', valign: 'middle',fontSize: 6,lineColor: 1,lineWidth: .01,cellWidth: 8}
                        }
                ],[
                    {
                        content: "M",   
                        styles: {halign: 'center',cellWidth: 10}
                    },
                    {
                        content: "F",   
                        styles: {halign: 'center',cellWidth: 10}
                    },
                    {
                        content: "Total",   
                        styles: {halign: 'center',cellWidth: 20}
                    }
                ]],
                headStyles: {lineColor: 1,lineWidth: .01,minCellHeight: 0},
                styles: { fontSize: 8, lineColor: 1,lineWidth: .01},
                body: [
                    [
                        {
                            content: "* Enrolment as of (1st Friday of June)",
                            colSpan: 2,
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        }
                    ],
                    [
                        {
                            content: "Late Enrollment during the month\n(beyond cut-off)",
                            colSpan: 2,
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        }   
                    ],
                    [
                        {
                            content: "Registered Learners as of end of the month",
                            colSpan: 2,
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        }   
                    ],
                    [
                        {
                            content: "Percentage of Enrolment as of end of the month",
                            colSpan: 2,
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        }   
                    ],
                    [
                        {
                            content: "Average Daily Attendance",
                            colSpan: 2,
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        }   
                    ],
                    [
                        {
                            content: "Percentage of Attendance for the month",
                            colSpan: 2,
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        }   
                    ],
                    [
                        {
                            content: "Number of students absent for 5 consecutive days:",
                            colSpan: 2,
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        }   
                    ],
                    [
                        {
                            content: "Drop out",
                            colSpan: 2,
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        }   
                    ],
                    [
                        {
                            content: "Transferred out",
                            colSpan: 2,
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        }   
                    ],
                    [
                        {
                            content: "Transferred in",
                            colSpan: 2,
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        }   
                    ]
                ]
            });

            doc.setFontSize(6);
            doc.text("1. CODES FOR CHECKING ATTENDANCE", 130.5, startY + 3,{align:'left'});
            doc.text("(blank) - Present; (x)- Absent; Tardy (half shaded=\nUpper for LateCommer, Lower for Cutting Classes)", 130.5, startY + 7,{align:'left'});
            doc.text("2. REASONS/CAUSES FOR DROPPING OUT", 130.5, startY + 13,{align:'left'});
            doc.text("a. Domestic-Related Factors\na.1. Had to take care of siblings\na.2. Early marriage/pregnancy\na.3. Parents' attitude toward schooling\na.4. Family problemsb. Individual-Related Factors\nb.1. Illness\nb.2. Overage\nb.3. Death\nb.4. Drug Abuse\nb.5. Poor academic performance\nb.6. Lack of interest/Distractions\nb.7. Hunger/Malnutrition\nc. School-Related Factors\nc.1. Teacher Factor\nc.2. Physical condition of classroom\nc.3. Peer influence\nd. Geographic/Environmental\nd.1. Distance between home and school\nd.2. Armed conflict (incl. Tribal wars & clanfeuds)\nd.3. Calamities/Disasters\ne. Financial-Related\me.1. Child labor, work\nf. Others (Specify)", 130.5, startY + 15,{align:'left'});

            let startY_ = doc.lastAutoTable.finalY + 2;

            doc.setFont("Helvetica","italic"); 
            doc.setFontSize(8);
            doc.text("I certify that this is a true and correct report.", 180, startY_ + 4,{align:'left'});
            doc.text("(Signature of Teacher over Printed Name)", 205, startY_ + 19,{align:'left'});
            doc.text("(Signature of School Head over Printed Name)", 202.5, startY_ + 39,{align:'left'});
            doc.setFont("Helvetica","normal"); 
            doc.text("Attested by:", 180, startY_ + 30,{align:'left'});

            doc.line(195, startY_ + 16, 265, startY_ + 16);

            doc.line(195, startY_ + 36, 265, startY_ + 36);
            
            doc.text("School Form 2 : Page ___ of ________", 4, startY_ + 39,{align:'left'});


            $("#obj1").height(window.innerHeight - 8);
            $("#frame1").height(window.innerHeight - 8);
            // $('#frame1').attr('src',doc.output("datauristring") + '#view=Fit&toolbar=0'); 
        
            $('#obj1').attr('data',doc.output("datauristring"));
            // $('#frame1').attr('src',doc.output("datauristring"));  
                
        } catch (error) {
            console.log(error)
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
        <object
            id="obj1"
            type="application/pdf"
            width="100%"
            height="100">
            {/* <iframe
                id="frame1"
                src="#view=FitH&toolbar=0"
                width="100%"
                height="100%"
            ></iframe> */}
        </object>
    </div>}
}
