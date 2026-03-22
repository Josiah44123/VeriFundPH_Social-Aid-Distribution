import * as React from "react"
import { cn } from "@/lib/utils"

const Select = ({ value, onValueChange, children }: any) => {
  return (
    <div className="relative w-full">
      <select 
        value={value} 
        onChange={e => onValueChange?.(e.target.value)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      >
        <option value="" disabled>Pumili ng ID</option>
        <option value="philsys">PhilSys</option>
        <option value="driver">Driver's License</option>
        <option value="voter">Voter's ID</option>
        <option value="postal">Postal ID</option>
        <option value="sss">SSS ID</option>
        <option value="gsis">GSIS ID</option>
        <option value="passport">Passport</option>
      </select>
      <div className="pointer-events-none">
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
             return React.cloneElement(child as any, { value })
          }
          return child
        })}
      </div>
    </div>
  )
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, any>(({ className, children, value, ...props }, ref) => (
  <button ref={ref} className={cn("flex h-[52px] w-full items-center justify-between rounded-[12px] border border-input bg-background px-3 py-2 text-sm ring-offset-background", className)} {...props} type="button">
    {children}
  </button>
))
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = ({ placeholder, value }: any) => {
  const labels: any = {
    philsys: "PhilSys", driver: "Driver's License", voter: "Voter's ID",
    postal: "Postal ID", sss: "SSS ID", gsis: "GSIS ID", passport: "Passport"
  }
  return <span className="truncate">{value ? labels[value] : placeholder}</span>
}

const SelectContent = (props: any) => null
const SelectItem = (props: any) => null

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
