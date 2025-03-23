# Asistente Virtual - Chatbot CV 🤖

Un asistente virtual interactivo desarrollado con React que utiliza la API de Google Gemini para proporcionar información sobre la experiencia profesional, habilidades técnicas y formación académica de Matías Benoni.


## Características

- **Interfaz de chat moderna** con diseño responsive
- **Animaciones fluidas** utilizando Framer Motion
- **Preguntas sugeridas** para facilitar la interacción
- **Indicador de escritura** para simular respuestas humanas
- **Formateo de mensajes** (listas, negritas)
- **Optimizado para dispositivos móviles** con opción para expandir/contraer

## Tecnologías

- **React**: Biblioteca principal para la interfaz de usuario
- **Tailwind CSS**: Framework CSS para el diseño
- **Framer Motion**: Para animaciones fluidas
- **Axios**: Para realizar peticiones HTTP
- **Google Gemini API**: Para generar respuestas inteligentes
- **React Icons**: Iconos visuales

## Instalación

1. Clona este repositorio:
   ```bash
   git clone https://github.com/matiassbp/ChatBot_CV
   cd ChatBot_CV
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Crea un archivo `.env` en la raíz del proyecto con tu clave API de Google Gemini:
   ```
   REACT_APP_GEMINI_API_KEY=tu_clave_api_aquí
   ```

4. Inicia la aplicación en modo desarrollo:
   ```bash
   npm start
   ```

## Estructura del Proyecto

```
src/
├── components/
│   ├── chatbot/
│   │   ├── api.js                # Servicios de API para Gemini
│   │   ├── Chatbot.js            # Componente principal
│   │   ├── ChatContainer.js      # Contenedor de la interfaz de chat
│   │   ├── Message.js            # Componente de mensaje individual
│   │   ├── MessageList.js        # Lista de mensajes
│   │   └── SuggestedQuestions.js # Componente de preguntas sugeridas
│   ├── public/
│   │   ├── Footer.js             # Pie de página
│   │   └── Header.js             # Encabezado
│   └── styles/
│       └── globalStyles.js       # Estilos globales
├── App.js                        # Componente raíz
└── index.js                      # Punto de entrada
```

## Uso

El chatbot está preconfigurado para responder preguntas sobre Matías Benoni, incluyendo:
- Experiencia laboral
- Habilidades técnicas
- Educación
- Idiomas
- Proyectos desarrollados
- Metodologías ágiles

Ejemplos de preguntas:
- "¿Cuál es su experiencia laboral?"
- "¿Qué tecnologías maneja?"
- "¿Dónde estudió?"

## Personalización

Para adaptar el chatbot a otro perfil profesional, modifica la función `createEnhancedPrompt` en `Chatbot.js` con la información correspondiente.
