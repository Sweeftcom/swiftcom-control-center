import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useDriverLocations } from "@/hooks/useDrivers";
import { useOrders } from "@/hooks/useOrders";
import { Truck, MapPin, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom icons
const driverIcon = new L.DivIcon({
  className: "custom-driver-marker",
  html: `<div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg border-2 border-white">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const orderIcon = new L.DivIcon({
  className: "custom-order-marker",
  html: `<div class="w-8 h-8 bg-warning rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-pulse">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export function LiveMap() {
  const { data: driverLocations } = useDriverLocations();
  const { data: orders } = useOrders();
  const mapRef = useRef<L.Map>(null);

  // Default center (Bangalore)
  const defaultCenter: [number, number] = [12.9716, 77.5946];

  // Filter pending orders with coordinates
  const pendingOrders = orders?.filter(
    (o) => o.status === "pending" && o.delivery_latitude && o.delivery_longitude
  ) || [];

  // Online drivers with locations
  const onlineDrivers = driverLocations?.filter(
    (dl) => dl.driver?.is_online
  ) || [];

  return (
    <div className="stat-card h-[500px] overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Live Map</h3>
          <p className="text-sm text-muted-foreground">
            Real-time driver and order locations
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-muted-foreground">Drivers ({onlineDrivers.length})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-warning animate-pulse" />
            <span className="text-muted-foreground">Pending Orders ({pendingOrders.length})</span>
          </div>
        </div>
      </div>

      <div className="h-[420px] rounded-lg overflow-hidden border border-border">
        <MapContainer
          center={defaultCenter}
          zoom={12}
          className="h-full w-full"
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {/* Driver markers */}
          {onlineDrivers.map((dl) => (
            <Marker
              key={dl.id}
              position={[Number(dl.latitude), Number(dl.longitude)]}
              icon={driverIcon}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className="h-4 w-4 text-primary" />
                    <span className="font-semibold">{dl.driver?.full_name || "Driver"}</span>
                  </div>
                  <div className="text-sm space-y-1">
                    <p>📱 {dl.driver?.phone || "N/A"}</p>
                    <p>🚗 {dl.driver?.vehicle_number || "N/A"}</p>
                    <p>🕐 Updated: {new Date(dl.last_updated).toLocaleTimeString()}</p>
                    {dl.speed && <p>⚡ Speed: {dl.speed} km/h</p>}
                  </div>
                  <Badge variant="outline" className="mt-2 bg-success/10 text-success border-success/30">
                    Online
                  </Badge>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Pending order markers */}
          {pendingOrders.map((order) => (
            <Marker
              key={order.id}
              position={[Number(order.delivery_latitude), Number(order.delivery_longitude)]}
              icon={orderIcon}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="h-4 w-4 text-warning" />
                    <span className="font-semibold">{order.order_number}</span>
                  </div>
                  <div className="text-sm space-y-1">
                    <p>📍 {order.delivery_address || "No address"}</p>
                    <p>💰 ₹{order.total_amount}</p>
                    <p>🕐 {new Date(order.created_at).toLocaleTimeString()}</p>
                  </div>
                  <Badge variant="outline" className="mt-2 bg-warning/10 text-warning border-warning/30">
                    Pending
                  </Badge>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
