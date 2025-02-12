
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import { Card, CardContent, Typography, Button, LinearProgress, Box, Divider } from "@mui/material";
// import { SERVER_URL } from "../../../constant/serverUrl";

// function ProjectDetails() {
//   const { projectId } = useParams(); // Get the project ID from the URL
//   const [project, setProject] = useState(null);

//   // Fetch project details
//   useEffect(() => {
   
//     axios
//       .get(`${SERVER_URL}/projects/${projectId}`)
//       .then((response) => {
       
//         setProject(response.data);
//       })
//       .catch((err) => console.log(err));
//   }, [projectId]);

//   if (!project) {
//     return <div>Loading...</div>;
//   }

//   const totalAmount = project.amount;
//   const raisedAmount = project.audience.reduce((total, a) => total + (parseInt(a.amount) || 0), 0);
//   const progress = (raisedAmount / totalAmount) * 100;

//   // Sort contributors by timestamp (latest first)
//   const sortedAudience = [...project.audience].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

//   return (
//     <Box 
//       sx={{ 
//         display: 'flex', 
//         flexDirection: 'column', 
//         alignItems: 'center', 
//         justifyContent: 'center', 
//         minHeight: '100vh', 
//         backgroundColor: '#fff', 
//         padding: '2rem' 
//       }}
//     >
//       <Card
//         sx={{
//           borderRadius: "16px",
//           backgroundColor: "#1e1e1e",
//           color: "white",
//           boxShadow: "0 6px 12px rgba(0, 230, 118, 0.5)",
//           width: '100%',
//           maxWidth: 800,
//         }}
//       >
//         {/* Title */}
//         <CardContent>
//           <Typography variant="h4" gutterBottom style={{ color: "#00e676" }}>
//             {project.title}
//           </Typography>

//           {/* Image */}
//           <img
//             src={project.imageUrl}
//             alt={project.title}
//             style={{
//               width: "100%",
//               height: "300px",
//               objectFit: "cover",
//               borderRadius: "16px 16px 0 0",
//               marginBottom: '1rem',
//             }}
//           />

//           {/* Description */}
//           <Typography variant="body1" color="lightgrey" paragraph>
//             {project.description}
//           </Typography>

//           {/* Progress Bar */}
//           <Typography variant="h6" color="lime" gutterBottom>
//             Progress
//           </Typography>
//           <LinearProgress
//             variant="determinate"
//             value={progress}
//             sx={{
//               backgroundColor: "#424242",
//               "& .MuiLinearProgress-bar": {
//                 backgroundColor: "#00e676",
//               },
//             }}
//           />
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
//             <Typography variant="body2" color="white">₹ 0</Typography>
//             <Typography variant="body2" color="white">₹ {totalAmount}</Typography>
//           </Box>

//           <Divider sx={{ my: 2 }} />

//           {/* Contributors List */}
//           <Typography variant="h6" color="orange" gutterBottom>
//             Contributors
//           </Typography>
//           <Box sx={{ maxHeight: 300, overflowY: 'auto', padding: '0 1rem' }}>
//             {sortedAudience.map((contributor, index) => {
//               const dateTime = new Date(contributor.timestamp).toLocaleString();
//               return (
//                 <Box
//                   key={index}
//                   sx={{
//                     display: 'flex',
//                     justifyContent: 'space-between',
//                     alignItems: 'center',
//                     padding: '0.5rem 0',
//                     borderBottom: '1px solid #333',
//                     marginBottom: '1rem', // Adding space at the bottom of each contributor item
//                   }}
//                 >
//                   <Box sx={{ display: 'flex', flexDirection: 'column' }}>
//                     <Typography variant="body1" color="white">
//                       {contributor.firstName}
//                     </Typography>
//                     <Typography variant="body2" color="lightgrey">
//                       {dateTime}
//                     </Typography>
//                   </Box>
//                   <Typography variant="body1" color="lime">
//                     ₹ {contributor.amount}
//                   </Typography>
//                 </Box>
//               );
//             })}
//           </Box>

