
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
    <div className="flex flex-col h-full animate-fade-in">
      {/* Scanner Header */}
      <div className="navbar bg-base-100 border-b backdrop-blur supports-backdrop-blur:bg-background/60">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Barcode className="h-5 w-5 text-primary" />
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
      <div className="flex flex-col flex-1 items-center justify-center p-6 gap-6">
        <div id={scannerContainerId} className="relative w-full max-w-sm h-64 bg-black rounded-xl overflow-hidden border border-primary/20 shadow-lg shadow-primary/10">
          {!isScanning && (
            <div className="absolute inset-0 flex items-center justify-center flex-col gap-2 bg-black/80 text-white">
              <ScanLine className="h-12 w-12 animate-float text-primary" />
              <p className="opacity-80">Click Start to activate camera</p>
            </div>
          )}
          
          {isScanning && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 border-2 border-primary/70 rounded-lg relative overflow-hidden">
                <div className="absolute h-0.5 w-full bg-primary/80 top-1/2 animate-[scan_2s_ease-in-out_infinite_alternate]"></div>
              </div>
            </div>
          )}
        </div>

        {/* Scanner Controls */}
        <div className="flex gap-2">
          {!isScanning ? (
            <Button onClick={startScanner} variant="glow" className="gap-2">
              <ScanLine className="h-4 w-4" />
              Start Scanner
            </Button>
          ) : (
            <Button onClick={stopScanner} variant="outline" className="gap-2 border-primary/50">
              <X className="h-4 w-4" />
              Stop Scanner
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;
