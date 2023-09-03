import { cleanEnv } from "envalid";
import {email, port, str} from "envalid/dist/validators"


export default cleanEnv (process.env, {
    MONGO_CONNECTION_URI : str(),
    PORT : port(),
    SESSION_SECRET : str(),
    EMAIL: email(),
    PASSWORD: str()
});