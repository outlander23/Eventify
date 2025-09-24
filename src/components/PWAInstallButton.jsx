import { useState, useEffect } from "react";
import Button from "./Button";

const PWAInstallButton = ({ className = "", variant = "outline" }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkIfInstalled = () => {
      if (
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true
      ) {
        setIsInstalled(true);
        return;
      }
    };

    checkIfInstalled();

    const handler = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Save the event so it can be triggered later
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const installedHandler = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", installedHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // Fallback for when prompt isn't available
      alert(
        "To install this app:\n\n• Chrome/Edge: Look for install icon in address bar\n• Mobile: Use browser menu → 'Install app' or 'Add to Home Screen'"
      );
      return;
    }

    try {
      // Show the install prompt
      const promptResult = await deferredPrompt.prompt();

      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;

      console.log(`User response to the install prompt: ${outcome}`);

      if (outcome === "accepted") {
        setIsInstalled(true);
      }

      // Clear the deferredPrompt
      setDeferredPrompt(null);
      setIsInstallable(false);
    } catch (error) {
      console.error("Error during installation:", error);
    }
  };

  // Don't show if already installed
  if (isInstalled) {
    return null;
  }

  // Show button if installable OR always show for better UX
  if (!isInstallable) {
    return null;
  }

  return (
    <Button
      onClick={handleInstall}
      variant={variant}
      className={`flex items-center space-x-2 ${className}`}
      title="Install Eventify as an app"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
      <span>Install App</span>
    </Button>
  );
};

export default PWAInstallButton;
