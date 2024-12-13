import {
  Alert,
  Button,
  Divider,
  Paper,
  Snackbar,
  Typography,
} from "@mui/material";
import { Box, Container, height } from "@mui/system";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Auth, app } from "../MyComponent/FirebaseConnection";
import { getDatabase, ref, onValue, set } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import "../App.css";

function Wishlist() {
  const [productDetails, setProductDetails] = useState([]);
  const [uid, setuid] = useState();
  const databse = getDatabase(app);

  const [snackBar, setOpenSnakbar] = useState(false);
  const time = new Date().valueOf();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
  };
  const referece = ref(databse, "Users/" + uid + "/" + "wishlist");
  useEffect(() => {
    onAuthStateChanged(Auth, (user) => {
      if (user) {
        setuid(user.uid);
      }
    });
    //reference
    onValue(referece, (snapshort) => {
      setProductDetails([]);
      snapshort.forEach((child) => {
        const data = child.val();
        if (data !== null) {
          setProductDetails((old) => [...old, data]);
        } else {
          console.log("error");
        }
      });
    });
  }, [uid]);

  return (
    <div>
      <Container>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            padding: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontFamily: "Roboto",
                color: "GrayText",
                margin: 2,
              }}
            >
              My Wishlist
            </Typography>

            <Divider />

            <div className="row row-cols-4 m-2">
              {Object.values(productDetails).map((details) => {
                return (
                  <>
                    <div className="col m-2">
                      <Paper
                        variant="outlined"
                        sx={{
                          padding: 2,
                          display: "flex",

                          width: 250,
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                        }}
                      >
                        <img src={details.image} height={200} width={200} />
                        <Typography
                          sx={{
                            marginTop: 2,
                            fontSize: 17,
                            color: "#969595",
                          }}
                        >
                          {details.productName}
                        </Typography>
                        <Typography
                          sx={{
                            marginTop: 2,
                            fontSize: 15,
                            color: "#969595",
                          }}
                        >
                          {"₹: " + details.originalPrice}
                        </Typography>

                        <Button
                          size="small"
                          sx={{
                            backgroundColor: "#05f599",
                            color: "white",
                            fontSize: "15px",
                            padding: "5px",
                            fontWeight: "600",
                            width: "150px",
                            marginTop: 2,
                            textTransform: "inherit",
                            ":hover": {
                              backgroundColor: "#05f599",
                            },
                          }}
                          onClick={() => {
                            const reference1 = ref(
                              databse,
                              "Users/" + uid + "/" + "cart/" + time.toString()
                            );
                            set(reference1, details).then(() => {
                              setOpenSnakbar(true);
                            });
                          }}
                        >
                          + ADD TO CART
                        </Button>
                      </Paper>
                    </div>
                  </>
                );
              })}
            </div>
          </Box>
        </Box>
        <Snackbar open={snackBar} autoHideDuration={1000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            Product added in cart !
          </Alert>
        </Snackbar>
      </Container>
    </div>
  );
}

export default Wishlist;
