import Message from "../models/MessagesModel.js";

export const getMessages = async (req, res) => {
    try {
        // console.log("Received searchTerm:", req.body.searchTerm); // Log the search term
        const user1 = req.userId;
        const user2 = req.body.Id;

        // Validate input
        if (!user1 || !user2 ) {
            return res.status(400).send("Both user Ids are required");
        }

        // Query for matching users, excluding the current user
        const messages = await Message.find({
            $or: [
                {sender:user1,recipient:user2 }, // Exclude current user
                {sender:user2, recipient:user1 },
            ],
        }).sort({timestamp:1});

        // Send response
        return res.status(200).json({ messages });
    } catch (error) {
        console.error("Error in messages", error);
        return res.status(500).json({ error: "Internal server error", details: error.message });
    }
};