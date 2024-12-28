const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}


export { asyncHandler }




// const asyncHandler = () => {}
// const asyncHandler = (func) => () => {}
// const asyncHandler = (func) => async () => {}


// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }




// // for connection with database we make an asynchandler  function separately 
// // and call it everytime we need for videos or or user details etc
// //  here is th procedure of doing it


// // const asynchandler= ()=>{} step1
// // const asynchandler =(fn)=>{()=>{}} step2
// // const asynchandler =(fn)=>()=>{}  step3   //we can write without braces

// // const asynchandler =(fn)=> async()=>{} step4  to make async function

// const asynchandler= (fn)=>async  (req, res, next)=>{  //next for middleware to tell mw has checked what it should check
//     try {
//         await fn(req,res,next);
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success:false,
//             message:err.message
//         })    //errcode is through user side otherwise 500
//     }
// }
// export {asynchandler}


// // fn is the actual middleware logic (e.g., database calls).
// // The returned function (async (req, res, next)) executes fn and uses await to handle asynchronous operations.
// // If fn throws an error, it is caught and handled by the catch block, ensuring the server doesn't crash.


// //so this all  is a wrapper function which will be
// //    useful in future in always used in production biilds

// //another method
// // const asynchandler= (requestHandler)=>{(req, res,next)=>{
// //     Promise.resolve(requestHandler(req, res,next)).catch((err)=>next(err))}}


// // export {asynchandler}