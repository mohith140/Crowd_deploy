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
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { SERVER_URL } from "../../../constant/serverUrl";
import { useHistory } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

function Projects() {
  const history = useHistory();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const amountRefs = useRef([]);
  const [amount, setAmount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openSnackbar1, setOpenSnackbar1] = useState(false);
  const [snackbarMessage1, setSnackbarMessage1] = useState("");
  const [Raised, setRaised] = useState("");
  
  // Category Filter States
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  
  useEffect(() => {
    axios
      .get(SERVER_URL + "/projects")
      .then((response) => {
        setProjects([...response.data].reverse());
        setFilteredProjects([...response.data].reverse()); // Initially show all projects
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    // Filter projects by title
    const filtered = projects.filter((project) =>
      project.title.toLowerCase().includes(term)
    );
    setFilteredProjects(filtered);
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    setAnchorEl(null);

    // Filter projects by category
    if (category === "Education" || category === "Technology" || category === "Donation") {
      const filtered = projects.filter((project) =>
      
        project.category &&  project.category.toLowerCase() === category.toLowerCase()
      
      );
      setFilteredProjects(filtered);
    } else {
      setFilteredProjects(projects); // Reset to all projects if no category selected
    }
  };

  const handlePledge = (pageName, projectTitle, idx) => {
    const pledgeAmount = parseInt(amountRefs.current[idx].value) || 0;
    if (pledgeAmount === 0) return;

    // Find the specific project to update
    const updatedProjects = [...projects];
    const projectIndex = updatedProjects.findIndex((project) => project.title === projectTitle);
    
    if (projectIndex !== -1) {
      const updatedProject = updatedProjects[projectIndex];
      
      // Check if the pledge amount exceeds the required amount
      if (pledgeAmount < 50) {
        setSnackbarMessage("Amount of "+pledgeAmount+"not allowed!");
        setOpenSnackbar(true);
       
        setSnackbarMessage1("please pledge with a minimum amount of 50");
        setOpenSnackbar1(true);
      
       
        return;
      }

     let x=updatedProject.audience.reduce((total, a) => total + (parseInt(a.amount) || 0), 0)
      if (x+pledgeAmount > updatedProject.amount) {
        setSnackbarMessage("Amount exceeds the required pledge amount!");
        setOpenSnackbar(true);
        return;
      }

      // Add the pledge to the audience list
      updatedProject.audience.push({
        timestamp: Date.now(),
        firstName: localStorage.getItem("firstName"),
        lastName: localStorage.getItem("lastName"),
        amount: pledgeAmount,
      });

      // Update the raised amount for the project
      updatedProject.raisedAmount = updatedProject.audience.reduce(
        (total, a) => total + (parseInt(a.amount) || 0),
        0
      );

      // Update the projects in the state
      updatedProjects[projectIndex] = updatedProject;

      // Now set the new state for both projects and filteredProjects
      setProjects(updatedProjects);
      setFilteredProjects(updatedProjects);
    }

    // Send the pledge to the server
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
      .catch((err) => console.log(err));
  };

  const handleViewDetails = (projectId) => {
    history.push(`/project-details/${projectId}`);
  };

  return (
    <div>
      {/* Filter and Search Box */}
     
      {/* Project Cards */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "2rem", backgroundColor: "#f5f5f5", top: "20px", flexDirection: "column", alignItems: "center" }}>
        
        {/* Filter Button */}
       
        {/* Search Box */}
        
        <TextField
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by Project Title"
          sx={{
            borderRadius: "25px",
            width: "50%",
            backgroundColor: "#f5f5f5",
            "& .MuiOutlinedInput-root": {
              borderRadius: "25px",
              borderColor: "green",
            },
            top: "23px",
            borderColor: "green",
            input: {
              paddingLeft: "1rem",
            },
          }}
        />
      </div>
      <Button
          aria-controls="category-menu"
          aria-haspopup="true"
          onClick={(event) => setAnchorEl(event.currentTarget)}
          sx={{
            backgroundColor: "#00e676",
            color: "black",
            fontWeight: "bold",
            marginBottom: "10px",
            marginLeft:"530px",
            width: "200px",
          }}
        >
         Category
        </Button>
        
        <Menu
          id="category-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={() => handleCategoryFilter("Education")}>Education</MenuItem>
          <MenuItem onClick={() => handleCategoryFilter("Technology")}>Technology</MenuItem>
          <MenuItem onClick={() => handleCategoryFilter("Donation")}>Donation</MenuItem>
          <MenuItem onClick={() => handleCategoryFilter("All")}>All</MenuItem>
        </Menu>

     
      <Grid container spacing={4} style={{ padding: "3rem", backgroundColor: "#f5f5f5" }}>
        {filteredProjects.map((element, index) => (
          <Grid item key={index} xs={12} sm={6} md={4} lg={4}>
            <Card sx={{ width: 330, borderRadius: "16px", backgroundColor: "#1e1e1e", color: "white", transition: "transform 0.3s, box-shadow 0.3s", "&:hover": { transform: "scale(1.05)", boxShadow: "0 6px 12px rgba(0, 230, 118, 0.5)" } }}>
              <CardMedia
                component="img"
                height="220"
                image={element.imageUrl}
                alt={element.title}
                style={{ borderRadius: "16px 16px 0 0" }}
                onClick={() => handleViewDetails(element._id)}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" style={{ color: "#00e676", textAlign: "center" }} onClick={() => handleViewDetails(element._id)}>
                  {element.title}
                </Typography>
                <Typography variant="body2" color="lightgrey" textAlign="center" onClick={() => handleViewDetails(element._id)}>
                  {/* {element.description} */}
                </Typography>
              </CardContent>
              <CardActions style={{ display: "flex", justifyContent: "space-between", padding: "1rem" }}>
                <Typography variant="body1" color="orange" fontWeight="bold">
                  Required: ₹ {element.amount}
                </Typography>
                <Typography variant="body1" color="lime" fontWeight="bold">
                  Raised: ₹ {element.audience.reduce((total, a) => total + (parseInt(a.amount) || 0), 0) }
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
                  onClick={() => handlePledge(element.pageName, element.title, index)}
                >
                  Pledge
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Snackbar */}
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="error" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <div>
        <Snackbar open={openSnackbar1} autoHideDuration={3000} onClose={() => setOpenSnackbar1(false)}>
          <Alert onClose={() => setOpenSnackbar1(false)} severity="error" sx={{ width: '100%' }}>
            {snackbarMessage1}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
}

export default Projects;

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
// import Snackbar from "@mui/material/Snackbar";
// import Alert from "@mui/material/Alert";
// import { SERVER_URL } from "../../../constant/serverUrl";
// import { useHistory } from "react-router-dom";

// function Projects() {
//   const history = useHistory();
//   const [projects, setProjects] = useState([]);
//   const [filteredProjects, setFilteredProjects] = useState([]);
//   const amountRefs = useRef([]);
//   const [amount, setAmount] = useState(0);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [openSnackbar, setOpenSnackbar] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");
//   const [openSnackbar1, setOpenSnackbar1] = useState(false);
//   const [snackbarMessage1, setSnackbarMessage1] = useState("");
//   const [Raised, setRaised] = useState("");
//   useEffect(() => {
//     axios
//       .get(SERVER_URL + "/projects")
//       .then((response) => {
//         setProjects([...response.data].reverse());
//         setFilteredProjects([...response.data].reverse()); // Initially show all projects
//       })
//       .catch((err) => console.log(err));
//   }, []);

//   const handleSearch = (event) => {
//     const term = event.target.value.toLowerCase();
//     setSearchTerm(term);

//     // Filter projects by title
//     const filtered = projects.filter((project) =>
//       project.title.toLowerCase().includes(term)
//     );
//     setFilteredProjects(filtered);
//   };

//   const handlePledge = (pageName, projectTitle, idx) => {
//     const pledgeAmount = parseInt(amountRefs.current[idx].value) || 0;
//     if (pledgeAmount === 0) return;

//     // Find the specific project to update
//     const updatedProjects = [...projects];
//     const projectIndex = updatedProjects.findIndex((project) => project.title === projectTitle);
    
//     if (projectIndex !== -1) {
//       const updatedProject = updatedProjects[projectIndex];
      
//       // Check if the pledge amount exceeds the required amount
//       if (pledgeAmount < 50) {
//         setSnackbarMessage("Amount of "+pledgeAmount+"not allowed!");
//         setOpenSnackbar(true);
       
//         setSnackbarMessage1("please pledge with a minimum amount of 50");
//         setOpenSnackbar1(true);
      
       
//         return;
//       }
//      // console.log(updatedProject.amount+" "+updatedProject.audience.reduce((total, a) => total + (parseInt(a.amount) || 0), 0))
//      let x=updatedProject.audience.reduce((total, a) => total + (parseInt(a.amount) || 0), 0)
//       if (x+pledgeAmount > updatedProject.amount) {
//         setSnackbarMessage("Amount exceeds the required pledge amount!");
//         setOpenSnackbar(true);
//         return;
//       }

//       // Add the pledge to the audience list
//       updatedProject.audience.push({
//         timestamp: Date.now(),
//         firstName: localStorage.getItem("firstName"),
//         lastName: localStorage.getItem("lastName"),
//         amount: pledgeAmount,
//       });

//       // Update the raised amount for the project
//       updatedProject.raisedAmount = updatedProject.audience.reduce(
//         (total, a) => total + (parseInt(a.amount) || 0),
//         0
//       );

//       // Update the projects in the state
//       updatedProjects[projectIndex] = updatedProject;

//       // Now set the new state for both projects and filteredProjects
//       setProjects(updatedProjects);
//       setFilteredProjects(updatedProjects);
//     }

//     // Send the pledge to the server
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
//       .catch((err) => console.log(err));
//   };

//   const handleViewDetails = (projectId) => {
//     history.push(`/project-details/${projectId}`);
//   };

//   return (
//     <div>
//       {/* Search Box */}
//       <div style={{ display: "flex", justifyContent: "center", marginBottom: "2rem", backgroundColor: "#f5f5f5", top: "20px" }}>
//         <TextField
//           variant="outlined"
//           size="small"
//           value={searchTerm}
//           onChange={handleSearch}
//           placeholder="Search by Project Title"
//           sx={{
//             borderRadius: "25px",
//             width: "50%",
//             backgroundColor: "#f5f5f5",
//             "& .MuiOutlinedInput-root": {
//               borderRadius: "25px",
//               borderColor: "green",
//             },
//             top: "23px",
//             borderColor: "green",
//             input: {
//               paddingLeft: "1rem",
//             },
//           }}
//         />
//       </div>

//       {/* Project Cards */}
//       <Grid container spacing={4} style={{ padding: "3rem", backgroundColor: "#f5f5f5" }}>
//         {filteredProjects.map((element, index) => (
//           <Grid item key={index} xs={12} sm={6} md={4} lg={4}>
//             <Card sx={{ width: 330, borderRadius: "16px", backgroundColor: "#1e1e1e", color: "white", transition: "transform 0.3s, box-shadow 0.3s", "&:hover": { transform: "scale(1.05)", boxShadow: "0 6px 12px rgba(0, 230, 118, 0.5)" } }}>
//               <CardMedia
//                 component="img"
//                 height="220"
//                 image={element.imageUrl}
//                 alt={element.title}
//                 style={{ borderRadius: "16px 16px 0 0" }}
//                 onClick={() => handleViewDetails(element._id)}
//               />
//               <CardContent>
//                 <Typography gutterBottom variant="h5" style={{ color: "#00e676", textAlign: "center" }} onClick={() => handleViewDetails(element._id)}>
//                   {element.title}
//                 </Typography>
//                 <Typography variant="body2" color="lightgrey" textAlign="center" onClick={() => handleViewDetails(element._id)}>
//                   {element.description}
//                 </Typography>
//               </CardContent>
//               <CardActions style={{ display: "flex", justifyContent: "space-between", padding: "1rem" }}>
//                 <Typography variant="body1" color="orange" fontWeight="bold">
//                   Required: ₹ {element.amount}
//                 </Typography>
//                 <Typography variant="body1" color="lime" fontWeight="bold">
//                   Raised: ₹ {element.audience.reduce((total, a) => total + (parseInt(a.amount) || 0), 0) }
//                           </Typography>
//               </CardActions>
//               <CardActions style={{ justifyContent: "center", paddingBottom: "1rem" }}>
//                 <TextField
//                   inputRef={(ref) => (amountRefs.current[index] = ref)}
//                   type="number"
//                   variant="outlined"
//                   size="small"
//                   placeholder="Amount (₹)"
//                   sx={{
//                     backgroundColor: "white",
//                     borderRadius: "8px",
//                     input: { color: "black", textAlign: "center" },
//                     width: "90%",
//                   }}
//                 />
//               </CardActions>
//               <CardActions>
//                 <Button
//                   fullWidth
//                   sx={{
//                     backgroundColor: "#00e676",
//                     color: "black",
//                     fontWeight: "bold",
//                     "&:hover": {
//                       backgroundColor: "#00c853",
//                     },
//                   }}
//                   onClick={() => handlePledge(element.pageName, element.title, index)}
//                 >
//                   Pledge
//                 </Button>
//               </CardActions>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>

//       {/* Snackbar */}
//       <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
//         <Alert onClose={() => setOpenSnackbar(false)} severity="error" sx={{ width: '100%' }}>
//           {snackbarMessage}
//         </Alert>
//       </Snackbar>
//       <div>
//       <Snackbar open={openSnackbar1} autoHideDuration={3000} onClose={() => setOpenSnackbar1(false)}>
//         <Alert onClose={() => setOpenSnackbar1(false)} severity="error" sx={{ width: '100%' }}>
//           {snackbarMessage1}
//         </Alert>
//       </Snackbar>
//       </div>
//     </div>
//   );
// }

// export default Projects;


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
//   const [filteredProjects, setFilteredProjects] = useState([]);
//   const amountRefs = useRef([]);
//   const [amount, setAmount] = useState(0);
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     axios
//       .get(SERVER_URL + "/projects")
//       .then((response) => {
//         setProjects([...response.data].reverse());
//         setFilteredProjects([...response.data].reverse()); // Initially show all projects
//       })
//       .catch((err) => console.log(err));
     
//   }, []);

//   const handleSearch = (event) => {
//     const term = event.target.value.toLowerCase();
//     setSearchTerm(term);

//     // Filter projects by title
//     const filtered = projects.filter((project) =>
//       project.title.toLowerCase().includes(term)
//     );
//     setFilteredProjects(filtered);
//   };
//   const handlePledge = (pageName, projectTitle, idx) => {
//     const pledgeAmount = parseInt(amountRefs.current[idx].value) || 0;
//     if (pledgeAmount === 0) return;
  
//     // Find the specific project to update
//     const updatedProjects = [...projects];
//     const projectIndex = updatedProjects.findIndex((project) => project.title === projectTitle);
    
//     if (projectIndex !== -1) {
//       const updatedProject = updatedProjects[projectIndex];
//       updatedProject.audience.push({
//         timestamp: Date.now(),
//         firstName: localStorage.getItem("firstName"),
//         lastName: localStorage.getItem("lastName"),
//         amount: pledgeAmount,
//       });
  
//       // Update the raised amount for the project
//       updatedProject.raisedAmount = updatedProject.audience.reduce(
//         (total, a) => total + (parseInt(a.amount) || 0),
//         0
//       );
  
//       // Update the projects in the state
//       updatedProjects[projectIndex] = updatedProject;
  
//       // Now set the new state for both projects and filteredProjects
//       setProjects(updatedProjects);
//       setFilteredProjects(updatedProjects);
//     }
  
//     // Send the pledge to the server
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
//       .catch((err) => console.log(err));
//   };
//   const handlePledge1 = (pageName, projectTitle, idx) => {
//     const pledgeAmount = parseInt(amountRefs.current[idx].value) || 0;
//     if(pledgeAmount==0)
//       return;
//     setAmount(pledgeAmount);
//    // handlePayment(pledgeAmount);

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

//   const handleViewDetails = (projectId) => {
//     history.push(`/project-details/${projectId}`);
//   };

//   return (
//     <div>
//       {/* Search Box */}
//       <div style={{ display: "flex", justifyContent: "center", marginBottom: "2rem",backgroundColor: "#f5f5f5",top:"20px" }}>
//         <TextField
//           variant="outlined"
//           size="small"
//           value={searchTerm}
//           onChange={handleSearch}
//           placeholder="Search by Project Title"
//           sx={{
//             borderRadius: "25px",
//             width: "50%",
//            backgroundColor: "#f5f5f5",
//             "& .MuiOutlinedInput-root": {
//               borderRadius: "25px",
//               borderColor:"green",
              
//             },
//             top:"23px",
//             borderColor:"green",
//             input: {
//               paddingLeft: "1rem",
//             },
//           }}
//         />
//       </div>

//       {/* Project Cards */}
//       <Grid container spacing={4} style={{ padding: "3rem", backgroundColor: "#f5f5f5" }}>
//         {filteredProjects.map((element, index) => (
//           <Grid item key={index} xs={12} sm={6} md={4} lg={4}>
//             <Card
//               sx={{
//                 width: 330,
//                 borderRadius: "16px",
//                 backgroundColor: "#1e1e1e",
//                 color: "white",
//                 transition: "transform 0.3s, box-shadow 0.3s",
//                 "&:hover": {
//                   transform: "scale(1.05)",
//                   boxShadow: "0 6px 12px rgba(0, 230, 118, 0.5)",
//                 },
//               }}
//             >
//               <CardMedia
//                 component="img"
//                 height="220"
//                 image={element.imageUrl}
//                 alt={element.title}
//                 style={{ borderRadius: "16px 16px 0 0" }}
//                 onClick={() => handleViewDetails(element._id)}
//               />
//               <CardContent>
//                 <Typography
//                   gutterBottom
//                   variant="h5"
//                   style={{ color: "#00e676", textAlign: "center" }}
//                   onClick={() => handleViewDetails(element._id)}
//                 >
//                   {element.title}
//                 </Typography>
//                 <Typography
//                   variant="body2"
//                   color="lightgrey"
//                   textAlign="center"
//                   onClick={() => handleViewDetails(element._id)}
//                 >
//                   {element.description}
//                 </Typography>
//               </CardContent>
//               <CardActions style={{ display: "flex", justifyContent: "space-between", padding: "1rem" }}>
//                 <Typography variant="body1" color="orange" fontWeight="bold">
//                   Required: ₹ {element.amount}
//                 </Typography>
//                 <Typography variant="body1" color="lime" fontWeight="bold">
//                   Raised: ₹ {element.audience.reduce((total, a) => total + (parseInt(a.amount) || 0), 0)}
//                 </Typography>
//               </CardActions>
//               <CardActions style={{ justifyContent: "center", paddingBottom: "1rem" }}>
//                 <TextField
//                   inputRef={(ref) => (amountRefs.current[index] = ref)}
//                   type="number"
//                   variant="outlined"
//                   size="small"
//                   placeholder="Amount (₹)"
//                   sx={{
//                     backgroundColor: "white",
//                     borderRadius: "8px",
//                     input: { color: "black", textAlign: "center" },
//                     width: "90%",
//                   }}
//                 />
//               </CardActions>
//               <CardActions>
//                 <Button
//                   fullWidth
//                   sx={{
//                     backgroundColor: "#00e676",
//                     color: "black",
//                     fontWeight: "bold",
//                     "&:hover": {
//                       backgroundColor: "#00c853",
//                     },
//                   }}
//                   onClick={() => handlePledge(element.pageName, element.title, index)}
//                 >
//                   Pledge
//                 </Button>
//               </CardActions>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//     </div>
//   );
// }

// export default Projects;



//----------

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
//   const [filteredProjects, setFilteredProjects] = useState([]);
//   const amountRefs = useRef([]);
//   const [amount, setAmount] = useState(0);
//   const [searchTerm, setSearchTerm] = useState("");

//   // Fetch all projects
//   useEffect(() => {
//     axios
//       .get(SERVER_URL + "/projects")
//       .then((response) => {
//         setProjects(response.data);
//         setFilteredProjects(response.data); // Initially show all projects
//       })
//       .catch((err) => console.log(err));
//   }, []);

//   // Filter projects based on search term
//   const handleSearch = (event) => {
//     const term = event.target.value.toLowerCase();
//     setSearchTerm(term);

//     // Filter projects by title
//     const filtered = projects.filter((project) =>
//       project.title.toLowerCase().includes(term)
//     );
//     setFilteredProjects(filtered);
//   };
// const handlePledge = (pageName, projectTitle, idx) => {
//   const pledgeAmount = parseInt(amountRefs.current[idx].value) || 0;
//   setAmount(pledgeAmount);
//   handlePayment(pledgeAmount);

//   axios
//     .post(SERVER_URL + "/creator/project/pledge", {
//       timestamp: Date.now(),
//       projectTitle: projectTitle,
//       amount: pledgeAmount,
//       pageName: pageName,
//       audienceEmail: localStorage.getItem("email"),
//       firstName: localStorage.getItem("firstName"),
//       lastName: localStorage.getItem("lastName"),
//     })
//     .then(() => axios.get(SERVER_URL + "/projects").then((response) => setProjects(response.data)))
//     .catch((err) => console.log(err));
// };

// const handlePayment = (amount) => {
//   const options = {
//     key: "rzp_test_XphPOSB4djGspx",
//     amount: amount * 100,
//     currency: "INR",
//     name: "Fundify",
//     description: "Payment for Pledge",
//     handler: function (response) {
//       alert("Payment Successful!");
//     },
//     prefill: {
//       name: localStorage.getItem("firstName") + " " + localStorage.getItem("lastName"),
//       email: localStorage.getItem("email"),
//     },
//     theme: { color: "#00e676" },
//   };
//   const rzp = new window.Razorpay(options);
//   rzp.open();
// };

//   // Navigate to the detailed page of the selected project
//   const handleViewDetails = (projectId) => {
//     history.push(`/project-details/${projectId}`);
//   };

//   return (
//     <div>
//       {/* Filter Box */}
//       <div style={{ textAlign: "center", marginBottom: "2rem" }}>
//         <TextField
//           variant="outlined"
//           size="medium"
//           placeholder="Search by Title"
//           value={searchTerm}
//           onChange={handleSearch}
//           sx={{
//             backgroundColor: "white",
//             borderRadius: "80rem", // More rounded corners
//             width: "40%", // Reduced width for a narrower look
//             height: "70%",
//             input: { color: "black", textAlign: "center" },
//             marginTop: "2rem",
//             fontWeight: "bold",
//           }}
//         />
//       </div>

//       <Grid container spacing={4} style={{ padding: "3rem", backgroundColor: "#f5f5f5" }}>
//         {filteredProjects.map((element, index) => (
//           <Grid item key={index} xs={12} sm={6} md={4} lg={4}>
//             <Card
//               sx={{
//                 width: 330,
//                 borderRadius: "16px",
//                 backgroundColor: "#1e1e1e",
//                 color: "white",
//                 transition: "transform 0.3s, box-shadow 0.3s",
//                 "&:hover": {
//                   transform: "scale(1.05)",
//                   boxShadow: "0 6px 12px rgba(0, 230, 118, 0.5)",
//                 },
//               }}
//              // Clicking on image/title redirects to detailed view
//             >
//               <CardMedia
//                 component="img"
//                 height="220"
//                 image={element.imageUrl}
//                 alt={element.title}
//                 style={{ borderRadius: "16px 16px 0 0" }}
//                 onClick={() => handleViewDetails(element._id)} 
//               />
//               <CardContent>
//                 <Typography gutterBottom variant="h5" style={{ color: "#00e676", textAlign: "center" }}  onClick={() => handleViewDetails(element._id)}>
                 
                
//                   {element.title} 
//                 </Typography>
//                 <Typography variant="body2" color="lightgrey" textAlign="center"   onClick={() => handleViewDetails(element._id)} >
                  
                 
//                   {element.description}
//                 </Typography>
//               </CardContent>
//               <CardActions style={{ display: "flex", justifyContent: "space-between", padding: "1rem" }}>
//                 <Typography variant="body1" color="orange" fontWeight="bold">
//                   Required: ₹ {element.amount}
//                 </Typography>
//                 <Typography variant="body1" color="lime" fontWeight="bold">
//                   Raised: ₹ {element.audience.reduce((total, a) => total + (parseInt(a.amount) || 0), 0)}
//                 </Typography>
//               </CardActions>
//               <CardActions style={{ justifyContent: "center", paddingBottom: "1rem" }}>
//                 <TextField
//                   inputRef={(ref) => (amountRefs.current[index] = ref)}
//                   type="number"
//                   variant="outlined"
//                   size="small"
//                   placeholder="Amount (₹)"
//                   sx={{
//                     backgroundColor: "white",
//                     borderRadius: "8px",
//                     input: { color: "black", textAlign: "center" },
//                     width: "90%",
//                   }}
//                 />
//               </CardActions>
//               <CardActions>
//                 <Button
//                   fullWidth
//                   sx={{
//                     backgroundColor: "#00e676",
//                     color: "black",
//                     fontWeight: "bold",
//                     "&:hover": {
//                       backgroundColor: "#00c853",
//                     },
//                   }}
//                   onClick={(e) => {
//                      // Prevent click from triggering project detail navigation
//                     handlePledge(element.pageName, element.title, index); // Handle pledge for selected project
//                   }}
//                 >
//                   Pledge
//                 </Button>
//               </CardActions>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//     </div>
//   );
// }

// export default Projects;
