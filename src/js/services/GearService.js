import axios from "axios";
import config from "../../config/config";

export default class GearService {
    fetchGearList() {
        return axios.get(`${config.databaseHost}/get-gear-list`);
    }
};
