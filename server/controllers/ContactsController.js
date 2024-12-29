import mongoose from "mongoose";
import User from "../models/UserModel.js";
import Message from "../models/MessagesModel.js";

export const SearchContacts = async (req, res) => {
    try {
        console.log("Received searchTerm:", req.body.searchTerm); // Log the search term
        const { searchTerm } = req.body;

        // Validate input
        if (!searchTerm || typeof searchTerm !== "string" ) {
            return res.status(400).send("Invalid searchTerm. ");
        }

        // Sanitize search term
        const sanitizedSearchTerm = searchTerm.replace(/[.*?${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(sanitizedSearchTerm, "i");

        // Query for matching users, excluding the current user
        const contacts = await User.find({
            $and: [
                { _id: { $ne: req.userId } }, // Exclude current user
                {
                    $or: [
                        { firstName: regex },//regex is the sanitized searchTerm
                        { lastName: regex },
                        { email: regex },
                    ],
                },
            ],
        });

        // Send response
        return res.status(200).json({ contacts });
    } catch (error) {
        console.error("Error in SearchContacts:", error);
        return res.status(500).json({ error: "Internal server error", details: error.message });
    }
};

export const getContactsForDMList = async (req, res) => {
    try {
        let {userId} = req;
        userId = new mongoose.Types.ObjectId(userId);
        const contacts = await Message.aggregate([
            {
                //we are matching the sender or recipient of message with userId
                $match:{
                    $or:[{sender:userId},{recipient:userId}],
                },
            },
            {
                //sorting according to timestamp
                $sort:{timestamp:-1},
            },
            {
                $group:{
                    _id:{
                        $cond:{
                            if:{seq:["$sender",userId]},
                            then:"$recipient",
                            else:"$sender",
                        },
                    },
                    lastMessageTime:{$first:"$timestamp"},
                },
            },
            {
                $lookup:{
                from:"users",
                localField:"_id",
                foreignField:"_id",
                as:"contactInfo",
                  },
            },
            {
                $unwind:"$contactInfo",
            },
            {
                $project:{
                    _id:1,
                    lastMessageTime:1,
                    email:"$contactInfo.email",
                    firstName:"$contactInfo.firstName",
                    lastName:"$contactInfo.lastName",
                    image:"$contactInfo.image",
                    color:"$contactInfo.color",
                },
            },
            {
                $sort:{lastMessageTime:-1},
            },
        ])
       
        // Send response
        return res.status(200).json({ contacts });
    } catch (error) {
        console.error("Error in SearchContacts:", error);
        return res.status(500).json({ error: "Internal server error", details: error.message });
    }
};























// import User from "../models/UserModel.js";

// export const SearchContacts = async (req, res, next) => {
//     try {
//        const {searchTerm} = req.body;
        
//         if(searchTerm===undefined || searchTerm===null){
//             return res.status(400).send("searchTerm is required ")
//         }

//         //removes all special characters from strings
//         const sanitizedsearchTerm = searchTerm.replace(
//             /[.*?${}()|[\]\\]/g,
//             "\\$&"
//         );

//         const regex = new RegExp(sanitizedsearchTerm,"i");


//         //if id != re.userId i.e current userid then search for it but if it is same we dont want it in results so while searching contacts the current user shouldn't be there
//         const contacts = await User.find({
//             $and:[{_id:{$ne: req.userId}},
//                 {$or:[{firstName:regex},{lastName:regex},{email:regex}]}
//             ],
//         });
        
//                 // Send response
//         return res.status(200).json({contacts})

//     } catch (error) {
//         console.error(error);
//         return res.status(500).send("Internal server error");
//     }
// };