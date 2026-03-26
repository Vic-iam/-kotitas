
//DATABASE
export const DB_HOST = process.env.DB_HOST
export const DB_PORT = parseInt(process.env.DB_PORT || '5432')
export const DB_USER = process.env.DB_USER
export const DB_PASSWORD = process.env.DB_PASSWORD
export const DB_NAME = process.env.DB_NAME

//SESSIONS 
export const SESS_DURATION = parseInt(process.env.SESS_DURATION || "3600000") //Default una hora
export const SESS_ABSOLUTE_DURATION = parseInt(process.env.SESS_ABSOLUTE_DURATION || "86400000" ) //Default un dia
