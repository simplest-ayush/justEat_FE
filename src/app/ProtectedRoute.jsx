import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";


export default function ProtectedRoute({children, allowedRoles}){

    const {user, isLoading}=useAuth();

    if(isLoading){
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500 text-sm">Loading...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
}