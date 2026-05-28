import { useCallback, useEffect, useMemo, useRef, useState } from "react";

function TryOnAI() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const detectorRef = useRef(null);
  const lastDetectRef = useRef(0);
  const faceMeshRef = useRef(null);
  const landmarksRef = useRef(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [faceShape, setFaceShape] = useState("unknown");
  const [message, setMessage] = useState("");
  const [scale, setScale] = useState(1.2);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [useAdvanced, setUseAdvanced] = useState(true);
  const [show3D, setShow3D] = useState(true);
  const advice = useMemo(() => {
    const s = String(faceShape || "").toLowerCase();
    if (s === "round") return "Your face is round. Square or rectangular frames tend to look best.";
    if (s === "square") return "Your face is square. Oval or aviator styles usually suit you.";
    if (s === "oval") return "Your face is oval. Aviator or cat-eye shapes are especially flattering.";
    return "Position yourself in good light and face the camera directly so we can detect your shape.";
  }, [faceShape]);

  const stopLoop = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  };

  const stopTracks = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const classifyFaceShape = useCallback((box) => {
    const ratio = box.height / Math.max(1, box.width);
    if (ratio >= 1.25) return "oval";
    if (ratio <= 1.05) return "round";
    return "square";
  }, []);

  const computeOverlayTransform = useCallback((box) => {
    const landmarks = landmarksRef.current;
    if (!useAdvanced || !landmarks || !Array.isArray(landmarks) || landmarks.length < 468) {
      return {
        angle: 0,
        centerX: box.x + box.width / 2,
        centerY: box.y + box.height * 0.35,
        refWidth: box.width,
      };
    }
    const leftEyeOuter = landmarks[263];
    const rightEyeOuter = landmarks[33];
    if (!leftEyeOuter || !rightEyeOuter) {
      return {
        angle: 0,
        centerX: box.x + box.width / 2,
        centerY: box.y + box.height * 0.35,
        refWidth: box.width,
      };
    }
    const dx = leftEyeOuter.x - rightEyeOuter.x;
    const dy = leftEyeOuter.y - rightEyeOuter.y;
    const angle = Math.atan2(dy, dx);
    const centerX = (leftEyeOuter.x + rightEyeOuter.x) / 2;
    const centerY = (leftEyeOuter.y + rightEyeOuter.y) / 2 + box.height * 0.05;
    const refWidth = Math.hypot(dx, dy) * 2.2;
    return { angle, centerX, centerY, refWidth };
  }, [useAdvanced]);

  const draw3DGlasses = useCallback((ctx, t) => {
    const overlayWidth = (t.refWidth || 100) * scale;
    const lensW = overlayWidth * 0.42;
    const lensH = lensW * 0.7;
    const gap = overlayWidth * 0.12;
    const bridgeW = overlayWidth * 0.12;
    const bridgeH = lensH * 0.18;
    const x = t.centerX + offsetX * (t.refWidth || 100);
    const y = t.centerY + offsetY * (t.refWidth || 100);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(t.angle);
    const gradLeft = ctx.createRadialGradient(-gap / 2 - lensW * 0.6, 0, lensW * 0.1, -gap / 2, 0, lensW);
    gradLeft.addColorStop(0, "rgba(30,30,30,0.35)");
    gradLeft.addColorStop(1, "rgba(0,0,0,0.05)");
    const gradRight = ctx.createRadialGradient(gap / 2 + lensW * 0.6, 0, lensW * 0.1, gap / 2, 0, lensW);
    gradRight.addColorStop(0, "rgba(30,30,30,0.35)");
    gradRight.addColorStop(1, "rgba(0,0,0,0.05)");
    ctx.beginPath();
    ctx.ellipse(-gap / 2 - lensW / 2, 0, lensW / 2, lensH / 2, 0, 0, Math.PI * 2);
    ctx.fillStyle = gradLeft;
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.6)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(gap / 2 + lensW / 2, 0, lensW / 2, lensH / 2, 0, 0, Math.PI * 2);
    ctx.fillStyle = gradRight;
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(-bridgeW / 2, -bridgeH / 2, bridgeW, bridgeH);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-gap / 2 - lensW, 0);
    ctx.lineTo(-gap / 2 - lensW - overlayWidth * 0.25, -overlayWidth * 0.05);
    ctx.moveTo(gap / 2 + lensW, 0);
    ctx.lineTo(gap / 2 + lensW + overlayWidth * 0.25, -overlayWidth * 0.05);
    ctx.stroke();
    ctx.restore();
  }, [offsetX, offsetY, scale]);

  const draw = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const width = video.videoWidth || 400;
    const height = video.videoHeight || 300;
    if (canvas.width !== width) canvas.width = width;
    if (canvas.height !== height) canvas.height = height;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(video, 0, 0, width, height);

    let faceBox = null;
    const detector = detectorRef.current;
    const now = Date.now();

    if (detector && now - lastDetectRef.current > 150) {
      lastDetectRef.current = now;
      try {
        const faces = await detector.detect(video);
        if (faces && faces[0]?.boundingBox) {
          const b = faces[0].boundingBox;
          faceBox = { x: b.x, y: b.y, width: b.width, height: b.height };
          setFaceShape(classifyFaceShape(faceBox));
        } else {
          setFaceShape("unknown");
        }
      } catch {
        setFaceShape("unknown");
      }
    }

    if (useAdvanced && faceMeshRef.current && now - lastDetectRef.current > 120) {
      try {
        await faceMeshRef.current.send({ image: video });
      } catch (e) { String(e); }
    }

    if (!faceBox) {
      const lm = landmarksRef.current;
      if (lm && Array.isArray(lm) && lm.length >= 468) {
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        for (let i = 0; i < lm.length; i += 1) {
          const p = lm[i];
          if (p.x < minX) minX = p.x;
          if (p.y < minY) minY = p.y;
          if (p.x > maxX) maxX = p.x;
          if (p.y > maxY) maxY = p.y;
        }
        const pad = 10;
        faceBox = { x: Math.max(0, minX - pad), y: Math.max(0, minY - pad), width: Math.min(width, maxX - minX + pad * 2), height: Math.min(height, maxY - minY + pad * 2) };
        setFaceShape(classifyFaceShape(faceBox));
      } else {
        const w = Math.min(width, height) * 0.5;
        const h = w * 1.15;
        faceBox = { x: (width - w) / 2, y: (height - h) / 2, width: w, height: h };
      }
    }

    ctx.strokeStyle = "rgba(0,0,0,0.35)";
    ctx.lineWidth = 2;
    ctx.strokeRect(faceBox.x, faceBox.y, faceBox.width, faceBox.height);

    if (show3D) {
      const t = computeOverlayTransform(faceBox);
      draw3DGlasses(ctx, t);
    }

    rafRef.current = requestAnimationFrame(draw);
  }, [classifyFaceShape, useAdvanced, show3D, computeOverlayTransform, draw3DGlasses]);

  // Start Camera
  const startCamera = async () => {
    setMessage("");
    try {
      if ("FaceDetector" in window) {
        detectorRef.current = new window.FaceDetector({ fastMode: true, maxDetectedFaces: 1 });
      } else {
        detectorRef.current = null;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      if (useAdvanced) {
        try {
          await new Promise((resolve, reject) => {
            const s = document.createElement("script");
            s.src = "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js";
            s.async = true;
            s.onload = resolve;
            s.onerror = reject;
            document.head.appendChild(s);
          });
          const { FaceMesh } = window;
          if (FaceMesh) {
            const faceMesh = new FaceMesh({
              locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
            });
            faceMesh.setOptions({
              selfieMode: true,
              maxNumFaces: 1,
              refineLandmarks: true,
              minDetectionConfidence: 0.5,
              minTrackingConfidence: 0.5,
            });
            faceMesh.onResults((results) => {
              const lm = results.multiFaceLandmarks?.[0];
              if (lm) {
                const canvas = canvasRef.current;
                const w = canvas?.width || 0;
                const h = canvas?.height || 0;
                landmarksRef.current = lm.map((p) => ({ x: p.x * w, y: p.y * h }));
              } else {
                landmarksRef.current = null;
              }
            });
            faceMeshRef.current = faceMesh;
          } else {
            faceMeshRef.current = null;
            landmarksRef.current = null;
          }
        } catch (e) {
          String(e);
          faceMeshRef.current = null;
          landmarksRef.current = null;
        }
      }

      setCameraOn(true);
    } catch (error) {
      setMessage("Camera access denied");
    }
  };

  // Stop Camera
  const stopCamera = () => {
    stopLoop();
    stopTracks();
    setCameraOn(false);
    landmarksRef.current = null;
  };

  useEffect(() => {
    if (!cameraOn) return () => {};
    const video = videoRef.current;
    if (!video) return () => {};

    const onReady = () => {
      stopLoop();
      rafRef.current = requestAnimationFrame(draw);
    };

    video.addEventListener("loadeddata", onReady);
    return () => {
      video.removeEventListener("loadeddata", onReady);
      stopLoop();
    };
  }, [cameraOn, draw]);

  return (
    <main style={{ textAlign: "center", padding: 20 }}>
      <h2>Virtual Try On</h2>
      {message && <p>{message}</p>}

      {!cameraOn ? (
        <button type="button" onClick={startCamera}>
          Start Camera
        </button>
      ) : (
        <button type="button" onClick={stopCamera}>
          Stop Camera
        </button>
      )}

      <div style={{ marginTop: 16, display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center", alignItems: "flex-start" }}>
        <aside style={{ minWidth: 280, maxWidth: 360, textAlign: "left", border: "1px solid #eee", borderRadius: 8, padding: 12 }}>
          <div style={{ marginTop: 16, borderTop: "1px solid #eee", paddingTop: 12 }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Your Face Shape</div>
            <div style={{ fontSize: 14, marginBottom: 6 }}>
              Detected: <strong>{faceShape}</strong>
            </div>
            <div style={{ fontSize: 14 }}>{advice}</div>
          </div>
        </aside>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
          <label htmlFor="adv-detect" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <input
              id="adv-detect"
              type="checkbox"
              checked={useAdvanced}
              onChange={(e) => setUseAdvanced(e.target.checked)}
            />
            Advanced face detection
          </label>
          <label htmlFor="show3d" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <input
              id="show3d"
              type="checkbox"
              checked={show3D}
              onChange={(e) => setShow3D(e.target.checked)}
            />
            3D overlay
          </label>
        </div>

        <div style={{ marginTop: 16, display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          <label htmlFor="scale">
            Scale: {scale.toFixed(2)}
          </label>
          <input
            id="scale"
            type="range"
            min="0.6"
            max="2.0"
            step="0.01"
            value={scale}
            onChange={(e) => setScale(Number(e.target.value))}
          />

          <label htmlFor="offsetX">
            X: {offsetX.toFixed(2)}
          </label>
          <input
            id="offsetX"
            type="range"
            min="-0.5"
            max="0.5"
            step="0.01"
            value={offsetX}
            onChange={(e) => setOffsetX(Number(e.target.value))}
          />

          <label htmlFor="offsetY">
            Y: {offsetY.toFixed(2)}
          </label>
          <input
            id="offsetY"
            type="range"
            min="-0.5"
            max="0.5"
            step="0.01"
            value={offsetY}
            onChange={(e) => setOffsetY(Number(e.target.value))}
          />

          <div style={{ width: "min(720px, 100%)", flex: 1 }}>
            <video ref={videoRef} autoPlay playsInline style={{ display: "none" }}>
              <track kind="captions" />
            </video>
            <canvas
              ref={canvasRef}
              style={{ width: "100%", borderRadius: 8, border: "1px solid #ddd" }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default TryOnAI;
