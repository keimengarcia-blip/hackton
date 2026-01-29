# ⚓ Documentación Técnica: API de Monitoreo Marítimo Tierrabomba

Esta documentación está dirigida a desarrolladores que deseen consumir los datos de estado climático o integrar el sistema de **Webhooks** para notificaciones en tiempo real.

## 1. Conceptos Fundamentales

El sistema evalúa las condiciones climáticas de la zona de Tierrabomba (Cartagena) y categoriza el riesgo en tres estados:

* **Verde (Bajo):** Navegación segura para embarcaciones menores.
* **Amarillo (Medio):** Precaución. Posible mar picado o visibilidad limitada.
* **Rojo (Alto):** Riesgo elevado. Restricción sugerida de zarpe por vientos fuertes o tormentas.



---

## 2. Consumo del Endpoint de Análisis (`POST /auto`)

Este endpoint dispara una consulta a los servicios de **OpenWeather** y **VesselFinder**, procesa la matriz de riesgo y retorna el estado actual.

### Solicitud (Request)
- **Endpoint:** `http://localhost:3000/api/alert/auto`
- **Método:** `POST`
- **Headers:** `Content-Type: application/json`

### Respuesta Exitosa (Response 200 OK)
```json
{
  "message": "Análisis de Tierrabomba completado",
  "data": {
    "status": "verde",
    "description": "Condiciones óptimas para navegación menor.",
    "probability": 10,
    "timestamp": "2026-01-29T17:00:33.960Z",
    "data_source": {
      "wind_knots": 8.01,
      "visibility_km": 10,
      "vessel_traffic": 3,
      "weather_condition": "Clear"
    },
    "type": "automatic"
  }
}
```
## 3. Integración de Webhook (Push Notifications)
El servidor implementa un Webhook Proactivo. Si el estado cambia (ejemplo: de verde a rojo), el backend enviará automáticamente una petición POST a la URL del sistema externo.

**Estructura de la Petición Webhook (Payload)**
El sistema externo recibirá un JSON con la siguiente estructura:
```json
{
  "event": "MARITIME_STATUS_CHANGE",
  "previous_status": "verde",
  "current_status": "rojo",
  "description": "PELIGRO: Vientos fuertes (26.5 kn) o tormenta en curso.",
  "timestamp": "2026-01-29T17:15:00.000Z"
}
```
**Lógica de Disparo (Trigger)**
- El monitor automático verifica el clima cada 5 minutos.

- Si nuevo_estado !== estado_anterior, se dispara el Webhook.

- No hay spam: Si el estado se mantiene igual, no se envía ninguna notificación.
## 4. Gestión de Errores

| Código | Mensaje | Causa |
| :--- | :--- | :--- |
| 400 | Estado inválido | Se intentó enviar un estado manual diferente a verde, amarillo o rojo. |
| 502 | Error al conectar con servicios de clima | Falla en la comunicación con OpenWeatherMap. |
| 500 | Error interno | Error inesperado en el procesamiento de datos. |

## 5. Ejemplo de Implementación (TypeScript)
Para integrar este retorno en una aplicación de React/Frontend, se recomienda usar la siguiente interfaz:
```typescript
export interface MaritimeStatusResponse {
  status: 'verde' | 'amarillo' | 'rojo';
  description: string;
  probability: number;
  data_source: {
    wind_knots: number;
    visibility_km: number;
    weather_condition: string;
  };
  timestamp: string;
}
```
