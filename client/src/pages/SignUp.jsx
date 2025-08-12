// import axios from 'axios';
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// export const SignUp = () => {
//  const navigate = useNavigate();
//     const[formdata,setFormData] = useState(
//       {  name:"",
//         email:"", 
//         password:""
//     })

//     const handleChange = (e) => {
//         setFormData({...formdata,[e.target.name]:e.target.value})
//     }
//     const handleSubmit = async (e) => {
//       e.preventDefault();

//       try {
//         const res = await axios.post("http://localhost:5000/auth/signup",formdata)
//         const token = res.data.data.token;
//         localStorage.setItem("token",token)
//         navigate("/");
//       } catch (error) {
//         alert(error.response?.data?.message||"SignUp failed")
//       }
//     }
//     return (
//         <form onSubmit={handleSubmit}>
//           <input name="name" placeholder="Name" onChange={handleChange} />
//           <input name="email" placeholder="Email" onChange={handleChange} />
//           <input name="password" type="password" placeholder="Password" onChange={handleChange} />
//           <button type="submit">Sign Up</button>
//         </form>
//       );
// }