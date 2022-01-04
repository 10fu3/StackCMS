import {Navigate,RouteProps,Outlet} from 'react-router-dom';
import {isAuthSelector} from "../../store/auth";
import {useSelector} from "react-redux";
import React, {FC} from "react";

const PrivateRoute: FC<RouteProps> = ()=>{
    const isAuth = useSelector(isAuthSelector);
    return isAuth ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute
