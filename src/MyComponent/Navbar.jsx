import { Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  return (
    <div className="d-flex justify-content-center m-2">
      <Button
        variant="outlined"
        onClick={() => {
          navigate("/mobiles");
        }}
      >
        mobiles
      </Button>

      <Button
        variant="outlined"
        onClick={() => {
          navigate("/beauty-and-kids");
        }}
      >
        beauty-and-kids
      </Button>
    </div>
  );
}

export default Navbar;
