import User from "../models/UserModel.js";

export const SearchContacts = async (req, res) => {
    try {
        console.log("Received searchTerm:", req.body.searchTerm); // Log the search term
        const { searchTerm } = req.body;

        // Validate input
        if (!searchTerm || typeof searchTerm !== "string" || searchTerm.trim().length < 2) {
            return res.status(400).send("Invalid searchTerm. It must be at least 2 characters.");
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
                        { firstName: regex },
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