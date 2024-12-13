import {
  Avatar,
  Button,
  Dialog,
  Divider,
  IconButton,
  Input,
  Paper,
  Typography,
} from "@mui/material";
import { Box, Container } from "@mui/system";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Auth, app } from "../MyComponent/FirebaseConnection";
import {
  getDatabase,
  ref,
  onValue,
  remove,
  set,
  update,
} from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [uid, setuid] = useState();
  const databse = getDatabase(app);
  const [cartData, setCartData] = useState([]);
  const [paymentDialog, setPaymentDialog] = useState();
  const referece = ref(databse, "Users/" + uid + "/" + "cart");
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();
  const [orderConfirmData, setOrderConfirmData] = useState([]);
  const totals = 0;

  useEffect(() => {
    onAuthStateChanged(Auth, (user) => {
      if (user) {
        setuid(user.uid);
      }
    });
    onValue(referece, (snapshort) => {
      setCartData([]);
      const data = snapshort.val();
      if (data !== null) {
        setCartData(data);
      } else {
        console.log("error");
      }
    });
    getTotalPrice();
  }, [uid]);

  // totol price
  function getTotalPrice() {
    onValue(referece, (snapshort) => {
      const total = [];
      snapshort.forEach((child) => {
        const data = child.child("originalPrice").val();
        const quantity = child.child("quantity").val();
        const Total = parseInt(data) * parseInt(quantity);
        total.push(Total);
      });
      const ttl = total.reduce(
        (previousValue, currentValue) => previousValue + currentValue,
        totals
      );
      setTotalPrice(ttl);
    });
  }

  //item delete from cart
  function itemDeleteFromCart(id) {
    remove(ref(databse, `Users/${uid}/cart/${id}`)).then(() => {
      alert("product removed");
    });
  }

  function gettingCartProductDetails() {
    const refeCartDetails = ref(databse, "Users/" + uid + "/" + "cart/");
    onValue(refeCartDetails, (snapshort) => {
      const data = snapshort.val();
      if (data !== null) {
        setOrderConfirmData(data);
      }
    });
  }

  //quantity value
  function quantityValue(value, productId) {
    const refeAddQuantity = ref(
      databse,
      "Users/" + uid + "/" + "cart/" + productId
    );
    update(refeAddQuantity, { quantity: value }).then(() => {});
  }

  // get payment
  function getPayment() {
    setPaymentDialog(true);
    gettingCartProductDetails();
  }

  //order confirm proccess
  function orderConfirmProccess() {
    Object.values(orderConfirmData).map((details) => {
      const refeOrderProccess = ref(
        databse,
        "Users/" + uid + "/" + "myOrders/" + details.productId
      );

      set(refeOrderProccess, {
        productName: details.productName,
        productId: details.productId,
        category: details.category,
        originalPrice: details.originalPrice,
        image: details.image,
        orderId: details.productId,
        quantity: details.quantity,
        vendorId: details.vendorId,
        status: "Processing",
      }).then(() => {
        navigate("/order-confirm");
        //sending orders to the vendor
        sendOrdersToVendor(orderConfirmData);
      });
    });
  }

  function sendOrdersToVendor(orderDetails) {
    Object.values(orderDetails).map((details) => {
      const vendorId = details.vendorId;
      const refeVendor = ref(
        databse,
        "Vendors/" + vendorId + "/" + "orders/" + details.productId
      );
      set(refeVendor, {
        productName: details.productName,
        productId: details.productId,
        category: details.category,
        originalPrice: details.originalPrice,
        image: details.image,
        orderId: details.productId,
        quantity: details.quantity,
        payment: "card payment",
        customerId: uid,
      }).then(() => {
        const refeRemoveCartItem = ref(databse, "Users/" + uid + "/" + "cart");
        remove(refeRemoveCartItem);
      });
    });
  }
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
              flexDirection: "row",
            }}
          >
            <div className="col-8">
              <Paper
                variant="outlined"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                  marginRight: 2,
                  padding: 1,
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
                  Cart
                </Typography>
                <Divider sx={{ marginTop: 2 }} />
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <div className="col">
                    {Object.values(cartData).map((details) => {
                      return (
                        <>
                          <Paper
                            variant="outlined"
                            sx={{
                              padding: 2,
                              marginBottom: 2,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              flexDirection: "row",
                            }}
                          >
                            <Avatar
                              sx={{ height: 70, width: 70 }}
                              src={details.image}
                            />
                            <Typography
                              sx={{
                                fontSize: 15,
                                color: "#969595",
                                width: 200,
                              }}
                            >
                              {details.productName}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: 15,
                                color: "#969595",
                              }}
                            >
                              {"₹: " + details.originalPrice}
                            </Typography>
                            <input
                              type="number"
                              value={details.quantity}
                              onChange={(event) => {
                                quantityValue(
                                  event.target.value,
                                  details.productId
                                );
                              }}
                              defaultValue={1}
                              style={{ width: 40, border: "none" }}
                            />
                            <IconButton
                              onClick={() =>
                                itemDeleteFromCart(details.productId)
                              }
                            >
                              <Delete />
                            </IconButton>
                          </Paper>
                        </>
                      );
                    })}
                  </div>
                </Box>
              </Paper>
            </div>

            <div className="col-3">
              <Paper
                variant="outlined"
                sx={{
                  flexDirection: "column",
                  padding: 3,
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: "Roboto",
                    color: "GrayText",
                    margin: 2,
                  }}
                >
                  {"Total: " + "₹" + totalPrice}
                </Typography>

                <Button
                  size="large"
                  sx={{
                    backgroundColor: "#05f599",
                    color: "white",
                    fontSize: "15px",
                    padding: "5px",
                    width: 200,
                    fontWeight: "600",
                    marginTop: 2,
                    textTransform: "inherit",
                    ":hover": {
                      backgroundColor: "#05f599",
                    },
                  }}
                  onClick={() => {
                    getPayment();
                  }}
                >
                  Place order
                </Button>
              </Paper>
            </div>
          </Box>
        </Box>

        {/* payment dialog */}

        <Dialog
          PaperProps={{ elevation: 0 }}
          maxWidth="xl"
          open={paymentDialog}
          keepMounted
          aria-describedby="alert-dialog-slide-description"
        >
          <div className="col p-3">
            <Typography
              variant="h5"
              sx={{
                fontFamily: "unset",
                color: "GrayText",
                fontSize: "18px",
              }}
            >
              Confirm order
            </Typography>
            <Divider sx={{ marginTop: 1 }} />

            <div className="col p-2 mt-2">
              <p>Order details:</p>

              <div className="col">
                <Paper
                  variant="outlined"
                  sx={{
                    padding: 3,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <div className="col mt-2">
                    {Object.values(orderConfirmData).map((details) => {
                      console.log(details);
                      return (
                        <>
                          <div className="d-flex border mt-2 p-3">
                            <div className="col p-1">
                              <p>image</p>
                              <img src={details.image} height={50} width={50} />
                            </div>

                            <div className="col p-1 ">
                              <p>name</p>
                              <h6 className="text-muted">
                                {details.productName}
                              </h6>
                            </div>

                            <div className="col p-1 text-center">
                              <p>price</p>
                              <h6 className="text-muted">
                                {"₹: " + details.originalPrice}
                              </h6>
                            </div>

                            <div className="col p-1 text-center">
                              <p>quantity</p>
                              <h6 className="text-muted">{details.quantity}</h6>
                            </div>
                          </div>
                        </>
                      );
                    })}
                  </div>
                </Paper>
                <Divider sx={{ marginTop: 2 }} />
                <div className="d-flex justify-content-end p-2">
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: "Roboto",
                      color: "#969595",
                      fontSize: 17,
                    }}
                  >
                    {"Total: ₹" + totalPrice}
                  </Typography>
                </div>
              </div>

              <Button
                size="large"
                fullWidth
                sx={{
                  backgroundColor: "#05f599",
                  color: "white",
                  fontSize: "15px",
                  padding: "5px",
                  marginTop: 2,
                  textTransform: "inherit",
                  ":hover": {
                    backgroundColor: "#05f599",
                  },
                }}
                onClick={orderConfirmProccess}
              >
                Confirm order
              </Button>
            </div>
          </div>
        </Dialog>
      </Container>
    </div>
  );
}

export default Cart;
