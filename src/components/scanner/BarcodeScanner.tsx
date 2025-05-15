
import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Barcode, ScanLine, X } from "lucide-react";

interface BarcodeScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onClose: () => void;
}

const BarcodeScanner = ({ onScanSuccess, onClose }: BarcodeScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = "html5qr-code-full-region";

  useEffect(() => {
    // Initialize scanner on mount
    scannerRef.current = new Html5Qrcode(scannerContainerId);

    // Clean up on unmount
    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current
          .stop()
          .then(() => console.log("Scanner stopped"))
          .catch((err) => console.error("Error stopping scanner:", err));
      }
    };
  }, []);

  const startScanner = () => {
    if (!scannerRef.current) return;

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
    };

    setIsScanning(true);
    scannerRef.current
      .start(
        { facingMode: "environment" }, // Use the back camera
        config,
        (decodedText) => handleScanSuccess(decodedText),
        (errorMessage) => console.log(errorMessage)
      )
      .catch((err) => {
        console.error("Error starting scanner:", err);
        toast.error("Failed to start camera. Please check permissions.");
        setIsScanning(false);
      });
  };

  const stopScanner = () => {
    if (!scannerRef.current || !scannerRef.current.isScanning) return;

    scannerRef.current
      .stop()
      .then(() => setIsScanning(false))
      .catch((err) => console.error("Error stopping scanner:", err));
  };

  const handleScanSuccess = (decodedText: string) => {
    // Play a success sound
    const audio = new Audio("/beep.mp3");
    audio.play().catch(err => console.error("Error playing audio:", err));
    
    // Vibrate if supported
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }

    // Stop the scanner after successful scan
    stopScanner();
    
    // Pass the result to parent component
    onScanSuccess(decodedText);
    
    // Show toast
    toast.success("Barcode detected!", {
      description: `Code: ${decodedText}`,
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Scanner Header */}
      <div className="navbar bg-base-100 border-b">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Barcode className="h-5 w-5" />
            <span className="font-bold">Scanner</span>
          </div>
        </div>
        <div className="flex-none">
          <Button variant="ghost" size="icon" onClick={onClose} className="btn btn-ghost btn-circle">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Scanner Content */}
      <div className="flex flex-col flex-1 items-center justify-center p-4 gap-4">
        <div id={scannerContainerId} className="relative w-full max-w-sm h-64 bg-black rounded-lg overflow-hidden">
          {!isScanning && (
            <div className="absolute inset-0 flex items-center justify-center flex-col gap-2 bg-black/80 text-white">
              <ScanLine className="h-12 w-12" />
              <p>Click Start to activate camera</p>
            </div>
          )}
          
          {isScanning && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 border-2 border-white/70 rounded-lg"></div>
            </div>
          )}
        </div>

        {/* Scanner Controls */}
        <div className="flex gap-2">
          {!isScanning ? (
            <button onClick={startScanner} className="btn btn-primary gap-2">
              <ScanLine className="h-4 w-4" />
              Start Scanner
            </button>
          ) : (
            <button onClick={stopScanner} className="btn btn-outline gap-2">
              <X className="h-4 w-4" />
              Stop Scanner
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;
