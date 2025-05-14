
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="max-w-md text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          Sorry, we couldn't find the page you're looking for. The page might have been removed, 
          had its name changed, or is temporarily unavailable.
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Go Back
          </Button>
          <Button onClick={() => navigate("/")}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
