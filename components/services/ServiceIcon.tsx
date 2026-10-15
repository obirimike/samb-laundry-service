import { Sparkles, WashingMachine, Home, Bug, LucideProps } from "lucide-react";

interface ServiceIconProps extends LucideProps {
  category: "LAUNDRY" | "CLEANING" | "DOMESTIC_SUPPORT" | "PEST_CONTROL" | string;
}

export default function ServiceIcon({
  category,
  ...props
}: ServiceIconProps) {
  if (category === "LAUNDRY") {
    return <WashingMachine {...props} />;
  }
  if (category === "DOMESTIC_SUPPORT") {
    return <Home {...props} />;
  }
  if (category === "PEST_CONTROL") {
    return <Bug {...props} />;
  }

  return <Sparkles {...props} />;
}