//           {/* Pledge Button */}
//           <Button
//             fullWidth
//             sx={{
//               backgroundColor: "#00e676",
//               color: "black",
//               fontWeight: "bold",
//               mt: 2,
//               "&:hover": {
//                 backgroundColor: "#00c853",
//               },
//             }}
//             onClick={() => alert("Pledge functionality will be implemented here")}
//           >
//             Pledge
//           </Button>
//         </CardContent> {/* <-- This closes CardContent */}
//       </Card> {/* <-- This closes the Card */}
//     </Box>
//   );
// }

// export default ProjectDetails;
//-----------
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Card, CardContent, Typography, Button, LinearProgress, Box, Divider } from "@mui/material";
import { SERVER_URL } from "../../../constant/serverUrl";

function ProjectDetails() {
  const { projectId } = useParams(); // Get the project ID from the URL
  const [project, setProject] = useState(null);

  // Fetch project details
  useEffect(() => {
    axios
      .get(`${SERVER_URL}/projects/${projectId}`)
      .then((response) => {
        setProject(response.data);
      })
      .catch((err) => console.log(err));
  }, [projectId]);

  if (!project) {
    return <div>Loading...</div>;
  }

  const totalAmount = project.amount;
  const raisedAmount = project.audience.reduce((total, a) => total + (parseInt(a.amount) || 0), 0);
  const progress = (raisedAmount / totalAmount) * 100;

  // Sort contributors by timestamp (latest first)
  const sortedAudience = [...project.audience].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center", // Horizontally center content
        justifyContent: "center", // Vertically center content
        minHeight: "100vh",
        backgroundColor: "#fff",
        padding: "2rem",
      }}
    >
      <Card
        sx={{
          borderRadius: "16px",
          backgroundColor: "#1e1e1e",
          color: "white",
          boxShadow: "0 6px 12px rgba(0, 230, 118, 0.5)",
          width: "100%",
          maxWidth: 800,
        }}
      >
        <CardContent>
          {/* Title */}
          <Typography variant="h4" gutterBottom style={{ color: "#00e676", textAlign: "center" }}>
            {project.title}
          </Typography>

          {/* Image */}
          <img
            src={project.imageUrl}
            alt={project.title}
            style={{
              width: "100%",
              height: "300px",
              objectFit: "cover",
              borderRadius: "16px 16px 0 0",
              marginBottom: "1rem",
            }}
          />

          {/* Description */}
          <Typography variant="body1" color="lightgrey" paragraph>
            {project.description}
          </Typography>

          {/* Progress Bar */}
          <Typography variant="h6" color="lime" gutterBottom textAlign="center">
            Progress
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              backgroundColor: "#424242",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#00e676",
              },
            }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
            <Typography variant="body2" color="white">₹ 0</Typography>
            <Typography variant="body2" color="white">₹ {totalAmount}</Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Contributors List */}
          <Typography variant="h6" color="orange" gutterBottom textAlign="center">
            Contributors
          </Typography>
          <Box sx={{ maxHeight: 300, overflowY: "auto", padding: "0 1rem" }}>
            {sortedAudience.map((contributor, index) => {
              const dateTime = new Date(contributor.timestamp).toLocaleString();
              return (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.5rem 0",
                    borderBottom: "1px solid #333",
                    marginBottom: "1rem",
                  }}
                >
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography variant="body1" color="white">
                      {contributor.firstName}
                    </Typography>
                    <Typography variant="body2" color="lightgrey">
                      {dateTime}
                    </Typography>
                  </Box>
                  <Typography variant="body1" color="lime">
                    ₹ {contributor.amount}
                  </Typography>
                </Box>
              );
            })}
          </Box>

          {/* Pledge Button */}
          <Button
            fullWidth
            sx={{
              backgroundColor: "#00e676",
              color: "black",
              fontWeight: "bold",
              mt: 2,
              "&:hover": {
                backgroundColor: "#00c853",
              },
            }}
            onClick={() => alert("Pledge functionality will be implemented here")}
          >
            Pledge
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

export default ProjectDetails;
