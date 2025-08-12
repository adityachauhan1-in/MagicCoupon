// import axios from "axios";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom"


// export const Login = () => {

//     const navigate = useNavigate();

//     const [formdata,setFormData] = useState({
//   email:"",
//   password:""
//     })
//     const handleChange = (e) => {
//         setFormData({...formdata,[e.target.name]:e.target.value});
//     }
//     const handleSubmit = async(e) => {
   
//         e.preventDefault();
//         try {
//             const res = await axios.post("http://localhost:5000/auth/login", formdata);
//             const token = res.data.data.token;
//             localStorage.setItem("token", token)
//             navigate("/") 
//         } catch (error) {
//             console.log(error.message)
//            alert(error.response?.data?.message||"login failed") 
//         }

 
//     }
//     return (
//         <form onSubmit={handleSubmit}>
//           <input name="email" placeholder="Email" onChange={handleChange} />
//           <input name="password" type="password" placeholder="Password" onChange={handleChange} />
//           <button type="submit">Log In</button>
//         </form>
//       )


// }