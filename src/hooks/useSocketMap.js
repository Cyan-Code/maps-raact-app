import { useContext, useEffect } from "react"
import { SocketContext } from "../context/SocketContext"

export const useSocketMap = (nuevoMarcador$, movimientoMarcador$, agregarMarcador, actualizarPosicion) => {
  
  const {socket} = useContext(SocketContext)
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
      socket.emit('marcador-actualizado', marcador)
    })
  },[movimientoMarcador$, socket, agregarMarcador])

  useEffect(() => {
    socket.on('marcador-actualizado', (marcadorActualizado) => {
      actualizarPosicion(marcadorActualizado);
    })
  },[socket, actualizarPosicion])

}


