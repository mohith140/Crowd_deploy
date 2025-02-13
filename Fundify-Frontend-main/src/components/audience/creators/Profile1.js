import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Box, Typography, Avatar, Grid, Card, CardContent, Button, TextField } from '@mui/material';
import { useParams } from 'react-router-dom';
import { SERVER_URL } from '../../../constant/serverUrl';

const Profile1 = () => {
    
  const { email } = useParams();
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({
    firstName: '',
    lastName: '',
   email: '',
    profileImage: null,
  });
  console.log("kl")
  useEffect(() => {
    axios.get(SERVER_URL + `/api/profile/audience/${email}`)
      .then(response => {
        setProfile(response.data);
        setUpdatedProfile({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
            email: response.data.email,
        });
      })
      .catch(error => {
        console.error("There was an error fetching the profile!", error);
      });
  }, [email]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile({ ...updatedProfile, [name]: value });
  };

  const handleFileChange = (e) => {
    setUpdatedProfile({ ...updatedProfile, profileImage: e.target.files[0] });
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.append('firstName', updatedProfile.firstName);
    formData.append('lastName', updatedProfile.lastName);
    formData.append('pageName', updatedProfile.pageName);
    formData.append('description', updatedProfile.description);
    formData.append('category', updatedProfile.category);
    formData.append('email', email);
    if (updatedProfile.profileImage) {
      formData.append('profileImage', updatedProfile.profileImage);
    }

    axios.post(SERVER_URL + '/api/profile/update', formData)
      .then(response => {
        setProfile(response.data);
        setEditMode(false);
      })
      .catch(error => {
        console.error("There was an error updating the profile!", error);
      });
  };

  if (!profile) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Card sx={{ borderRadius: '16px', backgroundColor: '#1e1e1e', color: 'white' }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar
              alt={profile.firstName}
              src={profile.profileImage ? SERVER_URL + profile.profileImage : ''}
              sx={{ width: 100, height: 100, mb: 2 }}
            />
            {editMode ? (
              <>
                <TextField
                  name="firstName"
                  label="First Name"
                  value={updatedProfile.firstName}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
                />
                <TextField
                  name="lastName"
                  label="Last Name"
                  value={updatedProfile.lastName}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
                />
                 <TextField
                  name="email"
                  label="Email"
                  value={updatedProfile.lastName}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
                />
               
                <Button variant="contained" onClick={handleSave} sx={{ mt: 2 }}>
                  Save
                </Button>
              </>
            ) : (
              <>
                <Typography variant="h4" sx={{ color: '#00e676', mb: 2 }}>
                  {profile.firstName} {profile.lastName}
                </Typography>
               
                <Typography variant="body2" sx={{ color: 'lightgrey' }}>
                  Email: {profile.email}
                </Typography>
                {/* <Button variant="contained" onClick={() => setEditMode(true)} sx={{ mt: 2 }}>
                  Edit
                </Button> */}
              </>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Profile1;