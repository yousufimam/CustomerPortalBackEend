import axios from "axios";

function foo(){
    axios.get("http://localhost:3000/api/order-management")
    .then((resp) => {
        console.log("AXIOS =======> ",resp.data)
    })
}

export default foo;