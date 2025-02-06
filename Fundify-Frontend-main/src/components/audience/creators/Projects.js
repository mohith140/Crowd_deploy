// import React, { useState, useRef, useEffect } from "react";
// import axios from "axios";
// import Grid from "@mui/material/Grid";
// import Card from "@mui/material/Card";
// import CardActions from "@mui/material/CardActions";
// import CardContent from "@mui/material/CardContent";
// import CardMedia from "@mui/material/CardMedia";
// import Typography from "@mui/material/Typography";
// import Button from "@mui/material/Button";
// import TextField from "@mui/material/TextField";
// import { SERVER_URL } from "../../../constant/serverUrl";
// import { useHistory } from "react-router-dom";

// function Projects() {
//   const history = useHistory();
//   const [projects, setProjects] = useState([]);
//   const amountRefs = useRef([]);
//   const [amount, setAmount] = useState(0);

//   useEffect(() => {
//     axios
//       .get(SERVER_URL + "/projects")
//       .then((response) => {
//         setProjects(response.data);
//       })
//       .catch((err) => console.log(err));
//   }, []);

//   const handlePledge = (pageName, projectTitle, idx) => {
//     const pledgeAmount = parseInt(amountRefs.current[idx].value) || 0;
//     setAmount(pledgeAmount);
//     handlePayment(pledgeAmount);

//     axios
//       .post(SERVER_URL + "/creator/project/pledge", {
//         timestamp: Date.now(),
//         projectTitle: projectTitle,
//         amount: pledgeAmount,
//         pageName: pageName,
//         audienceEmail: localStorage.getItem("email"),
//         firstName: localStorage.getItem("firstName"),
//         lastName: localStorage.getItem("lastName"),
//       })
//       .then(() => axios.get(SERVER_URL + "/projects").then((response) => setProjects(response.data)))
//       .catch((err) => console.log(err));
//   };

//   const handlePayment = (amount) => {
//     const options = {
//       key: "rzp_test_XphPOSB4djGspx",
//       amount: amount * 100,
//       currency: "INR",
//       name: "Fundify",
//       description: "Payment for Pledge",
//       handler: function (response) {
//         alert("Payment Successful!");
//       },
//       prefill: {
//         name: localStorage.getItem("firstName") + " " + localStorage.getItem("lastName"),
//         email: localStorage.getItem("email"),
//       },
//       theme: { color: "#00e676" },
//     };
//     const rzp = new window.Razorpay(options);
//     rzp.open();
//   };

//   return (
//     <Grid container spacing={4} style={{ padding: "3rem", backgroundColor: "#f5f5f5" }}>
//       {projects.map((element, index) => (
//         <Grid item key={index} xs={12} sm={6} md={4} lg={4}>
//           <Card
//             sx={{
//               width: 330, 
//              borderRadius: "16px",
//               backgroundColor: "#1e1e1e",
//               color: "white",
//               transition: "transform 0.3s, box-shadow 0.3s",
//               "&:hover": {
//                 transform: "scale(1.05)",
//                 boxShadow: "0 6px 12px rgba(0, 230, 118, 0.5)",
//               },
//             }}
//           >
//             <CardMedia
//               component="img"
//               height="220"
//               image={element.imageUrl}
//               alt={element.title}
//               style={{ borderRadius: "16px 16px 0 0" }}
//             />
//             <CardContent>
//               <Typography gutterBottom variant="h5" style={{ color: "#00e676", textAlign: "center" }}>
//                 {element.title}
//               </Typography>
//               <Typography variant="body2" color="lightgrey" textAlign="center">
//                 {element.description}
//               </Typography>
//             </CardContent>
//             <CardActions style={{ display: "flex", justifyContent: "space-between", padding: "1rem" }}>
//               <Typography variant="body1" color="orange" fontWeight="bold">
//                 Required: ₹ {element.amount}
//               </Typography>
//               <Typography variant="body1" color="lime" fontWeight="bold">
//                 Raised: ₹ {element.audience.reduce((total, a) => total + (parseInt(a.amount) || 0), 0)}
//               </Typography>
//             </CardActions>
//             <CardActions style={{ justifyContent: "center", paddingBottom: "1rem" }}>
//               <TextField
//                 inputRef={(ref) => (amountRefs.current[index] = ref)}
//                 type="number"
//                 variant="outlined"
//                 size="small"
//                 placeholder="Amount (₹)"
//                 sx={{
//                   backgroundColor: "white",
//                   borderRadius: "8px",
//                   input: { color: "black", textAlign: "center" },
//                   width: "90%",
//                 }}
//               />
//             </CardActions>
//             <CardActions>
//               <Button
//                 fullWidth
//                 sx={{
//                   backgroundColor: "#00e676",
//                   color: "black",
//                   fontWeight: "bold",
//                   "&:hover": {
//                     backgroundColor: "#00c853",
//                   },
//                 }}
//                 onClick={() => handlePledge(element.pageName, element.title, index)}
//               >
//                 Pledge
//               </Button>
//             </CardActions>
//           </Card>
//         </Grid>
//       ))}
//     </Grid>
//   );
// }

