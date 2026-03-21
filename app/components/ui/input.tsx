import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "~/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
    return (
        <InputPrimitive
            type={type}
            data-slot="input"
            className={cn(
                `w-full
                rounded-lg
                border
                border-border
                bg-surface
                px-3
                py-2
                text-sm
                text-text
                placeholder-text-muted
                focus:outline-none
                focus:ring-2
                focus:ring-primary
                focus:border-transparent`,
                className
            )}
            {...props}
        />
    )
}

export { Input }
