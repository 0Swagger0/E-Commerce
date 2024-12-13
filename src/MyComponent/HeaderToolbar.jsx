import React, { useState, useEffect } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Dialog,
  Divider,
  IconButton,
  ListItemIcon,
  MenuItem,
  Paper,
  Snackbar,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import "../App.css";
import bagIcon from "../Image/bag.png";
import { Logout, Search } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
//icon
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
//animation
import LoginAnimation from "../LottieAnimation/50124-user-profile.json";
//logo
import logo1 from "../Image/Logo1.png";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Lottie from "react-lottie";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
//firebase
import {
  app,
  Auth,
  SignInWithPhoneNumber,
} from "../MyComponent/FirebaseConnection";
import { RecaptchaVerifier, onAuthStateChanged } from "firebase/auth";
import { getDatabase, set, ref, onValue, update } from "firebase/database";
//hover
import HoverPopover from "material-ui-popup-state/HoverPopover";
import {
  usePopupState,
  bindHover,
  bindPopover,
} from "material-ui-popup-state/hooks";

const HeaderToolbar = () => {
  //dialog box
  const [open2, setOpen2] = useState(false);
  ///inputs
  const [number, setNumber] = useState(0);
  const [OTP, setOTP] = useState("");
  const [open, setOpen] = useState(0);
  const [open1, setOpen1] = useState(false);
  const [visible, setVisible] = useState(false);
  const [checkUser, setCheckUser] = useState(false);
  const [uid, setuid] = useState();
  const [productCount, setProductCout] = useState();
  //firebase
  const database = getDatabase(app);
  const navigate = useNavigate();

  //user info
  const [userInfo, setUserInfo] = useState({
    userFullName: "",
    userEmail: "",
    userAddress: "",
  });

  const popupState = usePopupState({
    variant: "popover",
    popupId: "demoPopover",
  });

  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      right: -3,
      top: 13,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: "0 4px",
    },
  }));
  // lottie Animation
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: LoginAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  //check user is available
  useEffect(() => {
    onAuthStateChanged(Auth, (user) => {
      if (user) {
        //logged
        setuid(user.uid);
        setOpen2(false);
        setCheckUser(true);
      } else {
        setOpen2(true);
      }
    });

    const referece = ref(database, "Users/" + "/" + uid + "/" + "cart");
    onValue(referece, (snapshort) => {
      snapshort.forEach((childsnapshort) => {
        const data = childsnapshort.hasChild.length;
        if (data !== null) {
          setProductCout(data);
        } else {
          console.log("null");
        }
      });
    });
  }, [uid]);

  // generating recaptcha
  const generatingRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        },
      },
      Auth
    );
  };

  // gettingOTP function
  const gettingNumber = () => {
    setVisible(true);
    generatingRecaptcha();
    let appVerifier = window.recaptchaVerifier;
    SignInWithPhoneNumber(Auth, "+91" + number, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setOpen(true);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  // get otp
  const gettingOTP = () => {
    setOpen1(true);
    let confirmationResult = window.confirmationResult;
    confirmationResult
      .confirm(OTP)
      .then((result) => {
        // User signed in successfully.
        const user = result.user;

        const uid = user.uid;
        // adding vendor data in firebase realtime
        const reference = ref(database, "Users/" + uid);
        set(reference, {
          accountType: "user",
          phone: number,
          uid: uid,
        })
          .then(() => {
            alert("User Logging Successfully");
            setOpen(false);
            getInformatiobOfUser();
          })
          .catch(() => {});
      })
      .catch((error) => {
        // User couldn't sign in (bad verification code?)
        console.log(error.message);
      });
  };

  //getting information of user and validation
  function getInformatiobOfUser() {
    const referece = ref(database, "Users/" + "/" + uid + "/");
    onValue(referece, (snapshort) => {
      const userName = snapshort.child("userName").val();
      const userAddress = snapshort.child("userAddress").val();
      const userEmail = snapshort.child("userEmail").val();
      //validation condition
      if (!userName || !userEmail || !userAddress) {
        setOpen1(true);
      } else {
        setOpen1(false);
      }
    });
  }

  //get user login
  function GetLoginUser(event) {
    event.preventDefault();
    setOpen2(true);
  }

  //navigate
  function navigateOnCart() {
    navigate("/cart");
  }

  function navigateOnwishlist() {
    navigate("/wishlist");
  }

  //upload user info in databse
  function uploadUserInformationInDatabase() {
    const referece = ref(database, "Users/" + "/" + uid + "/");
    update(referece, {
      userName: userInfo.userFullName,
      userEmail: userInfo.userEmail,
      userAddress: userInfo.userAddress,
    }).then(() => {
      alert("information added successfully");
      setOpen1(false);
    });
  }

  return (
    <>
      <Toolbar
        sx={{
          backgroundColor: "#F5F5F5",
        }}
      >
        <div
          style={{
            width: "100%",
            justifyContent: "center",
            flexDirection: "row",
            marginBottom: "10px",
            marginTop: "15px",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "inline-flex",
              justifyContent: "center",
            }}
          >
            <img src={logo1} height={55} width={170} />

            <div className="searchbar mt-2">
              <input
                type="text"
                className="searchbar__input"
                name="q"
                placeholder="Search for products"
              />
              <button type="submit" className="searchbar__button">
                <Search />
              </button>
            </div>

            {checkUser === false ? (
              <button
                className="loginButton"
                style={{
                  marginRight: "10px",
                  marginLeft: "20px",
                  marginTop: "7px",
                }}
                onClick={GetLoginUser}
              >
                Login/sign up
              </button>
            ) : (
              <>
                <Avatar
                  sx={{
                    marginTop: 1,
                    marginLeft: 3,
                  }}
                  {...bindHover(popupState)}
                />
                <IconButton sx={{ marginLeft: 2 }} onClick={navigateOnwishlist}>
                  <FavoriteBorderIcon />
                </IconButton>

                <IconButton
                  aria-label="cart"
                  sx={{ marginLeft: 1 }}
                  onClick={navigateOnCart}
                >
                  <StyledBadge badgeContent={productCount} color="secondary">
                    <img
                      src={bagIcon}
                      alt="Add To cart"
                      height={27}
                      width={27}
                    />
                  </StyledBadge>
                </IconButton>

                <HoverPopover
                  sx={{ padding: 3 }}
                  {...bindPopover(popupState)}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                >
                  <Typography style={{ margin: 10 }}>
                    <MenuItem
                      onClick={() => {
                        navigate("/profile");
                      }}
                    >
                      <Avatar sx={{ marginRight: 2, height: 25, width: 25 }} />{" "}
                      Profile
                    </MenuItem>
                    <Divider />
                    <MenuItem
                      onClick={() => {
                        navigate("/my-orders");
                      }}
                    >
                      <ListItemIcon>
                        <ShoppingCartCheckoutIcon fontSize="small" />
                      </ListItemIcon>
                      My orders
                    </MenuItem>
                    <Divider />
                    <MenuItem
                      onClick={() => {
                        Auth.signOut();
                      }}
                    >
                      <ListItemIcon>
                        <Logout fontSize="small" />
                      </ListItemIcon>
                      Logout
                    </MenuItem>
                  </Typography>
                </HoverPopover>
              </>
            )}
          </div>

          <Box
            sx={{
              justifyContent: "center",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <div
              style={{
                height: "1px",
                width: "64%",
                marginTop: "2px",

                background: "#d9e2e1",
              }}
            ></div>
          </Box>

          <div className="centerAlign">
            <Box
              sx={{
                justifyContent: "center",
                flexDirection: "row",
                display: "flex",
                alignItems: "center",
              }}
            >
              {/* Pages For Navigation */}
              <Box
                sx={{
                  direction: "flex",
                  flexDirection: "row",
                }}
              >
                {/* menus */}
                {/* Fashion Menu */}
                <Button
                  aria-haspopup="true"
                  size="small"
                  sx={{
                    color: "GrayText",
                    fontSize: "15px",
                    marginRight: "10px",
                    paddingLeft: "15px",
                    paddingRight: "15px",
                    textTransform: "capitalize",
                    ":hover": {
                      backgroundColor: "#05f599",
                      color: "white",
                    },
                  }}
                  onClick={() => {
                    navigate("/");
                  }}
                >
                  Fashion
                </Button>

                {/* Electronics Menu */}
                <Button
                  aria-haspopup="true"
                  size="small"
                  sx={{
                    color: "GrayText",
                    fontSize: "15px",
                    marginRight: "10px",
                    paddingLeft: "15px",
                    paddingRight: "15px",
                    textTransform: "capitalize",
                    ":hover": {
                      backgroundColor: "#05f599",
                      color: "white",
                    },
                  }}
                  onClick={() => {
                    navigate("/electronics");
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: "unset",
                      fontSize: "16px",
                    }}
                  >
                    Electronics
                  </Typography>
                </Button>

                {/* Mobile Menu */}

                <Button
                  aria-haspopup="true"
                  size="small"
                  sx={{
                    color: "GrayText",
                    fontSize: "15px",
                    marginRight: "10px",
                    paddingLeft: "15px",
                    paddingRight: "15px",
                    textTransform: "capitalize",
                    ":hover": {
                      backgroundColor: "#05f599",
                      color: "white",
                    },
                  }}
                  onClick={() => {
                    navigate("/mobiles");
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: "unset",
                      fontSize: "16px",
                    }}
                  >
                    Mobiles
                  </Typography>
                </Button>

                {/*Home & Kitchen Menu */}

                <Button
                  aria-haspopup="true"
                  size="small"
                  sx={{
                    color: "GrayText",
                    fontSize: "15px",
                    marginRight: "10px",
                    paddingLeft: "15px",
                    paddingRight: "15px",
                    textTransform: "capitalize",
                    ":hover": {
                      backgroundColor: "#05f599",
                      color: "white",
                    },
                  }}
                  onClick={() => {
                    navigate("/home-and-kitchen");
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: "unset",
                      fontSize: "16px",
                    }}
                  >
                    Home & Kitchen
                  </Typography>
                </Button>

                {/*Beauty Products Menu */}

                <Button
                  aria-haspopup="true"
                  size="small"
                  sx={{
                    color: "GrayText",
                    fontSize: "15px",
                    marginRight: "10px",
                    paddingLeft: "15px",
                    paddingRight: "15px",
                    textTransform: "capitalize",
                    ":hover": {
                      backgroundColor: "#05f599",
                      color: "white",
                    },
                  }}
                  onClick={() => {
                    navigate("/beauty-and-kids");
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: "unset",
                      fontSize: "16px",
                    }}
                  >
                    Beauty & Kids
                  </Typography>
                </Button>
              </Box>
              {/* pages For natigation */}
            </Box>
          </div>

          {/* dialog for user login */}
          <Dialog open={open2} maxWidth="xl">
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                padding: 5,
                justifyContent: "center",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontFamily: "unset",
                  color: "GrayText",
                  fontSize: "18px",
                }}
              >
                User Login !
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  padding: 1,
                }}
              >
                <Box>
                  <Lottie
                    options={defaultOptions}
                    height="250px"
                    width="250px"
                  />
                </Box>

                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{
                    marginRight: "17px",
                    marginLeft: "17px",
                    backgroundColor: "#f0f0f0",
                  }}
                />

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* visible input */}
                  {visible === false ? (
                    <Paper
                      className="borderBlack"
                      variant="outlined"
                      sx={{
                        alignItems: "center",
                        flexDirection: "row",
                        display: "flex",
                        padding: "3px",
                        width: 300,
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "unset",
                          fontSize: "14px",
                          marginLeft: "5px",
                          color: "#a1a09f",
                        }}
                        variant="body2"
                      >
                        +91
                      </Typography>
                      <Divider
                        sx={{
                          backgroundColor: "#f0f0f0",
                          marginLeft: "7px",
                          marginRight: "5px",
                        }}
                        orientation="vertical"
                        variant="middle"
                        flexItem
                      />
                      <input
                        className="inputOutlineNone"
                        placeholder="Mobile Number*"
                        onChange={(Event) => {
                          Event.preventDefault();
                          setNumber(Event.target.value);
                        }}
                      />
                    </Paper>
                  ) : null}

                  {/* visible input */}
                  {visible === true ? (
                    <Paper
                      className="borderBlack"
                      variant="outlined"
                      sx={{
                        alignItems: "center",
                        flexDirection: "row",
                        display: "flex",
                        padding: "3px",
                        width: "300px",
                      }}
                    >
                      <input
                        className="inputOutlineNone"
                        placeholder="OTP"
                        onChange={(Event) => {
                          Event.preventDefault();
                          setOTP(Event.target.value);
                        }}
                      />
                    </Paper>
                  ) : null}

                  {/* continuing read policy */}
                  <Box
                    sx={{
                      marginTop: "50px",
                      width: "200px",
                    }}
                  >
                    <p className="paragraph">
                      To Continuing, I agree to the user{" "}
                      <span className="paragraph1">Tearms</span> of use &
                      <span className="paragraph1">Policy</span>
                    </p>
                  </Box>
                  {/* continue Button */}

                  {/* visible button */}
                  {visible === false ? (
                    <button className="buttonShape" onClick={gettingNumber}>
                      Continue
                    </button>
                  ) : null}
                  {/* visible button */}
                  {visible === true ? (
                    <button className="buttonShape" onClick={gettingOTP}>
                      Submit
                    </button>
                  ) : null}
                </Box>
              </Box>
            </Box>
          </Dialog>

          {/* dialog for getting information of user */}
          <Dialog open={open1} maxWidth="xl">
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                padding: 5,
                width: 500,
                justifyContent: "center",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontFamily: "unset",
                  color: "GrayText",
                  fontSize: "18px",
                }}
              >
                User Information !
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  padding: 1,
                }}
              >
                <TextField
                  label="Full name"
                  fullWidth
                  sx={{ fontFamily: "Roboto", color: "GrayText", marginTop: 3 }}
                  onChange={(event) => {
                    setUserInfo({
                      ...userInfo,
                      userFullName: event.target.value,
                    });
                  }}
                />
                <TextField
                  label="Email"
                  fullWidth
                  sx={{ fontFamily: "Roboto", color: "GrayText", marginTop: 2 }}
                  onChange={(event) => {
                    setUserInfo({
                      ...userInfo,
                      userEmail: event.target.value,
                    });
                  }}
                />

                <TextField
                  label="Address"
                  multiline
                  id="outlined-multiline-static"
                  fullWidth
                  rows={4}
                  sx={{
                    fontFamily: "Roboto",
                    color: "GrayText",
                    marginTop: 3,
                  }}
                  onChange={(event) => {
                    setUserInfo({
                      ...userInfo,
                      userAddress: event.target.value,
                    });
                  }}
                />

                <Button
                  fullWidth
                  sx={{
                    fontFamily: "Roboto",
                    marginTop: 3,
                    color: "white",
                    backgroundColor: "#05f599",
                    textTransform: "inherit",
                    ":hover": {
                      backgroundColor: "#05f599",
                    },
                  }}
                  onClick={uploadUserInformationInDatabase}
                >
                  Submit
                </Button>
              </Box>
            </Box>
          </Dialog>
        </div>
        <div id="recaptcha-container" className="justify-center flex"></div>
        <Snackbar open={open} autoHideDuration={6000}>
          <Alert severity="success" sx={{ width: "100%" }}>
            OTP sent successfully
          </Alert>
        </Snackbar>
      </Toolbar>
    </>
  );
};
export default HeaderToolbar;
