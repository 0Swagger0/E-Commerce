import { Button } from "@mui/material";
import React from "react";
import Lottie from "react-lottie";
import { useNavigate } from "react-router-dom";
import ConfirmOrderAnimation from "../LottieAnimation/lf30_editor_l2pntkvk.json";

function OrderConfirm() {
  const navigate = useNavigate();

  // lottie Animation
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: ConfirmOrderAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div>
      <div className="d-flex justify-content-center">
        <div className="col">
          <Lottie options={defaultOptions} height={600} width={600} />

          <div className="col text-center">
            <Button
              size="large"
              sx={{
                backgroundColor: "#05f599",
                color: "white",
                fontSize: 20,
                padding: "5px",
                width: 500,
                height: 60,
                marginTop: 2,
                textTransform: "inherit",
                ":hover": {
                  backgroundColor: "#05f599",
                },
              }}
              onClick={() => {
                navigate("/");
              }}
            >
              Continue shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirm;
