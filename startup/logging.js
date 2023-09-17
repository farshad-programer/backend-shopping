 import 'express-async-errors';
 import winston from 'winston';
 import debug from 'debug';



debug("app:main");


export default function(){
  winston.add(new winston.transports.File({filename: 'logfile.log',colorize: true, prettyPrint: true}));
  winston.add(new winston.transports.Console({colorize: true, prettyPrint: true}));
  
  process.on('uncaughtException', (ex)=>{
    debug(ex);
    winston.error(ex.message,ex);
    process.exit(1);
  });
  
  process.on('unhandledRejection', (ex)=>{
    debug(ex);
    winston.error(ex.message,ex);
    process.exit(1);
  });
  
}