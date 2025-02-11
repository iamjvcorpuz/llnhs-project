import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom"; 

import '../css/app.css';

import AttendancePage from './Pages/AttendanceKioskPage';
import Dashboard from './Pages/Admin/Dashboard';
import Student from './Pages/Admin/Student';
import Teacher from './Pages/Admin/Teacher';
import Subject from './Pages/Admin/Subject';
import Users from './Pages/Admin/Users';
 
// const createBrowserHistory = require("history").createBrowserHistory;

const App = () => {
    return (
    <Router>
        <Routes>
            <Route exact path="/attendance/kiosk" element={<AttendancePage />} />
            <Route exact path="/admin/dashboard" element={<Dashboard />} />
            <Route exact path="/admin/dashboard/student" element={<Student />} />
            <Route exact path="/admin/dashboard/teacher" element={<Teacher />} />
            <Route exact path="/admin/dashboard/subject" element={<Subject />} />
            <Route exact path="/admin/dashboard/Users" element={<Users />} />
        </Routes>
    </Router>
    )
};

export default App;