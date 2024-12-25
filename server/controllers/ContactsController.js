import User from "../models/UserModel.js";

export const SearchContacts = async (req, res, next) => {
    try {
       const {searchTerm} = req.body;
        
        if(searchTerm===undefined || searchTerm===null){
            return res.status(400).send("searchTerm is required ")
        }

        //removes all special characters from strings
        const sanitizedsearchTerm = searchTerm.replace(
            /[.*?${}()|[\]\\]/g,
            "\\$&"
        );

        const regex = new RegExp(sanitizedsearchTerm,"i");


        //if id != re.userId i.e current userid then search for it but if it is same we dont want it in results so while searching contacts the current user shouldn't be there
        const contacts = await User.find({
            $and:[{_id:{$ne: req.userId}},
                {$or:[{firstName:regex},{lastName:regex},{email:regex}]}
            ],
        });
        
                // Send response
        return res.status(200).json({contacts})

    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
};