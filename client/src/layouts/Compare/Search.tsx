import { InputHTMLAttributes } from 'react'

export default function Search(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex items-center pl-4 mb-4 rounded-lg text-[#1f1f1f] bg-slate-200">
      <input
        type="text"
        className="w-full h-full p-4 bg-transparent border-none outline-none placeholder:text-gray-500"
        placeholder='Search stock by symbol'
        {...props}
      />
    </div>
  )
}
