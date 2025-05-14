
import { useState } from "react";
import Layout from "@/components/Layout";
import BarcodeScanner from "@/components/scanner/BarcodeScanner";
import { useNavigate } from "react-router-dom";
import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScanBarcode, ArrowRight, Package } from "lucide-react";

export default function Scanner() {
  const [showScanner, setShowScanner] = useState(false);
  const [scannedCode, setScannedCode] = useState("");
  const [manualCode, setManualCode] = useState("");
  const navigate = useNavigate();
  const { products, searchProducts } = useData();

  const handleScanSuccess = (decodedText: string) => {
    setScannedCode(decodedText);
    setShowScanner(false);
    findProductByCode(decodedText);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    findProductByCode(manualCode);
  };

  const findProductByCode = (code: string) => {
    // In a real app, you would search for the product by its barcode/SKU
    // Here we're just searching for products that contain the code in their SKU
    const foundProducts = searchProducts(code);
    
    if (foundProducts.length > 0) {
      // If we find a product, navigate to its details page
      toast.success("Product found!", {
        description: `Found: ${foundProducts[0].name}`,
      });
      navigate(`/products/${foundProducts[0].id}`);
    } else {
      toast.error("Product not found", {
        description: "No products match this barcode or SKU",
      });
    }
  };

  return (
    <Layout showSearch={false}>
      <div className="container mx-auto max-w-md py-6">
        {showScanner ? (
          <div className="bg-background border rounded-lg shadow-lg h-[500px] overflow-hidden">
            <BarcodeScanner
              onScanSuccess={handleScanSuccess}
              onClose={() => setShowScanner(false)}
            />
          </div>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ScanBarcode className="h-5 w-5" />
                  Barcode Scanner
                </CardTitle>
                <CardDescription>
                  Scan product barcodes or QR codes to quickly find items in your inventory
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Button
                  className="w-full h-32 flex flex-col gap-2"
                  onClick={() => setShowScanner(true)}
                >
                  <ScanBarcode className="h-8 w-8" />
                  <span>Scan Barcode / QR Code</span>
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or enter manually
                    </span>
                  </div>
                </div>
                
                <form onSubmit={handleManualSubmit} className="flex gap-2">
                  <Input
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder="Enter SKU or barcode"
                    className="flex-1"
                  />
                  <Button type="submit">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
              {scannedCode && (
                <CardFooter className="flex flex-col items-start">
                  <p className="text-sm text-muted-foreground">Last scanned:</p>
                  <p className="font-mono">{scannedCode}</p>
                </CardFooter>
              )}
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Recent Scans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  {/* This would be populated with actual scan history in a real implementation */}
                  <div className="py-8 flex flex-col items-center justify-center text-muted-foreground">
                    <Package className="h-8 w-8 mb-2 opacity-50" />
                    <p className="text-sm">No recent scans</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}
