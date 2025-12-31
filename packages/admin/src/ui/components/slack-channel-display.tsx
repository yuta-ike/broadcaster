import { TbHash, TbLock, TbShare, TbTrash } from "react-icons/tb"
import type { SlackChannel } from "../../domain/model/SlackChannel.js"

type Props = {
  channel: SlackChannel
}

export const SlackChannelDisplay = ({ channel }: Props) => {
  const icon =
    channel.kind === "public" ? (
      <TbHash />
    ) : channel.kind === "private" ? (
      <TbLock />
    ) : channel.kind === "archived" ? (
      <TbTrash />
    ) : (
      <TbShare />
    )
  return (
    <div className="flex items-center gap-2">
      {icon}
      <div>{channel.name}</div>
    </div>
  )
}
