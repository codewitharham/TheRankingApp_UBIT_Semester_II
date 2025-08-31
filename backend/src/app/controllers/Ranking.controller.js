// ranking controller to handle ranking related requests

const getRanking = async (req, res) => {
    try {
        
        return res.status(200).json({message: "getRanking called"}) // send success message as JSON response with status 200 (OK)
    } catch (error) {
        res.status(500).json({message: error.message}) // send error message as JSON response with status 500 (Internal Server Error)
    } 
}

export {getRanking}