import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import moment from "moment-timezone";
import "./App.css";

const App: React.FC = () => {
  const webcamRef: any = useRef(null);
  const [captureInterval, setCaptureInterval] = useState(5);
  const [startTime, setStartTime] = useState({ hour: 0, minute: 0, second: 0 });
  const [selectedOption, setSelectedOption] = useState('');
  const [textInputValuePosition, setTextInputValuePosition] = useState('');

  const handleIntervalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCaptureInterval(Number(event.target.value));
  };

  const handleSelectChange = (event: any) => {
    setSelectedOption(event.target.value);
  };

  const handleTextInputChange = (event: any) => {
    setTextInputValuePosition(event.target.value);
  };

  const handleStartTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setStartTime({ ...startTime, [field]: Number(event.target.value) });
  };

  const captureImage = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      try {
        const response = await axios.post("http://localhost:3001/upload", {
          imageSrc,
          selectedOption,
          textInputValuePosition
        });
        console.log(response.data);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (webcamRef.current) {
          webcamRef.current.srcObject = stream;
        }
      })
      .catch((error) => console.error("Error accessing webcam:", error));

    const captureIntervalId = setInterval(() => {
      const thaiTime = moment().tz("Asia/Bangkok");
      const startDateTime = moment().tz("Asia/Bangkok").set(startTime); // เวลาเริ่มถ่ายภาพ
      if (thaiTime.isAfter(startDateTime)) {
        captureImage();
      }
    }, captureInterval * 1000);

    return () => {
      clearInterval(captureIntervalId);
      if (webcamRef.current && webcamRef.current.srcObject) {
        const tracks = webcamRef.current.srcObject.getTracks();
        tracks.forEach((track: any) => track.stop());
      }
    };
  }, [captureInterval, startTime]);

  return (
    <div className="flex">
      <Webcam className="webcam" audio={false} ref={webcamRef} />
      <br />
      <label className="label" htmlFor="interval">ถ่ายทุกๆ (วินาที):</label>
      <input
        className="input-field"
        type="number"
        id="interval"
        value={captureInterval}
        onChange={handleIntervalChange}
      />
      <br />
      <label htmlFor="startTimeHour">เวลาเริ่มถ่ายภาพ (ชั่วโมง):</label>
      <input
        type="number"
        id="startTimeHour"
        value={startTime.hour}
        onChange={(e) => handleStartTimeChange(e, "hour")}
      />

      <label htmlFor="startTimeMinute">(นาที):</label>
      <input
        type="number"
        id="startTimeMinute"
        value={startTime.minute}
        onChange={(e) => handleStartTimeChange(e, "minute")}
      />

      <label htmlFor="startTimeSecond">(วินาที):</label>
      <input
        type="number"
        id="startTimeSecond"
        value={startTime.second}
        onChange={(e) => handleStartTimeChange(e, "second")}
      />
      <div>
      <label htmlFor="dropdown">เลือกข้อมูล:</label>
      <select id="dropdown" value={selectedOption} onChange={handleSelectChange}>
        <option value="">กรุณาเลือก</option>
        <option value="watermeter">มิเตอร์น้ำ</option>
        <option value="electricmeter">มิเตอร์ไฟ</option>
      </select>
      <br />
      <label htmlFor="textInput">ตำแหน่ง:</label>
      <input type="text" id="textInput" value={textInputValuePosition} onChange={handleTextInputChange} />
      <br />
    </div>
    </div>
    
  );
};

export default App;
