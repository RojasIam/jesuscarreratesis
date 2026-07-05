'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type GeolocationStatus =
  | 'idle'
  | 'loading'
  | 'success'
  | 'denied'
  | 'unavailable'
  | 'unsupported';

export interface GeolocationCoords {
  lat: number;
  lng: number;
  accuracy?: number;
}

const GEO_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 20000,
  maximumAge: 0,
};

function applyPosition(
  position: GeolocationPosition,
  setCoords: (coords: GeolocationCoords) => void,
  setStatus: (status: GeolocationStatus) => void,
) {
  setCoords({
    lat: position.coords.latitude,
    lng: position.coords.longitude,
    accuracy: position.coords.accuracy,
  });
  setStatus('success');
}

function applyError(
  error: GeolocationPositionError,
  setCoords: (coords: GeolocationCoords | null) => void,
  setStatus: (status: GeolocationStatus) => void,
  setErrorMessage: (message: string) => void,
) {
  setCoords(null);
  if (error.code === error.PERMISSION_DENIED) {
    setStatus('denied');
    setErrorMessage(
      'Permiso de ubicación denegado. Actívalo en la configuración del navegador o pulsa el botón para intentar de nuevo.',
    );
  } else if (error.code === error.POSITION_UNAVAILABLE) {
    setStatus('unavailable');
    setErrorMessage('No se pudo determinar tu ubicación. Verifica que el GPS esté activo.');
  } else {
    setStatus('unavailable');
    setErrorMessage('Tiempo de espera agotado al obtener la ubicación.');
  }
}

export function useGeolocation(autoRequest = true) {
  const [coords, setCoords] = useState<GeolocationCoords | null>(null);
  const [status, setStatus] = useState<GeolocationStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const watchIdRef = useRef<number | null>(null);

  const clearWatch = useCallback(() => {
    if (watchIdRef.current != null && typeof navigator !== 'undefined') {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  const requestLocation = useCallback(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setStatus('unsupported');
      setErrorMessage('Tu navegador no soporta geolocalización.');
      return;
    }

    clearWatch();
    setCoords(null);
    setStatus('loading');
    setErrorMessage('');

    let settled = false;

    const finishSuccess = (position: GeolocationPosition) => {
      if (settled) return;
      settled = true;
      clearWatch();
      applyPosition(position, setCoords, setStatus);
    };

    const finishError = (error: GeolocationPositionError) => {
      if (settled) return;
      settled = true;
      clearWatch();
      applyError(error, setCoords, setStatus, setErrorMessage);
    };

    watchIdRef.current = navigator.geolocation.watchPosition(
      finishSuccess,
      finishError,
      GEO_OPTIONS,
    );

    window.setTimeout(() => {
      if (settled) return;
      clearWatch();
      navigator.geolocation.getCurrentPosition(finishSuccess, finishError, GEO_OPTIONS);
    }, 20000);
  }, [clearWatch]);

  useEffect(() => {
    return () => clearWatch();
  }, [clearWatch]);

  useEffect(() => {
    if (!autoRequest || typeof window === 'undefined' || !navigator.geolocation) {
      if (typeof window !== 'undefined' && !navigator.geolocation) {
        setStatus('unsupported');
      }
      return;
    }

    if (navigator.permissions?.query) {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then((result) => {
          if (result.state === 'granted') {
            requestLocation();
          } else if (result.state === 'denied') {
            setStatus('denied');
            setErrorMessage(
              'Ubicación bloqueada. Pulsa «Permitir ubicación» para volver a solicitar acceso.',
            );
          } else {
            requestLocation();
          }

          result.onchange = () => {
            if (result.state === 'granted') {
              requestLocation();
            } else if (result.state === 'denied') {
              setCoords(null);
              setStatus('denied');
            }
          };
        })
        .catch(() => {
          requestLocation();
        });
    } else {
      requestLocation();
    }
  }, [autoRequest, requestLocation]);

  return {
    coords,
    status,
    errorMessage,
    requestLocation,
    refreshLocation: requestLocation,
    isLoading: status === 'loading',
  };
}

export function googleMapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}
