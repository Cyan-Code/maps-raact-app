import React, { useContext, useEffect } from 'react'
import { useMapBox } from '../hooks/useMapBox';
import {SocketContext} from '../context/SocketContext';

const puntoInicial = {
  lng: -122.4725,
  lat: 37.801,
  zoom: 13.5
}

export const MapaPage = () => {

  const {socket} = useContext(SocketContext)

  const {
    setRefDivMap,
    coords,
    nuevoMarcador$,
    movimientoMarcador$,
    agregarMarcador
  } = useMapBox(puntoInicial) //Estudiar este Hook
  
  // Esuchar los marcadores nuevos
  useEffect(() => {
    socket.on('marcador-nuevo', marcador => {
      agregarMarcador( marcador, marcador.id )
    })
  },[socket, agregarMarcador])
  
  // Listen active markers
  useEffect(() => {
    socket.on('marcadores-activos', (marcadores) => {
      for(const key of Object.keys(marcadores)){
        agregarMarcador( marcadores[key], key)
      }
    })
  },[socket, agregarMarcador])

  useEffect(() => {
    nuevoMarcador$.subscribe(marcador => {
      socket.emit('marcador-nuevo', marcador)
    })
  },[nuevoMarcador$, socket])


  useEffect(() => {
    movimientoMarcador$.subscribe(marcador => {
      console.log(marcador);
    })
  },[movimientoMarcador$])

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
