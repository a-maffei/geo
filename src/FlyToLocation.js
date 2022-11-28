import { useMap } from "react-leaflet";

export default function Location({ position }) {
  const map = useMap();
  map.flyTo(position, map.getZoom());
  return null;
}
