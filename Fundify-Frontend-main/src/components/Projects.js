import React from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { SERVER_URL } from "../constant/serverUrl";
import { useHistory } from "react-router-dom";

function Projects() {
  const history = useHistory();
  const [projects, setProjects] = React.useState([]);
  const amountRef = React.useRef();

  React.useEffect(() => {
    axios
      .get(SERVER_URL + "/projects")
      .then((response) => {
        setProjects(response.data.slice(0, 10));
      })
      .catch((err) => {});
  }, []);

  const handlePledge = (pageName, projectTitle) => {
    history.push("/login");
  };

  const getRaisedAmount = (audience) => {
    return audience.reduce((total, element) => total + (parseInt(element.amount) || 0), 0);
  };

  return (
    <Grid container style={{ padding: "3rem", backgroundColor: "#121212" }} spacing={4}>
      {projects.map((element, index) => (
        <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
          <Card
            sx={{
              borderRadius: "160px",
              backgroundColor: "#1e1e1e",
              color: "white",
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0 6px 12px rgba(255, 255, 255, 0.3)",
              },
            }}
          >
            <CardMedia
              component="img"
              height="200"
              image={element.projectURL}
              alt={element.title}
              style={{ borderRadius: "16px 16px 0 0" }}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div" style={{ color: "#00e676" }}>
                {element.title}
              </Typography>
              <Typography variant="body2" color="red">
                {element.description}
              </Typography>
            </CardContent>
            <CardActions style={{ paddingInline: "1rem", paddingBottom: "1rem" }}>
              <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                <Grid item>
                  <Typography variant="body1" color="orange" fontWeight="bold">
                    Required: ₹ {element.amount}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body1" color="blue" fontWeight="bold">
                    Raised: ₹h {getRaisedAmount(element.audience)*10}
                  </Typography>
                </Grid>
              </Grid>
            </CardActions>
            <CardActions style={{ paddingInline: "1rem", paddingBottom: "1rem" }}>
              <TextField
                inputRef={amountRef}
                type="number"
                variant="outlined"
                size="small"
                placeholder="Amount (₹)"
                sx={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  input: { color: "black" },
                  width: "100%",
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
                onClick={() => handlePledge(element.pageName, element.title)}
              >
                Pledge
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default Projects;
