import { type ComponentProps, useEffect, useState } from "react"
import { TbLoader } from "react-icons/tb"
import { Button } from "./button.js"
import { MultiInput } from "./control/multi-input.js"
import { getTextFromClipboard } from "./utils/clipboard.js"
import { parseSlackPermalink } from "./utils/slack-parmalink.js"

type MessageRef = {
  channel: string
  timestamp: string
}

type Props = Omit<ComponentProps<typeof MultiInput>, "onChange" | "value"> & {
  value: string
  onChange: (value: string) => void
  slackPermalink?: string
  getMessage: (ref: MessageRef) => Promise<string | null>
  option: {
    slackWorkspaceDomain: string
  }
}

export const SlackEditor = ({
  getMessage,
  onChange,
  value,
  slackPermalink,
  option,
  ...props
}: Props) => {
  const [messageRef, setMessageRef] = useState<MessageRef | null>(null)
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    ;(async () => {
      const text = await getTextFromClipboard()
      if (text == null) {
        return
      }
      const parsed = parseSlackPermalink(text, option.slackWorkspaceDomain)
      if (parsed == null) {
        return
      }

      setMessageRef(parsed)
    })()
  }, [])

  const handleApplyMessage = async () => {
    if (messageRef == null) {
      return
    }
    try {
      setIsPending(true)
      const body = await getMessage(messageRef)
      if (body == null) {
        return
      }
      onChange(body)
      setMessageRef(null)
    } finally {
      setIsPending(false)
    }
  }

  useEffect(() => {
    const parsed = parseSlackPermalink(value, option.slackWorkspaceDomain)
    if (parsed != null) {
      setMessageRef(parsed)
    }
  }, [value, option.slackWorkspaceDomain])

  return (
    <div className="flex flex-col gap-2">
      {messageRef != null && (
        <div className="flex items-center gap-2 bg-slate-50 p-1 pl-3 text-sm">
          <div>Slackのリンクを検出しました</div>
          <Button
            type="button"
            variant="secondary"
            onClick={handleApplyMessage}
            prefix={isPending ? <TbLoader className="animate-spin" /> : null}
            className="shrink-0 rounded border border-green-500 bg-white px-3 py-1 text-green-900 hover:bg-green-50"
          >
            反映
          </Button>
        </div>
      )}
      <MultiInput
        {...props}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={isPending}
      />
    </div>
  )
}
