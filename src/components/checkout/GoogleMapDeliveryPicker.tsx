'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export interface LocationData {
  lat: number;
  lng: number;
  formattedAddress?: string;
  province?: string;
  district?: string;
  subdistrict?: string;
  postalCode?: string;
  streetAddress?: string;
}

interface GoogleMapDeliveryPickerProps {
  apiKey?: string;
  onLocationSelect: (data: LocationData) => void;
  defaultLat?: number;
  defaultLng?: number;
}

interface GeocodeAddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface GeocodeResultItem {
  address_components?: GeocodeAddressComponent[];
  formatted_address?: string;
  geometry?: {
    location?: {
      lat: () => number;
      lng: () => number;
    };
  };
}

interface MapClickEvent {
  latLng?: {
    lat: () => number;
    lng: () => number;
  };
}

// Minimal window.google declaration for TypeScript
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google?: any;
    initGoogleMapsCallback?: () => void;
  }
}

export default function GoogleMapDeliveryPicker({
  apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  onLocationSelect,
  defaultLat = 13.7563, // Bangkok center default
  defaultLng = 100.5018,
}: GoogleMapDeliveryPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const autocompleteInstanceRef = useRef<any>(null);

  // Load Google Maps JavaScript API
  useEffect(() => {
    if (!apiKey) return;

    if (window.google && window.google.maps) {
      setIsScriptLoaded(true);
      return;
    }

    const existingScript = document.getElementById('google-maps-sdk');
    if (existingScript) {
      const checkInterval = setInterval(() => {
        if (window.google && window.google.maps) {
          setIsScriptLoaded(true);
          clearInterval(checkInterval);
        }
      }, 200);
      return () => clearInterval(checkInterval);
    }

    const script = document.createElement('script');
    script.id = 'google-maps-sdk';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=th`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setIsScriptLoaded(true);
    };
    document.head.appendChild(script);
  }, [apiKey]);

  // Reverse geocode to extract address components
  const parseAddressComponents = useCallback((results: GeocodeResultItem[]): Partial<LocationData> => {
    if (!results || results.length === 0) return {};
    const result = results[0];
    const components = result.address_components || [];

    let province = '';
    let district = '';
    let subdistrict = '';
    let postalCode = '';
    let streetNumber = '';
    let route = '';

    for (const c of components) {
      const types: string[] = c.types || [];
      if (types.includes('administrative_area_level_1')) {
        province = c.long_name.replace('จังหวัด', '').trim();
      } else if (types.includes('locality') || types.includes('administrative_area_level_2')) {
        district = c.long_name.replace('อำเภอ', '').replace('เขต', '').trim();
      } else if (types.includes('sublocality_level_1') || types.includes('sublocality') || types.includes('administrative_area_level_3')) {
        subdistrict = c.long_name.replace('ตำบล', '').replace('แขวง', '').trim();
      } else if (types.includes('postal_code')) {
        postalCode = c.long_name.trim();
      } else if (types.includes('street_number')) {
        streetNumber = c.long_name.trim();
      } else if (types.includes('route')) {
        route = c.long_name.trim();
      }
    }

    const streetAddress = [streetNumber, route].filter(Boolean).join(' ');

    return {
      formattedAddress: result.formatted_address,
      province,
      district,
      subdistrict,
      postalCode,
      streetAddress: streetAddress || undefined,
    };
  }, []);

  const handleUpdatePosition = useCallback(
    (lat: number, lng: number) => {
      setCurrentCoords({ lat, lng });

      if (window.google && window.google.maps) {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results: GeocodeResultItem[] | null, status: string) => {
          if (status === 'OK' && results && results[0]) {
            const parsed = parseAddressComponents(results);
            onLocationSelect({
              lat,
              lng,
              ...parsed,
            });
          } else {
            onLocationSelect({ lat, lng });
          }
        });
      } else {
        onLocationSelect({ lat, lng });
      }
    },
    [onLocationSelect, parseAddressComponents]
  );

  // Initialize Map when expanded & script ready
  useEffect(() => {
    if (!isOpen || !isScriptLoaded || !mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const initialPos = currentCoords || { lat: defaultLat, lng: defaultLng };

    // Create Map
    const map = new window.google.maps.Map(mapContainerRef.current, {
      center: initialPos,
      zoom: 15,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: true,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }],
        },
      ],
    });
    mapInstanceRef.current = map;

    // Create Draggable Pin Marker
    const marker = new window.google.maps.Marker({
      position: initialPos,
      map,
      draggable: true,
      title: 'จุดส่งมอบของขวัญ Giftory',
      animation: window.google.maps.Animation.DROP,
    });
    markerInstanceRef.current = marker;

    // Marker drag end
    marker.addListener('dragend', () => {
      const pos = marker.getPosition();
      if (pos) {
        handleUpdatePosition(pos.lat(), pos.lng());
      }
    });

    // Map click
    map.addListener('click', (e: MapClickEvent) => {
      if (e.latLng) {
        marker.setPosition(e.latLng);
        handleUpdatePosition(e.latLng.lat(), e.latLng.lng());
      }
    });

    // Setup Places Autocomplete
    if (searchInputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(searchInputRef.current, {
        componentRestrictions: { country: 'th' },
        fields: ['geometry', 'formatted_address', 'address_components', 'name'],
      });
      autocompleteInstanceRef.current = autocomplete;

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) return;

        const loc = place.geometry.location;
        map.setCenter(loc);
        map.setZoom(17);
        marker.setPosition(loc);

        const parsed = parseAddressComponents([place]);
        const lat = loc.lat();
        const lng = loc.lng();
        setCurrentCoords({ lat, lng });
        onLocationSelect({
          lat,
          lng,
          ...parsed,
        });
      });
    }
  }, [isOpen, isScriptLoaded, defaultLat, defaultLng, currentCoords, handleUpdatePosition, parseAddressComponents, onLocationSelect]);

  // Handle GPS button
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('เบราว์เซอร์ของท่านไม่รองรับการระบุตำแหน่ง GPS');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setIsLocating(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        if (mapInstanceRef.current) {
          mapInstanceRef.current.setCenter({ lat, lng });
          mapInstanceRef.current.setZoom(17);
        }
        if (markerInstanceRef.current) {
          markerInstanceRef.current.setPosition({ lat, lng });
        }
        handleUpdatePosition(lat, lng);
      },
      () => {
        setIsLocating(false);
        alert('ไม่สามารถดึงตำแหน่งปัจจุบันได้ กรุณาอนุญาตการเข้าถึงตำแหน่งในเบราว์เซอร์');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="border border-shadow-black/15 bg-white transition-all">
      {/* Toggle Bar */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-main-yellow/10"
      >
        <div className="flex items-center gap-2.5">
          <svg
            className="size-4 text-maroon stroke-[1.5]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
            />
          </svg>
          <div>
            <p className="text-xs font-medium text-shadow-black">
              ปักหมุดตำแหน่งจัดส่งบนแผนที่ Google Maps (ไม่บังคับ)
            </p>
            <p className="text-[11px] font-light text-shadow-black/60">
              {currentCoords
                ? `ปักหมุดแล้ว: ${currentCoords.lat.toFixed(5)}, ${currentCoords.lng.toFixed(5)}`
                : 'คลิกเพื่อปักหมุดจุดส่งมอบที่แน่นอน ให้ไรเดอร์นำทางได้แม่นยำยิ่งขึ้น'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentCoords && (
            <span className="border border-maroon/20 bg-main-yellow/20 px-2 py-0.5 text-[10px] font-light text-maroon">
              บันทึกพิกัดแล้ว
            </span>
          )}
          <span className="text-xs text-shadow-black/40">{isOpen ? '▲ ปิด' : '▼ เปิด'}</span>
        </div>
      </button>

      {/* Collapsible Map Body */}
      {isOpen && (
        <div className="border-t border-shadow-black/10 p-4">
          {!apiKey ? (
            <div className="border border-main-red/20 bg-main-red/5 p-3 text-xs font-light text-main-red">
              ไม่พบคีย์ Google Maps API ในระบบ
            </div>
          ) : (
            <div className="space-y-3">
              {/* Search & GPS Action Bar */}
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="พิมพ์ชื่อสถานที่ / คอนโด / อาคาร เพื่อค้นหา..."
                    className="w-full border border-shadow-black/20 bg-main-white px-3 py-2 text-xs text-shadow-black focus:border-maroon focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleGetCurrentLocation}
                  disabled={isLocating}
                  className="flex items-center justify-center gap-1.5 border border-shadow-black/20 bg-white px-3 py-2 text-xs font-light text-shadow-black transition-colors hover:border-maroon hover:text-maroon disabled:opacity-50"
                >
                  <svg
                    className="size-3.5 stroke-[1.5]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <circle cx="12" cy="12" r="3" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 2v3m0 14v3m10-10h-3M5 12H2"
                    />
                  </svg>
                  <span>{isLocating ? 'กำลังค้นหา...' : 'ใช้พิกัดปัจจุบัน (GPS)'}</span>
                </button>
              </div>

              {/* Map Canvas */}
              <div
                ref={mapContainerRef}
                className="relative h-64 w-full border border-shadow-black/15 bg-main-white sm:h-72"
              >
                {!isScriptLoaded && (
                  <div className="flex h-full items-center justify-center text-xs font-light text-shadow-black/50">
                    กำลังโหลดแผนที่ Google Maps...
                  </div>
                )}
              </div>

              {/* Map Footer Helper */}
              <div className="flex flex-col justify-between gap-1 text-[11px] font-light text-shadow-black/60 sm:flex-row sm:items-center">
                <p>คลิกบนแผนที่หรือลากหมุดสีแดงเพื่อระบุจุดส่งมอบที่ถูกต้อง</p>
                {currentCoords && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${currentCoords.lat},${currentCoords.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-maroon underline hover:text-main-red"
                  >
                    เปิดดูใน Google Maps
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
