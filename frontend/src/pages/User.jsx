import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import Header from "../components/Header";
import { ToastContainer, toast } from "react-toastify";
import "../styles/user.scss"

const User = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");
  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.token) {
        navigate("/login");
      }
      const { data } = await axios.post(
        "http://localhost:4000",
        {},
        { withCredentials: true }
      );
      const { status, user } = data;
      setUsername(user);
      return status
        ? toast(`Hello ${user}`, {
            position: "top-right",
          })
        : (removeCookie("token"), navigate("/login"));
    };
    verifyCookie();
  }, [cookies, navigate, removeCookie]);

  const handleLogout = () => {
    removeCookie("token");
    navigate("/signup");
  };
  return (
    <>
     <Header logout={handleLogout} />
      <div className="home_page">
        <h4>
          {" "}
          Welcome back <span>{username}</span>
        </h4>
        {/* <button onClick={Logout}>LOGOUT</button> */}
      </div>
      {/* <ToastContainer /> */}
    </>
  );
};

export default User;