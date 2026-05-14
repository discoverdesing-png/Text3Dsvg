import { SVG3D } from "3dsvg";
import { useState, useRef } from "react";

function App() {
  // Object
  const [text, setText] = useState("WarPyron");
  const [depth, setDepth] = useState(1);
  const [zoom, setZoom] = useState(4.6);
  
  // Material
  const [color, setColor] = useState("#f97316");
  const [metalness, setMetalness] = useState(0.3);
  const [roughness, setRoughness] = useState(0.6);
  
  // Animation
  const [animate, setAnimate] = useState("pulse");
  const [speed, setSpeed] = useState(0.2);
  
  // Lighting
  const [lightX, setLightX] = useState(-3);
  const [lightY, setLightY] = useState(1);
  const [lightZ, setLightZ] = useState(7);
  const [lightIntensity, setLightIntensity] = useState(1.2);
  
  // Background
  const [bgColor, setBgColor] = useState("#0a0a0a");

  // Función para descargar PNG - CORREGIDA
  const downloadImage = () => {
    // 3dsvg genera un canvas, lo buscamos directo
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `${text || '3d-text'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } else {
      alert('No se encontró el canvas. Espera a que cargue el texto 3D');
    }
  };

  // Función para grabar video MP4
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const downloadVideo = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) {
      alert('No se encontró el canvas');
      return;
    }

    if (!recording) {
      // Empezar a grabar
      const stream = canvas.captureStream(30); // 30 FPS
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      });
      
      chunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `${text || '3d-text'}.webm`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      };
      
      mediaRecorderRef.current.start();
      setRecording(true);
      
      // Grabar 5 segundos y parar automático
      setTimeout(() => {
        if (mediaRecorderRef.current && recording) {
          mediaRecorderRef.current.stop();
          setRecording(false);
        }
      }, 5000);
      
    } else {
      // Parar grabación manual
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  return (
    <div style={{background: bgColor, height: '100vh', display: 'flex', transition: '0.3s'}}>
      
      {/* Panel de controles */}
      <div style={{
        width: '320px', 
        background: '#1a1a1a', 
        padding: '20px', 
        color: 'white', 
        fontFamily: 'Arial',
        overflowY: 'auto'
      }}>
        <h3 style={{marginTop: 0}}>SETTINGS</h3>
        
        {/* BOTONES DE DESCARGA */}
        <div style={{marginBottom: '15px', display: 'flex', gap: '10px', flexDirection: 'column'}}>
          <button 
            onClick={downloadImage}
            style={{
              padding: '12px',
              background: '#f97316',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px'
            }}
          >
            📷 Descargar PNG
          </button>
          
          <button 
            onClick={downloadVideo}
            style={{
              padding: '12px',
              background: recording ? '#dc2626' : '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px'
            }}
          >
            {recording ? '⏹ Parar Grabación' : '🎥 Grabar Video 5s'}
          </button>
        </div>
        
        {/* OBJECT */}
        <details open style={{marginBottom: '15px'}}>
          <summary style={{cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px'}}>Object</summary>
          
          <label>Texto:</label>
          <input 
            type="text" 
            value={text} 
            onChange={(e) => setText(e.target.value)}
            style={{width: '100%', marginBottom: '10px', padding: '5px'}}
          />

          <label>Profundidad: {depth}</label>
          <input 
            type="range" min="0" max="2" step="0.1"
            value={depth} 
            onChange={(e) => setDepth(parseFloat(e.target.value))}
            style={{width: '100%', marginBottom: '10px'}}
          />

          <label>Zoom: {zoom}</label>
          <input 
            type="range" min="1" max="10" step="0.1"
            value={zoom} 
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            style={{width: '100%'}}
          />
        </details>

        {/* BACKGROUND */}
        <details style={{marginBottom: '15px'}}>
          <summary style={{cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px'}}>Background</summary>
          <label>Color fondo:</label>
          <input 
            type="color" 
            value={bgColor} 
            onChange={(e) => setBgColor(e.target.value)}
            style={{width: '100%', height: '40px'}}
          />
        </details>

        {/* MATERIAL */}
        <details style={{marginBottom: '15px'}}>
          <summary style={{cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px'}}>Material</summary>
          
          <label>Color:</label>
          <input 
            type="color" 
            value={color} 
            onChange={(e) => setColor(e.target.value)}
            style={{width: '100%', marginBottom: '10px', height: '40px'}}
          />

          <label>Metalness: {metalness}</label>
          <input 
            type="range" min="0" max="1" step="0.1"
            value={metalness} 
            onChange={(e) => setMetalness(parseFloat(e.target.value))}
            style={{width: '100%', marginBottom: '10px'}}
          />

          <label>Roughness: {roughness}</label>
          <input 
            type="range" min="0" max="1" step="0.1"
            value={roughness} 
            onChange={(e) => setRoughness(parseFloat(e.target.value))}
            style={{width: '100%'}}
          />
        </details>

        {/* ANIMATION */}
        <details style={{marginBottom: '15px'}}>
          <summary style={{cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px'}}>Animation</summary>
          
          <label>Tipo:</label>
          <select 
            value={animate} 
            onChange={(e) => setAnimate(e.target.value)}
            style={{width: '100%', marginBottom: '10px', padding: '5px'}}
          >
            <option value="pulse">Pulse</option>
            <option value="rotate">Rotate</option>
            <option value="float">Float</option>
            <option value="none">None</option>
          </select>

          <label>Velocidad: {speed}</label>
          <input 
            type="range" min="0" max="5" step="0.1"
            value={speed} 
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            style={{width: '100%'}}
          />
        </details>

        {/* LIGHTING */}
        <details open style={{marginBottom: '15px'}}>
          <summary style={{cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px'}}>Lighting</summary>
          
          <label>Key Light X: {lightX}</label>
          <input 
            type="range" min="-10" max="10" step="0.1"
            value={lightX} 
            onChange={(e) => setLightX(parseFloat(e.target.value))}
            style={{width: '100%', marginBottom: '10px'}}
          />

          <label>Key Light Y: {lightY}</label>
          <input 
            type="range" min="-10" max="10" step="0.1"
            value={lightY} 
            onChange={(e) => setLightY(parseFloat(e.target.value))}
            style={{width: '100%', marginBottom: '10px'}}
          />

          <label>Key Light Z: {lightZ}</label>
          <input 
            type="range" min="-10" max="10" step="0.1"
            value={lightZ} 
            onChange={(e) => setLightZ(parseFloat(e.target.value))}
            style={{width: '100%', marginBottom: '10px'}}
          />

          <label>Key Intensity: {lightIntensity}</label>
          <input 
            type="range" min="0" max="2" step="0.05"
            value={lightIntensity} 
            onChange={(e) => setLightIntensity(parseFloat(e.target.value))}
            style={{width: '100%'}}
          />
        </details>
      </div>

      {/* Texto 3D - CON TAMAÑO EXPLÍCITO */}
      <div style={{
        flex: 1, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        width: '100%',
        height: '100%'
      }}>
        <SVG3D
  text={text}
  font="Archivo Black"
  depth={0.5}
  smoothness={0}
  color={color}
  metalness={metalness}
  roughness={roughness}
  animate={animate}
  animateSpeed={speed}
  zoom={zoom}
  lightPosition={[lightX, lightY, lightZ]}
  lightIntensity={lightIntensity}
/>
      </div>
    </div>
  );
}

export default App;