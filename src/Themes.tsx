
export const themes = {
  largeHeading: {
    fontWeight: 600,
    fontSize: {xs:'24px',md:"32px"},
    color: "var(--color-black)",
  },
  lightFont:{
    fontWeight: 400,
    fontSize: {xs:"15px",md:"16px"},
    color: "var(--color-grey)",
  },
  mediumSizedFont:{
     fontWeight: 600,
    fontSize: "19px",
    color: "var(--color-black)",
  },
ButtonStyle:{
  backgroundColor:'var(--color-purple)',
  color:"var(--color-white)",
      fontWeight: 600,
fontSize:'18px',
borderRadius:"10px",
 textTransform: "none",
// "&:hover": {
//       backgroundColor: "var(--color-darkPurple)",
//       color: "white",
//     }
},
inputFeildinActive:{
  fontWeight: 600,
    fontSize: "19px",
    color: "var(--color-grey)",
},
OutlinedButtonStyle:{
   backgroundColor: "transparent",
  color: "var(--color-purple)",
  border: "1px solid var(--color-purple)",
  fontWeight: 600,
  fontSize: "18px",
  borderRadius: "10px",
  textTransform: "none",
  fontFamily: "Sora, sans-serif",
  "&:hover": {
    backgroundColor: "var(--color-purple)",
    color: "var(--color-white)",
    border: "1px solid var(--color-purple)",
  },
},

textFieldStyle:{
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#ccc", 
      },
      "&:hover fieldset": {
        borderColor: "#ccc", 
      },
      "&.Mui-focused fieldset": {
        borderColor: "var(--color-purple)", 
      },
    },
    "& .MuiInputLabel-root": {
      color: "#666", 
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "var(--color-purple)", 
    },
  },

  inputFeildActions: {
  inActive: {
    color: "var(--color-grey)",
    fontFamily: "Sora, sans-serif",
    fontWeight: 400,
    fontSize: "16px",
    transition: "all 0.2s ease",

    "&.Mui-focused": {
      color: "var(--color-purple)",
    },
  },

  active: {
    fontFamily: "Sora, sans-serif",

    "& .MuiInputBase-root": {
      borderBottom: "1px solid var(--color-light)",
    },
    "& .MuiInputBase-root.Mui-focused": {
      borderBottom: "1px solid var(--color-purple)",
    },

    "& .MuiInputBase-input": {
      fontSize: "16px",
      fontWeight: 400,
      fontFamily: "Sora, sans-serif",
    },

    "& .MuiInputBase-input:not(:placeholder-shown)": {
      fontSize: "18px",
      fontWeight: 400,
      fontFamily: "Sora, sans-serif",
    },
  },
}


};