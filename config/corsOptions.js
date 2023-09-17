import allowedOrigins from "./allowedOrigins.js";
import winston from "winston";

const  corsOptions = {
 
  origin: (origin, callback) => {
    try {
      
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by cors"));
      }
    
    optionsSuccessStatus : 200

   
   
     } catch (err) {
winston.error(err.message, err);
console.log('error for origin')
 }
}}

export default corsOptions;
