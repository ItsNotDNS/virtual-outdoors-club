// import axios from "axios";
// import Cookies from "universal-cookie";
// const cookies = new Cookies(),
//     axiosAuth = axios.create({
//         headers: {
//             "Authorization": `Bearer ${cookies.get("token")}`
//         }
//     });

// export default axiosAuth;

import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies(),
    axiosAuth = { axiosSingleton: axios },
    setAxiosWithAuth = () => {
        axiosAuth.axiosSingleton = axios.create({
            headers: {
                "Authorization": `Bearer ${cookies.get("token")}`
            }
        });
    };

export default axiosAuth;
export { setAxiosWithAuth };
