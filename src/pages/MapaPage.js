import React from 'react'
import { useMapBox } from '../hooks/useMapBox';

const puntoInicial = {
  lng: -122.4725,
  lat: 37.801,
  zoom: 13.5
}

export const MapaPage = () => {

  const {setRefDivMap, coords, agregarMarcador} = useMapBox(puntoInicial) //Estudiar este Hook
  

  return (
    <>
      <div className="info">
        lng: {coords.lng} | lat: {coords.lat} | zoom: {coords.zoom}
      </div>
      <div
        ref={setRefDivMap} 
        className="mapContainer"
      />
    </>
  )
}
