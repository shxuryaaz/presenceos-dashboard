import { useEffect, useRef, useState } from "react";
import TeacherLayout from "@/components/dashboard/TeacherLayout";

type FaceBox = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  name: string;
  engagement: number;
  mood: "Focused" | "Neutral" | "Distracted";
};

type DetectFaceResult = {
  boundingBox: DOMRectReadOnly;
};

type FaceDetectorInstance = {
  detect: (input: HTMLVideoElement) => Promise<DetectFaceResult[]>;
};

type FaceDetectorConstructor = new (options?: {
  fastMode?: boolean;
  maxDetectedFaces?: number;
}) => FaceDetectorInstance;

type MediaPipeDetector = {
  detectForVideo: (
    video: HTMLVideoElement,
    timestampMs: number,
  ) => {
    detections: Array<{
      boundingBox?: {
        originX: number;
        originY: number;
        width: number;
        height: number;
      };
    }>;
  };
};

const trackedNames = ["Saksham Bhardwaj", "Shaurya Singh", "Shaurya Upadhyay", "Yash Singh"];

export default function CameraFeedPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const detectorRef = useRef<FaceDetectorInstance | null>(null);
  const mediaPipeDetectorRef = useRef<MediaPipeDetector | null>(null);
  const tracksRef = useRef<
    Array<{
      id: string;
      name: string;
      centerX: number;
      centerY: number;
      lastSeenMs: number;
    }>
  >([]);
  const nextTrackRef = useRef(0);
  const [cameraState, setCameraState] = useState<"idle" | "active" | "denied" | "unavailable">("idle");
  const [faces, setFaces] = useState<FaceBox[]>([]);
  const [supportsFaceDetection, setSupportsFaceDetection] = useState(false);
  const [detectorLabel, setDetectorLabel] = useState("None");

  useEffect(() => {
    let stream: MediaStream | null = null;
    const FaceDetectorClass = (
      window as unknown as { FaceDetector?: FaceDetectorConstructor }
    ).FaceDetector;
    if (FaceDetectorClass) {
      detectorRef.current = new FaceDetectorClass({ fastMode: true, maxDetectedFaces: 2 });
      setSupportsFaceDetection(true);
      setDetectorLabel("Native Face Detection API");
    } else {
      (async () => {
        try {
          const vision = await import("@mediapipe/tasks-vision");
          const filesetResolver = await vision.FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
          );
          const detector = await vision.FaceDetector.createFromOptions(filesetResolver, {
            baseOptions: {
              modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/latest/blaze_face_short_range.tflite",
            },
            runningMode: "VIDEO",
            minDetectionConfidence: 0.5,
          });
          mediaPipeDetectorRef.current = detector as MediaPipeDetector;
          setSupportsFaceDetection(true);
          setDetectorLabel("MediaPipe Face Detector");
        } catch {
          setSupportsFaceDetection(false);
          setDetectorLabel("Unavailable");
        }
      })();
    }

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((media) => {
        stream = media;
        if (videoRef.current) {
          videoRef.current.srcObject = media;
        }
        setCameraState("active");
      })
      .catch((error: DOMException) => {
        if (error.name === "NotAllowedError") {
          setCameraState("denied");
          return;
        }
        setCameraState("unavailable");
      });

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    const interval = window.setInterval(async () => {
      const video = videoRef.current;
      const detector = detectorRef.current;
      const mediaPipeDetector = mediaPipeDetectorRef.current;
      if (!video || video.readyState < 2) return;

      try {
        const detections = detector
          ? await detector.detect(video)
          : mediaPipeDetector
            ? mediaPipeDetector.detectForVideo(video, performance.now()).detections.map((item) => ({
                boundingBox: new DOMRectReadOnly(
                  item.boundingBox?.originX ?? 0,
                  item.boundingBox?.originY ?? 0,
                  item.boundingBox?.width ?? 0,
                  item.boundingBox?.height ?? 0,
                ),
              }))
            : [];

        const now = Date.now();
        tracksRef.current = tracksRef.current.filter((track) => now - track.lastSeenMs < 3500);

        const visibleFaces = detections
          .slice(0, 4)
          .sort((a, b) => b.boundingBox.width * b.boundingBox.height - a.boundingBox.width * a.boundingBox.height)
          .map((detection) => {
            const { boundingBox } = detection;
            const centerX = boundingBox.x + boundingBox.width / 2;
            const centerY = boundingBox.y + boundingBox.height / 2;

            let bestTrackIndex = -1;
            let bestDistance = Number.POSITIVE_INFINITY;
            for (let i = 0; i < tracksRef.current.length; i += 1) {
              const track = tracksRef.current[i];
              const dx = centerX - track.centerX;
              const dy = centerY - track.centerY;
              const distance = Math.sqrt(dx * dx + dy * dy);
              if (distance < bestDistance && distance < 140) {
                bestDistance = distance;
                bestTrackIndex = i;
              }
            }

            let assignedTrack = tracksRef.current[bestTrackIndex];
            if (!assignedTrack) {
              const name = trackedNames[nextTrackRef.current % trackedNames.length];
              nextTrackRef.current += 1;
              assignedTrack = {
                id: `track-${nextTrackRef.current}`,
                name,
                centerX,
                centerY,
                lastSeenMs: now,
              };
              tracksRef.current.push(assignedTrack);
            } else {
              assignedTrack.centerX = centerX;
              assignedTrack.centerY = centerY;
              assignedTrack.lastSeenMs = now;
            }

            const faceArea = boundingBox.width * boundingBox.height;
            const frameArea = Math.max(1, video.videoWidth * video.videoHeight);
            const areaRatio = faceArea / frameArea;
            const movementPenalty = bestDistance === Number.POSITIVE_INFINITY ? 0 : Math.min(18, bestDistance / 7);
            const engagement = Math.max(
              35,
              Math.min(96, Math.round(50 + areaRatio * 900 - movementPenalty)),
            );

            return {
              id: assignedTrack.id,
              x: (boundingBox.x / video.videoWidth) * 100,
              y: (boundingBox.y / video.videoHeight) * 100,
              w: (boundingBox.width / video.videoWidth) * 100,
              h: (boundingBox.height / video.videoHeight) * 100,
              name: assignedTrack.name,
              engagement,
              mood: engagement >= 78 ? "Focused" : engagement >= 58 ? "Neutral" : "Distracted",
            } satisfies FaceBox;
          });

        setFaces(visibleFaces);
      } catch {
        setFaces([]);
      }
    }, 350);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <TeacherLayout>
      <div className="space-y-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="dashboard-section-title mb-2">Live Camera Feed</h3>
          <p className="text-xs text-muted-foreground">
            {supportsFaceDetection
              ? `Real-time face detection is active (${detectorLabel}). Faces are labeled with engagement estimates.`
              : "Face Detection API is unavailable in this browser. Use Chrome for live detection."}
          </p>
        </div>

        <div className="relative bg-black rounded-lg overflow-hidden border border-border w-full max-w-4xl">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-[420px] object-cover" />

          {cameraState === "active" ? (
            <div className="absolute inset-0">
              {faces.map((face) => (
                <div
                  key={face.id}
                  className={`absolute rounded-md ${
                    face.mood === "Focused"
                      ? "border-2 border-success shadow-[0_0_0_1px_rgba(34,197,94,0.25)]"
                      : face.mood === "Neutral"
                        ? "border-2 border-primary shadow-[0_0_0_1px_rgba(249,115,22,0.25)]"
                        : "border-2 border-destructive shadow-[0_0_0_1px_rgba(239,68,68,0.25)]"
                  }`}
                  style={{
                    left: `${face.x}%`,
                    top: `${face.y}%`,
                    width: `${face.w}%`,
                    height: `${face.h}%`,
                  }}
                >
                  <div className="absolute -top-7 left-0 bg-black/70 text-white text-[10px] px-2 py-1 rounded">
                    {face.name} · {face.mood} · {face.engagement}%
                  </div>
                  <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-current rounded-tl-sm" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-current rounded-tr-sm" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-current rounded-bl-sm" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-current rounded-br-sm" />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {cameraState === "denied" ? (
          <p className="text-sm text-destructive">Camera permission denied. Please allow camera access.</p>
        ) : null}
        {cameraState === "unavailable" ? (
          <p className="text-sm text-destructive">No camera device detected.</p>
        ) : null}
        {!supportsFaceDetection ? (
          <p className="text-sm text-destructive">
            Browser does not support the Face Detection API needed for realistic face tracking.
          </p>
        ) : null}
      </div>
    </TeacherLayout>
  );
}
