import { Chip, Divider, Typography } from "@mui/material";
import { Box, style } from "@mui/system";
import { Auth, app } from "./FirebaseConnection";
import { getDatabase, onValue, ref } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect } from "react";
import { useState } from "react";

function MyOrders() {
  //datbase
  const database = getDatabase(app);
  const [myOrderData, setMyOrderData] = useState([]);
  const [uid, setuid] = useState();

  useEffect(() => {
    onAuthStateChanged(Auth, (user) => {
      if (user) {
        setuid(user.uid);
      }
    });
    gettingUserInfo();
  }, [uid]);

  //getting info
  function gettingUserInfo() {
    const reference = ref(database, "Users/" + uid + "/" + "myOrders");
    setMyOrderData([]);
    onValue(reference, (snapshort) => {
      const data = snapshort.val();
      if (data !== null) {
        setMyOrderData(data);
      }
    });
  }
  return (
    <div className="container">
      <div className="col">
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontFamily: "Roboto",
              color: "GrayText",
              margin: 2,
            }}
          >
            My orders
          </Typography>
        </Box>
        <Divider />

        <div className="col mt-2">
          {Object.values(myOrderData).map((details) => {
            return (
              <>
                <div className="row d-flex justify-content-center mt-4">
                  <div className="row d-flex justify-content-between">
                    <div className="col">
                      <img height={100} width={100} src={details.image} />
                    </div>

                    <div className="col">
                      <p>name</p>
                      <Typography
                        variant="body1"
                        sx={{
                          fontFamily: "Roboto",
                          color: "GrayText",
                        }}
                      >
                        {details.productName}
                      </Typography>
                    </div>

                    <div className="col text-center">
                      <p>price</p>
                      <Typography
                        variant="body1"
                        sx={{
                          fontFamily: "Roboto",
                          color: "GrayText",
                        }}
                      >
                        {"₹ " + details.originalPrice}
                      </Typography>
                    </div>

                    <div className="col text-center">
                      <p>quantity</p>
                      <Typography
                        variant="body1"
                        sx={{
                          fontFamily: "Roboto",
                          color: "GrayText",
                        }}
                      >
                        {details.quantity}
                      </Typography>
                    </div>

                    <div className="col text-center">
                      <p>order status</p>
                      {details.status === "Processing" ? (
                        <Chip
                          label={details.status}
                          sx={{ backgroundColor: "yellow" }}
                        />
                      ) : null}

                      {details.status === "Ready for shipping" ? (
                        <Chip
                          label={details.status}
                          sx={{ backgroundColor: "yellow" }}
                        />
                      ) : null}
                      {details.status === "Shipping" ? (
                        <Chip
                          label={details.status}
                          sx={{
                            backgroundColor: "greenyellow",
                            color: "white",
                          }}
                        />
                      ) : null}

                      {details.status === "Dispatch" ? (
                        <Chip
                          label={details.status}
                          sx={{
                            backgroundColor: "greenyellow",
                            color: "white",
                          }}
                        />
                      ) : null}

                      {details.status === "Completed" ? (
                        <Chip
                          label={details.status}
                          sx={{
                            backgroundColor: "#0be34c",
                            color: "white",
                          }}
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
                <Divider sx={{ marginTop: 3 }} />
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default MyOrders;
