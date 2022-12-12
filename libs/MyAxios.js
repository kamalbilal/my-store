import axios from "axios"

async function MyAxios(options) {
    let response = {}
    try {
        const temp = await axios(options)
        response = {...temp}
        response["success"] = true
        response["error"] = null
        return response
        
    } catch (error) {
        response["success"] = false
        response["error"] = error
        return response
    }

}

export default MyAxios