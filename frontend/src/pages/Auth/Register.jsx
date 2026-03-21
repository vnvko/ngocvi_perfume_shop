// Trang đăng ký — redirect sang tab register trong Login page
import { Navigate } from 'react-router-dom';
export default function Register() { return <Navigate to="/login" state={{ register: true }} replace />; }
