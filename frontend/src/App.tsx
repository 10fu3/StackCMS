import React from 'react';
import './App.css';
import Top from "./component/Top";
import {Routes, Route, Navigate} from "react-router-dom";
import PrivateRoute from "./component/auth/PrivateRoute";
import LoginPage from "./component/Login";
import {isAuthSelector} from "./store/auth";
import NotFound from "./component/NotFound";
import {useSelector} from "react-redux";
import DisplayList from "./component/DisplayList";
import ContentsList from "./component/content/ContentsList";
import ApiSettings from "./component/api/ApiSettings";
import MembersList from "./component/manage/member/MemberList";
import RoleListPage from "./component/manage/role/RoleListPage";
import ApiCreate from "./component/api/ApiCreate";
import ContentsNew from "./component/content/ContentsNew";
import ContentsEditor from "./component/content/ContentsEditor";
import RoleDetailPage from "./component/manage/role/RoleDetail";
import ApiSchemaSettings from "./component/api/settings/ApiSchemaSettings";
import {Box} from "@chakra-ui/layout";
import ApiDeleteSettings from "./component/api/settings/ApiDeleteSettings";
import RoleCreatePage from "./component/manage/role/RoleCreate";
import ProfilePage from "./component/ProfilePage";
import RoleEditPage from "./component/manage/role/RoleEdit";
import MemberCreate from "./component/manage/member/MemberCreate";
import ProfileUpdatePage from "./component/manage/member/MemberUpdate";

const App:React.FC = ()=>{
  return useSelector(isAuthSelector) ? <Routes>
    <Route path="" element={<PrivateRoute/>}>
      <Route path="" element={<Top/>}>
        <Route path="profile/self" element={<ProfilePage/>}/>
        <Route path="profile/:id" element={<ProfilePage/>}/>
        <Route path="profile/:id/edit" element={<ProfileUpdatePage/>}/>
        {/*管理*/}
        <Route path="manage" element={<DisplayList category={"manage"}/>}/>
        <Route path="manage/member" element={<MembersList/>}/>
        <Route path="manage/member/create" element={<MemberCreate/>}/>
        <Route path="manage/role" element={<RoleListPage/>}/>
        <Route path="manage/role/create" element={<RoleCreatePage/>}/>
        <Route path="manage/role/:role_id" element={<RoleDetailPage/>}/>
        <Route path="manage/role/:role_id/edit" element={<RoleEditPage/>}/>
        {/*コンテンツ(API)ページ*/}
        <Route path="api" element={<DisplayList category={"api"}/>}/>
        <Route path="api/create" element={<ApiCreate/>}/>
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
          <Route path="delete" element={<ApiDeleteSettings/>}/>
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
