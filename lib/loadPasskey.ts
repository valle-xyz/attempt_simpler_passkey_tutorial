import { STORAGE_PASSKEY_LIST_KEY } from "./constants";
import { PasskeyListType} from "../../types";

function loadPasskey(): PasskeyListType | null {
  const passkeyStored = localStorage.getItem(STORAGE_PASSKEY_LIST_KEY);

  console.log("passkey stored: ", passkeyStored)

  const passkey = passkeyStored ? JSON.parse(passkeyStored) : null;

  console.log("passkey loaded: ", passkey)

  return passkey;
}

export default loadPasskey;
