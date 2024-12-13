import { Avatar, Divider, Typography } from "@mui/material";
import { Container } from "@mui/system";
import { Auth, app } from "./FirebaseConnection";
import { getDatabase, onValue, ref } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect } from "react";
import { useState } from "react";

function Profile() {
  const [uid, setuid] = useState();
  const [userName, setUserName] = useState();
  const [userEmail, setUserEmail] = useState();
  const [userAddress, setUserAddress] = useState();
  //datbase
  const database = getDatabase(app);

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
    const reference = ref(database, "Users/" + uid + "/");
    onValue(reference, (snapshort) => {
      const name = snapshort.child("userName").val();
      const email = snapshort.child("userEmail").val();
      const address = snapshort.child("userAddress").val();
      setUserName(name);
      setUserEmail(email);
      setUserAddress(address);
    });
  }

  return (
    <>
      <Container>
        <div className="col mt-4">
          <Typography
            variant="h4"
            sx={{
              fontFamily: "Roboto",
              color: "GrayText",
              margin: 2,
            }}
          >
            Profile
          </Typography>
          <Divider />
          <div className="col">
            <Typography
              variant="body1"
              sx={{
                fontFamily: "Roboto",
                color: "GrayText",
                margin: 2,
              }}
            >
              Details
            </Typography>
            <div className="row d-flex align-item-center">
              <Avatar
                sx={{ height: 200, width: 200, marginTop: 1, marginRight: 5 }}
              />
              <div className="col">
                {/* user info */}
                {/* name */}
                <Typography
                  sx={{
                    fontFamily: "Roboto",
                    color: "#aeb8b1",
                    fontSize: 15,
                  }}
                >
                  Full Name:
                </Typography>

                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: "Roboto",
                    color: "GrayText",
                  }}
                >
                  {userName}
                </Typography>

                {/* user info */}
                {/* email */}
                <Typography
                  sx={{
                    fontFamily: "Roboto",
                    color: "#aeb8b1",
                    fontSize: 15,
                    marginTop: 1,
                  }}
                >
                  Email:
                </Typography>

                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: "Roboto",
                    color: "GrayText",
                  }}
                >
                  {userEmail}
                </Typography>

                {/* user info */}
                {/* address */}
                <Typography
                  sx={{
                    fontFamily: "Roboto",
                    color: "#aeb8b1",
                    fontSize: 15,
                    marginTop: 1,
                  }}
                >
                  Address:
                </Typography>

                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: "Roboto",
                    color: "GrayText",
                  }}
                >
                  {userAddress}
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}

export default Profile;
