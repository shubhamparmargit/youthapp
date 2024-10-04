import React, { useState } from 'react';
import { useNavigate  } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import authService from '../../services/authService';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Youth Adda
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

function Signup() {
  const [formData, setFormData] = useState({
    name:'',
    username: '',
    email: '',
    password: '',
    gender: '',
    dob: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleGenderChange = (event) => {
    const gender = event.target.value;
    setFormData((prevData) => ({
      ...prevData,
      gender: gender,
    }));
  };
  const handleCityChange = (event) => {
    const city = event.target.value;
    setFormData((prevData) => ({
      ...prevData,
      city: city,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      await authService.signup(formData);
      setSuccessMessage('Signup successful!');
      toast.success("Signup successful! Please Login ");
      setLoading(false);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
     
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 409) {
        setErrorMessage('You already have an account. Please log in.');
        toast.warn("You already have an account. Please log in.", {
          autoClose: 5000,
          draggable: true
        });
      } else {
        setErrorMessage('Signup failed. Please try again.');
        toast.error(`${error}`, {
          autoClose: 20000
        });
      }
    }
  };


  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>

                            <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  label="Enter Your Name"
                  name="name"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="User Name"
                  name="username"
                  autoComplete="username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="gender-label">Gender</InputLabel>
                  <Select
                    labelId="gender-label"
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    label="Gender"
                    onChange={handleGenderChange}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                Date of Birth
                <TextField
                  required
                  fullWidth
                  name="dob"
                  type="date"
                  id="dob"
                  autoComplete="new-password"
                  value={formData.dob}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="city-label">City</InputLabel>
                  <Select
                    labelId="city-label"
                    id="city"
                    name="city"
                    value={formData.city}
                    label="City"
                    onChange={handleCityChange}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="indore">Indore</MenuItem>
                    <MenuItem value="bhopal">Bhopal</MenuItem>
                    <MenuItem value="ujjain">Ujjain</MenuItem>
                    <MenuItem value="dewas">Dewas</MenuItem>
                    <MenuItem value="pune">Pune</MenuItem>
                    <MenuItem value="bangalore">Bangalore</MenuItem>
                    <MenuItem value="delhi">Delhi</MenuItem>
                    <MenuItem value="gurugram">Gurugram</MenuItem>
                    <MenuItem value="mumbai">Mumbai</MenuItem>

                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="bio"
                  label="Your Bio"
                  name="bio"
                  autoComplete="bio"
                  value={formData.bio}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="mobile"
                  label="Your Mobile No. (optional)"
                  name="mobile"
                  autoComplete="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid>

            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}

export default Signup;
