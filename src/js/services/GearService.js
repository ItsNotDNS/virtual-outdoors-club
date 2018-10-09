import axios from "axios";
import config from "../../config/config";

export default class EquipmentService {
    fetchGearList() {
        return axios.get(`${config.databaseHost}/get-gear-list`, {
            headers: {
                "Access-Control-Allow-Origin": "*"
            }
        });
    }
};
