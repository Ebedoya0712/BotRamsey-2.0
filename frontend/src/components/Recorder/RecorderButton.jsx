import React, { useState, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const { transcript, resetTranscript } = useSpeechRecognition();
  const mediaRecorderRef = useRef(null);

  const handleRecordButtonClick = async () => {
    if (isRecording) {
      mediaRecorderRef.current.stop();
      SpeechRecognition.stopListening();
      setIsRecording(false);
      console.log('Transcripción:', transcript); // Muestra la transcripción por consola
    } else {
      resetTranscript();
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          mediaRecorderRef.current = new MediaRecorder(stream);

          mediaRecorderRef.current.onstart = () => {
            SpeechRecognition.startListening({ continuous: true });
          };

          mediaRecorderRef.current.onstop = () => {
            SpeechRecognition.stopListening();
          };

          mediaRecorderRef.current.start();
          setIsRecording(true);
        })
        .catch(error => {
          console.error('Error al acceder al micrófono:', error);
        });
    }
  };

  return (
    <div>
      <button onClick={handleRecordButtonClick}>
        {isRecording ? 'Detener' : 'Grabar'}
      </button>
    </div>
  );
};

export default AudioRecorder;
