import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputGroupProps extends React.ComponentProps<"div"> {}

export function InputGroup({ className, ...props }: InputGroupProps) {
  return (
    <div
      className={cn(
        "relative flex items-center w-full focus-within:z-10",
        className
      )}
      {...props}
    />
  )
}

export interface InputGroupInputProps extends React.ComponentProps<"input"> {}

export function InputGroupInput({ className, ...props }: InputGroupInputProps) {
  return (
    <input
      className={cn(
        "h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pr-9",
        className
      )}
      {...props}
    />
  )
}

export interface InputGroupAddonProps extends React.ComponentProps<"div"> {}

export function InputGroupAddon({ className, ...props }: InputGroupAddonProps) {
  return (
    <div
      className={cn(
        "absolute right-3 flex items-center text-muted-foreground pointer-events-none [&>svg]:size-4",
        className
      )}
      {...props}
    />
  )
}
