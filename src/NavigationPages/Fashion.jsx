import {
  Alert,
  Button,
  IconButton,
  Paper,
  Snackbar,
  Typography,
} from "@mui/material";
import { Box, Container, height } from "@mui/system";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Auth, app } from "../MyComponent/FirebaseConnection";
import { getDatabase, ref, onValue, set, push } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import "../App.css";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

function Fashion() {
  const [productDetails, setProductDetails] = useState([]);
  const [uid, setuid] = useState();
  const databse = getDatabase(app);

  useEffect(() => {
    onAuthStateChanged(Auth, (user) => {
      if (user) {
        setuid(user.uid);
      }
    });
    const referece = ref(databse, "Vendors/");
    onValue(referece, (snapshort) => {
      snapshort.forEach((childsnapshort) => {
        const data = childsnapshort.child("products").val();
        if (data !== null) {
          setProductDetails(data);
        } else {
          console.log("null");
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
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                background:
                  "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),url(https://media.istockphoto.com/photos/full-length-side-profile-body-size-photo-beautiful-she-her-lady-ideal-picture-id1151169816?k=20&m=1151169816&s=612x612&w=0&h=tPWF1cFGHAObnMIXA_yqiUdqgBiLZHlSaLONd9ZcA8c=)",
                height: 400,

                backgroundBlendMode: "overlay",
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontFamily: "Roboto",
                  color: "white",
                }}
              >
                Fashion
              </Typography>
            </Box>
            <div className="row row-cols-4 mt-4">
              {Object.values(productDetails).map((details) => {
                return (
                  <>
                    {details.Category === "Fashion" ? (
                      <div className="col mr-1">
                        <Paper
                          variant="outlined"
                          sx={{
                            display: "flex",
                            width: 250,
                            flexDirection: "column",
                            padding: 2,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <IconButton
                              onClick={() => {
                                const reference1 = ref(
                                  databse,
                                  "Users/" +
                                    uid +
                                    "/" +
                                    "wishlist/" +
                                    details.productId
                                );
                                set(reference1, {
                                  productName: details.productName,
                                  productId: details.productId,
                                  quantity: "1",
                                  vendorId: details.vendorId,
                                  image: details.image,
                                  originalPrice: details.originalPrice,
                                  category: details.Category,
                                }).then(() => {
                                  alert("product added to wishlist");
                                });
                              }}
                            >
                              <FavoriteBorderIcon />
                            </IconButton>

                            <img
                              style={{ marginTop: 5 }}
                              src={details.image}
                              height={200}
                              width={200}
                            />
                            <Typography
                              variant="h6"
                              sx={{
                                marginTop: 2,
                                fontSize: 17,
                                fontWeight: 600,
                                color: "#969595",
                              }}
                            >
                              {details.productName}
                            </Typography>
                            <Typography
                              sx={{
                                fontFamily: "Roboto",
                                color: "#969595",
                              }}
                            >
                              {"₹: " + details.originalPrice}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "end",
                              }}
                            >
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
                                  const referece = ref(
                                    databse,
                                    "Users/" +
                                      uid +
                                      "/" +
                                      "cart/" +
                                      details.productId
                                  );

                                  set(referece, {
                                    productName: details.productName,
                                    productId: details.productId,
                                    quantity: "1",
                                    vendorId: details.vendorId,
                                    image: details.image,
                                    originalPrice: details.originalPrice,
                                    category: details.Category,
                                  }).then(() => {
                                    alert("product added to cart ;)");
                                  });
                                }}
                              >
                                + ADD TO CART
                              </Button>
                            </Box>
                          </Box>
                        </Paper>
                      </div>
                    ) : null}
                  </>
                );
              })}
            </div>
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default Fashion;
