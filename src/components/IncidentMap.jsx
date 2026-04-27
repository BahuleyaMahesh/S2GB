import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getSeverityColor, getIncidentIcon } from '../services/mapsService';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const IncidentMap = forwardRef(({ incidents, onIncidentClick }, ref) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const circlesRef = useRef({});

  // Expose focusIncident to parent
  useImperativeHandle(ref, () => ({
    focusIncident(incident) {
      if (!incident?.location?.latitude || !mapInstanceRef.current) return;
      const lat = Number(incident.location.latitude);
      const lng = Number(incident.location.longitude);
      const color = getSeverityColor(incident.severity);

      // Fly to marker with animation
      mapInstanceRef.current.flyTo([lat, lng], 14, {
        animate: true,
        duration: 1.2,
      });

      // Open the popup for this marker
      const marker = markersRef.current[incident.id];
      if (marker) {
        setTimeout(() => marker.openPopup(), 1300);
      }

      // Draw / update an affected-area circle
      if (circlesRef.current[incident.id]) {
        circlesRef.current[incident.id].remove();
      }
      const radiusMap = { critical: 1200, high: 800, medium: 500, low: 250 };
      const radius = radiusMap[incident.severity?.toLowerCase()] || 600;

      const circle = L.circle([lat, lng], {
        radius,
        color,
        fillColor: color,
        fillOpacity: 0.12,
        weight: 2,
        dashArray: '6 4',
        opacity: 0.7,
      }).addTo(mapInstanceRef.current);

      circlesRef.current[incident.id] = circle;

      // Auto-remove the circle after 6 seconds
      setTimeout(() => {
        circle.remove();
        delete circlesRef.current[incident.id];
      }, 6000);
    },
  }));

  // Initialize Leaflet map
  useEffect(() => {
    if (mapInstanceRef.current) return;

    mapInstanceRef.current = L.map(mapRef.current, {
      center: [28.6139, 77.2090],
      zoom: 11,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(mapInstanceRef.current);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Sync markers with incidents
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Remove stale markers
    Object.keys(markersRef.current).forEach(id => {
      if (!incidents.find(inc => inc.id === id)) {
        markersRef.current[id].remove();
        delete markersRef.current[id];
      }
    });

    incidents.forEach(incident => {
      if (!incident.location?.latitude) return;
      if (markersRef.current[incident.id]) return;

      const lat = Number(incident.location.latitude);
      const lng = Number(incident.location.longitude);
      const color = getSeverityColor(incident.severity);
      const icon = getIncidentIcon(incident.incidentType);

      const svgMarker = L.divIcon({
        className: '',
        html: `
          <div style="position:relative;width:40px;height:40px;display:flex;align-items:center;justify-content:center;">
            <div style="position:absolute;width:40px;height:40px;border-radius:50%;background:${color};opacity:0.2;animation:pulse-ring 2s infinite;"></div>
            <div style="position:relative;width:28px;height:28px;border-radius:50%;background:${color};border:2.5px solid white;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 0 14px ${color}99;cursor:pointer;">${icon}</div>
          </div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -22],
      });

      const marker = L.marker([lat, lng], { icon: svgMarker }).addTo(map);
      const title = incident.structuredData?.title || incident.incidentType || 'Incident';
      const address = incident.location?.address || 'Unknown location';
      const desc = (incident.description || '').slice(0, 90);

      marker.bindPopup(`
        <div style="background:#1e293b;color:white;padding:12px;border-radius:10px;min-width:220px;font-family:Inter,sans-serif;border-left:4px solid ${color};">
          <div style="font-size:9px;font-weight:900;letter-spacing:2px;color:${color};margin-bottom:4px;text-transform:uppercase;">${incident.severity || 'UNKNOWN'} SEVERITY</div>
          <div style="font-size:14px;font-weight:800;margin-bottom:4px;">${title}</div>
          <div style="font-size:11px;color:#94a3b8;margin-bottom:6px;">📍 ${address}</div>
          <div style="font-size:11px;color:#64748b;line-height:1.4;">${desc}${desc.length >= 90 ? '...' : ''}</div>
        </div>`, { className: 'leaflet-dark-popup' });

      marker.on('click', () => onIncidentClick(incident));
      markersRef.current[incident.id] = marker;
    });
  }, [incidents, onIncidentClick]);

  return (
    <div className="w-full h-full relative">
      <style>{`
        @keyframes pulse-ring {
          0%   { transform: scale(0.8); opacity: 0.5; }
          70%  { transform: scale(1.8); opacity: 0;   }
          100% { transform: scale(0.8); opacity: 0;   }
        }
        .leaflet-dark-popup .leaflet-popup-content-wrapper { background:transparent; box-shadow:none; padding:0; }
        .leaflet-dark-popup .leaflet-popup-tip            { background:#1e293b; }
        .leaflet-dark-popup .leaflet-popup-content        { margin:0; }
        .leaflet-container { background:#0f172a; }
      `}</style>

      <div ref={mapRef} className="w-full h-full rounded-xl overflow-hidden" />

      {/* Legend */}
      <div className="absolute top-4 left-4 z-[1000] bg-gray-900/90 backdrop-blur-sm p-3 rounded-xl border border-white/10 pointer-events-none">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Severity</h4>
        <div className="space-y-1.5">
          {[['#EF4444','Critical'],['#F97316','High'],['#EAB308','Medium'],['#22C55E','Low']].map(([color, label]) => (
            <div key={label} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: color }} />
              <span className="text-[10px] text-white font-bold uppercase">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Active incident count */}
      <div className="absolute top-4 right-4 z-[1000] bg-gray-900/90 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10 pointer-events-none">
        <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Active</div>
        <div className="text-2xl font-black text-white leading-none">{incidents.length}</div>
      </div>

      {/* Zoom hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] bg-gray-900/80 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/10 pointer-events-none">
        <span className="text-[10px] text-gray-400 font-bold">Click any incident card or marker to zoom in</span>
      </div>
    </div>
  );
});

IncidentMap.displayName = 'IncidentMap';
export default IncidentMap;
