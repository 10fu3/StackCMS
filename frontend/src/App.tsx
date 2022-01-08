import React from 'react';
import './App.css';
import Top from "./component/Top";
import {Routes, Route, Navigate, Outlet} from "react-router-dom";
import PrivateRoute from "./component/auth/PrivateRoute";
import LoginPage from "./component/Login";
import {isAuthSelector} from "./store/auth";
import NotFound from "./component/NotFound";
import {useSelector} from "react-redux";
import DisplayList from "./component/DisplayList";
import ContentsList from "./component/content/ContentsList";
import ApiSettings from "./component/api/ApiSettings";
import MembersList from "./component/manage/MemberList";
import RoleListPage from "./component/manage/RoleListPage";
import ApiCreate from "./component/api/ApiCreate";
import ContentsNew from "./component/content/ContentsNew";
import ContentsEditor from "./component/content/ContentsEditor";
import RoleDetailPage from "./component/manage/RoleDetail";
import ApiSchemaSettings from "./component/api/settings/ApiSchemaSettings";
import {Box} from "@chakra-ui/layout";

const App:React.FC = ()=>{
  return useSelector(isAuthSelector) ? <Routes>
    <Route path="" element={<PrivateRoute/>}>
      <Route path="" element={<Top/>}>
        <Route path="new-member" />
        <Route path="new-api" element={<ApiCreate/>}/>
        {/*管理*/}
        <Route path="manage" element={<DisplayList category={"manage"}/>}/>
        <Route path="manage/member" element={<MembersList/>}/>
        <Route path="manage/member/:member_id"/>
        <Route path="manage/role" element={<RoleListPage/>}/>
        <Route path="manage/role/:role_id" element={<RoleDetailPage/>}/>
        {/*コンテンツ(API)ページ*/}
        <Route path="api" element={<DisplayList category={"api"}/>}/>
        <Route path="api/:id" element={<ContentsList/>}/>
        <Route path="api/:id/:contents_id" element={<ContentsEditor/>}/>
        <Route path="api/:id/new" element={<ContentsNew/>}/>
        <Route path="api/:id/settings" element={<ApiSettings/>}>
          <Route path="" element={<Box>top</Box>}/>
        </Route>
        <Route path="api/:id/settings/" element={<ApiSettings/>}>
          <Route path="" element={<Box>1</Box>}/>
          <Route path="schema" element={<ApiSchemaSettings/>}/>
          <Route path="preview" element={<Box>2</Box>}/>
          <Route path="webhook" element={<Box>3</Box>}/>
          <Route path="delete" element={<Box>4</Box>}/>
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
