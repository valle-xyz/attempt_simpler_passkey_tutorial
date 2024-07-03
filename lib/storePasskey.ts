import { PasskeyArgType } from "@safe-global/protocol-kit";

import loadPasskeys from "./loadPasskey";
import { STORAGE_PASSKEY_LIST_KEY } from "./constants";
import { PasskeyItemType } from "../../types";

function storePasskey(passkey: PasskeyArgType) {
  localStorage.setItem(STORAGE_PASSKEY_LIST_KEY, JSON.stringify(passkey));
}

export default storePasskey;
