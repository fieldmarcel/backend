import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"  //filesystem


    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUDNAME, 
        api_key:process.env.CLOUDINARY_API_KEY, 
        // api_secret: '<your_api_secret>' 
    api_secret:process.env.CLOUDINARY_API_SECRET
    });
    // By using process.env, you decouple your code 
    // from the specific environment variables 
    // set on
    //  your machine.


const uploadOnCloudinary = async (localFilePath)=>{
    try {

        if (!localFilePath) { // Corrected condition: check if path is provided
            console.error("No local file path provided."); // Helpful error message
            return null;
        }  //if dont want to wruite RETURN NULL JUZZ REMOVEE ! AND ADD A
        //   BRACKET FOR UTSIDE..CHECK BELOW CODE 
        cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        console.log("file is uploaded on cloudinary",response.url);
        return response;
        
    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null;
        //remove the locallly saved temporary 
        // files as the uploading failed 
    }
}
export {uploadOnCloudinary}
// if(local){ 
// cloudinary.uploader.upload(localFilePath,{
//     resource_type:"auto"
// })}
// console.log("file is uploaded on cloudinary",response.url);
// return response;


// this is for the syntax purpose for uploading
//     const uploadResult = await cloudinary.uploader
//     .upload(
//         'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//             public_id: 'shoes',
//         }
//     )
//     .catch((error) => {
//         console.log(error);
//     });
 
//  console.log(uploadResult);