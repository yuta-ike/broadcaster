import { useFormStatus } from "react-dom"
import { TbLoader } from "react-icons/tb"
import { Button } from "../button.js"

export const SubmitButton = (props: React.ComponentProps<typeof Button>) => {
  const { pending } = useFormStatus()

  return (
    <Button
      {...props}
      disabled={pending}
      data-pending={pending}
      prefix={pending ? <TbLoader className="animate-spin" /> : props.prefix}
    />
  )
}
