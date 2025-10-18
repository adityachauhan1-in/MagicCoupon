import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

            const ProtectedRoute = () => {
       const { user ,loading} = useAuth();
       if(loading){
        return <div>Loading...</div>;   
       }
      // if user is logged in, show the outlet (the protected route)
      // if user is not logged in, redirect to the login page
   return user ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;