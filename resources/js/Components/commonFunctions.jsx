import React from 'react';  
import $ from "jquery";
import { Link } from '@inertiajs/react';
import moment from 'moment';
//#region 
export const sortTimeDESC = function(a,b){
    let t1 = new Date(Date.parse(a.created_at));
    let t2 = new Date(Date.parse(b.created_at)); 
    return t1<t2 ? 1 : t1>t2 ? -1 : 0;
}
export function consoleLog(val){
    if(window.logs){
        let params = []
        if(arguments.length > 0) {
            for(let i = 0;i<arguments.length;i++){
                if(typeof(arguments[i]) === 'object'){
                    params.push(JSON.stringify(arguments[i]))
                } else {
                    params.push(arguments[i])
                }                
            }
        }
        // console.log(params.toString())
    }
}

export function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

export function hasKey(obj,key) {
    return Object.keys(obj).indexOf(key) !== -1
}

export function getMaxHeightDiv(param) {
    return Math.max.apply(null, $(param).map(function () {
        return $(this).height();
    }).get());
}

export const Pagination = (data,page,limit,params) => {
    let itemLimit = limit;
    let totalData = typeof(data)!="undefined"?data.length:0;
    let totalDataActive = typeof(data)!="undefined"?data.length:0;
    let totalPage = Math.ceil(totalData / itemLimit); 
    let totalPageAcive = Math.ceil(totalDataActive / itemLimit);  
    let temp_data = typeof(data)!="undefined"?data:[];
    return {
        Content: function(filter,callback) { 
            const perChunk = itemLimit;    
            if(filter == "") { 
                const result_chunk = data.reduce((resultArray, item, index) => { 
                    const chunkIndex = Math.floor(index/perChunk);            
                    if(!resultArray[chunkIndex]) {
                        resultArray[chunkIndex] = [];
                    }            
                    resultArray[chunkIndex].push(item);            
                    return resultArray;
                }, []);
                // console.log("result_chunk 1",result_chunk);
                callback(result_chunk);
            } else if(data.length > perChunk) { 
                // console.log("temp_data1",data);
                let temp_data2 = data.filter((e)=>e.office_name.toLowerCase().includes(filter));
                // console.log("temp_data2",temp_data2);
                const result_chunk = temp_data2.reduce((resultArray, item, index) => { 
                const chunkIndex = Math.floor(index/perChunk);            
                if(!resultArray[chunkIndex]) {
                    resultArray[chunkIndex] = [];
                }            
                resultArray[chunkIndex].push(item);            
                return resultArray;
                }, []);
                // console.log("result_chunk 2 ",result_chunk);
                callback(result_chunk);
            } else {
                callback([data]);
            }


        },
        FilterHighlightsSearch: function(filter,callback) {
            let findvalue = filter;
            let searchregexp = new RegExp(findvalue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "gi");
            let temp = temp_data;
            let temp_filtered = [];
            if(findvalue != "" && temp.length > 0) {
                temp.forEach((val,i,arr) => {
                    if(val.office_name.toLowerCase().includes(findvalue.toLowerCase()) || val.position_plantilla_name.toLowerCase().includes(findvalue.toLowerCase())) {
                        let office_name = val.office_name;
                        let position_plantilla_name = val.position_plantilla_name;
                        let temp_replace = {
                            ...val
                        }
                        temp_replace.office_name =  typeof(office_name)!="undefined"?office_name.replace(searchregexp, "<span class='highlight'>$&</span>"):office_name;
                        temp_replace.position_plantilla_name = typeof(position_plantilla_name)!="undefined"?position_plantilla_name.replace(searchregexp, "<span class='highlight'>$&</span>"):position_plantilla_name;
                        temp_filtered.push(temp_replace);
                    }
                    if((i + 1) === arr.length) {
                        callback(temp_filtered)
                    }
                });
            } else {
                callback(temp_filtered)
            }
        },
        FilterHighlightsSearchOfficePosition: function(office,filter,callback) {
            let findvalue = filter;
            let searchregexp = new RegExp(findvalue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "gi");
            let temp = temp_data;
            let temp_filtered = [];
            if((findvalue != "" || office.length > 0) && temp.length > 0) {
                console.log("office",office,office.length)
                temp.forEach((val,i,arr) => {
                    if( (office.length > 0 && office.some(e => e.value.toLowerCase() == val.office_name.toLowerCase()) ) && findvalue == "") {
                        console.log((office.length > 0 && office.some(e => e.value.toLowerCase() == val.office_name.toLowerCase())), val.office_name.toLowerCase() )
                        let office_name = val.office_name;
                        let position_plantilla_name = val.position_plantilla_name;
                        let temp_replace = {
                            ...val
                        }
                        temp_replace.office_name =  typeof(office_name)!="undefined"?office_name.replace(searchregexp, "<span class='highlight'>$&</span>"):office_name;
                        temp_replace.position_plantilla_name = typeof(position_plantilla_name)!="undefined"?position_plantilla_name.replace(searchregexp, "<span class='highlight'>$&</span>"):position_plantilla_name;
                        temp_filtered.push(temp_replace);
                    } else if( typeof(office)!="undefined" && val.position_plantilla_name.toLowerCase().includes(findvalue.toLowerCase())) {
                        console.log((office.length > 0 && office.some(e => e.value.toLowerCase() == val.office_name.toLowerCase())), val.office_name.toLowerCase() )
                        let office_name = val.office_name;
                        let position_plantilla_name = val.position_plantilla_name;
                        let temp_replace = {
                            ...val
                        }
                        temp_replace.office_name =  typeof(office_name)!="undefined"?office_name.replace(searchregexp, "<span class='highlight'>$&</span>"):office_name;
                        temp_replace.position_plantilla_name = typeof(position_plantilla_name)!="undefined"?position_plantilla_name.replace(searchregexp, "<span class='highlight'>$&</span>"):position_plantilla_name;
                        temp_filtered.push(temp_replace);
                    } else if( office.length == 0 && val.position_plantilla_name.toLowerCase().includes(findvalue.toLowerCase())) {
                        console.log((office.length > 0 && office.some(e => e.value.toLowerCase() == val.office_name.toLowerCase())), val.office_name.toLowerCase() )
                        let office_name = val.office_name;
                        let position_plantilla_name = val.position_plantilla_name;
                        let temp_replace = {
                            ...val
                        }
                        temp_replace.office_name =  typeof(office_name)!="undefined"?office_name.replace(searchregexp, "<span class='highlight'>$&</span>"):office_name;
                        temp_replace.position_plantilla_name = typeof(position_plantilla_name)!="undefined"?position_plantilla_name.replace(searchregexp, "<span class='highlight'>$&</span>"):position_plantilla_name;
                        temp_filtered.push(temp_replace);
                    }
                    if((i + 1) === arr.length) {
                        console.log(temp_filtered)
                        callback(temp_filtered)
                    }
                });
            } else {
                callback(temp_filtered)
            }
        },
        PageNumber: function() {            
            let loading = true;
            if(arguments.length) {
                if(typeof(arguments[0].loading) != "undefined") {
                    console.log("arguments[0].loading",arguments[0].loading)
                    loading = arguments[0].loading
                }
            }


            if(data.length > 0 && totalPage > 1) {
                return (
                    <ul className="pagination mt-3 float-right">
                        <li className="page-item"  >
                            <Link className="page-link"  onClick={()=>params(1)} aria-label="First">
                                <span aria-hidden="true"><i className="fas fa-angle-double-left"></i></span> 
                            </Link>
                        </li>
                        <li className={((page-1)==0)?"page-item disabled":"page-item"}  >
                            <Link className="page-link"  onClick={()=> (page-1)} aria-label="Previous">
                                <span aria-hidden="true"><i className="fas fa-angle-left"></i></span>
                            </Link>
                        </li>
                        {[...Array(totalPage)].map((_, i) => {
                            return (<li className={((page-1)==i)?"page-item active":"page-item"} key={i}>{((page-1)==i)?<span className="page-link">{i+1}<span className="sr-only">(current)</span></span>:<Link onClick={()=>params(i+1)} className="page-link">{i+1}</Link>}</li>)
                        })}
                        <li className={(page==totalPage)?"page-item disabled":"page-item"} >
                            <Link className="page-link"  onClick={()=>params(page+1)} aria-label="Next">
                                <span aria-hidden="true"><i className="fas fa-angle-right"></i></span>
                            </Link>
                        </li>
                        <li className="page-item" >
                            <Link className="page-link"  onClick={()=>params(totalPage)} aria-label="Last">
                                <span aria-hidden="true"><i className="fas fa-angle-double-right"></i></span> 
                            </Link>
                        </li>
                    </ul>
                );
            } else if(data.length > 0 && totalPage == 1) {
                return (<></>)
            } else {
                return (loading==true)?(
                    <div className='row'>
                        <div className='col-lg-12'>
                            <p className='p_ loading col-lg-12'>loading</p>
                        </div>								
                    </div>
                ):(
                    <div className='row'>
                        <div className='col-lg-12'>
                            <p className='p_ col-lg-12'></p>
                        </div>								
                    </div>
                );
            }
        },
        PageNumberActiveData: function() {
            let loading = true;
            let link = '';
            let filter = '';
            let filtered_data = [];
            if(arguments.length) {
                if(typeof(arguments[0].loading) != "undefined") {
                    // console.log("arguments[0].loading",arguments[0].loading)
                    loading = arguments[0].loading
                }
                if(typeof(arguments[0].target) != "undefined") {
                    link = arguments[0].target;
                }
                if(typeof(arguments[0].filter) != "undefined") {
                    filter = arguments[0].filter;
                }
                if(typeof(arguments[0].filtered_data) != "undefined") {
                    filtered_data = arguments[0].filtered_data;  
                    totalPageAcive = filtered_data.length;
                } 
            }
            if(data.length > 0) {
                return (
                    <ul className="pagination mt-3 float-right">
                        <li className="page-item"  >
                            <Link className="page-link" to={`${link}1#${1}`}  onClick={()=>params(1)} aria-label="First">
                                <span aria-hidden="true"><i className="fas fa-angle-double-left"></i></span> 
                            </Link>
                        </li>
                        <li className={((page-1)==0)?"page-item disabled":"page-item"}  >
                            <Link className="page-link" to={`${link}${Number(page)-1}#${Number(page)-1}`}  onClick={()=>params(Number(page)-1)} aria-label="Previous" >
                                <span aria-hidden="true"><i className="fas fa-angle-left"></i></span>
                            </Link>
                        </li>
                        {[...Array(totalPageAcive)].map((_, i) => {
                            return (<li className={((Number(page)-1)==i)?"page-item active":"page-item"} key={i}>{((Number(page)-1)==i)?<span className="page-link">{i+1}<span className="sr-only">(current)</span></span>:<Link to={`${link}${i+1}#${i+1}`}  onClick={()=>params(i+1)} className="page-link">{i+1}</Link>}</li>)
                        })}
                        <li className={(page==totalPageAcive)?"page-item disabled":"page-item"} >
                            <Link className="page-link" to={`${link}${Number(page)+1}#${Number(page)+1}`} onClick={()=>params(Number(page)+1)} aria-label="Next">
                                <span aria-hidden="true"><i className="fas fa-angle-right"></i></span>
                            </Link>
                        </li>
                        <li className="page-item" >
                            <Link className="page-link" to={`${link}${totalPageAcive}#${totalPageAcive}`}  onClick={()=>params(totalPageAcive)} aria-label="Last">
                                <span aria-hidden="true"><i className="fas fa-angle-double-right"></i></span> 
                            </Link>
                        </li>
                    </ul>
                );
            } else {
                return (loading==true)?(
                    <div className='row'>
                        <div className='col-lg-12'>
                            {/* <p className='p_ loading col-lg-12'>loading</p> */}
                        </div>								
                    </div>
                ):(
                    <div className='row'>
                        <div className='col-lg-12'>
                            {/* <p className='p_ col-lg-12'>Post Not Found</p> */}
                        </div>								
                    </div>
                );
                // return (
                //     <div className='row'>
                //         <div className='col-lg-12'>
                //             <p className='p_  col-lg-12'>Post Not Found</p>
                //             {/* <p className='p_ loading col-lg-12'>loading</p> */}
                //         </div>								
                //     </div>
                // );
            }
        },
        PostFilter: function(filters) {
            if(filters == "Announcement") {

            } else if(filters == "Discussions") {
                
            } else if(filters == "News") {
                
            }
        }
    }
};

export const validateEmail = (emailField) => {
    var reEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; 
    if(reEmail.test(emailField)) { 
        return true;
    } else { 
        return false;
    }

}

export const calculateAge = (dateString) => {
    if(dateString!="") {
        var today = new Date();
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return (undefined!=age)?age:"";
    } else {
        return ""
    }
}

export const capitalizeWords = (string) => {
    return typeof(string)!="undefined"&&string!=""?string.split(' ').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' '):""
}

export const getAge = (dateString) => {
    console.log("getAge",dateString);
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

export const uniques = (arr) => {
    var a = [];
    for (var i=0, l=arr.length; i<l; i++)
        if (a.indexOf(arr[i]) === -1 && arr[i] !== '')
            a.push(arr[i]);
    return a;
}

export const sortFullnameAZ = function(a,b){
    if(a.fullname.toLowerCase().trim() < b.fullname.toLowerCase().trim()){
        return -1;
    }
    if(a.fullname.toLowerCase().trim() > b.fullname.toLowerCase().trim()){
        return 1;
    }
    return 0;
}

export const weekCount = (year, month_number, startDayOfWeek) => {
    // month_number is in the range 1..12
  
    // Get the first day of week week day (0: Sunday, 1: Monday, ...)
    var firstDayOfWeek = startDayOfWeek || 0;
  
    var firstOfMonth = new Date(year, month_number-1, 1);
    var lastOfMonth = new Date(year, month_number, 0);
    var numberOfDaysInMonth = lastOfMonth.getDate();
    var firstWeekDay = (firstOfMonth.getDay() - firstDayOfWeek + 7) % 7;
  
    var used = firstWeekDay + numberOfDaysInMonth;
  
    return Math.ceil( used / 7);
  }

export const AlertSound = {
    /*
    messagebox
    smallbox
    voice_alert
    voice_off
    voice_on
    action_denied
    */
    test: async function() {
        let a = new Audio('/sound/voice_alert.mp3'); 
        a.addEventListener("canplaythrough", (event) => {
            /* the audio is now playable; play it if permissions allow */
            a.play();
        });
        // document.createElement('audio')
    },
    speech: async function(message) {
        const utterance = new SpeechSynthesisUtterance(message);
        const voices = speechSynthesis.getVoices();
        utterance.voice = voices[0]; 
        speechSynthesis.speak(utterance);
    },
    loading_data: async function(){        
        let a = new Audio('/sound/loading_data.mp3'); 
        a.addEventListener("canplaythrough", (event) => { 
            a.play();
        });
    },
    success_timelogs: async function() {
        let a = new Audio('/sound/success.mp3'); 
        a.addEventListener("canplaythrough", (event) => { 
            a.play();
        });
    },
    fail_timelogs: async function() {
        let a = new Audio('/sound/voice_off.mp3'); 
        a.addEventListener("canplaythrough", (event) => { 
            a.play();
        });
    },
    denied: async function() {
        let a = new Audio('/sound/voice_off.mp3'); 
        // let a = new Audio('/sound/voice_alert.mp3'); 
        a.addEventListener("canplaythrough", (event) => { 
            a.play();
        });
    },
    action_denied: async function() {
        let a = new Audio('/sound/action_denied.mp3'); 
        a.addEventListener("canplaythrough", (event) => { 
            a.play();
        });
    }
}
export const getWeeksInMonth = (year_month,callback) => {
    let totalWeeks = new Date(moment(year_month)).getWeekOfMonth();
    let temp = [];

    for (let week = 0; week < totalWeeks; week++) {
        temp.push({
            week: week,
            sun: null,
            mon: null,
            tue: null,
            wed: null,
            thu: null,
            fri: null,
            sat: null
        });
    }

    const weeks = [],
        firstDate = new Date(moment(year_month).startOf('month')),
        lastDate = new Date(moment(year_month).endOf('month')),
        numDays = lastDate.getDate();

    let dayOfWeekCounter = firstDate.getDay();

    for (let date = 1; date <= numDays; date++) {
      if (dayOfWeekCounter === 0 || weeks.length === 0) {
        weeks.push([]);
      }
      weeks[weeks.length - 1].push(date);
      dayOfWeekCounter = (dayOfWeekCounter + 1) % 7;
    }
    // console.log(temp,weeks);

    for (let i = 0; i < weeks.length; i++) {
        let val = weeks[i]; 
        if(temp.some(e => e.week==i)){
            val.forEach(element_ => {                    
                if(moment(year_month + "-" + element_).format('ddd') == "Mon") {
                    temp[i].mon = {
                        date: element_, 
                        fulldate: year_month + "-" + String(element_).padStart(2, '0'),
                        logs: {
                            status: '',
                            morning: '',
                            afternoon:''
                        }
                    };
                } else if(moment(year_month + "-" + element_).format('ddd') == "Tue") {
                    temp[i].tue = {
                        date: element_, 
                        fulldate: year_month + "-" + String(element_).padStart(2, '0'),
                        logs: {
                            status: '',
                            morning: '',
                            afternoon:''
                        }
                    };
                } else if(moment(year_month + "-" + element_).format('ddd') == "Wed") {
                    temp[i].wed = {
                        date: element_, 
                        fulldate: year_month + "-" + String(element_).padStart(2, '0'),
                        logs: {
                            status: '',
                            morning: '',
                            afternoon:''
                        }
                    };
                } else if(moment(year_month + "-" + element_).format('ddd') == "Thu") {
                    temp[i].thu = {
                        date: element_, 
                        fulldate: year_month + "-" + String(element_).padStart(2, '0'),
                        logs: {
                            status: '',
                            morning: '',
                            afternoon:''
                        }
                    };
                } else if(moment(year_month + "-" + element_).format('ddd') == "Fri") {
                    temp[i].fri = {
                        date: element_, 
                        fulldate: year_month + "-" + String(element_).padStart(2, '0'),
                        logs: {
                            status: '',
                            morning: '',
                            afternoon:''
                        }
                    };
                }
            });
        }
    }
    // weeks.forEach((val,i,arr) => {
    //     if(temp.some(e => e.week==i)){
    //         val.forEach(element_ => {                    
    //             if(moment(year_month + "-" + element_).format('ddd') == "Mon") {
    //                 temp[i].mon = {
    //                     date: element_, 
    //                     fulldate: year_month + "-" + String(element_).padStart(2, '0'),
    //                     logs: {
    //                         status: '',
    //                         morning: '',
    //                         afternoon:''
    //                     }
    //                 };
    //             } else if(moment(year_month + "-" + element_).format('ddd') == "Tue") {
    //                 temp[i].tue = {
    //                     date: element_, 
    //                     fulldate: year_month + "-" + String(element_).padStart(2, '0'),
    //                     logs: {
    //                         status: '',
    //                         morning: '',
    //                         afternoon:''
    //                     }
    //                 };
    //             } else if(moment(year_month + "-" + element_).format('ddd') == "Wed") {
    //                 temp[i].wed = {
    //                     date: element_, 
    //                     fulldate: year_month + "-" + String(element_).padStart(2, '0'),
    //                     logs: {
    //                         status: '',
    //                         morning: '',
    //                         afternoon:''
    //                     }
    //                 };
    //             } else if(moment(year_month + "-" + element_).format('ddd') == "Thu") {
    //                 temp[i].thu = {
    //                     date: element_, 
    //                     fulldate: year_month + "-" + String(element_).padStart(2, '0'),
    //                     logs: {
    //                         status: '',
    //                         morning: '',
    //                         afternoon:''
    //                     }
    //                 };
    //             } else if(moment(year_month + "-" + element_).format('ddd') == "Fri") {
    //                 temp[i].fri = {
    //                     date: element_, 
    //                     fulldate: year_month + "-" + String(element_).padStart(2, '0'),
    //                     logs: {
    //                         status: '',
    //                         morning: '',
    //                         afternoon:''
    //                     }
    //                 };
    //             }
    //         });
    //     }
    // });
    // return temp;
    callback(temp)
}
//  ------------- prototypes ----------------
Date.prototype.getWeekOfMonth = function () {
    var firstDay = new Date(this.setDate(1)).getDay();
    var totalDays = new Date(this.getFullYear(), this.getMonth() + 1, 0).getDate();
    return Math.ceil((firstDay + totalDays) / 7);
}

export const nextInLineYearGrade = (yrg) => {
    if(yrg == "Grade 7") {
        return "Grade 8";
    } else if(yrg == "Grade 8") {
        return "Grade 9";
    } else if(yrg == "Grade 9") {
        return "Grade 10";
    } else if(yrg == "Grade 10") {
        return "Grade 11";
    } else if(yrg == "Grade 11") {
        return "Grade 12";
    } else if(yrg == "Grade 12") {
        return "Grade 12";
    }
}
//#endregion