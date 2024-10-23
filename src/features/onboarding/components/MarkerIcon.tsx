import { MarkerType } from '@/types/map'
import { Calendar, MapPin, Info } from 'lucide-react'

interface MarkerIconProps {
  type: MarkerType
  className?: string
}

export function MarkerIcon({ type, className = "h-4 w-4" }: MarkerIconProps) {
  switch (type) {
    case MarkerType.Event:
      return <Calendar className={className} />
    case MarkerType.Location:
      return <MapPin className={className} />
    case MarkerType.Info:
      return <Info className={className} />
    default:
      return <MapPin className={className} />
  }
}
