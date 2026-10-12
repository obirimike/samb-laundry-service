import { Sparkles, WashingMachine, LucideProps } from "lucide-react";

interface ServiceIconProps extends LucideProps {
  category: "LAUNDRY" | "CLEANING" | string;
}

export default function ServiceIcon({
  category,
  ...props
}: ServiceIconProps) {
  if (category === "LAUNDRY") {
    return <WashingMachine {...props} />;
  }

  return <Sparkles {...props} />;
}
