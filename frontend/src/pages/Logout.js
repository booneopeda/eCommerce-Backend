import { Navigate } from "react-router-dom";
import UserContext from "../UserContext";
import { useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { googleLogout } from "@react-oauth/google";

export default function Logout() {
  const { setUser, unsetUser } = useContext(UserContext);

  useEffect(() => {
    setUser({ id: null, isAdmin: null });
    googleLogout();
    unsetUser();
    Swal.fire({
      title: "Logged out successfully",
      icon: "success",
      text: "See you again!",
      confirmButtonColor: "#2d1b07",
    });
  });

  return <Navigate to="/login" />;
}
