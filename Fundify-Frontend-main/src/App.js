import * as React from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import logo from "./logo.svg";
import "./App.css";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import Profile from "./components/creator/Profile";
import Profile1 from "./components/audience/creators/Profile1.js";
import SignUpCreator from "./components/SignUpCreator";
import SignUpAudience from "./components/SignUpAudience";
import Login from "./components/Login";
import CreatorDashboard from "./components/CreatorDashboard";
import AudienceDashboard from "./components/AudienceDashboard";
import Home from "./components/Home";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import ProjectDetails from "./components/audience/creators/ProjectDetails";

const theme = createTheme({
  palette: {
    type: "dark",
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Switch>
        <Route path="/audiencedashboard">
          <AudienceDashboard />
        </Route>
        <Route path="/creatordashboard">
          <CreatorDashboard />
        </Route>
        
        <Route path="/profile/:email" >
        <Profile/>
        </Route>
   
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/signupaudience">
          <SignUpAudience />
          </Route>

          <Route path="/profile1/audience/:email"  >
          <Profile1/>
          </Route>
        
        <Route path="/signupcreator">
          <SignUpCreator />
        </Route>
        <Route path="/home/projects">
          <Home />
        </Route>
        <Route path="/home/creators">
          <Home />
        </Route>
        <Route path="/project-details/:projectId">
          <ProjectDetails />
        </Route>
        <Route path="/" exact>
          <Redirect to="/home/creators" />
        </Route>
      </Switch>
     
    </ThemeProvider>
  );
}

export default App;
