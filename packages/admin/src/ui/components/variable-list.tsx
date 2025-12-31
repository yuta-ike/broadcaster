import { useCopy } from "broadcaster-components/utils/use-copy.js"
import { TbCheck, TbClipboard } from "react-icons/tb"

export const VariableTable = () => {
  return (
    <div className="text-slate-500 text-xs">
      <span className="mr-2">メタ変数:</span>
      <br />
      <CopyButton text={"{{ SPONSOR_NAME }}"} /> スポンサー名
      <span className="mx-2">/</span>
      <CopyButton text={"{{ SPONSOR_READABLE_ID }}"} /> スポンサーID
    </div>
  )
}

const CopyButton = ({ text }: { text: string }) => {
  const { copy, hasCopied } = useCopy()
  const handleClick = async () => {
    await copy(text)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group inline-flex items-center gap-1 rounded border border-slate-200 bg-slate-100 p-1 text-slate-800 text-xs hover:opacity-85"
    >
      <code className="">{text}</code>
      {hasCopied ? (
        <TbCheck size={16} className="inline text-green-700" />
      ) : (
        <TbClipboard
          size={16}
          className="inline transition-transform group-hover:scale-110"
        />
      )}
    </button>
  )
}
