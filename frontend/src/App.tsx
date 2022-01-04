import React from 'react';
import './App.css';
import Top from "./component/Top";
import {Routes, Route, Navigate, Outlet} from "react-router-dom";
import PrivateRoute from "./component/auth/PrivateRoute";
import LoginPage from "./component/Login";
import {isAuthSelector, setCurrentUser} from "./store/auth";
import NotFound from "./component/NotFound";
import {useSelector} from "react-redux";
import ContentsList from "./component/ContentsList";
import ContentsDetail from "./component/ContentsDetail";
import ApiSettings from "./component/api/ApiSettings";

const App:React.FC = ()=>{
  return useSelector(isAuthSelector) ? <Routes>
    <Route path="" element={<PrivateRoute/>}>
      <Route path="" element={<Top/>}>
        <Route path="members">
          <Route path=":member_id"/>
        </Route>
        <Route path="roles">
          <Route path=":role_id"/>
        </Route>

        <Route path=":category" element={<ContentsList/>}>
          <Route path=":id" element={<ContentsDetail/>}>
            <Route path=":settings" element={<ApiSettings/>}>
              <Route path=":option" element={<Outlet/>}/>
            </Route>
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<NotFound/>}/>
      <Route path="/login" element={(()=>{
        return <Navigate to="/api"/>
      })()}/>
    </Route>
  </Routes> : <Routes>
    <Route path="/login" element={<LoginPage/>}/>
    <Route path="*" element={<Navigate to={"/login"}/>}/>
  </Routes>
}

export default App;
