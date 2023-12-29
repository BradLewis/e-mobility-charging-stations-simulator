import type { IncomingMessage } from 'node:http'

import { Protocol, ProtocolVersion } from '../../types/index.js'
import { logPrefix, logger } from '../../utils/index.js'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class UIServerUtils {
  private constructor () {
    // This is intentional
  }

  public static handleProtocols = (
    protocols: Set<string>,
    request: IncomingMessage
  ): string | false => {
    let protocol: Protocol | undefined
    let version: ProtocolVersion | undefined
    if (protocols.size === 0) {
      return false
    }
    for (const fullProtocol of protocols) {
      if (UIServerUtils.isProtocolAndVersionSupported(fullProtocol)) {
        return fullProtocol
      }
    }
    logger.error(
      `${logPrefix(
        ' UI WebSocket Server |'
      )} Unsupported protocol: '${protocol}' or protocol version: '${version}'`
    )
    return false
  }

  public static isProtocolAndVersionSupported = (protocolStr: string): boolean => {
    const [protocol, version] = UIServerUtils.getProtocolAndVersion(protocolStr)
    return (
      Object.values(Protocol).includes(protocol) && Object.values(ProtocolVersion).includes(version)
    )
  }

  public static getProtocolAndVersion = (protocolStr: string): [Protocol, ProtocolVersion] => {
    const protocolIndex = protocolStr.indexOf(Protocol.UI)
    const protocol = protocolStr.substring(
      protocolIndex,
      protocolIndex + Protocol.UI.length
    ) as Protocol
    const version = protocolStr.substring(protocolIndex + Protocol.UI.length) as ProtocolVersion
    return [protocol, version]
  }

  public static isLoopback (address: string): boolean {
    // eslint-disable-next-line prefer-regex-literals
    const isLoopbackRegExp = new RegExp(
      // eslint-disable-next-line no-useless-escape
      /^localhost$|^127(?:\.\d+){0,2}\.\d+$|^(?:0*\:)*?:?0*1$/,
      'i'
    )
    return isLoopbackRegExp.test(address)
  }
}
