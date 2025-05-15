
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio"

const AspectRatio = ({ className, ...props }: React.ComponentProps<typeof AspectRatioPrimitive.Root>) => (
  <AspectRatioPrimitive.Root 
    className={className}
    {...props}
  />
)

export { AspectRatio }
