import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { saveAs } from "file-saver";
import imageToBase64 from "image-to-base64/browser";

const VideoConstraint = {
  width: 854,
  height: 480,
  facingmode: "user",
};
const WebcamCapture = () => {
  const [image, setImage] = useState("");
  //react webhook : untuk letak gambar dalam image variable
  var base;
  const webcamref = React.useRef(null);
  //variable useref untuk current event
  const capture = () => {
    //function capture
    const imageSrc = webcamref.current.getScreenshot();
    setImage(imageSrc);
    console.log(image);
  };

  const capturedelay = () => {
    setTimeout(capture, 5000);
  };

  const convert = () => {
    //function convert string to text
    imageToBase64(image).then((response) => {
      //converting gambar to base64 guna library
      base = new Blob([response], {
        type: "text/plain;charset=utf-8",
        //pastikan type file kita nak pakai
        //adalah text and in utf-8 charset
        //for standardisation
      });
    });
  };

  const downloadImage = (img) => {
    //function download gambar
    convert();
    saveAs(img, "image.jpg");
    //library file-saver
    //bagi masa untuk function convert untuk beroperasi supaya variable kosong tidak didownload
    setTimeout(downloadText, 2000);
  };
  const downloadText = () => {
    //function download text
    saveAs(base, "base64.txt");
  };

  //----------------------------------------------Timer-------------------------------------------------------------------
  const Ref = useRef(null);

  // The state for our timer
  const [timer, setTimer] = useState("00:00:00");

  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / 1000 / 60 / 60) % 24);
    return {
      total,
      hours,
      minutes,
      seconds,
    };
  };

  const startTimer = (e) => {
    let { total, hours, minutes, seconds } = getTimeRemaining(e);
    if (total >= 0) {
      // update the timer
      // check if less than 10 then we need to
      // add '0' at the begining of the variable
      setTimer(
        (hours > 9 ? hours : "0" + hours) +
          ":" +
          (minutes > 9 ? minutes : "0" + minutes) +
          ":" +
          (seconds > 9 ? seconds : "0" + seconds)
      );
    }
  };

  const clearTimer = (e) => {
    // If you adjust it you should also need to
    // adjust the Endtime formula we are about
    // to code next
    setTimer("00:00:05");

    // If you try to remove this line the
    // updating of timer Variable will be
    // after 1000ms or 1sec
    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
      startTimer(e);
    }, 1000);
    Ref.current = id;
  };

  const getDeadTime = () => {
    let deadline = new Date();

    // This is where you need to adjust if
    // you entend to add more time
    deadline.setSeconds(deadline.getSeconds() + 5);
    return deadline;
  };
  // Another way to call the clearTimer() to start
  // the countdown is via action event from the
  // button first we create function to be called
  // by the button
  const onClickReset = () => {
    clearTimer(getDeadTime());
  };
  return (
    <div class="webcam-container">
      <div class="webcam-img flex justify-center mt-5 border border-amber-500 border-solid border-4 mx-60 bg-black">
        {image == "" ? (
          <Webcam
            audio={false}
            height={480}
            ref={webcamref}
            screenshotFormat="image/jpeg"
            width={854}
            videoConstraints={VideoConstraint}
          />
        ) : (
          <img src={image} />
        )}
      </div>
      <div>
        {image != "" ? (
          <div>
            <div class="flex justify-center">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setImage("");
                }}
                class="webcam-btn bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
              >
                Retake Image
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  downloadImage(image);
                }}
                class="webcam-btn bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
              >
                Download
              </button>
            </div>
            <div class="flex justify-center">
              <h1 class="text-8xl">Snap!</h1>
            </div>
          </div>
        ) : (
          <div>
            <div class="flex justify-center">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  capture();
                }}
                class="webcam-btn bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
              >
                Capture
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  capturedelay();
                  onClickReset();
                }}
                class="webcam-btn bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
              >
                Capture 5 Second
              </button>
            </div>
            <div class="flex justify-center">
              <h1 class="text-8xl">{timer}</h1>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebcamCapture;
