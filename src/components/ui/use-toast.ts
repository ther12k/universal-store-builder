
import { useToast, toast } from "@/hooks/use-toast";

// Enhance the toast with new styling
const enhancedToast = {
  ...toast,
  // You can extend with custom methods if needed
};

export { useToast, enhancedToast as toast };
