import { Button } from "broadcaster-components/button.js"
import { Input } from "broadcaster-components/control/input.js"
import { Select } from "broadcaster-components/control/select.js"
import { TbPlus } from "react-icons/tb"
import type { Label, Sponsor } from "../../domain/model/Sponsor.js"
import { LabelDisplay } from "../components/label-display.js"

type Props = {
  labels: Label[]
  sponsors: Sponsor[]
}

export const LabelConditionInput = ({ labels }: Props) => {
  return (
    <div className="flex flex-col overflow-hidden rounded border border-slate-300">
      <div className="flex">
        <div className="grid w-[60px] place-items-center border-r border-r-slate-200 bg-slate-100">
          -
        </div>
        <div className="flex items-center gap-2 p-2">
          <div className="w-[150px]">
            <Select
              items={labels}
              value={labels[0]!.id}
              renderItem={(item) => <LabelDisplay label={item} />}
            />
          </div>
          <span>OR</span>
          <div className="w-[150px]">
            <Input />
          </div>
          <Button variant="secondary" type="button">
            OR条件を追加
          </Button>
        </div>
      </div>
      <hr className="border-t border-t-slate-300" />
      <div className="flex">
        <div className="grid w-[60px] place-items-center border-r border-r-slate-200 bg-slate-100">
          AND
        </div>
        <div className="flex items-center gap-2 p-2">
          <div className="w-[150px]">
            <Input />
          </div>
          <span>OR</span>
          <div className="w-[150px]">
            <Input />
          </div>
          <Button variant="secondary" type="button">
            OR条件を追加
          </Button>
        </div>
      </div>
      <hr className="border-t border-t-slate-300" />
      <div className="bg-slate-100 p-2">
        <Button variant="secondary" type="button" prefix={<TbPlus />}>
          AND条件を追加
        </Button>
      </div>
    </div>
  )
}
