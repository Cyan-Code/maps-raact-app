import mapboxgl from 'mapbox-gl';
import { useCallback, useEffect, useRef, useState } from 'react';
import {v4} from 'uuid';

import {Subject} from 'rxjs';

mapboxgl.accessToken = 'pk.eyJ1IjoiY3lhbi1jb2RlIiwiYSI6ImNrdWhvejByMjAwaHAyb3A4ODNleDlndXQifQ.52wKLh1X6ZTsqiGLuOWQuQ';

export const useMapBox = (puntoInicial) => {

  const mapaDiv = useRef();
  const setRefDivMap = useCallback((node) => { // pasar el nodo en el elemento en el que el mapa necesita renderizarse
    mapaDiv.current = node
  },[])

  // Referencia a los marcadores
  const marcadores = useRef({});

  // Observables de RXJS
  const movimientoMarcador = useRef(new Subject());
  const nuevoMarcador = useRef( new Subject() );
  
  //Mapa y coords
  const mapa = useRef();
  const [coords, setCoords] = useState(puntoInicial);

  //Funcion para agregar marcadores
  const agregarMarcador = useCallback((ev) => {    
      const {lng, lat} = ev.lngLat;
      const marker = new mapboxgl.Marker();
      marker.id = v4(); // TODO si el marker tiene id

      marker
        .setLngLat([lng, lat])
        .addTo( mapa.current )
        .setDraggable(true)

      marcadores.current[marker.id] = marker; // Whyyyy????

      // 
      nuevoMarcador.current.next({
        id: marker.id,
        lng,
        lat
      });

      //Escuchar movimientos del marcador
      marker.on('drag', ({target}) => {
        const {id} = target;
        const {lng, lat} = target.getLngLat();
        movimientoMarcador.current.next({
          id,
          lng, lat
        })
      })

  },[])

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapaDiv.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [ puntoInicial.lng, puntoInicial.lat ],
      zoom: puntoInicial.zoom
      });
    mapa.current = map;
  }, [puntoInicial])
  
  // Detectar Moviemiento del mapa
  useEffect(() => {
    mapa.current?.on('move', () => {
      const {lng, lat} = mapa.current.getCenter();
      setCoords({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: mapa.current.getZoom().toFixed(2)
      })
    }) 
    return () => {
      mapa.current?.off('move')
    }
  }, [mapa])

  // agregar marcadores cuando haga click
  useEffect(() => {
    mapa.current?.on('click', agregarMarcador)
    return () => {
      mapa.current?.off('click')
    }
  },[agregarMarcador])

  return {
    agregarMarcador,
    coords,
    setRefDivMap,
    nuevoMarcador$: nuevoMarcador.current,
    movimientoMarcador$: movimientoMarcador.current
  }
}
