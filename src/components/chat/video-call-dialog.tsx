
'use client';

import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import type { Chat } from '@/lib/types';
import { PhoneOff, VideoOff, Mic, MicOff } from 'lucide-react';

interface VideoCallDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chat: Chat;
}

export function VideoCallDialog({ open, onOpenChange, chat }: VideoCallDialogProps) {
  const { toast } = useToast();
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (open) {
      const getCameraPermission = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          streamRef.current = stream;
          setHasCameraPermission(true);

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions in your browser settings to use this feature.',
          });
        }
      };

      getCameraPermission();
    } else {
      // Cleanup when dialog closes
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if(videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setHasCameraPermission(false);
    }

    return () => {
      // Ensure cleanup on unmount as well
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  }, [open, toast]);

  const toggleMute = () => {
    if(streamRef.current){
        streamRef.current.getAudioTracks().forEach(track => track.enabled = !track.enabled);
        setIsMuted(prev => !prev);
    }
  };

  const toggleCamera = () => {
    if(streamRef.current){
        streamRef.current.getVideoTracks().forEach(track => track.enabled = !track.enabled);
        setIsCameraOff(prev => !prev);
    }
  };

  const handleHangUp = () => {
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Video Call with {chat.name}</DialogTitle>
          <DialogDescription>
            You are in a video call. Use the controls below to manage your call.
          </DialogDescription>
        </DialogHeader>
        <div className="relative aspect-video bg-muted rounded-md flex items-center justify-center">
            <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted playsInline />
            {isCameraOff && <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">Camera is off</div>}
            {!(hasCameraPermission) && (
                <Alert variant="destructive" className="m-4">
                    <AlertTitle>Camera Access Required</AlertTitle>
                    <AlertDescription>
                        Please allow camera access to use this feature. You may need to refresh the page and grant permission.
                    </AlertDescription>
                </Alert>
            )}
        </div>
        <DialogFooter className="sm:justify-center gap-2">
            <Button variant={isMuted ? "destructive" : "outline"} size="icon" onClick={toggleMute}>
                {isMuted ? <MicOff /> : <Mic />}
            </Button>
            <Button variant={isCameraOff ? "destructive" : "outline"} size="icon" onClick={toggleCamera}>
                {isCameraOff ? <VideoOff /> : <VideoOff className="text-transparent" />} 
            </Button>
            <Button variant="destructive" size="icon" onClick={handleHangUp}>
                <PhoneOff />
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
