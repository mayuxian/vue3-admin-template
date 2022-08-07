import { sha256 } from 'js-sha256'
import { Base64 } from 'js-base64'

export default {
  sha256AndBase64(value: any) {
    return Base64.encode(sha256(value))
  },
}
