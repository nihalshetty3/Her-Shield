const Incident = require("../models/Incident");

const getIncidents = async (req , res) => {
    try{
        const incident = await Incident.find()
        .sort({createdAt: -1});

        res.status(200).json({
            success:true,
            incidents
        });
    }
    catch(err){
        res.status(500).json({
            success:false,
            message: err.message
        });
    }
};
module.exports ={
    getIncidents
};