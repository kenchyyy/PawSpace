'use client';

import React from 'react';

type OverlayProps = {
  message: string;
  onClose?: () => void;
};

export default function Overlay({ message, onClose }: OverlayProps) {
  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-xl shadow-2xl max-w-lg w-full"
        onClick={(e) => e.stopPropagation()} 
      >
        
      </div>
    </div>
  );
}
