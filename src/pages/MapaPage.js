import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'

mapboxgl.accessToken = 'pk.eyJ1IjoiY3lhbi1jb2RlIiwiYSI6ImNrdWhvejByMjAwaHAyb3A4ODNleDlndXQifQ.52wKLh1X6ZTsqiGLuOWQuQ';

const puntoInicial = {
  lng: 5,
  lat: 34,
  zoom: 2
}

export const MapaPage = () => {

  const mapaDiv = useRef();
  const [mapa, setMapa] = useState(null)
  const [coords, setCoords] = useState(puntoInicial)

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapaDiv.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [ puntoInicial.lng, puntoInicial.lat ],
      zoom: puntoInicial.zoom
      });
    setMapa(map)
  }, [])
  
  // Detectar Moviemiento del mapa
  useEffect(() => {
    mapa?.on('move', () => {
      const {lng, lat} = mapa.getCenter();
      setCoords({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: mapa.getZoom().toFixed(2)
      })
    }) 
    return () => {
      mapa?.off('move')
    }
  }, [mapa])

  return (
    <>
      <div className="info">
        lng: {coords.lng} | lat: {coords.lat} | zoom: {coords.zoom}
      </div>
      <div
        ref={mapaDiv} 
        className="mapContainer"
      />
    </>
  )
}
