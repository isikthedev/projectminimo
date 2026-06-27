"use client"

import * as React from "react"

interface CollapsibleContextType {
  open: boolean
  setOpen: (open: boolean) => void
}

const CollapsibleContext = React.createContext<CollapsibleContextType | null>(null)

export function Collapsible({
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  children,
  className,
  asChild,
}: {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
  className?: string
  asChild?: boolean
}) {
  const [openState, setOpenState] = React.useState(defaultOpen)
  const open = openProp !== undefined ? openProp : openState
  const setOpen = React.useCallback(
    (val: boolean) => {
      setOpenState(val)
      onOpenChange?.(val)
    },
    [onOpenChange]
  )

  if (asChild && React.isValidElement<Record<string, unknown>>(children)) {
    const child = children as React.ReactElement<Record<string, unknown>>
    return (
      <CollapsibleContext.Provider value={{ open, setOpen }}>
        {React.cloneElement(child, {
          className: className
            ? `${className} ${(child.props.className as string) ?? ""}`
            : child.props.className,
          "data-state": open ? "open" : "closed",
        })}
      </CollapsibleContext.Provider>
    )
  }

  return (
    <CollapsibleContext.Provider value={{ open, setOpen }}>
      <div data-state={open ? "open" : "closed"} className={className}>
        {children}
      </div>
    </CollapsibleContext.Provider>
  )
}

export function CollapsibleTrigger({
  children,
  asChild,
  onClick,
  ...rest
}: {
  children?: React.ReactNode
  asChild?: boolean
} & Omit<React.ComponentPropsWithoutRef<"button">, "onClick"> & {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}) {
  const ctx = React.useContext(CollapsibleContext)
  if (!ctx) throw new Error("CollapsibleTrigger must be used within Collapsible")

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    ctx.setOpen(!ctx.open)
    onClick?.(e)
  }

  if (asChild && React.isValidElement<Record<string, unknown>>(children)) {
    const child = children as React.ReactElement<Record<string, unknown>>
    return React.cloneElement(child, {
      ...rest,
      onClick: handleClick,
      "data-state": ctx.open ? "open" : "closed",
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      data-state={ctx.open ? "open" : "closed"}
      {...rest}
    >
      {children}
    </button>
  )
}

export function CollapsibleContent({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const ctx = React.useContext(CollapsibleContext)
  if (!ctx) throw new Error("CollapsibleContent must be used within Collapsible")

  if (!ctx.open) return null

  return (
    <div data-state="open" className={className} {...props}>
      {children}
    </div>
  )
}