// export default Projects;


import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { SERVER_URL } from "../../../constant/serverUrl";
import { useHistory } from "react-router-dom";

function Projects() {
  const history = useHistory();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const amountRefs = useRef([]);
  const [amount, setAmount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all projects
  useEffect(() => {
    axios
      .get(SERVER_URL + "/projects")
      .then((response) => {
        setProjects(response.data);
        setFilteredProjects(response.data); // Initially show all projects
      })
      .catch((err) => console.log(err));
  }, []);

  // Filter projects based on search term
  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    // Filter projects by title
    const filtered = projects.filter((project) =>
      project.title.toLowerCase().includes(term)
    );
    setFilteredProjects(filtered);
  };

  const handlePledge = (pageName, projectTitle, idx) => {
    const pledgeAmount = parseInt(amountRefs.current[idx].value) || 0;
    setAmount(pledgeAmount);
    handlePayment(pledgeAmount);

    axios
      .post(SERVER_URL + "/creator/project/pledge", {
        timestamp: Date.now(),
        projectTitle: projectTitle,
        amount: pledgeAmount,
        pageName: pageName,
        audienceEmail: localStorage.getItem("email"),
        firstName: localStorage.getItem("firstName"),
        lastName: localStorage.getItem("lastName"),
      })
      .then(() => axios.get(SERVER_URL + "/projects").then((response) => setProjects(response.data)))
      .catch((err) => console.log(err));
  };

  const handlePayment = (amount) => {
    const options = {
      key: "rzp_test_XphPOSB4djGspx",
      amount: amount * 100,
      currency: "INR",
      name: "Fundify",
      description: "Payment for Pledge",
      handler: function (response) {
        alert("Payment Successful!");
      },
      prefill: {
        name: localStorage.getItem("firstName") + " " + localStorage.getItem("lastName"),
        email: localStorage.getItem("email"),
      },
      theme: { color: "#00e676" },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // Navigate to the detailed page of the selected project
  const handleViewDetails = (projectId) => {
    history.push(`/project-details/${projectId}`);
  };

  return (
    <div>
      {/* Filter Box */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
  <TextField
    variant="outlined"
    size="medium"
    placeholder="Search by Title"
    value={searchTerm}
    onChange={handleSearch}
    sx={{
      backgroundColor: "white",
      borderRadius: "80rem", // More rounded corners
      width: "40%", // Reduced width for a narrower look
      height:"70%",
      input: { color: "black", textAlign: "center" },
      marginTop: "2rem",
      fontWeight: "bold",
    }}
  />
</div>


      <Grid container spacing={4} style={{ padding: "3rem", backgroundColor: "#f5f5f5" }}>
        {filteredProjects.map((element, index) => (
          <Grid item key={index} xs={12} sm={6} md={4} lg={4}>
            <Card
              sx={{
                width: 330,
                borderRadius: "16px",
                backgroundColor: "#1e1e1e",
                color: "white",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0 6px 12px rgba(0, 230, 118, 0.5)",
                },
              }}
              onClick={() => handleViewDetails(element._id)} // Clicking redirects to detailed view
            >
              <CardMedia
                component="img"
                height="220"
                image={element.imageUrl}
                alt={element.title}
                style={{ borderRadius: "16px 16px 0 0" }}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" style={{ color: "#00e676", textAlign: "center" }}>
                  {element.title}
                </Typography>
                <Typography variant="body2" color="lightgrey" textAlign="center">
                  {element.description}
                </Typography>
              </CardContent>
              <CardActions style={{ display: "flex", justifyContent: "space-between", padding: "1rem" }}>
                <Typography variant="body1" color="orange" fontWeight="bold">
                  Required: ₹ {element.amount}
                </Typography>
                <Typography variant="body1" color="lime" fontWeight="bold">
                  Raised: ₹ {element.audience.reduce((total, a) => total + (parseInt(a.amount) || 0), 0)}
                </Typography>
              </CardActions>
              <CardActions style={{ justifyContent: "center", paddingBottom: "1rem" }}>
                <TextField
                  inputRef={(ref) => (amountRefs.current[index] = ref)}
                  type="number"
                  variant="outlined"
                  size="small"
                  placeholder="Amount (₹)"
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    input: { color: "black", textAlign: "center" },
                    width: "90%",
                  }}
                />
              </CardActions>
              <CardActions>
                <Button
                  fullWidth
                  sx={{
                    backgroundColor: "#00e676",
                    color: "black",
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: "#00c853",
                    },
                  }}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent click from triggering project detail navigation
                    handlePledge(element.pageName, element.title, index);
                  }}
                >
                  Pledge
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default Projects;
