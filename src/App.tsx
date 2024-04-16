import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import moment from "moment-timezone";
import "./App.css";

const App: React.FC = () => {
  const webcamRef: any = useRef(null);
  const [captureInterval, setCaptureInterval] = useState({
    hour: 0,
    minute: 0,
    second: 0,
  });
  const [startTime, setStartTime] = useState({ hour: 0, minute: 0, second: 0 });
  const [endTime, setEndTime] = useState({ hour: 0, minute: 0, second: 0 });
  const [selectedOption, setSelectedOption] = useState("");
  const [textInputValuePosition, setTextInputValuePosition] = useState("");
  const [running, setRunning] = useState(false);

  const handleIntervalChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    if (!running) {
      const value = Number(event.target.value);
      if (value >= 0) {
        setCaptureInterval({ ...captureInterval, [field]: value });
      }
    }
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
    if (!running) {
      setStartTime({ ...startTime, [field]: Number(event.target.value) });
    }
  };

  const handleEndTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    if (!running) {
      setEndTime({ ...endTime, [field]: Number(event.target.value) });
    }
  };

  const startCapture = () => {
    setRunning(true);
  };

  const stopCapture = () => {
    setRunning(false);
  };

  const captureImage = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      try {
        const response = await axios.post("http://localhost:3001/upload", {
          imageSrc,
          selectedOption,
          textInputValuePosition,
        });
        console.log(response.data);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  useEffect(() => {
    if (running) {
      const captureIntervalId = setInterval(() => {
        const thaiTime = moment().tz("Asia/Bangkok");
        const startDateTime = moment().tz("Asia/Bangkok").set(startTime);
        const endDateTime = moment().tz("Asia/Bangkok").set(endTime);
  
        if (thaiTime.isAfter(startDateTime) && thaiTime.isBefore(endDateTime)) {
          captureImage();
        } else {
          stopCapture(); // เวลาเกินหรือถึงเวลาสิ้นสุด หยุดการถ่ายรูป
        }
      }, (captureInterval.hour * 3600 + captureInterval.minute * 60 + captureInterval.second) * 1000);
  
      return () => {
        clearInterval(captureIntervalId);
      };
    }
  }, [running, captureInterval, startTime, endTime]);

  return (
    <div className="">
      <Webcam className="webcam" audio={false} ref={webcamRef} />
      <br />
      <div className="flex">
        <div>
          <label className="label" htmlFor="intervalHour">
            ถ่ายทุกๆ
          </label>
        </div>
        <input
          className="input-field"
          type="number"
          id="intervalHour"
          value={captureInterval.hour}
          onChange={(e) => handleIntervalChange(e, "hour")}
        />
        <div>
          <label className="label" htmlFor="intervalHour">
            ชั่วโมง
          </label>
        </div>
        <input
          className="input-field"
          type="number"
          id="intervalMinute"
          value={captureInterval.minute}
          onChange={(e) => handleIntervalChange(e, "minute")}
        />
        <div>
          <label className="label" htmlFor="intervalMinute">
            นาที
          </label>
        </div>
        <input
          className="input-field"
          type="number"
          id="intervalSecond"
          value={captureInterval.second}
          onChange={(e) => handleIntervalChange(e, "second")}
        />
        <div>
          <label className="label" htmlFor="intervalSecond">
            วินาที
          </label>
        </div>
      </div>
      <br />
      <div className="time flex">
        <label htmlFor="startTimeHour">เวลาเริ่มถ่ายภาพ (ชั่วโมง)</label>
        <input
          className="input-field"
          type="number"
          id="startTimeHour"
          value={startTime.hour}
          onChange={(e) => handleStartTimeChange(e, "hour")}
        />

        <label htmlFor="startTimeMinute">(นาที)</label>
        <input
          className="input-field"
          type="number"
          id="startTimeMinute"
          value={startTime.minute}
          onChange={(e) => handleStartTimeChange(e, "minute")}
        />

        <label htmlFor="startTimeSecond">(วินาที)</label>
        <input
          className="input-field"
          type="number"
          id="startTimeSecond"
          value={startTime.second}
          onChange={(e) => handleStartTimeChange(e, "second")}
        />
      </div>
      <div className="time flex">
        <label htmlFor="endTimeHour">เวลาสิ้นสุดถ่ายภาพ (ชั่วโมง)</label>
        <input
          className="input-field"
          type="number"
          id="endTimeHour"
          value={endTime.hour}
          onChange={(e) => handleEndTimeChange(e, "hour")}
        />

        <label htmlFor="endTimeMinute">(นาที)</label>
        <input
          className="input-field"
          type="number"
          id="endTimeMinute"
          value={endTime.minute}
          onChange={(e) => handleEndTimeChange(e, "minute")}
        />

        <label htmlFor="endTimeSecond">(วินาที)</label>
        <input
          className="input-field"
          type="number"
          id="endTimeSecond"
          value={endTime.second}
          onChange={(e) => handleEndTimeChange(e, "second")}
        />
      </div>
      <div className="select flex">
        <label htmlFor="dropdown">เลือกข้อมูล</label>
        <select
          className="input-field-selection"
          id="dropdown"
          value={selectedOption}
          onChange={handleSelectChange}
        >
          <option value="">กรุณาเลือก</option>
          <option value="watermeter">มิเตอร์น้ำ</option>
          <option value="electricmeter">มิเตอร์ไฟ</option>
        </select>
      </div>
      <br />
      <div className="flex">
        <label htmlFor="textInput">ตำแหน่ง</label>
        <input
          className="input-field-position"
          type="text"
          id="textInput"
          value={textInputValuePosition}
          onChange={handleTextInputChange}
        />
        <br />
      </div>
      <div className="flex">
        <button className="buttonstart" onClick={startCapture}>
          Start
        </button>
        <button className="buttonstop" onClick={stopCapture}>
          Stop
        </button>
      </div>
    </div>
  );
};

export default App;
