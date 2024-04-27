import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import moment from "moment-timezone";
// import "./App.css";
// import Login from './Login';

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
  const [selectedName, setSelectedName] = useState("");
  const [textInputValuePosition, setTextInputValuePosition] = useState("");
  const [running, setRunning] = useState(false);
  const [firstCaptureDone, setFirstCaptureDone] = useState(false);

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

  const handleNameSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedName(event.target.value);
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
          selectedName,
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
      const thaiTime = moment().tz("Asia/Bangkok");
      const startDateTime = moment().tz("Asia/Bangkok").set(startTime);
      const endDateTime = moment().tz("Asia/Bangkok").set(endTime);

      if (
        !firstCaptureDone &&
        thaiTime.isSameOrAfter(startDateTime) &&
        thaiTime.isBefore(endDateTime)
      ) {
        captureImage();
        setFirstCaptureDone(true);
      }

      const captureIntervalId = setInterval(() => {
        if (thaiTime.isAfter(startDateTime) && thaiTime.isBefore(endDateTime)) {
          captureImage();
        } else {
          stopCapture();
        }
      }, (captureInterval.hour * 3600 + captureInterval.minute * 60 + captureInterval.second) * 1000);

      return () => {
        clearInterval(captureIntervalId);
      };
    }
  }, [running, captureInterval, startTime, endTime, firstCaptureDone]);

  return (
    <div className="">
      {/* <Login/> */}
      <Webcam
        className="flex border-[1px] border-[#e6e6e6]"
        audio={false}
        ref={webcamRef}
      />
      <br />
      <div className="flex flex-col border-[1px] border-[#e6e6e6] rounded-[9px] py-2 px-8 bg-white w-[100%] justify-start items-start">
        <div className="pb-3">
          <label>ถ่ายทุกๆ</label>
        </div>
        <div className="flex gap-5">
          <div className="flex gap-3 justify-center items-center">
            <input
              className="w-[70px] h-[30px] border-[1px] border-[#dadada] rounded-[9px] py-2 px-2 bg-white"
              type="number"
              id="intervalHour"
              value={captureInterval.hour}
              onChange={(e) => handleIntervalChange(e, "hour")}
            />
            <label className="label" htmlFor="intervalHour">
              ชั่วโมง
            </label>
          </div>
          <div className="flex gap-3 justify-center items-center">
            <input
              className="w-[70px] h-[30px] border-[1px] border-[#dadada] rounded-[9px] py-2 px-2 bg-white"
              type="number"
              id="intervalMinute"
              value={captureInterval.minute}
              onChange={(e) => handleIntervalChange(e, "minute")}
            />

            <label className="label" htmlFor="intervalMinute">
              นาที
            </label>
          </div>
          <div className="flex gap-3 justify-center items-center">
            <input
              className="w-[70px] h-[30px] border-[1px] border-[#dadada] rounded-[9px] py-2 px-2 bg-white"
              type="number"
              id="intervalSecond"
              value={captureInterval.second}
              onChange={(e) => handleIntervalChange(e, "second")}
            />

            <label className="label" htmlFor="intervalSecond">
              วินาที
            </label>
          </div>
        </div>
      </div>
      <br />
      <div className="flex flex-col border-[1px] border-[#e6e6e6] rounded-[9px] py-2 px-8 bg-white w-[100%] justify-start items-start">
        <div className="pb-3">
          <label>เวลาเริ่มถ่ายภาพ</label>
        </div>
        <div className="flex gap-5">
          <div className="flex gap-3 justify-center items-center">
            <input
              className="w-[70px] h-[30px] border-[1px] border-[#dadada] rounded-[9px] py-2 px-2 bg-white"
              type="number"
              id="startTimeHour"
              value={startTime.hour}
              onChange={(e) => handleStartTimeChange(e, "hour")}
            />
            <label>ชั่วโมง</label>
          </div>
          <div className="flex gap-3 justify-center items-center">
            <input
              className="w-[70px] h-[30px] border-[1px] border-[#dadada] rounded-[9px] py-2 px-2 bg-white"
              type="number"
              id="startTimeMinute"
              value={startTime.minute}
              onChange={(e) => handleStartTimeChange(e, "minute")}
            />
            <label>นาที</label>
          </div>
          <div className="flex gap-3 justify-center items-center">
            <input
              className="w-[70px] h-[30px] border-[1px] border-[#dadada] rounded-[9px] py-2 px-2 bg-white"
              type="number"
              id="startTimeSecond"
              value={startTime.second}
              onChange={(e) => handleStartTimeChange(e, "second")}
            />
            <label>วินาที</label>
          </div>
        </div>
      </div>
      <br />
      <div className="flex flex-col border-[1px] border-[#e6e6e6] rounded-[9px] py-2 px-8 bg-white w-[100%] justify-start items-start">
        <div className="pb-3">
          <label>เวลาสิ้นสุดถ่ายภาพ </label>
        </div>
        <div className="flex gap-5">
          <div className="flex gap-3 justify-center items-center">
            <input
              className="w-[70px] h-[30px] border-[1px] border-[#dadada] rounded-[9px] py-2 px-2 bg-white"
              type="number"
              id="endTimeHour"
              value={endTime.hour}
              onChange={(e) => handleEndTimeChange(e, "hour")}
            />
            <label>ชั่วโมง</label>
          </div>
          <div className="flex gap-3 justify-center items-center">
            <input
              className="w-[70px] h-[30px] border-[1px] border-[#dadada] rounded-[9px] py-2 px-2 bg-white"
              type="number"
              id="endTimeMinute"
              value={endTime.minute}
              onChange={(e) => handleEndTimeChange(e, "minute")}
            />
            <label>นาที</label>
          </div>
          <div className="flex gap-3 justify-center items-center">
            <input
              className="w-[70px] h-[30px] border-[1px] border-[#dadada] rounded-[9px] py-2 px-2 bg-white"
              type="number"
              id="endTimeSecond"
              value={endTime.second}
              onChange={(e) => handleEndTimeChange(e, "second")}
            />
            <label>วินาที</label>
          </div>
        </div>
      </div>
      <br />
      <div className="flex flex-col border-[1px] border-[#e6e6e6] rounded-[9px] py-2 px-8 bg-white w-[100%] justify-start items-start">
        <div className="pb-3">
          <label>ประเภทมิเตอร์</label>
        </div>
        <div className="flex">
          <select
            className="border-[1px] border-[#dadada] rounded-[9px] py-2 px-2 bg-white w-[150px]"
            id="dropdown"
            value={selectedOption}
            onChange={handleSelectChange}
          >
            <option value="">กรุณาเลือก</option>
            <option value="watermeter">มิเตอร์น้ำ</option>
            <option value="electricmeter">มิเตอร์ไฟ</option>
          </select>
        </div>
      </div>
      <br />
      <div className="flex flex-col border-[1px] border-[#e6e6e6] rounded-[9px] py-2 px-8 bg-white w-[100%] justify-start items-start">
        <div className="pb-3">
          <label>เลือกชื่อ</label>
        </div>
        <div className="flex">
          <select
            className="border-[1px] border-[#dadada] rounded-[9px] py-2 px-2 bg-white w-[150px]"
            id="dropdownName"
            value={selectedName}
            onChange={handleNameSelectChange}
          >
            <option value="">กรุณาเลือก</option>
            <option value="name1">ชื่อ 1</option>
            <option value="name2">ชื่อ 2</option>
          </select>
        </div>
      </div>
      <br />
      <div className="flex flex-col border-[1px] border-[#e6e6e6] rounded-[9px] py-2 px-8 bg-white w-[100%] justify-start items-start">
        <div className="pb-3">
          <label>ตำแหน่ง</label>
        </div>
        <input
          className="border-[1px] border-[#dadada] rounded-[9px] py-2 px-2 bg-white w-[350px]"
          type="text"
          id="textInput"
          value={textInputValuePosition}
          onChange={handleTextInputChange}
        />
      </div>
      <div className="flex gap-3 pt-5">
        <button
          className="w-[50px] duration-300 hover:bg-green-600 text-white text-[16px] font-[400] rounded-md bg-green-500  py-3 px-4 flex justify-center items-center gap-3"
          onClick={startCapture}
        >
          Start
        </button>
        <button
          className="w-[50px] duration-300 hover:bg-[#FE6333] text-white text-[16px] font-[400] rounded-md bg-[#FF3D00]  py-3 px-4 flex justify-center items-center gap-3"
          onClick={stopCapture}
        >
          Stop
        </button>
      </div>
    </div>
  );
};

export default App;
