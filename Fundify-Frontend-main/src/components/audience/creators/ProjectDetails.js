import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Card, CardContent, Typography, Button, Grid } from "@mui/material";
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

  return (
    <Grid container justifyContent="center" style={{ padding: "2rem" }}>
      <Grid item xs={12} sm={8} md={6}>
        <Card
          sx={{
            borderRadius: "16px",
            backgroundColor: "#1e1e1e",
            color: "white",
            boxShadow: "0 6px 12px rgba(0, 230, 118, 0.5)",
          }}
        >
          <img
            src={project.imageUrl}
            alt={project.title}
            style={{ width: "100%", height: "300px", objectFit: "cover", borderRadius: "16px 16px 0 0" }}
          />
          <CardContent>
            <Typography variant="h4" gutterBottom style={{ color: "#00e676" }}>
              {project.title}
            </Typography>
            <Typography variant="body1" color="lightgrey" paragraph>
              {project.description}
            </Typography>
            <Typography variant="h6" color="orange">
              Required Amount: ₹ {project.amount}
            </Typography>
            <Typography variant="h6" color="lime">
              Raised Amount: ₹ {project.audience.reduce((total, a) => total + (parseInt(a.amount) || 0), 0)}
            </Typography>
          </CardContent>
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
            onClick={() => alert("Pledge functionality will be implemented here")}
          >
            Pledge
          </Button>
        </Card>
      </Grid>
    </Grid>
  );
}

export default ProjectDetails;
