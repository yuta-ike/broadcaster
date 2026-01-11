import { CheckboxOption } from "broadcaster-components/control/checkbox.js"
import { search } from "fast-fuzzy"
import { useState } from "react"
import { TbSearch, TbX } from "react-icons/tb"
import type { Sponsor } from "../../domain/model/Sponsor.js"

type Props = {
  sponsors: Sponsor[]
  value: string[]
  onChange: (value: string[]) => void
}

const debounceSearch = (text: string, sponsors: Sponsor[]) => {
  return search(text, sponsors, {
    keySelector: (sponsor) =>
      `${sponsor.name} ${sponsor.labels.map((label) => label.label).join(" ")}`,
  })
}

export const SponsorInput = ({ sponsors, value, onChange }: Props) => {
  const [searchText, setSearchText] = useState("")

  const filtered =
    searchText.trim().length === 0
      ? sponsors
      : debounceSearch(searchText, sponsors)

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <div className="group flex items-center">
        <div className="shrink-0 px-3 pr-0 text-slate-600 transition-[padding]">
          <TbSearch size={18} />
        </div>
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="企業名またはラベルで絞り込み"
          className="peer grow px-3 not-placeholder-shown:py-3 py-1 outline-none transition-[padding] placeholder:text-slate-300 group-has-focus:py-3"
        />
        <button
          type="button"
          className="mr-2 shrink-0 rounded-full p-2 hover:bg-slate-100 peer-placeholder-shown:hidden"
          onClick={() => setSearchText("")}
        >
          <TbX />
        </button>
      </div>
      <hr className="border-t border-t-slate-200" />
      <div className="flex flex-wrap gap-4 p-4">
        {filtered.map((sponsor) => (
          <div key={sponsor.id}>
            <CheckboxOption
              checked={value.includes(sponsor.id)}
              onChange={(e) => {
                if (e.target.checked) {
                  onChange([...new Set([...value, sponsor.id])])
                } else {
                  onChange(value.filter((id) => id !== sponsor.id))
                }
              }}
            >
              {sponsor.name}
            </CheckboxOption>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="mx-auto text-slate-600 text-sm">
            条件に一致する項目が見つかりません
          </div>
        )}
      </div>
    </div>
  )
}
